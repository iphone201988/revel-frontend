import { AppHeader } from "../../components/AppHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs';
import { ClientManagement } from "./components/ClientManagement";
import { ProviderManagement } from "./components/ProviderManagement/ProviderManagement";
import { GoalBankManagement } from "./components/GoalBankManagement";
import { PermissionsManagement } from "./components/PermissionTab/PermissionsManagement";
import { AuditSummary } from "./components/Audit/AuditSummary";


export function AdminScreen() {
  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader 
       
       onLogout={()=>{}}
      />
      
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="mb-6 bg-white border border-[#ccc9c0]">
            <TabsTrigger value="clients" className="data-[state=active]:bg-[#395159] data-[state=active]:text-white">
              Manage Clients
            </TabsTrigger>
            <TabsTrigger value="providers" className="data-[state=active]:bg-[#395159] data-[state=active]:text-white">
              Manage Providers
            </TabsTrigger>
            <TabsTrigger value="goal-bank" className="data-[state=active]:bg-[#395159] data-[state=active]:text-white">
              Goal Bank
            </TabsTrigger>
            <TabsTrigger value="permissions" className="data-[state=active]:bg-[#395159] data-[state=active]:text-white">
              Manage Permissions
            </TabsTrigger>
            <TabsTrigger value="audit-logs" className="data-[state=active]:bg-[#395159] data-[state=active]:text-white">
              Audit Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <ClientManagement  />
          </TabsContent>

          <TabsContent value="providers">
            <ProviderManagement  />
          </TabsContent>

          <TabsContent value="goal-bank">
            <GoalBankManagement />
          </TabsContent>

          <TabsContent value="permissions">
            <PermissionsManagement  />
          </TabsContent>

          <TabsContent value="audit-logs">
            <AuditSummary  />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
