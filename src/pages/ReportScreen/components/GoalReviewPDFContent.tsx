import {
  Target,
  TrendingUp,
  TrendingDown,
  Minus as MinusIcon,
} from "lucide-react";
import { Badge } from "../../../components/Badge";
import { Progress } from "../../../components/Progress/Progress";
import { Card } from "../../../components/Card";
import { useGoalReviewQuery } from "../../../redux/api/provider";

interface GoalReviewPDFContentProps {

  clientId: any;
}

const statusOptions = [
  { value: "Mastered", label: "Mastered", color: "bg-green-500" },
  { value: "InProgress", label: "Making Progress", color: "bg-blue-500" },
  { value: "Discontinued", label: "Discontinued", color: "bg-red-500" },
];

export function GoalReviewPDFContent({
  clientId,
}: GoalReviewPDFContentProps) {


  const { data } = useGoalReviewQuery(clientId, {
    skip: !clientId,
  });
  const reportData = data?.data;
  console.log(reportData, "-----------------------");
  const goals = reportData?.goalsProgress;
  const getStatusColor = (status: string) => {
    return (
      statusOptions.find((s) => s.value === status)?.color || "bg-gray-500"
    );
  };

  const getStatusLabel = (status: string) => {
    return statusOptions.find((s) => s.value === status)?.label || status;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "declining":
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <MinusIcon className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <div
      className="bg-white p-8 max-w-4xl mx-auto"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* Header */}
      <div className="border-b-2 border-[#395159] pb-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#395159] rounded">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-[#303630] text-2xl">
            Goal Progress Review Report
          </h1>
        </div>
        <div className="text-[#395159] mt-2">
          <p>
            <strong>Client:</strong> {reportData?.clientInfo?.name}
          </p>
          <p>
            <strong>Reporting Period:</strong> Last 30 Days
          </p>
          <p>
            <strong>Report Generated:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="mt-4 p-3 bg-[#efefef] rounded">
          <p className="text-sm text-[#303630]">
            <strong>{"DIR DataFlow"}</strong> - EIDBI Services Documentation
          </p>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mb-6">
        <h2 className="text-[#303630] text-xl mb-3">Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-[#efefef] rounded-lg">
            <p className="text-sm text-[#395159] mb-1">Total Goals</p>
            <p className="text-2xl text-[#303630]">{goals?.length}</p>
          </div>
          <div className="p-4 bg-[#efefef] rounded-lg">
            <p className="text-sm text-[#395159] mb-1">Avg Progress</p>
            <p className="text-2xl text-[#303630]">
              {reportData?.summary?.averageOverallPerformance}%
            </p>
          </div>
          <div className="p-4 bg-[#efefef] rounded-lg">
            <p className="text-sm text-[#395159] mb-1">Mastered Goals</p>
            <p className="text-2xl text-[#303630]">
              {
                goals?.filter((g: any) => g?.currentStatus === "Mastered")
                  ?.length
              }
            </p>
          </div>
        </div>
      </div>

      {/* Individual Goals */}
      <div className="mb-6">
        <h2 className="text-[#303630] text-xl mb-4">
          Individual Goal Progress
        </h2>
        <div className="space-y-4">
          {goals &&
            goals?.map((goal: any, index: number) => (
              <Card
                key={goal.id}
                className="p-5 bg-white border-2 border-[#ccc9c0]"
              >
                <div className="mb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-[#395159] text-white">
                      {goal?.category}
                    </Badge>
                    <Badge
                      className={`${getStatusColor(
                        goal?.currentStatus
                      )} text-white`}
                    >
                      {getStatusLabel(goal?.currentStatus)}
                    </Badge>
                  </div>
                  <p className="text-[#303630]">
                    <strong>Goal {index + 1}:</strong> {goal?.goal}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-[#395159] mb-1">
                      Average Progress
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={goal?.averages?.overall}
                        className="flex-1 h-2"
                      />
                      <span className="text-[#303630] min-w-[3rem]">
                        {goal?.averages?.overall}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#395159] mb-1">Trend</p>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(goal?.trend)}
                      <span className="text-[#303630] capitalize">
                        {goal?.trend}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-[#395159]">
                  <strong>Sessions Tracked:</strong> {goal?.totalSessions}
                </div>
              </Card>
            ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#ccc9c0] text-sm text-[#395159]">
        <p>
          <strong>Note:</strong> This report is generated from DIR DataFlow by
          Infinity Therapy LLC and represents data collected during EIDBI
          sessions following the DIRFloortime® model.
        </p>
        <p className="mt-2">
          <strong>HIPAA Compliance:</strong> This document contains protected
          health information. Handle in accordance with HIPAA regulations.
        </p>
        <p className="mt-2 text-[#303630]">
          <strong>Generated by:</strong> DIR DataFlow by Infinity Therapy LLC
          <br />
          <strong>Report Date:</strong> {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}
