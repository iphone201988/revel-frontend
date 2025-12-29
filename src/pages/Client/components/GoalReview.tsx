import { useEffect, useState } from "react";
import { AppHeader } from "../../../components/AppHeader";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus as MinusIcon,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Badge } from "../../../components/Badge";
import { Progress } from "../../../components/Progress/Progress";
import { useLocation, useNavigate } from "react-router-dom";
import { useGoalReviewQuery } from "../../../redux/api/provider";

const statusOptions = [
  { value: "Mastered", label: "Mastered", color: "bg-green-500" },
  { value: "InProgress", label: "In Progress", color: "bg-blue-500" },
  { value: "Discontinued", label: "Discontinued", color: "bg-red-500" },
];

export function GoalReviewScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const clientIdFromState = location?.state?.clientId;
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    if (clientIdFromState) {
      setClientId(clientIdFromState);
    }
  }, [clientIdFromState]);

  const { data, isLoading } = useGoalReviewQuery(clientId, {
    skip: !clientId,
  });

  const getStatusColor = (status: string) => {
    return (
      statusOptions.find((s) => s.value === status)?.color || "bg-gray-500"
    );
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
      Independent: "text-green-600 border-green-600",
      Minimal: "text-blue-600 border-blue-600",
      Moderate: "text-amber-600 border-amber-600",
    };
    return colors[supportLevel] || "text-gray-600 border-gray-600";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "increasing")
      return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (trend === "declining")
      return <TrendingDown className="w-5 h-5 text-red-500" />;
    return <MinusIcon className="w-5 h-5 text-yellow-500" />;
  };

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
                <strong>Support Level Performance:</strong> The average
                percentages shown reflect performance only at the support level
                specified in each goal's mastery criteria. For example, if a
                goal requires mastery at "Independent" level, only independent
                performance trials are included in the average.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          {goalsProgress.map((goal: any) => {
            // Get the appropriate average based on support level
            const supportLevelKey =
              goal.supportLevel?.toLowerCase() || "independent";
            const avgPercentage =
              goal.averages[supportLevelKey] || goal.averages.overall;

            return (
              <Card key={goal.goalId} className="p-6 bg-white">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-[#395159] text-white">
                        {goal.category}
                      </Badge>
                      <Badge
                        className={`${getStatusColor(
                          goal.currentStatus
                        )} text-white`}
                      >
                        {getStatusLabel(goal.currentStatus)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getSupportLevelColor(
                          goal.supportLevel || "Independent"
                        )}
                      >
                        Mastery:{" "}
                        {getSupportLevelLabel(
                          goal.supportLevel || "Independent"
                        )}
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
                            at{" "}
                            {getSupportLevelLabel(
                              goal.supportLevel || "Independent"
                            )}{" "}
                            level
                          </span>
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl text-[#303630]">
                            {avgPercentage}%
                          </span>
                          {getTrendIcon(goal.trend)}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-[#395159] mb-1">
                          Sessions Tracked
                        </p>
                        <p className="text-2xl text-[#303630]">
                          {goal.totalSessions}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-[#395159] mb-1">
                          Progress to Mastery
                        </p>
                        <div className="flex items-center gap-2">
                          <Progress value={avgPercentage} className="flex-1" />
                          <span className="text-sm text-[#303630]">
                            {avgPercentage}%
                          </span>
                        </div>
                        <p className="text-xs text-[#395159] mt-1">
                          Target: {goal.target}% (Baseline: {goal.baseline}%)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 max-w-xs">
                        {/* <div className="flex items-center gap-2">
                              <Badge
                        className={`${getStatusColor(
                          goal.currentStatus
                        )} text-white`}
                      > 
                        {getStatusLabel(goal.currentStatus)}
                      </Badge>
                                </div> */}

                        {/* <Select
                          value={goal.currentStatus}
                          onValueChange={(value) =>
                            handleStatusChange(goal.goalId, value)
                          }
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-3 h-3 rounded-full ${option.color}`}
                                  />
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select> */}
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
              <p className="text-2xl text-blue-600">
                {summary.goalsInProgress}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#395159]">Mastered</p>
              <p className="text-2xl text-green-600">{summary.goalsMastered}</p>
            </div>
            <div>
              <p className="text-sm text-[#395159]">Discontinued</p>
              <p className="text-2xl text-red-600">
                {summary.goalsDiscontinued}
              </p>
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
    </div>
  );
}
