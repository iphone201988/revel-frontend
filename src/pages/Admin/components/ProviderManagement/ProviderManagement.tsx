import { UserPlus, Edit } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { useGetProvidersQuery } from "../../../../redux/api/provider";
import { useNavigate } from "react-router-dom";
// import type { Screen } from '../../types/navigation';


export function ProviderManagement() {
  const { data } = useGetProvidersQuery();

  const navigate = useNavigate()
  // const displayProviders = providers.length
  //   ? providers
  //   : [
  //       {
  //         name: "Dr. Emily Anderson",
  //         credential: "PhD, DIR® Expert",
  //         level: "QSP",
  //         role: "Super Admin",
  //         clients: "All Clients",
  //       },
  //       {
  //         name: "James Rodriguez",
  //         credential: "MSW, LGSW DIR® Advanced",
  //         level: "Level 1",
  //         role: "Admin",
  //         clients: "3 Clients",
  //       },
  //       {
  //         name: "Lisa Chen",
  //         credential: "BSW DIR® Basic",
  //         level: "Level 2",
  //         role: "User",
  //         clients: "2 Clients",
  //       },
  //     ];
  console.log(typeof(data?.data?.length));
  
 const length: number = Number(data?.data?.length);
localStorage.setItem("activeUser", `${length}`);

  return (
    <>
  
      <Card className="p-6 bg-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[#303630] mb-2">Provider Management</h3>
            <p className="text-[#395159]">
              Add new providers or manage existing provider information
            </p>
          </div>
          <Button
            onClick={() => navigate("/provider-add")}
            className="bg-[#395159] hover:bg-[#303630] text-white h-12"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Provider
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <h3 className="text-[#303630] mb-6">Current Providers</h3>
        <div className="space-y-3">
          {data?.data?.map((provider:any, index:number) => (
            <div
              key={index}
              className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#303630]">{provider.name}</p>
                  <div className="flex gap-4 mt-1 text-sm text-[#395159]">
                    <span>{provider.credential}</span>
                    {provider.clinicRole && (
                      <span>• {provider.clinicRole}</span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {provider.systemRole && (
                      <span className="px-2 py-1 bg-[#395159] text-white text-xs rounded">
                        {provider?.systemRole === "1"
                          ? "Super Admin"
                          : provider?.systemRole === "2"
                          ? "Admin"
                          : "User"}
                      </span>
                    )}
                    {provider.totalClients && (
                      <span className="px-2 py-1 bg-white text-[#395159] text-xs rounded border border-[#ccc9c0]">
                        {provider.totalClients} Clients
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#395159] text-[#395159]"
                  onClick={() => navigate("/provider-edit", {state:{provider: provider}})}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
