import { AppHeader } from "../../../../components/AppHeader";
import { ArrowLeft, Shield, ChevronRight, User } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
// import { Screen } from '../types/navigation';
import { Badge } from "../../../../components/Badge";
import { useNavigate } from "react-router-dom";
import { useGetProvidersQuery } from "../../../../redux/api/provider";

export function PermissionsHomeScreen() {
  const { data: providers } = useGetProvidersQuery();

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader
       
        onLogout={() => {}}
       
      />

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
        </div>

        <div className="mb-6 p-4 bg-white border-l-4 border-[#395159] rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#395159] mt-0.5" />
            <div>
              <h3 className="text-[#303630] mb-1">Super Admin Access Only</h3>
              <p className="text-[#395159] text-sm">
                Select a provider below to view and modify their permissions.
                Changes take effect immediately for the selected provider.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-[#303630] mb-6">Organization Providers</h2>

        <div className="grid gap-4">
          {providers?.data?.map((provider) => (
            <Card
              key={provider.id}
              className="p-6 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#395159] flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[#303630] mb-1">{provider.name}</h3>
                    <div className="flex gap-4 text-sm text-[#395159] mb-2">
                      <span>{provider.credential}</span>
                      <span>• {provider.clinicRole}</span>
                    </div>
                    <Badge
                      className={
                        provider.systemRole === "1"
                          ? "bg-[#395159] text-white"
                          : provider.systemRole === "2"
                          ? "bg-[#303630] text-white"
                          : "bg-[#ccc9c0] text-[#303630]"
                      }
                    >
                      {provider.systemRole === "1"
                        ? "Super Admin"
                        : provider.systemRole === "2"
                        ? "Admin"
                        : "User"}
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/provider-permissions", {state:{provider:provider}})}
                  className="bg-[#395159] hover:bg-[#303630] text-white"
                >
                  View Permissions
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
