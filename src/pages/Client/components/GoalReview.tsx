import { useEffect, useState } from "react";
import { AppHeader } from "../../../components/AppHeader";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus as MinusIcon,
  Check,
  AlertCircle,
  Loader2, // Added for loading spinner
} from "lucide-react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Badge } from "../../../components/Badge";
import { Progress } from "../../../components/Progress/Progress";
import { useLocation, useNavigate } from "react-router-dom";
import { useGoalReviewQuery, useUpdateGoalStatusMutation } from "../../../redux/api/provider";
import { handleError } from "../../../utils/helper";
import { toast } from "sonner"; // Assuming you're using sonner for toast notifications

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/Select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/Dailog";
import { Label } from "../../../components/Label";
import { Textarea } from "../../../components/Textarea";

const statusOptions = [
  { value: "Mastered", label: "Mastered", color: "bg-green-500" },
  { value: "InProgress", label: "In Progress", color: "bg-blue-500" },
  { value: "Discontinued", label: "Discontinued", color: "bg-red-500" },
];

export function GoalReviewScreen() {
  const [updateGoalStatus] = useUpdateGoalStatusMutation();

  // Existing states
  const location = useLocation();
  const navigate = useNavigate();
  const clientIdFromState = location?.state?.clientId;
  const [clientId, setClientId] = useState<string | null>(null);

  // Dialog states
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    goalId: string;
    currentStatus: string;
    newStatus: string;
  } | null>(null);
  const [statusChangeReason, setStatusChangeReason] = useState("");

  // Loading states for better UX
  const [updatingGoalId, setUpdatingGoalId] = useState<string | null>(null);

  useEffect(() => {
    if (clientIdFromState) {
      setClientId(clientIdFromState);
    }
  }, [clientIdFromState]);

  const { data, isLoading } = useGoalReviewQuery(clientId, {
    skip: !clientId,
  });

  const handleStatusChange = (goalId: string, status: string, currentStatus: string) => {
    if (!clientId) return;

    // Direct update for "InProgress" status or same status
    if (status === "InProgress"|| status === "Mastered"  || status === currentStatus) {
      performStatusUpdate(goalId, status, "");
      return;
    }

    // Show confirmation dialog ONLY for Mastered and Discontinued status changes
    setPendingStatusChange({ goalId, currentStatus, newStatus: status });
    setStatusChangeReason("");
    setShowReasonDialog(true);
  };

  // ✅ FIXED: Proper RTK Query integration with loading & error states
  const performStatusUpdate = async (goalId: string, status: string, reason: string) => {
    if (!clientId) return;

    setUpdatingGoalId(goalId);

    try {
      await updateGoalStatus({
        clientId,
        goalId,
        status,
        reason,
      }).unwrap();

      // Success feedback
      toast.success("Goal status updated successfully");

      // Reset dialog states
      setShowReasonDialog(false);
      setPendingStatusChange(null);
      setStatusChangeReason("");
      setUpdatingGoalId(null);

    } catch (error) {
      handleError(error);
      toast.error("Failed to update goal status");
      setUpdatingGoalId(null);
    }
  };

  // Cancel status change
  const cancelStatusChange = () => {
    setShowReasonDialog(false);
    setPendingStatusChange(null);
    setStatusChangeReason("");
  };

  // Confirm status change with reason
  const confirmStatusChange = () => {
    if (pendingStatusChange && statusChangeReason.trim()) {
      performStatusUpdate(
        pendingStatusChange.goalId,
        pendingStatusChange.newStatus,
        statusChangeReason.trim()
      );
    }
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find((s) => s.value === status)?.color || "bg-gray-500";
  };

  const getStatusLabel = (status: string) => {
    return statusOptions.find((s) => s.value === status)?.label || status;
  };

  const getSupportLevelLabel = (supportLevel: string) => {
    const labels: Record<string, string> = {
      Independent: "Independent",
      Minimal: "Minimal Support",
      Moderate: "Moderate Support",
    };
    return labels[supportLevel] || supportLevel;
  };

  const getSupportLevelColor = (supportLevel: string) => {
    const colors: Record<string, string> = {
      "Independent": "text-green-600 border-green-600",
      "Minimal Support": "text-blue-600 border-blue-600",
      "Moderate Support": "text-amber-600 border-amber-600",
    };
    return colors[supportLevel] || "text-gray-600 border-gray-600";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "increasing") return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (trend === "declining") return <TrendingDown className="w-5 h-5 text-red-500" />;
    return <MinusIcon className="w-5 h-5 text-yellow-500" />;
  };

  // Check if any goal is currently updating
  const isUpdating = (goalId: string) => updatingGoalId === goalId;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#efefef]">
        <AppHeader />
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <p className="text-center text-[#395159]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen bg-[#efefef]">
        <AppHeader />
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <p className="text-center text-[#395159]">No data available</p>
        </div>
      </div>
    );
  }

  const { clientInfo, goalsProgress, summary } = data.data;

  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader />

      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-6 border-[#395159] text-[#395159]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h2 className="text-[#303630] mb-2">Goal Progress Review</h2>
          <p className="text-[#395159]">{clientInfo.name} • Last 30 Days</p>
        </div>

        <Card className="mb-6 p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-900">
                <strong>Support Level Performance:</strong> The average percentages shown reflect performance only at the support level specified in each goal's mastery criteria. For example, if a goal requires mastery at "Independent" level, only independent performance trials are included in the average.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          {goalsProgress.map((goal: any) => {
            const supportLevelKey = goal.requiredSupportLevel?.toLowerCase() ;
            const avgPercentage = goal.averages[supportLevelKey] || goal.averages.overall;
            const currentlyUpdating = isUpdating(goal.goalId);

            return (
              <Card key={goal.goalId} className="p-6 bg-white">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-[#395159] text-white">{goal.category}</Badge>
                      <Badge className={`${getStatusColor(goal.currentStatus)} text-white`}>
                        {getStatusLabel(goal.currentStatus)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getSupportLevelColor(goal.supportLevel || "Independent")}
                      >
                        Mastery: {getSupportLevelLabel(goal.requiredSupportLevel || "Independent")}
                      </Badge>
                    </div>

                    <p className="text-[#303630] mb-4">{goal.goal}</p>

                    <div className="grid grid-cols-3 gap-6 mb-4">
                      <div>
                        <p className="text-sm text-[#395159] mb-1">
                          Average Performance (30 days)
                          <br />
                          <span
                            className={`text-xs font-medium ${
                              supportLevelKey === "independent"
                                ? "text-green-600"
                                : supportLevelKey === "minimal"
                                ? "text-blue-600"
                                : "text-amber-600"
                            }`}
                          >
                            at {getSupportLevelLabel(goal.supportLevel || "Independent")} level
                          </span>
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl text-[#303630]">{avgPercentage}%</span>
                          {getTrendIcon(goal.trend)}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-[#395159] mb-1">Sessions Tracked</p>
                        <p className="text-2xl text-[#303630]">{goal.totalSessions}</p>
                      </div>

                      <div>
                        <p className="text-sm text-[#395159] mb-1">Progress to Mastery</p>
                        <div className="flex items-center gap-2">
                          <Progress value={avgPercentage} className="flex-1" />
                          <span className="text-sm text-[#303630]">{avgPercentage}%</span>
                        </div>
                        <p className="text-xs text-[#395159] mt-1">
                          Target: {goal.target}% (Baseline: {goal.baseline}%)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 max-w-xs">
                        <Select
                          value={goal.currentStatus}
                          onValueChange={(value) =>
                            handleStatusChange(goal.goalId, value, goal.currentStatus)
                          }
                          disabled={currentlyUpdating}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                            {currentlyUpdating && (
                              <Loader2 className="w-4 h-4 ml-auto animate-spin" />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${option.color}`} />
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {avgPercentage >= goal.target && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                          <Check className="w-5 h-5" />
                          <span>Mastery criteria approaching</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="mt-6 p-6 bg-white">
          <h3 className="text-[#303630] mb-4">Summary</h3>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-[#395159]">Total Goals</p>
              <p className="text-2xl text-[#303630]">{goalsProgress.length}</p>
            </div>
            <div>
              <p className="text-sm text-[#395159]">In Progress</p>
              <p className="text-2xl text-blue-600">{summary.goalsInProgress}</p>
            </div>
            <div>
              <p className="text-sm text-[#395159]">Mastered</p>
              <p className="text-2xl text-green-600">{summary.goalsMastered}</p>
            </div>
            <div>
              <p className="text-sm text-[#395159]">Discontinued</p>
              <p className="text-2xl text-red-600">{summary.goalsDiscontinued}</p>
            </div>
          </div>

          <h3 className="text-[#303630] mb-4">Goal Status Legend</h3>
          <div className="grid grid-cols-3 gap-4">
            {statusOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${option.color}`} />
                <span className="text-[#303630]">{option.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Status Change Reason Dialog */}
      <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Change Goal Status</DialogTitle>
            <DialogDescription>
              {pendingStatusChange && (
                <>
                  Changing status to: <strong className="text-[#303630]">{getStatusLabel(pendingStatusChange.newStatus)}</strong>
                  <br />
                  Please provide a reason for this status change.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-[#303630]">
              Reason for Status Change <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              value={statusChangeReason}
              onChange={(e) => setStatusChangeReason(e.target.value)}
              placeholder="Enter reason for status change..."
              className="min-h-32 resize-none"
              disabled={updatingGoalId !== null}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              className="border-[#395159] text-[#395159]"
              onClick={cancelStatusChange}
              disabled={updatingGoalId !== null}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#395159] hover:bg-[#303630] text-white"
              onClick={confirmStatusChange}
              disabled={!statusChangeReason.trim() || updatingGoalId !== null}
            >
              {updatingGoalId !== null ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm Change"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
