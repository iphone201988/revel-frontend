import { useState, useEffect } from "react";
import { AppHeader } from "../../components/AppHeader";
import {
  ArrowLeft,
  FileText,
  Users,
  BarChart3,
  Filter,
  Download,
  Eye,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Label } from "../../components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/Select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/Tabs";
import { toast } from "react-toastify";
import { Badge } from "../../components/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/Table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";

import {
  useReportsOverviewQuery,
  useClientProgressReportsQuery,
  useProviderActivityReportsQuery,
  useDonloadFedecDistributionMutation,
  useDownloadSessionTrendMutation,
  useDownloadDaignosisBreakdownMutation,
  useDownloadGoalReviewReportMutation,
} from "../../redux/api/provider";

import { useGetProvidersQuery } from "../../redux/api/provider";
import { useGetAllClientsQuery } from "../../redux/api/provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/Dailog";
import { GoalReviewPDFContent } from "./components/GoalReviewPDFContent";
import { handleDownloadFunction, handleError } from "../../utils/helper";

export function ReportsScreen() {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState("30");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [selectedClient, setSelectedClient] = useState("all");
  const [previewClient, setPreviewClient] = useState<string | null>(null);

  const handleExportReport = async (fileName: string) => {
    try {
      const blob = await downloadFedecDistribution({
        fedcDistribution,
      })
        .unwrap()
        .catch((error) => handleError(error));

      await handleDownloadFunction(blob, fileName);
    } catch (error) {
      console.error("PDF download failed", error);
    }
  };

  const handleExportSessionTrends = async (fileName: string) => {
    try {
      const blob = await downloadSessionTrend({
        sessionTrends,
      })
        .unwrap()
        .catch((error) => handleError(error));

      await handleDownloadFunction(blob, fileName);
    } catch (error) {
      console.error("PDF download failed", error);
    }
  };
  const handleExportDiagnosis = async (fileName: string) => {
    try {
      const blob = await downloadDaignosisBreakdown({
        diagnosisBreakdown,
      })
        .unwrap()
        .catch((error) => handleError(error));
      await handleDownloadFunction(blob, fileName);
    } catch (error) {
      console.error("PDF download failed", error);
    }
  };
  const handleDownloadGoalReview = async (clientId: any, fileName: string) => {
    try {
      const blob = await downloadGoalReviewReport({
        clientId: clientId,
      })
        .unwrap()
        .catch((error) => handleError(error));

      await handleDownloadFunction(blob, fileName);
    } catch (error) {
      console.error("PDF download failed", error);
    }
  };

  /* =======================
    RTK QUERY CALLS
    ======================== */
  const [downloadGoalReviewReport, { isLoading: isExporting }] =
    useDownloadGoalReviewReportMutation();
  const [downloadSessionTrend, { isLoading: isDownloading }] =
    useDownloadSessionTrendMutation();

  const [downloadFedecDistribution, { isLoading }] =
    useDonloadFedecDistributionMutation();
  const [downloadDaignosisBreakdown, { isLoading: isDaigosnisDownloading }] =
    useDownloadDaignosisBreakdownMutation();

  const {
    data: overviewRes,
    isLoading: overviewLoading,
    isError: overviewError,
  } = useReportsOverviewQuery({ dateRange });

  const { data: clientProgressRes, isLoading: clientProgressLoading } =
    useClientProgressReportsQuery({
      dateRange,
      selectedClient,
    });

  const { data: providerActivityRes, isLoading: providerActivityLoading } =
    useProviderActivityReportsQuery({
      dateRange,
      selectedProvider,
    });

  const { data: providersRes } = useGetProvidersQuery();
  const { data: clientsRes } = useGetAllClientsQuery();

  /* =======================
     DERIVED DATA
  ======================== */

  const keyMetrics = overviewRes?.data?.keyMetrics;
  const fedcDistribution = overviewRes?.data?.fedcDistribution ?? [];
  const sessionTrends = overviewRes?.data?.sessionTrends ?? [];
  const diagnosisBreakdown = overviewRes?.data?.diagnosisBreakdown ?? [];

  const clientProgressData = clientProgressRes?.data ?? [];
  const providerActivityData = providerActivityRes?.data ?? [];

  const providers = providersRes?.data ?? [];
  const clients = clientsRes?.data ?? [];

  const loading =
    overviewLoading || clientProgressLoading || providerActivityLoading;

  useEffect(() => {
    if (overviewError) {
      toast.error("Failed to load reports data");
    }
  }, [overviewError]);

  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader />

      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-[#395159] text-[#395159]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Badge className="bg-[#395159] text-white px-4 py-2">
            Admin Access Only
          </Badge>
        </div>

        <h2 className="text-[#303630] mb-6">Reports & Analytics</h2>

        {/* Filters */}
        <Card className="p-6 bg-white mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#395159]" />
            <h3>Report Filters</h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                  <SelectItem value="180">Last 6 Months</SelectItem>
                  <SelectItem value="365">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Provider</Label>
              <Select
                value={selectedProvider}
                onValueChange={setSelectedProvider}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  {providers.map((p: any) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Client</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients.map((c: any) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {loading && (
          <div className="text-center py-12 text-[#395159]">
            Loading reports...
          </div>
        )}

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 gap-4 mb-6">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="clients">
              <Users className="w-4 h-4 mr-2" /> Clients
            </TabsTrigger>
            <TabsTrigger value="providers">
              <FileText className="w-4 h-4 mr-2" /> Providers
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Card className="p-6 bg-white">
                <h3 className="text-[#303630] mb-4">
                  Key Metrics (Last {dateRange} Days)
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#efefef] rounded-lg">
                    <p className="text-sm text-[#395159] mb-1">
                      Total Sessions
                    </p>
                    <p className="text-[#303630] text-3xl">
                      {keyMetrics?.totalSessions}
                    </p>
                  </div>

                  <div className="p-4 bg-[#efefef] rounded-lg">
                    <p className="text-sm text-[#395159] mb-1">Total Hours</p>
                    <p className="text-[#303630] text-3xl">
                      {keyMetrics?.totalHours}
                    </p>
                  </div>

                  <div className="p-4 bg-[#efefef] rounded-lg">
                    <p className="text-sm text-[#395159] mb-1">
                      Active Clients
                    </p>
                    <p className="text-[#303630] text-3xl">
                      {keyMetrics?.activeClients}
                    </p>
                  </div>
                  <div className="p-4 bg-[#efefef] rounded-lg">
                    <p className="text-sm text-[#395159] mb-1">
                      Active Providers
                    </p>
                    <p className="text-[#303630] text-3xl">
                      {keyMetrics?.activeProviders}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#303630]">FEDC Level Distribution</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#395159] text-[#395159]"
                    onClick={() => handleExportReport("FEDC Distribution")}
                    disabled={isLoading}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {isLoading ? "Exporting..." : "PDF"}
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={fedcDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry?.name}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fedcDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#303630]">Session Trends (6 Months)</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-[#395159] hover:bg-[#303630] text-white"
                    onClick={() => handleExportSessionTrends("Session Trends")}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {isDownloading ? "Exporting..." : "PDF"}
                  </Button>
                </div>
              </div>
              {/* <h3 className="mb-4">Session Trends</h3> */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sessionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sessions" fill="#395159" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#303630]">Client Diagnosis Breakdown</h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#395159] text-[#395159]"
                  onClick={() => handleExportDiagnosis("Diagnosis Breakdown")}
                >
                  <Download className="w-4 h-4 mr-1" />
                  {isDaigosnisDownloading ? "Exporting..." : "PDF"}
                </Button>
              </div>
              <div className="space-y-3">
                {diagnosisBreakdown.map((item: any, index: number) => (
                  <div key={index} className="p-4 bg-[#efefef] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#303630]">{item?.diagnosis}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#395159]">
                          {item?.count} clients
                        </span>
                        <Badge className="bg-[#395159] text-white">
                          {item?.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div
                        className="bg-[#395159] h-2 rounded-full"
                        style={{ width: `${item?.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* CLIENTS */}
          <TabsContent value="clients">
            <Card className="p-6 bg-white">
              <h3 className="mb-4">Client Progress</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Active Goals</TableHead>
                    <TableHead>Completed Goals</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Avg FEDC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientProgressData.map((c: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell>{c?.client}</TableCell>
                      <TableCell>{c?.activeGoals}</TableCell>
                      <TableCell>{c?.completedGoals}</TableCell>
                      <TableCell>{c?.sessionsThisMonth}</TableCell>
                      <TableCell>
                        <Badge>{c?.avgFEDC ?? "N/A"}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            <Card className="p-6 bg-white mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[#303630] mb-1">
                    Individual Goal Review Reports
                  </h3>
                  <p className="text-sm text-[#395159]">
                    Download comprehensive goal progress reports for individual
                    clients
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {clientProgressData.map((client: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-[#303630] mb-1">{client?.client}</p>
                      <p className="text-sm text-[#395159]">
                        {client?.activeGoals} active goals •{" "}
                        {client?.completedGoals} completed
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#395159] text-[#395159]"
                        onClick={() => setPreviewClient(client?.clientId)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#395159] hover:bg-[#303630] text-white"
                        onClick={() =>
                          handleDownloadGoalReview(
                            client?.clientId,
                            "Goal Review Report"
                          )
                        }
                      >
                        <Download className="w-4 h-4 mr-1" />
                        {isExporting ? "Downloading..." : "Download PDF"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* PROVIDERS */}
          <TabsContent value="providers">
            <Card className="p-6 bg-white">
              <h3 className="mb-4">Provider Activity</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider Name </TableHead>
                    <TableHead>Active Clients</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Avg Session Length</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providerActivityData.map((p: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell>{p?.provider}</TableCell>
                      <TableCell>{p?.clients}</TableCell>
                      <TableCell>{p?.sessionsThisMonth}</TableCell>
                      <TableCell>{p?.totalHours}</TableCell>
                      <TableCell>{p?.avgSessionLength} minutes</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog
          open={previewClient !== null}
          onOpenChange={() => setPreviewClient(null)}
        >
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#303630]">
                Goal Review Report Preview
              </DialogTitle>
              <DialogDescription>
                Preview the goal review report before downloading as PDF.
              </DialogDescription>
            </DialogHeader>
            {previewClient && (
              <div>
                <GoalReviewPDFContent clientId={previewClient} />
                <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-[#ccc9c0]">
                  <Button
                    variant="outline"
                    className="border-[#395159] text-[#395159]"
                    onClick={() => setPreviewClient(null)}
                  >
                    Close Preview
                  </Button>
                  <Button
                    className="bg-[#395159] hover:bg-[#303630] text-white"
                    onClick={() =>
                      handleDownloadGoalReview(
                        previewClient,
                        "Goal Review Report"
                      )
                    }
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isExporting ? "Downloading..." : "Download PDF"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

/* =======================
   HELPER COMPONENT
======================= */

// const Metric = ({ label, value }: any) => (
//   <div className="p-4 bg-[#efefef] rounded">
//     <p className="text-sm">{label}</p>
//     <p className="text-3xl">{value}</p>
//   </div>
// );
