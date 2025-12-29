import { AppHeader } from "../../components/AppHeader";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/Tabs";
import { ClientManagement } from "./components/ClientManagement";
import { ProviderManagement } from "./components/ProviderManagement/ProviderManagement";
import { GoalBankManagement } from "./components/GoalBankManagement";
import { PermissionsManagement } from "./components/PermissionTab/PermissionsManagement";
import { AuditSummary } from "./components/Audit/AuditSummary";
import { Button } from "../../components/Button";
import { Activity, ArrowLeft, Shield, Target, UserPlus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AdminScreen() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader />
     
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
         <div className="flex items-center justify-between mb-6">

           <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="border-[#395159] text-[#395159] mb-3"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="mb-6 bg-white border border-[#ccc9c0]">
            <TabsTrigger
              value="clients"
              className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
            >
                <Users className="w-4 h-4 mr-2" />
              Manage Clients
            </TabsTrigger>
            <TabsTrigger
              value="providers"
              className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
            >
               <UserPlus className="w-4 h-4 mr-2" />
              Manage Providers
            </TabsTrigger>
            <TabsTrigger
              value="goal-bank"
              className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Goal Bank
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
            >
               <Shield className="w-4 h-4 mr-2" />
              Manage Permissions
            </TabsTrigger>
            <TabsTrigger
              value="audit-logs"
              className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
            >
                <Activity className="w-4 h-4 mr-2" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <ClientManagement />
          </TabsContent>

          <TabsContent value="providers">
            <ProviderManagement />
          </TabsContent>

          <TabsContent value="goal-bank">
            <GoalBankManagement />
          </TabsContent>

          <TabsContent value="permissions">
            <PermissionsManagement />
          </TabsContent>

          <TabsContent value="audit-logs">
            <AuditSummary />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
