import { Badge } from "../../../components/Badge";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Label } from "../../../components/Label";
import { Textarea } from "../../../components/Textarea";
import { Input } from "../../../components/Input";
import { Separator } from "../../../components/Seprator";
import {
  FileText,
  CheckCircle2,
  Lock,
  Edit,
  Save,
  FileSignature,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";
import moment from "moment";

interface NoteEditorCardProps {
  isEditing: boolean;
  isSigned: boolean;
  hasEdited: boolean;
  sessionOverview: string;
  treatmentChanges: string;
  clinicalRecommendations: string;
  signature: string;
  finalizedTimestamp: string;
  sessionData: any;
  clinicAccount: any;
  currentUser: any;
  allGoals: any[];
  removedGoalIds: number[];
  onEditNote: () => void;
  onSaveEdits: () => void;
  onSignNote: () => void;
  onDownloadPDF: () => void;
  setSessionOverview: (val: string) => void;
  setTreatmentChanges: (val: string) => void;
  setClinicalRecommendations: (val: string) => void;
  aiNoteData: any;
  setSignature: (val: string) => void;
}

export function NoteEditorCard({
  isEditing,
  isSigned,
  hasEdited,
  sessionOverview,
  treatmentChanges,
  clinicalRecommendations,
  signature,
  finalizedTimestamp,
  sessionData,
  clinicAccount,
  currentUser,
  allGoals,
  removedGoalIds,
  onEditNote,
  onSaveEdits,
  onSignNote,
  onDownloadPDF,
  setSessionOverview,
  setTreatmentChanges,
  setClinicalRecommendations,
  aiNoteData,
  setSignature,
}: NoteEditorCardProps) {
  // Extract AI response data (for clinical content only)
  const aiResponse = aiNoteData?.aiResponse || {};
  const clinicalNote = aiResponse.clinicalNote || {};
  const sessionDetails = aiResponse.sessionDetails || {};

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Format time helper
  const formatTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-[#303630]">AI-Generated Clinical Note</h3>
          {hasEdited && !isSigned && (
            <Badge className="bg-orange-500 text-white">
              <Edit className="w-3 h-3 mr-1" />
              Edited
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-[#395159]">
          <Lock className="w-4 h-4" />
          HIPAA Compliant
        </div>
      </div>

      {!isSigned && !isEditing && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-800">
              <strong>Review the note carefully.</strong> You can edit any
              section before signing.
            </p>
            <Button
              onClick={onEditNote}
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-600 hover:bg-blue-100"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit Note
            </Button>
          </div>
        </div>
      )}

      {isEditing && !isSigned && (
        <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-orange-800">
              <strong>Editing Mode:</strong> Make changes to the note below,
              then save your edits.
            </p>
            <Button
              onClick={onSaveEdits}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Save className="w-4 h-4 mr-1" />
              Save Edits
            </Button>
          </div>
        </div>
      )}

      <div
        className={`space-y-4 p-6 rounded-lg border-2 ${
          isEditing && !isSigned
            ? "border-orange-300 bg-orange-50/30"
            : "border-[#ccc9c0] bg-[#efefef]"
        }`}
      >
        {/* Document Header - Using collectedSessionData */}
        <div className="bg-white p-6 rounded-lg border border-[#ccc9c0]">
          <div className="text-center border-b border-[#ccc9c0] pb-4 mb-4">
            <h2 className="text-[#303630] text-2xl mb-2">
              {clinicAccount?.clinicName || "DIR DataFlow"}
            </h2>
            <p className="text-[#395159]">Session Note</p>
            <p className="text-sm text-[#395159] mt-1">
              Treatment Plan Development and Progress Monitoring
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-xs text-[#395159]">Person's Name</Label>
              <p className="text-[#303630]">
                {sessionData?.clientName || "Client"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">Date of Birth</Label>
              <p className="text-[#303630]">
                {formatDate(sessionData?.clientDob)}
              </p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">Age</Label>
              <p className="text-[#303630]">
                {sessionData?.clientAge || "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">Diagnosis</Label>
              <p className="text-[#303630]">
                {sessionData?.diagnosis || "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">Provider Name</Label>
              <p className="text-[#303630]">
                {sessionData?.providerName ||
                  currentUser?.name ||
                  "Provider Name"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">Credential/Title</Label>
              <p className="text-[#303630]">
                {sessionData?.providerCredential ||
                  currentUser?.credential ||
                  "Credential"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">
                Date Service Provided
              </Label>
              <p className="text-[#303630]">
                {formatDate(sessionData?.dateOfSession)}
              </p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">
                Documentation Date
              </Label>
              <p className="text-[#303630]">
                {formatDate(
                  sessionData?.documentationDate || new Date().toISOString()
                )}
              </p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">
                Session Start Time
              </Label>
              <p className="text-[#303630]">
                {moment(sessionData?.startTime).format("HH:mm") || "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">Session End Time</Label>
              <p className="text-[#303630]">
                {moment(sessionData?.endTime).format("HH:mm") || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Session Details Section - Using collectedSessionData */}
        <div className="bg-white p-6 rounded-lg border border-[#ccc9c0]">
          <h3 className="text-[#303630] mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#395159]" />
            Session Details
          </h3>
          <Separator className="mb-4 bg-[#ccc9c0]" />

          <div className="space-y-3">
            <div>
              <Label className="text-xs text-[#395159]">Total Duration</Label>
              <p className="text-[#303630]">
                {sessionData?.duration
                  ? Math.round(sessionData.duration / 60)
                  : "N/A"}{" "}
                minutes
              </p>
            </div>
            <div>
              <Label className="text-sm text-[#395159]">
                Activities Engaged
              </Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {(sessionData?.activityEngaged || []).length > 0 ? (
                  sessionData.activityEngaged.map(
                    (activity: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="border-[#395159] text-[#395159]"
                      >
                        {activity}
                      </Badge>
                    )
                  )
                ) : (
                  <Badge
                    variant="outline"
                    className="border-[#395159] text-[#395159]"
                  >
                    No activities recorded
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm text-[#395159]">
                Supports Observed
              </Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {(sessionData?.supportsObserved || []).length > 0 ? (
                  sessionData.supportsObserved.map(
                    (support: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="border-[#395159] text-[#395159]"
                      >
                        {support}
                      </Badge>
                    )
                  )
                ) : (
                  <Badge
                    variant="outline"
                    className="border-[#395159] text-[#395159]"
                  >
                    No supports recorded
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <Label className="text-xs text-[#395159]">
                Attendees Present
              </Label>
              <p className="text-[#303630]">
                <Badge
                  variant="outline"
                  className="border-[#395159] text-[#395159]"
                >
                  {sessionData?.attendees || "Client Only"}
                </Badge>
              </p>
            </div>
            {sessionData?.variables && (
              <div>
                <Label className="text-xs text-[#395159]">
                  Client Variables and Presentation
                </Label>
                <p className="text-[#303630]">{sessionData?.variables}</p>
              </div>
            )}
          
            {sessionData?.providerObservation && (
              <div>
                <Label className="text-sm text-[#395159]">
                  Provider Observations
                </Label>
                <p className="text-[#303630] text-sm">
                  {sessionData.providerObservation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Clinical Note - Presentation and Engagement (AI Generated) */}
        <div className="bg-white p-6 rounded-lg border border-[#ccc9c0]">
          <h3 className="text-[#303630] mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#395159]" />
            Summary of Progress and Response to Treatment
          </h3>
          <Separator className="mb-4 bg-[#ccc9c0]" />
             <Label className="text-sm text-[#395159]">
                  Session Overview
                </Label>
          <div className="space-y-4">
            {isEditing ? (
              <Textarea
                value={sessionOverview}
                onChange={(e) => setSessionOverview(e.target.value)}
                className="mt-1"
                rows={4}
                placeholder="Describe the client's presentation and engagement..."
              />
            ) : (
              <p className="text-[#303630] text-sm leading-relaxed">
                {sessionOverview ||
                  clinicalNote.presentationAndEngagement ||
                  "No overview available."}
              </p>
            )}
          </div>
        </div>

        {/* Interactions and Affect (AI Generated) */}
        {clinicalNote.interactionsAndAffect && (
          <div className="bg-white p-6 rounded-lg border border-[#ccc9c0]">
            <h3 className="text-[#303630] mb-3">Interactions and Affect</h3>
            <Separator className="mb-4 bg-[#ccc9c0]" />
            <p className="text-[#303630] text-sm leading-relaxed">
              {clinicalNote.interactionsAndAffect}
            </p>
          </div>
        )}

        {/* FEDC Observations (AI Generated) */}
        <div className="bg-white p-6 rounded-lg border border-[#ccc9c0]">
          <h3 className="text-[#303630] mb-3">FEDC Level Observations</h3>
          <Separator className="mb-4 bg-[#ccc9c0]" />

          <div className="space-y-3">
            <div>
              <Label className="text-sm text-[#395159] mb-2 block">
                Observed FEDC Level
              </Label>
              <Badge className="bg-[#395159] text-white">
                {sessionDetails?.observedFEDCLevel || "FEDC Level Observed"}
              </Badge>
            </div>

            {clinicalNote?.fedcObservations && (
              <div>
                <Label className="text-sm text-[#395159] mb-2 block">
                  Clinical Observations
                </Label>
                <p className="text-[#303630] text-sm leading-relaxed">
                  {clinicalNote.fedcObservations}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ITP Goal Progress - Using collectedSessionData goals */}
        {(sessionData?.goalsDataCollection || []).map(
          (goalDataCollection: any, index: number) => {
            const aiGoal = clinicalNote.goalProgress?.[index] || {};

            // Calculate accuracy from collected data
            const accuracy = goalDataCollection.accuracy || 0;
            const total = goalDataCollection.total || 0;

            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-[#ccc9c0]"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-[#303630]">ITP Goal {index + 1}</h4>
                  <Badge
                    className={`${
                      accuracy >= 80
                        ? "bg-green-600"
                        : accuracy >= 60
                        ? "bg-yellow-600"
                        : "bg-orange-600"
                    } text-white`}
                  >
                    {accuracy}% Accuracy
                  </Badge>
                </div>
                <Separator className="mb-4 bg-[#ccc9c0]" />

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-[#395159]">
                      Goal Description
                    </Label>
                    <p className="text-[#303630]">
                      {aiGoal?.goalName ||
                        goalDataCollection?.goalId?.category ||
                        "Goal"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-[#395159]">
                        Performance
                      </Label>
                      <p className="text-[#303630]">
                        {accuracy}% accuracy across {total} trials
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-[#395159]">
                        Total Opportunities
                      </Label>
                      <p className="text-[#303630]">{total}</p>
                    </div>
                  </div>

                  {/* Support Level Breakdown from collected data */}
                  <div>
                    <Label className="text-sm text-[#395159] mb-2 block">
                      Support Level Breakdown
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 bg-[#efefef] rounded border border-[#ccc9c0]">
                        <Label className="text-xs text-[#395159]">
                          Independent
                        </Label>
                        <p className="text-[#303630] font-semibold">
                          {goalDataCollection.supportLevel?.independent
                            ?.count || 0}
                        </p>
                        <p className="text-xs text-[#395159]">
                          Success:{" "}
                          {goalDataCollection.supportLevel?.independent
                            ?.success || 0}
                        </p>
                      </div>
                      <div className="p-2 bg-[#efefef] rounded border border-[#ccc9c0]">
                        <Label className="text-xs text-[#395159]">
                          Minimal
                        </Label>
                        <p className="text-[#303630] font-semibold">
                          {goalDataCollection.supportLevel?.minimal?.count || 0}
                        </p>
                        <p className="text-xs text-[#395159]">
                          Success:{" "}
                          {goalDataCollection.supportLevel?.minimal?.success ||
                            0}
                        </p>
                      </div>
                      <div className="p-2 bg-[#efefef] rounded border border-[#ccc9c0]">
                        <Label className="text-xs text-[#395159]">
                          Moderate
                        </Label>
                        <p className="text-[#303630] font-semibold">
                          {goalDataCollection.supportLevel?.modrate?.count || 0}
                        </p>
                        <p className="text-xs text-[#395159]">
                          Success:{" "}
                          {goalDataCollection.supportLevel?.modrate?.success ||
                            0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {aiGoal.masteryCriteria && (
                    <div>
                      <Label className="text-sm text-[#395159]">
                        Mastery Criteria
                      </Label>
                      <p className="text-sm text-[#303630]">
                        {aiGoal.masteryCriteria}
                      </p>
                    </div>
                  )}

                  {aiGoal.clinicalInterpretation && (
                    <div>
                      <Label className="text-sm text-[#395159]">
                        Clinical Interpretation
                      </Label>
                      <p className="text-sm text-[#303630] leading-relaxed">
                        {aiGoal.clinicalInterpretation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          }
        )}
         


          <div className="bg-white p-6 rounded-lg border border-[#ccc9c0]">
          <h3 className="text-[#303630] mb-3 flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#395159]" />
           Detailed Clinical Observations
          </h3>
          <Separator className="mb-4 bg-[#ccc9c0]" />
          {isEditing ? (
            <Textarea
              value={treatmentChanges}
              onChange={(e) => setTreatmentChanges(e.target.value)}
              rows={4}
              className="bg-white"
              placeholder="Document any changes to treatment or diagnosis..."
            />
          ) : (
            <p className="text-[#303630] text-sm whitespace-pre-wrap">
              {treatmentChanges ||
                clinicalNote.changesInTreatmentOrDiagnosis ||
                "No changes to diagnosis at this time. Treatment plan remains appropriate."}
            </p>
          )}
        </div>




        {/* Treatment Changes Section (AI Generated) */}
        <div className="bg-white p-6 rounded-lg border border-[#ccc9c0]">
          <h3 className="text-[#303630] mb-3 flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#395159]" />
           Changes in Treatment or Diagnosis
          </h3>
          <Separator className="mb-4 bg-[#ccc9c0]" />
          {isEditing ? (
            <Textarea
              value={treatmentChanges}
              onChange={(e) => setTreatmentChanges(e.target.value)}
              rows={4}
              className="bg-white"
              placeholder="Document any changes to treatment or diagnosis..."
            />
          ) : (
            <p className="text-[#303630] text-sm whitespace-pre-wrap">
              {treatmentChanges ||
                clinicalNote.changesInTreatmentOrDiagnosis ||
                "No changes to diagnosis at this time. Treatment plan remains appropriate."}
            </p>
          )}
        </div>

        {/* Clinical Recommendations / Plan (AI Generated) */}
        <div className="bg-white p-6 rounded-lg border border-[#ccc9c0]">
          <h3 className="text-[#303630] mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#395159]" />
            Clinical Recommendations / Plan
          </h3>
          <Separator className="mb-4 bg-[#ccc9c0]" />
          {isEditing ? (
            <Textarea
              value={clinicalRecommendations}
              onChange={(e) => setClinicalRecommendations(e.target.value)}
              rows={5}
              className="bg-white"
              placeholder="Enter recommendations and plan..."
            />
          ) : (
            <div className="text-sm text-[#303630] leading-relaxed whitespace-pre-wrap">
              {clinicalRecommendations ||
                clinicalNote.plan ||
                "Plan will be documented here."}
            </div>
          )}
        </div>

        {/* Signature Section */}
        <div className="bg-white p-6 rounded-lg border border-[#ccc9c0]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#303630] flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-[#395159]" />
              Provider Signature
            </h3>
            {isSigned && (
              <Badge className="bg-green-600 text-white">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Signed
              </Badge>
            )}
          </div>

          {!isSigned ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-[#395159]">
                    Provider Name
                  </Label>
                  <p className="text-[#303630]">
                    {sessionData?.providerName ||
                      currentUser?.name ||
                      "Provider Name"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-[#395159]">
                    Credential/Title
                  </Label>
                  <p className="text-[#303630]">
                    {sessionData?.providerCredential ||
                      currentUser?.credential ||
                      "Credential"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signature">Electronic Signature</Label>
                <Input
                  id="signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Type your full name to sign"
                  className="h-12"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={onSignNote}
                  className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white"
                >
                  Sign Note
                </Button>
                <Button
                  onClick={onDownloadPDF}
                  variant="outline"
                  className="flex-1 h-12 border-[#395159] text-[#395159]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Signed electronically by{" "}
                {signature ||
                  sessionData?.providerName ||
                  currentUser?.name ||
                  "Provider"}{" "}
                on {finalizedTimestamp}
              </p>
              <p className="text-xs text-[#395159] mt-2">
                If you need to edit and re-sign, please request QSP approval.
              </p>
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={onDownloadPDF}
                  variant="outline"
                  className="flex-1 h-12 border-[#395159] text-[#395159]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={() => toast.success("Sent to QSP for review")}
                  className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white"
                >
                  Send to QSP for Review
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
