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
import { useLocation, useNavigate } from "react-router-dom";
import {
  useDownloadSessionNotesMutation,
  useGenerateNotesMutation,
  useGetUserProfileQuery,
} from "../../../redux/api/provider";
import { useEffect, useState } from "react";
import moment from "moment";
import { handleDownloadFunction, handleError } from "../../../utils/helper";
import { FullScreenLoader } from "./Loader";
import { showSuccess } from "../../../components/CustomToast";

export function NoteEditorCard({ onGenerate }: any) {
  const [hasEdited, setHasEdited] = useState(true);
  const [isSigned, setIsSigned] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sessionOverview, setSessionOverview] = useState("");
  const [treatmentChanges, setTreatmentChanges] = useState("");
  const [clinicalRecommendations, setClinicalRecommendations] = useState("");
  const [clientVariables, setClientVariables] = useState("");
  const [signatureError, setSignatureError] = useState("");

  const [providerObservation, setProviderObservations] = useState("");

  const [signature, setSignature] = useState("");

  const onEditNote = () => {
    setIsEditing(true);
    setHasEdited(false);
  };

  const onSaveEdits = () => {
    setHasEdited(true);
    setIsEditing(false);
  };
  const onSignNote = () => {
    if (!signature.trim()) {
      setSignatureError("Signature is required.");
      return;
    }
    setIsSigned(true);
    setIsEditing(false);
  };

  const { data: currentUser } = useGetUserProfileQuery();

  const location = useLocation();
  const collectedSessionData = location?.state?.sessionData;

  console.log(collectedSessionData, "collected session data");

  const navigate = useNavigate();

  const [generateNotes, { data: notes, isSuccess, isLoading }] =
    useGenerateNotesMutation();

  const [downloadSessionNotes, { isLoading: isDownloading }] =
    useDownloadSessionNotesMutation();
  console.log(notes?.data, " ai reponse ");

  const aiData = notes?.data?.soapNote;

  const sessionData = collectedSessionData?.sessionData;

  const sessionId = collectedSessionData?.collectedData?.sessionId;

  useEffect(() => {
    if (onGenerate) {
      generateNotes(sessionId)
        .unwrap()
        .catch((error: any) => handleError(error));
    }
  }, [onGenerate]);

  useEffect(() => {
    if (isSuccess) {
      setSessionOverview(aiData?.soap_note?.objective?.session_context);
      setClientVariables(sessionData.clientVariables);
      setTreatmentChanges(aiData?.soap_note?.assessment);
      setClinicalRecommendations(aiData?.soap_note?.plan);
      setProviderObservations(aiData?.soap_note?.objective?.observations);
    }
  }, [isSuccess]);

  const getSupportLevel = (performance: any) => {
    const indie = performance.independent?.count || 0;
    const minimal = performance.minimal_support?.count || 0;
    const moderate = performance.moderate_support?.count || 0;

    const max = Math.max(indie, minimal, moderate);
    if (max === indie) return "Independent";
    if (max === minimal) return "Minimal Support";
    return "Moderate Support";
  };

  function calculateSupportStats(supportLevels: {
    independent?: { count?: number; success?: number; miss?: number };
    minimal?: { count?: number; success?: number; miss?: number };
    modrate?: { count?: number; success?: number; miss?: number };
  }) {
    const independent = supportLevels.independent || {};
    const minimal = supportLevels.minimal || {};
    const moderate = supportLevels.modrate || {}; // typo handled

    // Totals
    const totalSuccess =
      (independent.success || 0) +
      (minimal.success || 0) +
      (moderate.success || 0);

    const totalMiss =
      (independent.miss || 0) + (minimal.miss || 0) + (moderate.miss || 0);

    const totalTrials = totalSuccess + totalMiss;

    return {
      totalSuccess,
      totalTrials,
      totalMiss,
    };
  }
  if (isLoading) {
    return (
      <>
        {isLoading && (
          <FullScreenLoader text="AI is generating the clinical note..." />
        )}
      </>
    );
  }

  const onDownloadPDF = async (fileName: string) => {
    try {
      const payload = buildPdfPayload();
      const blob = await downloadSessionNotes({
        sessionData: payload,
      })
        .unwrap()
        .catch((error) => handleError(error));

      await handleDownloadFunction(blob, fileName);
    } catch (err) {
      toast.error("Failed to generate PDF");
    }
  };

  const buildPdfPayload = () => {
    return {
      client: {
        name: sessionData?.client?.name,
        dob: moment(sessionData?.client?.dob).format("DD-MM-YYYY"),
      },

      provider: {
        name: currentUser?.data?.name,
        credential: currentUser?.data?.credential,
      },

      session: {
        dateOfSession: moment(sessionData?.dateOfSession).format("DD-MM-YYYY"),
        documentationDate: moment(new Date()).format("DD-MM-YYYY"),
        startTime: moment(sessionData?.startTime).format("hh:mm A"),
        endTime: moment(sessionData?.endTime).format("hh:mm A"),
        durationMinutes: Math.floor(
          (collectedSessionData?.collectedData?.duration || 0) / 60
        ),
        attendees: sessionData?.present || "Client Only",
      },

      clinicalNote: {
        sessionOverview,
        providerObservation,
        clientVariables,
        treatmentChanges,
        clinicalRecommendations,
      },

      fedcObserved:
        aiData?.soap_note?.objective?.data_and_progress?.goals?.map(
          (g: any) => g?.fedc_level
        ) || [],

      goals: (
        collectedSessionData?.collectedData?.goals_dataCollection || []
      ).map((goal: any) => {
        const stats = calculateSupportStats(goal?.supportLevel || {});
        return {
          fedcCategory: goal?.fedc_category,
          accuracy: goal?.totals?.overall_accuracy_percent || goal?.accuracy,
          totalTrials: goal?.totals?.total_trials || goal?.total,
          supportLevel: goal?.performance
            ? getSupportLevel(goal?.performance)
            : getSupportLevel(goal?.supportLevel),
          success: stats.totalSuccess,
          miss: stats.totalMiss,
        };
      }),

      signature: {
        signedBy: signature || currentUser?.data?.name,
        signedAt: moment(new Date()).format("DD-MM-YYYY"),
      },
    };
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
        {/* Document Header */}
        <div className="bg-white p-6 rounded-lg border border-[#ccc9c0]">
          <div className="text-center border-b border-[#ccc9c0] pb-4 mb-4">
            <h2 className="text-[#303630] text-2xl mb-2">DIR DataFlow</h2>
            <p className="text-[#395159]">Session Note</p>
            <p className="text-sm text-[#395159] mt-1">
              Treatment Plan Development and Progress Monitoring
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-xs text-[#395159]">Person's Name</Label>
              <p className="text-[#303630]">
                {sessionData?.client?.name || "Client"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">Date of Birth</Label>
              <p className="text-[#303630]">
                {moment(sessionData?.client?.dob).format("DD-MM-YYYY") || "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">Provider Name</Label>
              <p className="text-[#303630]">
                {currentUser?.data?.name || "Provider Name"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">Credential/Title</Label>
              <p className="text-[#303630]">
                {currentUser?.data?.credential || "Credential"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">
                Date Service Provided
              </Label>
              <p className="text-[#303630]">
                {moment(sessionData?.dateOfSession).format("DD-MM-YYYY") ||
                  new Date().toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">
                Documentation Date
              </Label>
              <p className="text-[#303630]">{moment().format("DD-MM-YYYY")}</p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">
                Session Start Time
              </Label>
              <p className="text-[#303630]">
                {moment(sessionData?.startTime).format("hh:mm A") || "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-[#395159]">Session End Time</Label>
              <p className="text-[#303630]">
                {" "}
                {moment(sessionData?.endTime).format("hh:mm A") || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Session Details Section */}
        <div className="bg-white p-6 rounded-lg border border-[#ccc9c0]">
          <h3 className="text-[#303630] mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#395159]" />
            Session Details
          </h3>
          <Separator className="mb-4 bg-[#ccc9c0]" />

          <div className="space-y-3">
            <div>
              <Label className="text-sm text-[#395159]">Total Duration</Label>
              <p className="text-[#303630]">
                {Math.floor(
                  (collectedSessionData?.collectedData?.duration || 0) / 60
                )}{" "}
                minutes
              </p>
            </div>

            <div>
              <Label className="text-sm text-[#395159]">
                Attendees Present
              </Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {sessionData?.present && (
                  <Badge
                    variant="outline"
                    className="border-[#395159] text-[#395159]"
                  >
                    {sessionData?.present}
                  </Badge>
                )}

                {!sessionData?.present && (
                  <Badge
                    variant="outline"
                    className="border-[#395159] text-[#395159]"
                  >
                    Client Only
                  </Badge>
                )}
              </div>
            </div>

            {isEditing ? (
              <div>
                <Label className="text-sm text-[#395159]">
                  Client Variables and Presentation
                </Label>
                <Textarea
                  value={clientVariables}
                  onChange={(e) => {
                    setClientVariables(e.target.value);
                  }}
                  className="mt-1"
                  rows={2}
                />
              </div>
            ) : (
              <div>
                <Label className="text-sm text-[#395159]">
                  Client Variables and Presentation
                </Label>
                <p className="text-[#303630] text-sm">
                  {clientVariables ||
                    "No specific variables or concerns noted for this session. Client presented as alert and ready to engage."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Summary Section */}
        <div className="bg-white p-6 rounded-lg border border-[#ccc9c0]">
          <h3 className="text-[#303630] mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#395159]" />
            Summary of Progress and Response to Treatment
          </h3>
          <Separator className="mb-4 bg-[#ccc9c0]" />

          <div className="space-y-4">
            <div>
              <Label className="text-sm text-[#395159] mb-2 block">
                Session Overview
              </Label>
              {isEditing ? (
                <Textarea
                  value={sessionOverview}
                  onChange={(e) => {
                    setSessionOverview(e.target.value);
                  }}
                  className="mt-1"
                  rows={4}
                  placeholder="Describe the session overview..."
                />
              ) : (
                <p className="text-[#303630] text-sm leading-relaxed">
                  {sessionOverview || ""}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm text-[#395159] mb-2 block">
                Provider Observation
              </Label>
              {isEditing ? (
                <Textarea
                  value={providerObservation}
                  onChange={(e) => {
                    setProviderObservations(e.target.value);
                  }}
                  className="mt-1"
                  rows={5}
                  placeholder="Describe the detailedd observation..."
                />
              ) : (
                <p className="text-[#303630] text-sm leading-relaxed">
                  {providerObservation || ""}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm text-[#395159] mb-2 block">
                FEDC Observed During Session
              </Label>
              <div className="flex flex-wrap gap-2">
                {aiData ? (
                  (aiData?.soap_note?.objective?.data_and_progress?.goals || [])
                    .length > 0 ? (
                    (
                      aiData?.soap_note?.objective?.data_and_progress?.goals ||
                      []
                    ).map((fedc: any) => (
                      <Badge key={fedc} className="bg-[#395159] text-white">
                        {fedc?.fedc_level}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-[#303630] text-sm">
                      Multiple FEDC levels observed and addressed during session
                    </p>
                  )
                ) : (
                  <p className="text-[#303630] text-sm">
                    {
                      collectedSessionData?.collectedData?.goals_dataCollection
                        .length
                    }{" "}
                    FEDC levels observed and addressed during session
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ITP Goal Progress */}
        {false
          ? aiData?.soap_note?.objective?.data_and_progress?.goals
          : collectedSessionData?.collectedData?.goals_dataCollection?.map(
              (goal: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg border border-[#ccc9c0]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-[#303630]">ITP Goal {index + 1}</h4>
                      <Badge
                        className={`${
                          goal?.totals?.overall_accuracy_percent ||
                          goal?.accuracy >= 80
                            ? "bg-green-600"
                            : goal?.totals?.overall_accuracy_percent ||
                              goal?.accuracy >= 60
                            ? "bg-yellow-600"
                            : "bg-orange-600"
                        } text-white`}
                      >
                        {goal?.totals?.overall_accuracy_percent ||
                          goal?.accuracy}
                        % Accuracy
                      </Badge>
                    </div>
                    <Separator className="mb-4 bg-[#ccc9c0]" />

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-[#395159]">
                          Goal Description
                        </Label>
                        <p className="text-[#303630]">{goal?.fedc_category}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-[#395159]">
                            Performance
                          </Label>
                          <p className="text-[#303630]">
                            {goal?.totals?.overall_accuracy_percent ||
                              goal?.accuracy}
                            % accuracy across{" "}
                            {goal?.totals?.total_trials || goal?.total}{" "}
                            opportunities
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm text-[#395159]">
                            Support Level Required
                          </Label>
                          <Badge
                            variant="outline"
                            className="border-[#395159] text-[#395159]"
                          >
                            {goal?.performance
                              ? getSupportLevel(goal?.performance)
                              : getSupportLevel(goal?.supportLevel)}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-[#395159]">
                          Opportunities
                        </Label>
                        <p className="text-sm text-[#303630]">
                          Successful:{" "}
                          {goal?.totals?.totalSuccess ||
                            calculateSupportStats(goal?.supportLevel)
                              .totalSuccess}{" "}
                          • Missed:{" "}
                          {goal?.totals?.total_miss ||
                            calculateSupportStats(goal?.supportLevel).totalMiss}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
            )}

        {/* Treatment Changes Section */}
        <div className="bg-white p-6 rounded-lg border border-[#ccc9c0]">
          <h3 className="text-[#303630] mb-3 flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#395159]" />
            Treatment Changes / Diagnosis
          </h3>
          <Separator className="mb-4 bg-[#ccc9c0]" />
          {isEditing ? (
            <Textarea
              value={treatmentChanges}
              onChange={(e) => {
                setTreatmentChanges(e.target.value);
              }}
              rows={4}
              className="bg-white"
              placeholder="Document any changes to treatment or diagnosis..."
            />
          ) : (
            <p className="text-[#303630] text-sm whitespace-pre-wrap">
              {treatmentChanges || ""}
            </p>
          )}
        </div>

        {/* Clinical Recommendations */}
        <div className="bg-white p-6 rounded-lg border border-[#ccc9c0]">
          <h3 className="text-[#303630] mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#395159]" />
            Clinical Recommendations / Plan
          </h3>
          <Separator className="mb-4 bg-[#ccc9c0]" />
          {isEditing ? (
            <Textarea
              value={clinicalRecommendations}
              onChange={(e) => {
                setClinicalRecommendations(e.target.value);
              }}
              rows={5}
              className="bg-white"
              placeholder="Enter recommendations (one per line)..."
            />
          ) : (
            <ul className="list-disc list-inside text-sm text-[#303630] space-y-2">
              {clinicalRecommendations || ""}
            </ul>
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
                    {currentUser?.data?.name || "Provider Name"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-[#395159]">
                    Credential/Title
                  </Label>
                  <p className="text-[#303630]">
                    {currentUser?.data?.credential || "Credential"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signature">Electronic Signature</Label>
                <Input
                  id="signature"
                  value={signature}
                  onChange={(e) => {
                    setSignature(e.target.value);
                    if (e.target.value.trim()) {
                      setSignatureError("");
                    }
                  }}
                  placeholder="Type your full name to sign"
                  className={`h-12 ${signatureError ? "border-red-500" : ""}`}
                />

                {signatureError && (
                  <p className="text-sm text-red-600 mt-1">{signatureError}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={onSignNote}
                  className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white"
                >
                  Sign Note
                </Button>
                {isSigned && (
                  <Button
                    onClick={() => onDownloadPDF("Session Note")}
                    variant="outline"
                    className="flex-1 h-12 border-[#395159] text-[#395159]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Signed electronically by{" "}
                {signature || currentUser?.data?.name || "Provider"} on{" "}
                {moment().date()}
              </p>
              <p className="text-xs text-[#395159] mt-2">
                If you need to edit and re-sign, please request QSP approval.
              </p>
              <div className="flex gap-3 mt-4">
                {isSigned && (
                  <Button
                    onClick={() => onDownloadPDF("Session Note")}
                    variant="outline"
                    className="flex-1 h-12 border-[#395159] text-[#395159]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isDownloading ? "Downloading..." : "Download PDF"}
                  </Button>
                )}
                <Button
                  onClick={() => {
                   showSuccess("Sent to QSP for review"), navigate("/");
                  }}
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
