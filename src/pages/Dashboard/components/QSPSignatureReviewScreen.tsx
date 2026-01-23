import { useState, useMemo } from "react";
import { AppHeader } from "../../../components/AppHeader";
import {
  ArrowLeft,
  FileSignature,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Calendar as CalendarIcon,
  Filter,
  Download,
} from "lucide-react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Badge } from "../../../components/Badge";
import { Checkbox } from "../../../components/CheckBox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/Dailog";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { Separator } from "../../../components/Seprator";
import { ScrollArea } from "../../../components/ScrollArea";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  useGetDraftReportsQuery,
  useSavePendingSignMutation,
} from "../../../redux/api/provider";
import { showError, showSuccess } from "../../../components/CustomToast";
import type { PendingNote } from "../../../Types/types";
import { handleError } from "../../../utils/helper";

export function QSPSignatureReviewScreen() {
  type UrgencyLevel = "normal" | "warning" | "critical";

  function getDaysPassed(date: string | Date): number {
    if (!date) return 0;

    const reportDate = new Date(date);
    const today = new Date();

    // Remove time for accurate day difference
    reportDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - reportDate.getTime();

    return diffTime > 0 ? Math.floor(diffTime / (1000 * 60 * 60 * 24)) : 0;
  }

  function getUrgencyLevel(daysPassed: number): UrgencyLevel {
    if (daysPassed >= 5) return "critical";
    if (daysPassed >= 3) return "warning";
    return "normal";
  }

  const { data: draftNotes, isLoading, isError } = useGetDraftReportsQuery();
  const navigate = useNavigate();

  // Transform API data to match PendingNote interface
  const pendingNotes = useMemo(() => {
    if (!draftNotes?.data) return [];

    return draftNotes.data.map((report: any) => {
      const daysPending = getDaysPassed(report?.date);
      const urgencyLevel = getUrgencyLevel(daysPending);

      return {
        id: report._id,
        clientId: report.client.name,
        clientName: report.client.name,
        clientDob: report.client.dob,
        providerId: report.provider.name,
        providerName: report.provider.name,
        providerCredential: report.provider.credentail || "",
        sessionDate: report.session.startTime,
        signedDate: new Date(report.date).toLocaleString(),

        goals: report.supportObserved?.join(", ") || "No goals specified",
        summary:
          report.observations || report.assessment || "No summary available",

        daysPending,
        urgencyLevel,
        fullNoteData: report,
      };
    });
  }, [draftNotes]);

  const [selectedNotes, setSelectedNotes] = useState(new Set());

  const [filterClient, setFilterClient] = useState("all");
  const [filterProvider, setFilterProvider] = useState("all");
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [viewingNote, setViewingNote] = useState<PendingNote | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [signature, setSignature] = useState("");

  // Get unique clients and providers for filters
  const uniqueClients = useMemo(
    () =>
      Array.from(new Set(pendingNotes.map((n: any) => n.clientName))).sort(),
    [pendingNotes]
  );

  const uniqueProviders = useMemo(
    () =>
      Array.from(new Set(pendingNotes.map((n: any) => n.providerName))).sort(),
    [pendingNotes]
  );
  const [savePendingSign] = useSavePendingSignMutation();
  // Filter notes
  const filteredNotes = useMemo(() => {
    return pendingNotes.filter((note: any) => {
      if (filterClient !== "all" && note.clientName !== filterClient)
        return false;
      if (filterProvider !== "all" && note.providerName !== filterProvider)
        return false;
      if (filterUrgency !== "all" && note.urgencyLevel !== filterUrgency)
        return false;
      return true;
    });
  }, [pendingNotes, filterClient, filterProvider, filterUrgency]);

  // Toggle note selection
  const toggleNoteSelection = (noteId: string) => {
    const newSelected = new Set(selectedNotes);
    if (newSelected.has(noteId)) {
      newSelected.delete(noteId);
    } else {
      newSelected.add(noteId);
    }
    setSelectedNotes(newSelected);
  };

  // Select all filtered notes
  const selectAll = () => {
    const allFiltered = new Set(filteredNotes.map((n: any) => n.id));
    setSelectedNotes(allFiltered);
  };

  // Deselect all
  const deselectAll = () => {
    setSelectedNotes(new Set());
  };

  // Handle batch signing
  const handleBatchSign = async () => {
    if (selectedNotes.size === 0) {
      showError("Please select at least one note to sign");
      return;
    }

    if (!signature.trim()) {
      showError("Please enter your signature");
      return;
    }

    try {
      const payload = {
        reportIds: Array.from(selectedNotes),
        qspSignature: signature.trim(),
      };

      await savePendingSign(payload).unwrap().catch((error )=> handleError(error));

      showSuccess(`${payload.reportIds.length} note(s) signed successfully`);

      // Reset UI
      setSelectedNotes(new Set());
      setSignature("");
    } catch (error: any) {
      showError(error?.data?.message || "Failed to sign selected notes");
    }
  };

  // View note details
  const viewNoteDetails = (note: PendingNote) => {
    setViewingNote(note);
    setIsViewingDetails(true);
  };

  // Get urgency badge
  const getUrgencyBadge = (urgencyLevel: string, daysPending: number) => {
    if (urgencyLevel === "critical") {
      return (
        <Badge className="bg-red-600 text-white animate-pulse">
          <AlertCircle className="w-3 h-3 mr-1" />
          Critical - {daysPending} days
        </Badge>
      );
    }
    if (urgencyLevel === "warning") {
      return (
        <Badge className="bg-yellow-500 text-white">
          <Clock className="w-3 h-3 mr-1" />
          Warning - {daysPending} days
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-[#395159] text-[#395159]">
        {daysPending} day{daysPending !== 1 ? "s" : ""}
      </Badge>
    );
  };

  const criticalCount = pendingNotes.filter(
    (n: any) => n.urgencyLevel === "critical"
  ).length;
  const warningCount = pendingNotes.filter(
    (n: any) => n.urgencyLevel === "warning"
  ).length;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#efefef]">
        <AppHeader />
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <Card className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#395159] mx-auto mb-4"></div>
            <p className="text-[#395159]">Loading pending notes...</p>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-[#efefef]">
        <AppHeader />
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <Card className="p-8 text-center border-2 border-red-500">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h3 className="text-[#303630] mb-2">Error Loading Notes</h3>
            <p className="text-[#395159]">
              Unable to load pending notes. Please try again.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader />

      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-[#395159] text-[#395159]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3">
            <Badge className="bg-[#395159] text-white px-4 py-2">
              {pendingNotes.length} Note{pendingNotes.length !== 1 ? "s" : ""}{" "}
              Pending Review
            </Badge>
            {criticalCount > 0 && (
              <Badge className="bg-red-600 text-white px-4 py-2 animate-pulse">
                {criticalCount} Critical
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge className="bg-yellow-500 text-white px-4 py-2">
                {warningCount} Warning
              </Badge>
            )}
          </div>
        </div>

        {/* Alert Message */}
        {(criticalCount > 0 || warningCount > 0) && (
          <Card className="p-4 mb-6 border-2 border-yellow-400 bg-yellow-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="text-[#303630] mb-1">
                  Overdue Signatures Require Attention
                </h3>
                <p className="text-sm text-[#395159]">
                  {criticalCount > 0 && (
                    <span className="text-red-600">
                      <strong>
                        {criticalCount} note{criticalCount !== 1 ? "s" : ""}
                      </strong>{" "}
                      overdue by 5+ business days (critical).
                    </span>
                  )}
                  {criticalCount > 0 && warningCount > 0 && " "}
                  {warningCount > 0 && (
                    <span className="text-yellow-700">
                      <strong>
                        {warningCount} note{warningCount !== 1 ? "s" : ""}
                      </strong>{" "}
                      overdue by 3+ business days (warning).
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#395159]" />
            <h3 className="text-[#303630]">Filter Notes</h3>
          </div>
          <Separator className="mb-4 bg-[#ccc9c0]" />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm text-[#395159]">Client</Label>
              <Select value={filterClient} onValueChange={setFilterClient}>
                <SelectTrigger className="h-10 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {uniqueClients.map((client: any) => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-[#395159]">Provider</Label>
              <Select value={filterProvider} onValueChange={setFilterProvider}>
                <SelectTrigger className="h-10 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  {uniqueProviders.map((provider: any) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-[#395159]">Urgency</Label>
              <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                <SelectTrigger className="h-10 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency Levels</SelectItem>
                  <SelectItem value="critical">Critical (5+ days)</SelectItem>
                  <SelectItem value="warning">Warning (3+ days)</SelectItem>
                  <SelectItem value="normal">Normal (0-2 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Batch Actions */}
        <Card className="p-6 mb-6 bg-white border-2 border-[#395159]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-[#303630]">
                {selectedNotes.size} Note{selectedNotes.size !== 1 ? "s" : ""}{" "}
                Selected
              </h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={selectAll}
                  disabled={filteredNotes.length === 0}
                >
                  Select All ({filteredNotes.length})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={deselectAll}
                  disabled={selectedNotes.size === 0}
                >
                  Deselect All
                </Button>
              </div>
            </div>
            {selectedNotes.size > 0 && (
              <div className="flex items-center gap-3">
                <div>
                  <Label className="text-sm text-[#395159]">
                    QSP Signature
                  </Label>
                  <Input
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Type your name to sign"
                    className="w-64 h-10 mt-1"
                  />
                </div>
                <Button
                  onClick={handleBatchSign}
                  className="bg-[#395159] hover:bg-[#303630] text-white h-10 mt-6"
                  disabled={!signature.trim()}
                >
                  <FileSignature className="w-4 h-4 mr-2" />
                  Sign {selectedNotes.size} Note
                  {selectedNotes.size !== 1 ? "s" : ""}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Notes List */}
        <div className="space-y-4">
          {filteredNotes.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-[#303630] mb-2">All Caught Up!</h3>
              <p className="text-[#395159]">
                No notes pending your signature at this time.
              </p>
            </Card>
          ) : (
            filteredNotes.map((note: any) => (
              <Card
                key={note.id}
                className={`p-6 transition-all ${
                  note.urgencyLevel === "critical"
                    ? "border-2 border-red-500 bg-red-50"
                    : note.urgencyLevel === "warning"
                    ? "border-2 border-yellow-400 bg-yellow-50"
                    : "bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedNotes.has(note.id)}
                    onCheckedChange={() => toggleNoteSelection(note.id)}
                    className="mt-1"
                  />

                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[#303630]">{note.clientName}</h3>
                          {note.isAIGenerated && (
                            <Badge className="bg-[#395159] text-white">
                              AI Generated
                            </Badge>
                          )}
                          {getUrgencyBadge(note.urgencyLevel, note.daysPending)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[#395159]">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {note.providerName}
                            {note.providerCredential &&
                              `, ${note.providerCredential}`}
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            Session:{" "}
                            {new Date(note.sessionDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Signed: {note.signedDate}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Goals */}
                    <div>
                      <p className="text-sm text-[#395159] mb-1">
                        <strong>Goals Addressed:</strong>
                      </p>
                      <p className="text-[#303630]">{note.goals}</p>
                    </div>

                    {/* Summary Preview */}
                    <div>
                      <p className="text-sm text-[#395159] mb-1">
                        <strong>Summary:</strong>
                      </p>
                      <p className="text-[#303630] line-clamp-2">
                        {note.summary}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewNoteDetails(note)}
                        className="border-[#395159] text-[#395159]"
                      >
                        View Full Note
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success("Downloading note PDF...")}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* View Note Details Dialog */}
      <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSignature className="w-5 h-5" />
              Session Note - {viewingNote?.clientName}
            </DialogTitle>
            <DialogDescription>
              Review the session note details before signing.
            </DialogDescription>
          </DialogHeader>

          {viewingNote && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-4">
                {/* Session Info */}
                <Card className="p-4 bg-[#efefef]">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#395159]">Session Date</p>
                      <p className="text-[#303630]">
                        {new Date(viewingNote.sessionDate).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#395159]">Provider</p>
                      <p className="text-[#303630]">
                        {viewingNote.providerName}
                        {viewingNote.providerCredential &&
                          `, ${viewingNote.providerCredential}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#395159]">
                        Provider Signature
                      </p>
                      <p className="text-[#303630]">{viewingNote.signedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#395159]">
                        Days Pending QSP Review
                      </p>
                      <p className="text-[#303630]">
                        {viewingNote.daysPending} business days
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Goals */}
                <div>
                  <h4 className="text-[#303630] mb-2">Goals Addressed</h4>
                  <Separator className="mb-3 bg-[#ccc9c0]" />
                  <p className="text-[#303630]">{viewingNote.goals}</p>
                </div>

                {/* Subjective */}
                {viewingNote.fullNoteData?.subjective && (
                  <div>
                    <h4 className="text-[#303630] mb-2">Subjective</h4>
                    <Separator className="mb-3 bg-[#ccc9c0]" />
                    <p className="text-[#303630]">
                      {viewingNote.fullNoteData.subjective}
                    </p>
                  </div>
                )}

                {/* Observations */}
                <div>
                  <h4 className="text-[#303630] mb-2">Observations</h4>
                  <Separator className="mb-3 bg-[#ccc9c0]" />
                  <p className="text-[#303630]">{viewingNote.summary}</p>
                </div>

                {/* Assessment */}
                {viewingNote.fullNoteData?.assessment && (
                  <div>
                    <h4 className="text-[#303630] mb-2">Assessment</h4>
                    <Separator className="mb-3 bg-[#ccc9c0]" />
                    <p className="text-[#303630]">
                      {viewingNote.fullNoteData.assessment}
                    </p>
                  </div>
                )}

                {/* Plan */}
                {viewingNote.fullNoteData?.plan && (
                  <div>
                    <h4 className="text-[#303630] mb-2">Plan</h4>
                    <Separator className="mb-3 bg-[#ccc9c0]" />
                    <p className="text-[#303630]">
                      {viewingNote.fullNoteData.plan}
                    </p>
                  </div>
                )}

                {/* Activities */}
                {viewingNote.fullNoteData?.activities?.length > 0 && (
                  <div>
                    <h4 className="text-[#303630] mb-2">Activities</h4>
                    <Separator className="mb-3 bg-[#ccc9c0]" />
                    <p className="text-[#303630]">
                      {viewingNote.fullNoteData.activities.join(", ")}
                    </p>
                  </div>
                )}

                {/* Goals Performance */}
                {viewingNote.fullNoteData?.goals?.length > 0 && (
                  <div>
                    <h4 className="text-[#303630] mb-2">Goals Performance</h4>
                    <Separator className="mb-3 bg-[#ccc9c0]" />
                    {viewingNote.fullNoteData.goals.map(
                      (goal: any, index: number) => (
                        <Card key={index} className="p-3 mb-2 bg-white">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-[#395159]">Accuracy:</span>
                              <span className="text-[#303630] ml-2">
                                {goal.accuracy}%
                              </span>
                            </div>
                            <div>
                              <span className="text-[#395159]">
                                Performance:
                              </span>
                              <span className="text-[#303630] ml-2">
                                {goal.performance}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#395159]">
                                Successful:
                              </span>
                              <span className="text-[#303630] ml-2">
                                {goal.successfull}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#395159]">Missed:</span>
                              <span className="text-[#303630] ml-2">
                                {goal.missed}
                              </span>
                            </div>
                          </div>
                        </Card>
                      )
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
