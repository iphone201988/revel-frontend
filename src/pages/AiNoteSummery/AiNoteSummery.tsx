import { useEffect, useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/Button";
import { NoteSidebarSummary } from "./components/NoteSidebarSummary";
import { NoteGenerateCard } from "./components/NoteGenerateCard";
import { NoteEditorCard } from "./components/NoteEditorCard";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useGenerateNotesMutation } from "../../redux/api/provider";
import { handleError } from "../../utils/helper";

interface AINoteSummaryScreenProps {
  clientId: string | null;
  sessionData: any;
  currentUser: any;
  clinicAccount: any;
  onNavigate: (screen: any) => void;
  onLogout: () => void;
}

export function AINoteSummaryScreen({
  clientId,
  sessionData,
  currentUser,
  clinicAccount,
  onLogout,
}: AINoteSummaryScreenProps) {
  const location = useLocation();
  const collectedSessionData = location?.state?.sessionData;
  const navigate = useNavigate();

  const [generateNotes, { data: notes, isSuccess }] =
    useGenerateNotesMutation();

  const [isNoteGenerated, setIsNoteGenerated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [signature, setSignature] = useState("");
  const [isSigned, setIsSigned] = useState(false);
  const [finalizedTimestamp, setFinalizedTimestamp] = useState("");
  const [generatedNoteData, setGeneratedNoteData] = useState<any>(null);

  const [sessionOverview, setSessionOverview] = useState("");
  const [treatmentChanges, setTreatmentChanges] = useState("");
  const [clinicalRecommendations, setClinicalRecommendations] = useState("");

  useEffect(() => {
    if (isSuccess && notes?.data) {
      setGeneratedNoteData(notes.data);

      const clinicalNote = notes.data.aiResponse.clinicalNote;

      setSessionOverview(clinicalNote.presentationAndEngagement || "");
      setTreatmentChanges(clinicalNote.changesInTreatmentOrDiagnosis || "");
      setClinicalRecommendations(clinicalNote.plan || "");
    }
  }, [isSuccess, notes]);

  useEffect(() => {
    setIsNoteGenerated(false);
    setIsEditing(false);
    setIsSigned(false);
    setHasEdited(false);
    setSignature("");
    setSessionOverview("");
    setTreatmentChanges("");
    setClinicalRecommendations("");
  }, [clientId]);

  const extractedGoals = generatedNoteData?.aiResponse?.clinicalNote?.goalProgress || [];
  const allGoals = extractedGoals.map((goal: any, index: number) => ({
    _id: goal.goalNumber || index + 1,
    category: goal.goalName || "Goal",
    goal: goal.clinicalInterpretation || "",
  }));

  const removedGoalIds: number[] = [];

  const generateAINote = () => {
    const sessionIdToUse = collectedSessionData?.collectedData?.sessionId || sessionData?.sessionId;

    if (!sessionIdToUse) {
      toast.error("Session ID not found. Please try again.");
      return;
    }

    generateNotes(sessionIdToUse)
      .unwrap()
      .then(() => {
        toast.success("AI note generated successfully!");
        setIsNoteGenerated(true);
        setIsEditing(false);
        setHasEdited(false);
      })
      .catch((error) => {
        handleError(error);
        toast.error("Failed to generate note. Please try again.");
      });
  };

  const createManualNote = () => {
    toast.info("Creating blank note for manual completion...");
    setIsNoteGenerated(true);
    setIsEditing(true);
    setHasEdited(true);
    setSessionOverview("");
    setTreatmentChanges("");
    setClinicalRecommendations("");
  };

  const handleEditNote = () => {
    setIsEditing(true);
    toast.info(
      "Note is now editable. Make any necessary changes before signing."
    );
  };

  const handleSaveEdits = () => {
    setIsEditing(false);
    setHasEdited(true);
    toast.success(
      "Changes saved. You can continue editing or proceed to sign the note."
    );
  };

  const handleSignNote = () => {
    if (!signature.trim()) {
      toast.error("Please enter your signature");
      return;
    }

    const timestamp = new Date().toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setFinalizedTimestamp(timestamp);
    setIsSigned(true);

    const isQSP =
      currentUser?.role === "QSP" || currentUser?.role === "Super Admin";
    if (!isQSP) {
      toast.success(
        "Note signed and sent to QSP for review. A task has been created for the QSP."
      );
    } else {
      toast.success("Note signed and added to client record");
    }
  };

  const handleDownloadPDF = () => {
    toast.success("Downloading note as PDF...");
  };

  const enrichedSessionData = {
    ...sessionData,
    ...collectedSessionData,
    clientName: generatedNoteData?.aiResponse?.clientDetails?.name || sessionData?.clientName || "Client",
    clientDob: sessionData?.clientDob || "N/A",
    date: generatedNoteData?.aiResponse?.sessionDetails?.date || sessionData?.date || new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader onLogout={onLogout} />

      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-6 border-[#395159] text-[#395159]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-3 gap-6">
          <NoteSidebarSummary
            sessionData={enrichedSessionData}
            // generatedNoteData={generatedNoteData}
          />

          <div className="col-span-2 space-y-4">
            {!isNoteGenerated ? (
              <NoteGenerateCard
                onGenerate={generateAINote}
                onManual={createManualNote}
              />
            ) : (
              <NoteEditorCard
                isEditing={isEditing}
                isSigned={isSigned}
                hasEdited={hasEdited}
                sessionOverview={sessionOverview}
                treatmentChanges={treatmentChanges}
                clinicalRecommendations={clinicalRecommendations}
                signature={signature}
                finalizedTimestamp={finalizedTimestamp}
                sessionData={enrichedSessionData}
                aiNoteData={generatedNoteData}
                clinicAccount={clinicAccount}
                currentUser={currentUser}
                allGoals={allGoals}
                removedGoalIds={removedGoalIds}
                onEditNote={handleEditNote}
                onSaveEdits={handleSaveEdits}
                onSignNote={handleSignNote}
                onDownloadPDF={handleDownloadPDF}
                setSessionOverview={setSessionOverview}
                setTreatmentChanges={setTreatmentChanges}
                setClinicalRecommendations={setClinicalRecommendations}
                setSignature={setSignature}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
