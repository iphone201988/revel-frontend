import React, { useEffect, useState } from "react";
import { AppHeader } from "../../../../components/AppHeader";
import {
  ArrowLeft,
  Download,
  Filter,
  Shield,
  FileText,
  User,
  Calendar,
  Activity,
  TrendingUp,
  Goal,
} from "lucide-react";
import { Button } from "../../../../components/Button";
import { Badge } from "../../../../components/Badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/Tabs";

import { AuditLogTable } from "./components/AuditLogTable";
// import { AuditStats as AuditStatsSection } from './components/AuditStats';
// import { AuditLog, type AuditStats } from './components/mockData';
import { AuditStatsSection } from "./components/AuditStats";
import AuditFilters from "./components/AuditFilters";
import { useNavigate } from "react-router-dom";
import {
  useDownloadAuditlogsMutation,
  useViewAuditsQuery,
  useViewStatsQuery,
} from "../../../../redux/api/provider";
import { handleError } from "../../../../utils/helper";

export function AuditLogScreen() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  console.log(page);
  

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [resourceFilter, setResourceFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { data } = useViewStatsQuery();
  const statistic = data?.data;
  const [selectedPage, setSelectedPage] = useState(1);

  const { data: auditsLogs } = useViewAuditsQuery({
    page: selectedPage,
    search: search,
    action: actionFilter,
    resource: resourceFilter,
    startDate,
    endDate,
  });
  
useEffect(() => {
  setSelectedPage(1);
}, [search, actionFilter, resourceFilter, startDate, endDate]);

  // Mock data now sourced from shared module for reuse

  const handleSearch = () => {};

  const handleClearFilters = () => {
    setSearch("");
    setActionFilter("");
    setResourceFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const[downloadAuditlogs] = useDownloadAuditlogsMutation()
  const handleExport = async() => {
    // In production, implement CSV export
     try {
    const blob = await downloadAuditlogs().unwrap().catch((error)=>handleError(error));

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "audit-logs.csv"; // 👈 filename
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  }catch(error){
    handleError(error)
  }

  };

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleString("en-US", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  const getActionBadge = (action: string) => {
    const actionMap: Record<string, { label: string; color: string }> = {
      login: { label: "Provider Login", color: "bg-blue-500" },
      logout: { label: "Provider Logout", color: "bg-gray-500" },
      view_client: { label: "View Clients", color: "bg-green-500" },
      create_client: { label: "Create Client", color: "bg-emerald-500" },
      update_client: { label: "Update Client", color: "bg-yellow-500" },
      delete_client: { label: "Delete Client", color: "bg-red-500" },
      view_session: { label: "View Session", color: "bg-green-500" },
      create_session: { label: "Create Session", color: "bg-emerald-500" },
      update_session: { label: "Update Session", color: "bg-yellow-500" },
      sign_qsp: { label: "QSP Signature", color: "bg-purple-500" },
      export_pdf: { label: "Export", color: "bg-orange-500" },
      create_provider: { label: "Create Provider", color: "bg-emerald-500" },
      update_provider: { label: "Update Provider", color: "bg-yellow-500" },
      view_audit_logs: { label: "View Statistics", color: "bg-indigo-500" },
    };

    const config = actionMap[action] || { label: action, color: "bg-gray-500" };
    return (
      <Badge className={`${config.color} text-white`}>{config.label}</Badge>
    );
  };
  


// GOAL







  const getResourceIcon = (resource: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Auth: <Shield className="w-4 h-4" />,
      Client: <User className="w-4 h-4" />,
      Session: <Calendar className="w-4 h-4" />,
      document: <FileText className="w-4 h-4" />,
      Provider: <User className="w-4 h-4" />,
      Goal: <Goal className="w-4 h-4" />,
      Audit_Logs: <Activity className="w-4 h-4" />,
      Export: <Download className="w-4 h-4" />,
    };

    return iconMap[resource] || <FileText className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader  />

      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            className="border-[#395159] text-[#395159]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-[#395159] text-[#395159]"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            {/* <Button
            //   onClick={loadLogs}
              variant="outline"
              className="border-[#395159] text-[#395159]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button> */}
            <Button
                onClick={handleExport}
              className="bg-[#395159] hover:bg-[#303630] text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <Tabs defaultValue="logs" className="w-full">
          <TabsList className="mb-6 bg-white border border-[#ccc9c0]">
            <TabsTrigger
              value="logs"
              className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
            >
              <Activity className="w-4 h-4 mr-2" />
              Activity Logs
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            {showFilters && (
              <AuditFilters
                search={search}
                actionFilter={actionFilter}
                resourceFilter={resourceFilter}
                startDate={startDate}
                endDate={endDate}
                setSearch={setSearch}
                setActionFilter={setActionFilter}
                setResourceFilter={setResourceFilter}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                onApply={handleSearch}
                onClear={handleClearFilters}
              />
            )}

            <AuditLogTable
              logs={auditsLogs?.data?.auditLogs} // <-- array of logs
              page={auditsLogs?.data?.page}
              totalPages={auditsLogs?.data?.totalPages}
              totalRecords={auditsLogs?.data?.totalRecords}
               getResourceIcon={getResourceIcon}
                getActionBadge={getActionBadge}
              onPageChange={setSelectedPage}
            />
            {/* <AuditLogTable
             logs = {auditsLogs?.data}
            //   logs={logs}
            //   loading={loading}
              page={selectedPage}
              totalPages={auditsLogs?.data?.totalPages}
            //   formatDate={formatDate}
            //   getActionBadge={getActionBadge}
            //   getResourceIcon={getResourceIcon}
              onPageChange={setSelectedPage}
            //   onSelectLog={() => {}}
            /> */}
          </TabsContent>

          <TabsContent value="stats">
            <AuditStatsSection stats={statistic} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
