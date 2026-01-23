import { useEffect, useMemo, useState } from "react";
import { Badge } from "../../../components/Badge";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Checkbox } from "../../../components/CheckBox";
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
import { Download, Search, X, CheckCircle2, Eye, Lock } from "lucide-react";
import type { HistorySectionProps, SessionData } from "../../../Types/types";
import {
  useDownloadSelectedSessionMutation,
  useDownloadSessionHistoryMutation,
} from "../../../redux/api/provider";
import { handleDownloadFunction, handleError } from "../../../utils/helper";
import { showSuccess } from "../../../components/CustomToast";

export function HistorySection({
  sessions: rawSessions = [],
  currentUser,
  canViewAllSessions,
}: HistorySectionProps) {
  // console.log("current User ::: " , currentUser);
  const [sessionSearchQuery, setSessionSearchQuery] = useState("");
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);
  const [isViewingNote, setIsViewingNote] = useState(false);
  const [viewNoteData, setViewNoteData] = useState<SessionData | null>(null);
  const [downloadingSessionId, setDownloadingSessionId] = useState<
    string | null
  >(null);

  // Handle both prop name variations and extract array from API response if needed
  const canViewAll = canViewAllSessions ?? true;

  // Extract sessions array from API response structure if needed
  const sessions = useMemo(() => {
    // console.log("Raw sessions received:", rawSessions);
    // console.log("Type:", typeof rawSessions);
    // console.log("Is Array:", Array.isArray(rawSessions));

    // If it's already an array, use it
    if (Array.isArray(rawSessions)) {
      return rawSessions;
    }

    // If it has a 'data' property that's an array, use that
    if (
      rawSessions &&
      typeof rawSessions === "object" &&
      Array.isArray(rawSessions.data)
    ) {
      // console.log(
      //   "Extracting from data property, length:",
      //   rawSessions.data.length
      // );
      return rawSessions.data;
    }

    // Otherwise return empty array
    // console.warn("Sessions is not in expected format, returning empty array");
    return [];
  }, [rawSessions]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to format time
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper function to calculate duration in hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Helper function to get goals summary
  const getGoalsSummary = (session: SessionData) => {
    const goalCount = session.goals_dataCollection.length;
    const avgAccuracy =
      session.goals_dataCollection.reduce((sum, g) => sum + g.accuracy, 0) /
      goalCount;
    return `${goalCount} goal${goalCount !== 1 ? "s" : ""} (Avg: ${Math.round(
      avgAccuracy
    )}% accuracy)`;
  };

  // Filter sessions based on permissions
  const permissionFilteredSessions = useMemo(() => {
    // Ensure sessions is an array
    if (!Array.isArray(sessions)) {
      // console.error("Sessions is not an array:", sessions);
      return [];
    }

    // console.log(
    //   "Filtering sessions. canViewAll:",
    //   canViewAll,
    //   "sessions count:",
    //   sessions.length
    // );

    if (canViewAll) return sessions;

    return sessions.filter((session) => {
      const providerId = session?.sessionId?.provider;
      const userId = currentUser?._id;
      // console.log("Comparing provider:", providerId, "with user:", userId);
      return providerId === userId;
    });
  }, [canViewAll, sessions, currentUser]);

  // Filter sessions based on search query
  const visibleSessions = useMemo(() => {
    // Ensure we have an array
    if (!Array.isArray(permissionFilteredSessions)) {
      // console.error("permissionFilteredSessions is not an array");
      return [];
    }

    if (sessionSearchQuery.trim() === "") return permissionFilteredSessions;
    const searchLower = sessionSearchQuery.toLowerCase();

    return permissionFilteredSessions.filter((session) => {
      const searchableText = [
        formatDate(session.sessionId.dateOfSession),
        session.sessionId.sessionType,
        session.sessionId.status,
        session.clientId.name,
        session.providerObservation,
        ...session.activityEngaged,
        ...session.supportsObserved,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchLower);
    });
  }, [permissionFilteredSessions, sessionSearchQuery]);

  const toggleSessionSelection = (sessionId: string) => {
    setSelectedSessions((prev: any) =>
      prev.includes(sessionId)
        ? prev.filter((id: any) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const selectAllFilteredSessions = () => {
    const allIds = visibleSessions.map((s) => s._id);
    setSelectedSessions(allIds);
  };

  const deselectAllSessions = () => {
    setSelectedSessions([]);
  };

  const openViewNote = (session: SessionData) => {
    setViewNoteData(session);
    setIsViewingNote(true);
  };

  const closeViewNote = () => {
    setIsViewingNote(false);
    setViewNoteData(null);
  };

  const [downloadSessionHistory, { isSuccess }] =
    useDownloadSessionHistoryMutation();

  const handleDownloadSession = async (goalBankId: any) => {
    try {
      setDownloadingSessionId(goalBankId);
      const blob = await downloadSessionHistory(goalBankId)
        .unwrap()
        .catch((error) => handleError(error));

      await handleDownloadFunction(blob, "Session");
    } catch (error) {
      console.error("PDF download failed", error);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      showSuccess("Session Downlaod successfully..");
      setDownloadingSessionId(null);
    }
  }, [isSuccess]);

  const [
    downloadSelectedSession,
    { isLoading: isBatchDownloading, isSuccess: isBatchDownloaded },
  ] = useDownloadSelectedSessionMutation();

  const handleBatchDownload = async () => {
    try {
      const blob = await downloadSelectedSession({
        sessionIds: selectedSessions,
      })
        .unwrap()
        .catch((error) => handleError(error));
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "selected-session-history.zip"; // or .pdf
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      // await handleDownloadFunction(blob, "Session");
    } catch (error) {
      console.error("PDF download failed", error);
    }
  };
  useEffect(() => {
    if (isBatchDownloaded) {
      showSuccess("Selected Session Downlaod successfully..");
      setDownloadingSessionId(null);
    }
  }, [isBatchDownloaded]);

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#303630]">Session History</h3>
        {!canViewAll && (
          <Badge className="bg-[#395159] text-white">
            Showing Your Sessions Only
          </Badge>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#395159]" />
          <Input
            type="text"
            placeholder="Search sessions by keyword (date, provider, goals, notes, activities, etc.)..."
            value={sessionSearchQuery}
            onChange={(e) => {
              setSessionSearchQuery(e.target.value);
              setSelectedSessions([]);
            }}
            className="pl-10 h-12 bg-[#efefef] border-[#ccc9c0] focus:border-[#395159]"
          />
          {sessionSearchQuery && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSessionSearchQuery("");
                setSelectedSessions([]);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-2 text-[#395159] hover:bg-[#ccc9c0]"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        {visibleSessions.length > 0 && (
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-[#395159]">
              Showing {visibleSessions.length} session
              {visibleSessions.length !== 1 ? "s" : ""}
            </p>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={
                  selectedSessions.length === visibleSessions.length
                    ? deselectAllSessions
                    : selectAllFilteredSessions
                }
                className="border-[#395159] text-[#395159] h-8"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {selectedSessions.length === visibleSessions.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>

              {selectedSessions.length > 0 && (
                <>
                  <Badge className="bg-[#395159] text-white">
                    {selectedSessions.length} selected
                  </Badge>

                  <Button
                    size="sm"
                    onClick={handleBatchDownload}
                    className="bg-[#395159] hover:bg-[#303630] text-white h-8"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {isBatchDownloading
                      ? "Downloading..."
                      : " Download Selected"}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {visibleSessions.length === 0 ? (
          <div className="text-center py-8 text-[#395159]">
            <p>
              {sessionSearchQuery
                ? `No sessions found matching "${sessionSearchQuery}"`
                : "No sessions found."}
            </p>
          </div>
        ) : (
          visibleSessions.map((session, index) => (
            <div
              key={session._id}
              className={`p-5 bg-[#efefef] rounded-lg border transition-all ${
                sessionSearchQuery && selectedSessions.includes(index)
                  ? "border-[#395159] shadow-md"
                  : "border-[#ccc9c0]"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="pt-1">
                  <Checkbox
                    checked={selectedSessions.includes(session._id)}
                    onCheckedChange={() => toggleSessionSelection(session._id)}
                    className="w-5 h-5"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-[#303630] font-semibold">
                      {formatDate(session?.sessionId?.dateOfSession)}
                    </p>
                    <Badge className="bg-green-500 text-white">
                      {session?.sessionId?.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-blue-500 text-blue-600"
                    >
                      {session?.sessionId?.sessionType}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#395159] mb-2">
                    {formatDuration(Math.round(session.duration / 60))} •{" "}
                    {formatTime(session.sessionId.startTime)} -{" "}
                    {formatTime(session?.sessionId?.endTime)}
                  </p>
                  <p className="text-sm text-[#395159] mb-2">
                    Client: {session?.clientId?.name}
                  </p>
                  <p className="text-sm text-[#395159] mb-2">
                    Goals: {getGoalsSummary(session)}
                  </p>
                  {session?.activityEngaged?.length > 0 && (
                    <p className="text-sm text-[#395159] mb-2">
                      Activities: {session?.activityEngaged.join(", ")}
                    </p>
                  )}
                  {session?.supportsObserved?.length > 0 && (
                    <p className="text-sm text-[#395159] mb-2">
                      Supports: {session?.supportsObserved.join(", ")}
                    </p>
                  )}
                  {session?.providerObservation && (
                    <p className="text-sm text-[#303630] mt-2">
                      Observation: {session?.providerObservation}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#395159] text-[#395159]"
                  onClick={() => openViewNote(session)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button
                  size="sm"
                  className="bg-[#395159] hover:bg-[#303630] text-white"
                  disabled={downloadingSessionId === session._id}
                  onClick={() => handleDownloadSession(session?._id)}
                >
                  {downloadingSessionId === session._id
                    ? " Downloading..."
                    : " Download PDF"}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Details Dialog */}
      <Dialog open={isViewingNote} onOpenChange={setIsViewingNote}>
        <DialogContent className="max-w-6xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Session Details
            </DialogTitle>
            <DialogDescription>
              Detailed view of session note and data collection.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[calc(95vh-120px)] pr-4">
            {viewNoteData ? (
              <div className="space-y-4">
                <Card className="p-4 bg-white">
                  <h4 className="text-[#303630] mb-3">Session Information</h4>
                  <Separator className="mb-4 bg-[#ccc9c0]" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label className="text-xs text-[#395159] mb-1 block">
                        Client
                      </Label>
                      <p className="text-[#303630] font-medium">
                        {viewNoteData?.clientId?.name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-[#395159] mb-1 block">
                        Date of Session
                      </Label>
                      <p className="text-[#303630] font-medium">
                        {formatDate(viewNoteData?.sessionId?.dateOfSession)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-[#395159] mb-1 block">
                        Session Type
                      </Label>
                      <p className="text-[#303630] font-medium">
                        {viewNoteData?.sessionId?.sessionType}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-[#395159] mb-1 block">
                        Duration
                      </Label>
                      <p className="text-[#303630] font-medium">
                        {formatDuration(Math.round(viewNoteData.duration / 60))}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-[#395159] mb-1 block">
                        Status
                      </Label>
                      <Badge className="bg-green-500 text-white">
                        {viewNoteData?.sessionId?.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-[#395159] mb-1 block">
                        Start Time
                      </Label>
                      <p className="text-[#303630] font-medium">
                        {formatTime(viewNoteData?.sessionId?.startTime)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-[#395159] mb-1 block">
                        End Time
                      </Label>
                      <p className="text-[#303630] font-medium">
                        {formatTime(viewNoteData?.sessionId?.endTime)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-white">
                  <h4 className="text-[#303630] mb-3 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    Goal Progress (Data Collection)
                  </h4>
                  <Separator className="mb-4 bg-[#ccc9c0]" />
                  <div className="space-y-4">
                    {viewNoteData?.goals_dataCollection?.map((goal, idx) => (
                      <div
                        key={goal._id}
                        className="p-3 bg-[#efefef] rounded-lg border border-[#ccc9c0]"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-[#303630] font-semibold">
                            Goal {idx + 1}
                          </h5>
                          <Badge
                            className={`${
                              goal.accuracy >= 80
                                ? "bg-green-600"
                                : goal.accuracy >= 60
                                ? "bg-yellow-600"
                                : "bg-orange-600"
                            } text-white`}
                          >
                            {goal?.accuracy}% Accuracy
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="p-3 bg-white rounded border border-[#ccc9c0]">
                            <Label className="text-xs text-[#395159] mb-1 block">
                              Total Trials
                            </Label>
                            <p className="text-[#303630] font-semibold text-lg">
                              {goal.total}
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded border border-[#ccc9c0]">
                            <Label className="text-xs text-[#395159] mb-1 block">
                              Counter
                            </Label>
                            <p className="text-[#303630] font-semibold text-lg">
                              {goal.counter}
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded border border-[#ccc9c0]">
                            <Label className="text-xs text-[#395159] mb-1 block">
                              Accuracy
                            </Label>
                            <p className="text-[#303630] font-semibold text-lg">
                              {goal.accuracy}%
                            </p>
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded border border-[#ccc9c0]">
                          <Label className="text-xs text-[#395159] mb-2 block">
                            Support Levels
                          </Label>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                              <p className="text-xs text-[#395159] mb-1">
                                Independent
                              </p>
                              <p className="text-[#303630] font-semibold">
                                {goal?.supportLevel?.independent?.success}/
                                {goal?.supportLevel?.independent?.count}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-[#395159] mb-1">
                                Minimal
                              </p>
                              <p className="text-[#303630] font-semibold">
                                {goal?.supportLevel?.minimal?.success}/
                                {goal.supportLevel?.minimal?.count}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-[#395159] mb-1">
                                Moderate
                              </p>
                              <p className="text-[#303630] font-semibold">
                                {goal?.supportLevel?.modrate?.success}/
                                {goal?.supportLevel?.modrate?.count}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4 bg-white">
                  <h4 className="text-[#303630] mb-3">Activities Engaged</h4>
                  <Separator className="mb-4 bg-[#ccc9c0]" />
                  {viewNoteData.activityEngaged.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {viewNoteData?.activityEngaged?.map((activity, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="border-[#395159] text-[#395159]"
                        >
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#395159] italic">
                      No activities recorded
                    </p>
                  )}
                </Card>

                <Card className="p-4 bg-white">
                  <h4 className="text-[#303630] mb-3">Supports Observed</h4>
                  <Separator className="mb-4 bg-[#ccc9c0]" />
                  {viewNoteData?.supportsObserved?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {viewNoteData?.supportsObserved.map((support, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="border-blue-500 text-blue-600"
                        >
                          {support}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#395159] italic">
                      No supports recorded
                    </p>
                  )}
                </Card>

                <Card className="p-4 bg-white">
                  <h4 className="text-[#303630] mb-3">Provider Observations</h4>
                  <Separator className="mb-4 bg-[#ccc9c0]" />
                  {viewNoteData?.providerObservation ? (
                    <p className="text-[#303630] whitespace-pre-wrap">
                      {viewNoteData?.providerObservation}
                    </p>
                  ) : (
                    <p className="text-sm text-[#395159] italic">
                      No observations recorded
                    </p>
                  )}
                </Card>

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-4">
                  <Button
                    type="button"
                    onClick={closeViewNote}
                    className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white"
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={downloadingSessionId === viewNoteData?._id}
                    onClick={() => handleDownloadSession(viewNoteData?._id)}
                    className="h-12 border-[#395159] text-[#395159]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {downloadingSessionId === viewNoteData?._id
                      ? " Downloading..."
                      : " Download PDF"}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-[#395159]">Loading note data...</p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
