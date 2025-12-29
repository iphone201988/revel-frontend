import { useEffect, useMemo } from "react";
import {
  useGetAssignedClientsQuery,
  useGetUserProfileQuery,
} from "../../redux/api/provider";
import { Button } from "../../components/Button";
import { Users, Settings, Plus, BarChart3 } from "lucide-react";
import { Card } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { AppHeader } from "../../components/AppHeader";
import { useNavigate } from "react-router-dom";
import { ReviewAlertBanner } from "./components/ReviewAlertBanner";
import { usePermission } from "../../utils/usePermission";

const Dashboard = () => {
  const onNavigate = useNavigate();
  const { data }: any = useGetUserProfileQuery();
  const { hasPermission } = usePermission();

  useEffect(() => { }, [data]);

  const { data: clients }: any = useGetAssignedClientsQuery();

  const reviewAlerts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!Array.isArray(clients?.data)) return [];

    return clients.data
      .map((client: any) => {
        if (!client?.reviewDate) return null;

        const reviewDate = new Date(client?.reviewDate);
        reviewDate.setHours(0, 0, 0, 0);

        const daysUntilReview = Math.ceil(
          (reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilReview > 0 && daysUntilReview <= 15) {
          return {
            clientId: client._id,
            clientName: client.name,
            reviewDate: reviewDate.toLocaleDateString(),
            daysUntilReview,
          };
        }

        return null;
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.daysUntilReview - b.daysUntilReview);
  }, [clients?.data]);

  return (
    <div>
      <div className="min-h-screen bg-[#efefef]">
        <AppHeader />

        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-[#303630] mb-2">
              Welcome Back, Dr. {data?.data?.name}
            </h2>
            <p className="text-[#395159]">Here's your overview for today</p>
          </div>

          {/* Review Alerts */}
          <ReviewAlertBanner
            alerts={reviewAlerts}
            onClientClick={(clientId) =>
              onNavigate("/client", { state: { clientId: clientId } })
            }
          />

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex justify-end mb-4">
              {hasPermission("enterSessionData") && (
                <Button
                  onClick={() =>
                    onNavigate("/session-initiation", {
                      state: {
                        clients: clients?.data,
                        currentUser: data?.data,
                      },
                    })
                  } //>>>>>>>>>>>>>>>>>>>>>>>>>
                  className="h-16 bg-[#395159] hover:bg-[#303630] text-white flex items-center gap-2 px-6"
                >
                  <Plus className="w-5 h-5" />
                  Start Session
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {hasPermission("accessAdminPanel") && (
                <Button
                  onClick={() => onNavigate("/admin")} //sdasdsdsdsdsd
                  className="h-24 bg-white hover:bg-[#efefef] text-[#303630] border-2 border-[#ccc9c0] flex-col gap-2"
                  variant="outline"
                >
                  <Settings className="w-8 h-8 text-[#395159]" />
                  Admin
                </Button>
              )}
              {hasPermission("viewProgressReports") && (
                <Button
                  onClick={() => onNavigate("/reports")} //,,,,,,,,,,,,,,,,,,,
                  className="h-24 bg-white hover:bg-[#efefef] text-[#303630] border-2 border-[#ccc9c0] flex-col gap-2"
                  variant="outline"
                >
                  <BarChart3 className="w-8 h-8 text-[#395159]" />
                  Reports
                </Button>
              )}
            </div>
          </div>

          {/* Client Selection */}
          {hasPermission("viewAssignedClients") && (
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#395159]" />
                  <h3 className="text-[#303630]">Your Clients</h3>
                </div>
                <Badge className="bg-[#395159] text-white">
                  {clients?.data?.length} Active
                </Badge>
              </div>
              <div className="space-y-3">
                {clients?.data?.map((client: any) => (
                  <div
                    key={client._id}
                    className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0] hover:border-[#395159] cursor-pointer transition-all"
                    onClick={() =>
                      onNavigate("/client", {
                        state: {
                          clientId: client._id,
                          currentUser: data?.data,
                        },
                      })
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#303630]">{client?.name}</p>
                        <p className="text-sm text-[#395159]">
                          Age: {client?.age}
                        </p>{" "}
                        {/** replace age here */}
                      </div>
                      <div className="text-right">
                        {/* <div className="flex items-center gap-1 text-sm text-[#395159]">
                      <Clock className="w-4 h-4" />
                      {client.nextSession}
                    </div> */}
                        {hasPermission("enterSessionData") && (
                          <Button
                            size="sm"
                            className="mt-2 bg-[#395159] hover:bg-[#303630] text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate("/session-initiation", {
                                state: { client: client },
                              });
                            }}
                          >
                            Start Session
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
