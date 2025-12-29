
import { Shield, User, ChevronRight } from 'lucide-react';
import { Button } from '../../../../components/Button';
import { Card } from '../../../../components/Card';
import { Badge } from '../../../../components/Badge';
import { useNavigate } from 'react-router-dom';
import { useGetProvidersQuery } from '../../../../redux/api/provider';
// import type { Screen } from '../../types/navigation';



export function PermissionsManagement() {
    const { data: providers } = useGetProvidersQuery();
  const navigate = useNavigate()
 

  return (
    <>
   
      <Card className="p-6 bg-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[#303630] mb-2">Permissions Management</h3>
            <p className="text-[#395159]">View and modify provider permissions. Changes take effect immediately.</p>
          </div>
          <Button
            onClick={() => navigate('/permissions')}
            className="bg-[#395159] hover:bg-[#303630] text-white h-12"
          >
            <Shield className="w-4 h-4 mr-2" />
            View All Permissions
          </Button>
        </div>
      </Card>

      <div className="grid gap-4">
        {providers?.data?.map((provider) => (
          <Card key={provider.id} className="p-6 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#395159] flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#303630] mb-1">{provider?.name}</h3>
                  <div className="flex gap-4 text-sm text-[#395159] mb-2">
                    <span>{provider?.credential}</span>
                    {provider?.clinicRole && <span>• {provider?.clinicRole}</span>}
                  </div>
                  {provider?.systemRole && (
                   <Badge
                      className={
                        provider?.systemRole === "1"
                          ? "bg-[#395159] text-white"
                          : provider.systemRole === "2"
                          ? "bg-[#303630] text-white"
                          : "bg-[#ccc9c0] text-[#303630]"
                      }
                    >
                      {provider?.systemRole === "1"
                        ? "Super Admin"
                        : provider.systemRole === "2"
                        ? "Admin"
                        : "User"}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                onClick={() => navigate('/provider-permissions', {state: {provider: provider}})}
                className="bg-[#395159] hover:bg-[#303630] text-white"
              >
                View Permissions
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

