import { Activity, User, FileText } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { Badge } from "../../../../components/Badge";

import { useNavigate } from "react-router-dom";
import { useViewAuditsQuery } from "../../../../redux/api/provider";
import moment from "moment";



export function AuditSummary() {
  const navigate = useNavigate();
  const { data } = useViewAuditsQuery({ page: 1 });


  const today = new Date().toISOString().split("T")[0]; // "2025-12-12"
  const logs = data?.data?.auditLogs || [];


  const todayEventsCount =
    logs?.filter((log: any) => log.createdAt.startsWith(today)).length || 0;
  const activeUser = localStorage.getItem("activeUser");
  return (
    <>
    
      <Card className="p-6 bg-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[#303630] mb-2">Audit Logs</h3>
            <p className="text-[#395159]">
              Track all system activity for HIPAA compliance and security
              monitoring
            </p>
          </div>
          <Button
            onClick={() => navigate("/audit-logs")}
            className="bg-[#395159] hover:bg-[#303630] text-white h-12"
          >
            <Activity className="w-4 h-4 mr-2" />
            View Full Audit Logs
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-6 bg-white border-[#ccc9c0]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#395159] rounded">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#395159]">Total Events Today</p>

              <p className="text-[#303630]">{todayEventsCount} events</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#ccc9c0]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#395159] rounded">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#395159]">Active Users</p>
              <p className="text-[#303630]">{activeUser} providers</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#ccc9c0]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#395159] rounded">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#395159]">Exports This Week</p> 
              <p className="text-[#303630]">{data?.data?.exportThisWeek} PDFs</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-white">
        <h3 className="text-[#303630] mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {logs?.slice(0, 5).map((log: any, index: number) => (
            <div
              key={index}
              className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[#303630]">{log.userName}</p>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#395159]">
                    {log.action} • {log.resource}
                  </p>
                </div>
                <span className="text-sm text-[#395159]">{moment(log?.createdAt).format('hh:mm A')}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
