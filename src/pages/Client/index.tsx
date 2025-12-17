import { ProgressScreen } from "./components/ProgressScreen";
import {
  mockArchivedGoals,
  mockSessions,
} from "./components/mockData";
import { ClientHeader } from "./components/ClientHeader";
import { GoalsSection } from "./components/GoalsTab";
import { ProvidersSection } from "./components/ProviderTab";
import { ProfileSection } from "./components/ProfileTab";
import { HistorySection } from "./components/HistorySection";
import { ArchivedGoalsSection } from "./components/ArchivedGoalSection";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/Tabs";
import { useGetClientProfileQuery, useGetProvidersQuery, useGetUserProfileQuery, useSessionHistoryQuery } from "../../redux/api/provider";
import { useLocation } from "react-router-dom";
interface ClientScreenProps {
  clientId: string | null;
  currentUser: any;
  onNavigate: (screen: Screen, clientId?: string) => void;
  onLogout: () => void;
}

export function ClientScreen() {
  const location = useLocation();
  const clientId = location?.state?.clientId;
  // const currentUser = location?.state?.currentUser;
  const {data:profile}= useGetUserProfileQuery()
const currentUser = profile?.data
  console.log(currentUser, "user??????????????");
  
  const { data } = useGetClientProfileQuery({ clientId }, { skip: !clientId });
  const clientData: any = data?.data;

  const {data:providers}:any = useGetProvidersQuery()
  const providerList  = providers?.data

  const userPermissions = currentUser?.permissions || [];
const isAdmin =
  currentUser?.systemRole === "2" || currentUser?.systemRole === "1";

// Use includes() to check array permissions
const canViewProgress = isAdmin || userPermissions.includes("ViewProgressReports");
const canEditSignedNotes = isAdmin || userPermissions.includes("EditSignedNotes");
const canViewAllSessions = isAdmin || userPermissions.includes("ViewAllSessions");


  const  {data :sessions} = useSessionHistoryQuery(clientId)
  return (
    <div className="min-h-screen bg-[#efefef]">
      <ClientHeader
        clientName={clientData?.name}
        dob={clientData?.dob}
        age={clientData?.age}
        diagnosis={clientData?.diagnosis}
        onLogout={()=>{}}
      />

      <div className="max-w-screen-2xl mx-auto px-6 pb-10">
        <Tabs defaultValue="goals" className="w-full">
          <TabsList className="mb-6 bg-white border border-[#ccc9c0]">
            <TabsTrigger
              value="goals"
              className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
            >
              ITP Goals
            </TabsTrigger>
            {canViewProgress && (
              <TabsTrigger
                value="progress"
                className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
              >
                Progress
              </TabsTrigger>
            )}
            <TabsTrigger
              value="providers"
              className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
            >
              Providers
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
            >
              Client Profile
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
            >
              Session History
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
            >
              Archived Goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="goals">
            <GoalsSection
              clientId={clientId}
              clientGoals={clientData?.itpGoals}
            />
          </TabsContent>

          {canViewProgress && (
            <TabsContent value="progress">
              <ProgressScreen clientId={clientId} clientName={clientData?.name} />
            </TabsContent>
          )}

          <TabsContent value="providers">
            <ProvidersSection
            clientId = {clientId}
              providers={providerList}         
              initialAssigned={clientData?.assignedProvider}
            />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSection
            clientId={clientData?._id}
              providers={providerList}
              initialProfile={clientData?.clientProfile}
              initialQsp={clientData?.qsp}
              initialClinicalSupervisor={clientData?.clinicalSupervisor}
              initialPlanReviewDate={clientData?.reviewDate}
            />
          </TabsContent>

          <TabsContent value="history">
            <HistorySection
              sessions={sessions}
             canviewAllSessions={canViewAllSessions}
              canEditSignedNotes={canEditSignedNotes}
              currentUser={currentUser}
            />
          </TabsContent>
          
          <TabsContent value="archived">
            <ArchivedGoalsSection goals={mockArchivedGoals} />
          </TabsContent> 
        </Tabs>
      </div>
    </div>
  );
}
