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
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useDownloadSessionNotesMutation,
  useGenerateNotesMutation,
  useGetOrgnaizationQuery,
  useGetUserProfileQuery,
  useSaveReportMutation,
} from "../../../redux/api/provider";
import { useEffect, useState } from "react";
import moment from "moment";
import { handleDownloadFunction, handleError } from "../../../utils/helper";
import { FullScreenLoader } from "./Loader";
import { showSuccess } from "../../../components/CustomToast";

export function NoteEditorCard({ onGenerate }: any) {
  const [hasEdited, setHasEdited] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [sessionOverview, setSessionOverview] = useState("");
  const [treatmentChanges, setTreatmentChanges] = useState("");
  const [clinicalRecommendations, setClinicalRecommendations] = useState("");
  const [clientVariables, setClientVariables] = useState("");
  const [signatureError, setSignatureError] = useState("");
  const [providerObservation, setProviderObservations] = useState("");
  const [signature, setSignature] = useState("");

  const { data: orgnaizationData } = useGetOrgnaizationQuery();
  const { data: currentUser } = useGetUserProfileQuery();
  const { data: profile } = useGetUserProfileQuery();
  
  const qspSignatureRequired = profile?.data?.permissions?.includes("QspSignatureRequired");

  const location = useLocation();
  const collectedSessionData = location?.state?.sessionData;
  const navigate = useNavigate();

  const [generateNotes, { data: notes, isSuccess, isLoading }] =
    useGenerateNotesMutation();

  const [downloadSessionNotes, { isLoading: isDownloading }] =
    useDownloadSessionNotesMutation();

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

  const onEditNote = () => {
    setIsEditing(true);
    setHasEdited(true);
  };

  const onSaveEdits = () => {
    setIsEditing(false);
    setIsSaved(true);
  };

  const onSignNote = async () => {
    if (!isSaved) {
      setSignatureError("Please save the note before signing.");
      toast.error("Please click 'Save Edits' before signing.");
      return;
    }

    if (!signature.trim()) {
      setSignatureError("Signature is required.");
      return;
    }

    await handleSaveReportWithSignature();
  };

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
    const moderate = supportLevels.modrate || {};

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
        const independentData = goal?.performance?.independent || goal?.supportLevel?.independent || {};
        const minimalData = goal?.performance?.minimal_support || goal?.supportLevel?.minimal || {};
        const moderateData = goal?.performance?.moderate_support || goal?.supportLevel?.modrate || {};

        return {
          description: goal?.goal_name || goal?.goalId?.discription,
          fedcCategory: goal?.fedc_category || goal?.goalId?.category,
          accuracy: goal?.totals?.overall_accuracy_percent || goal?.accuracy,
          totalTrials: goal?.totals?.total_trials || goal?.total,
          supportLevel: goal?.performance
            ? getSupportLevel(goal?.performance)
            : getSupportLevel(goal?.supportLevel),
          success: stats.totalSuccess,
          miss: stats.totalMiss,
          supportLevelDetails: {
            independent: independentData?.count > 0 ? {
              count: independentData.count || 0,
              success: independentData.success || 0,
              percent: independentData.success_percent || Math.round(((independentData.success || 0) / (independentData.count || 1)) * 100)
            } : null,
            minimal: minimalData?.count > 0 ? {
              count: minimalData.count || 0,
              success: minimalData.success || 0,
              percent: minimalData.success_percent || Math.round(((minimalData.success || 0) / (minimalData.count || 1)) * 100)
            } : null,
            moderate: moderateData?.count > 0 ? {
              count: moderateData.count || 0,
              success: moderateData.success || 0,
              percent: moderateData.success_percent || Math.round(((moderateData.success || 0) / (moderateData.count || 1)) * 100)
            } : null,
          },
        };
      }),

      signature: {
        signedBy: signature || currentUser?.data?.name,
        signedAt: moment(new Date()).format("DD-MM-YYYY"),
      },
    };
  };

  const buildSaveReportPayload = () => {
    const status = qspSignatureRequired ? "PENDING_QSP_SIGNATURE" : "SIGNED";
    
    return {
      subjective: sessionOverview,

      client: {
        name: sessionData?.client?.name,
        dob: sessionData?.client?.dob,
      },

      provider: {
        name: currentUser?.data?.name,
        credentail: currentUser?.data?.credential,
      },

      session: {
        startTime: sessionData?.startTime,
        endTime: sessionData?.endTime,
      },

      date: new Date(),

      totalDuration: Math.floor(
        (collectedSessionData?.collectedData?.duration || 0) / 60
      ),

      clientVariables,

      session_context: sessionOverview,
      observations: providerObservation,

      supportObserved:
        aiData?.soap_note?.objective?.data_and_progress?.strategies_implemented || [],
      activities:
        aiData?.soap_note?.objective?.data_and_progress?.activities || [],

      assessment: treatmentChanges,
      plan: clinicalRecommendations,

      signature: signature,
      status: status,

      orgnaizationId: orgnaizationData?.data?._id,

      goals: (
        collectedSessionData?.collectedData?.goals_dataCollection || []
      ).map((goal: any) => {
        const stats = calculateSupportStats(goal?.supportLevel || {});
        return {
          description: goal?.goal_name,
          accuracy: goal?.totals?.overall_accuracy_percent || goal?.accuracy,
          performance: `${goal?.totals?.total_trials || goal?.total} trials`,
          supportLevel: goal?.performance
            ? getSupportLevel(goal?.performance)
            : getSupportLevel(goal?.supportLevel),
          progressSummery: `Accuracy ${goal?.accuracy}%`,
          successfull: stats.totalSuccess,
          missed: stats.totalMiss,
        };
      }),
    };
  };

  const [saveReport,{ isSuccess: isReportSaved } ] = useSaveReportMutation();

  const handleSaveReportWithSignature = async () => {
    const payload = buildSaveReportPayload();
    
    await saveReport(payload)
      .unwrap()
      .then(() => {
        setIsSigned(true);
        setIsEditing(false);
        
        if (qspSignatureRequired) {
          showSuccess("Note has been sent to QSP for signature");
        } else {
          showSuccess("Report saved and signed successfully");
        }
      })
      .catch((error: any) => handleError(error));
  };

  if (isLoading) {
    return (
      <>
        {isLoading && (
          <FullScreenLoader text="AI is generating the clinical note..." />
        )}
      </>
    );
  }

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
          {isSaved && !isSigned && (
            <Badge className="bg-green-500 text-white">
              <Save className="w-3 h-3 mr-1" />
              Saved
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-[#395159]">
          <Lock className="w-4 h-4" />
          HIPAA Compliant
        </div>
      </div>

      {/* Blue Banner - Initial Review */}
      {!isSigned && !isEditing && !isSaved && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-800">
              <strong>Review the note carefully.</strong> You can edit any
              section before saving and signing.
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

      {/* Orange Banner - Editing Mode */}
      {isEditing && !isSigned && (
        <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-orange-800">
              <strong>Editing Mode:</strong> Make changes to the note below,
              then save your edits before signing.
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

      {/* Green Banner - Saved Successfully */}
      {isSaved && !isSigned && !isEditing && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-800">
              <strong>Note Saved Successfully.</strong> You can now sign the
              note below or edit again if needed.
            </p>
            <Button
              onClick={onEditNote}
              variant="outline"
              size="sm"
              className="border-green-600 text-green-700 hover:bg-green-100"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit Again
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
            <h2 className="text-[#303630] text-2xl mb-2">
              {orgnaizationData?.data?.clinicName}
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
                  disabled={isSigned}
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
                  disabled={isSigned}
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
                  placeholder="Describe the detailed observation..."
                  disabled={isSigned}
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
                    ).map((fedc: any, idx: number) => (
                      <Badge key={idx} className="bg-[#395159] text-white">
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
                        ?.length
                    }{" "}
                    FEDC levels observed and addressed during session
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ITP Goal Progress */}
        {(aiData?.soap_note?.objective?.data_and_progress?.goals ||
          collectedSessionData?.collectedData?.goals_dataCollection)?.map(
          (goal: any, index: number) => {
            const stats = calculateSupportStats(
              goal?.supportLevel || goal?.performance || {}
            );
            const accuracy =
              goal?.totals?.overall_accuracy_percent || goal?.accuracy || 0;
            const totalTrials =
              goal?.totals?.total_trials || goal?.total || stats.totalTrials;
            const goalDescription =
              goal?.goal_name || goal?.goalId?.discription || "";
            const fedcCategory =
              goal?.fedc_level ||
              goal?.fedc_category ||
              goal?.goalId?.category ||
              "";

            const independentData =
              goal?.performance?.independent || goal?.supportLevel?.independent || {};
            const minimalData =
              goal?.performance?.minimal_support ||
              goal?.supportLevel?.minimal ||
              {};
            const moderateData =
              goal?.performance?.moderate_support ||
              goal?.supportLevel?.modrate ||
              {};

            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-[#ccc9c0]"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-[#303630] font-semibold">
                    ITP Goal {index + 1}
                  </h4>
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

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-[#395159] font-semibold">
                      Goal Description
                    </Label>
                    <p className="text-[#303630] mt-1">{goalDescription}</p>
                  </div>

                  {fedcCategory && (
                    <div>
                      <Label className="text-sm text-[#395159] font-semibold">
                        FEDC Category
                      </Label>
                      <p className="text-[#303630] mt-1">{fedcCategory}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-[#395159] font-semibold">
                        Performance
                      </Label>
                      <p className="text-[#303630] mt-1">
                        {accuracy}% accuracy across {totalTrials} opportunities
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm text-[#395159] font-semibold">
                        Support Level Required
                      </Label>
                      <Badge
                        variant="outline"
                        className="border-[#395159] text-[#395159] mt-1"
                      >
                        {goal?.performance
                          ? getSupportLevel(goal?.performance)
                          : getSupportLevel(goal?.supportLevel)}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-[#395159] font-semibold">
                      Opportunities
                    </Label>
                    <p className="text-sm text-[#303630] mt-1">
                      Successful: {stats.totalSuccess} • Missed:{" "}
                      {stats.totalMiss}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm text-[#395159] font-semibold mb-2 block">
                      Performance by Support Level
                    </Label>
                    <div className="space-y-2">
                      {independentData?.count > 0 && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-[#303630]">
                            Independent
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-[#303630]">
                              {independentData.success || 0}/
                              {independentData.count || 0}
                            </span>
                            <Badge
                              variant="outline"
                              className="border-[#395159] text-[#395159] min-w-[60px] justify-center"
                            >
                              {independentData.success_percent ||
                                Math.round(
                                  ((independentData.success || 0) /
                                    (independentData.count || 1)) *
                                    100
                                )}
                              %
                            </Badge>
                          </div>
                        </div>
                      )}

                      {minimalData?.count > 0 && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-[#303630]">
                            Minimal Support
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-[#303630]">
                              {minimalData.success || 0}/{minimalData.count || 0}
                            </span>
                            <Badge
                              variant="outline"
                              className="border-[#395159] text-[#395159] min-w-[60px] justify-center"
                            >
                              {minimalData.success_percent ||
                                Math.round(
                                  ((minimalData.success || 0) /
                                    (minimalData.count || 1)) *
                                    100
                                )}
                              %
                            </Badge>
                          </div>
                        </div>
                      )}

                      {moderateData?.count > 0 && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-[#303630]">
                            Moderate Support
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-[#303630]">
                              {moderateData.success || 0}/
                              {moderateData.count || 0}
                            </span>
                            <Badge
                              variant="outline"
                              className="border-[#395159] text-[#395159] min-w-[60px] justify-center"
                            >
                              {moderateData.success_percent ||
                                Math.round(
                                  ((moderateData.success || 0) /
                                    (moderateData.count || 1)) *
                                    100
                                )}
                              %
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {(goal?.engagement_summary || goal?.performance_summary) && (
                    <div>
                      <Label className="text-sm text-[#395159] font-semibold">
                        Progress Summary
                      </Label>
                      <p className="text-sm text-[#303630] mt-1">
                        {goal?.engagement_summary || goal?.performance_summary}
                      </p>
                    </div>
                  )}
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
              disabled={isSigned}
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
              disabled={isSigned}
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
              <Badge className={`${qspSignatureRequired ? 'bg-orange-600' : 'bg-green-600'} text-white`}>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                {qspSignatureRequired ? 'Awaiting QSP' : 'Signed'}
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

              {!isSaved && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Please save the note before signing.
                  </p>
                </div>
              )}

              {isSaved && (
                <>
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

                  <div className="flex gap-3">
                    <Button
                      onClick={onSignNote}
                      className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white"
                    >
                      Sign Note
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className={`p-4 rounded-lg border ${qspSignatureRequired ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
              <p className={`text-sm flex items-center gap-2 ${qspSignatureRequired ? 'text-orange-800' : 'text-green-800'}`}>
                <CheckCircle2 className="w-4 h-4" />
                Signed electronically by{" "}
                {signature || currentUser?.data?.name || "Provider"} on{" "}
                {moment().format("DD-MM-YYYY")}
                {qspSignatureRequired && " - Pending QSP Signature"}
              </p>
              <p className="text-xs text-[#395159] mt-2 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                This note is now locked and cannot be edited. Contact your administrator if changes are needed.
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
                    navigate("/");
                  }}
                  className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white"
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}