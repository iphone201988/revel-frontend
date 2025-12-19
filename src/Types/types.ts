export type PermissionKey = keyof ProviderPermissions["permissions"];
export interface ProviderPermissions {
  _id: string;
  name: string;
  credential: string;
  clinicRole: string;
  systemRole: string;
  permissions: {
    viewAssignedClients: boolean;
    viewAllClients: boolean;
    addEditClients: boolean;
    deleteClients: boolean;
    viewSessionData: boolean;
    viewAllSessions: boolean;
    enterSessionData: boolean;
    collectFEDCData: boolean;
    generateAINotes: boolean;
    editSignedNotes: boolean;
    editNarrativeReports: boolean;
    accessAdminPanel: boolean;
    manageProviders: boolean;
    addClientGoals: boolean;
    editClientGoals: boolean;
    editMasteryCriteria: boolean;
    viewGoalBank: boolean;
    editGoalBank: boolean;
    scheduleSessions: boolean;
    viewProgressReports: boolean;
    exportData: boolean;
    managePermissions: boolean;
  };
}
export interface GoalDataCollection {
  supportLevel: {
    independent: { count: number; success: number; miss?: number };
    minimal: { count: number; success: number; miss: number };
    modrate: { count: number; success: number; miss: number };
  };
  goalId: string;
  accuracy: number;
  total: number;
  counter: number;
  time: string;
  _id: string;
}

export interface SessionData {
  _id: string;
  sessionId: {
    _id: string;
    client: string;
    provider: string;
    sessionType: string;
    dateOfSession: string;
    startTime: string;
    endTime: string;
    organizationId: string;
    status: string;
  };
  goals_dataCollection: GoalDataCollection[];
  clientId: {
    _id: string;
    name: string;
    dob: string;
    diagnosis: string;
    parentName: string;
    email: string;
    itpGoals: Array<{
      goal: string;
      targetDate: string;
      baselinePercentage: number;
      _id: string;
    }>;
  };
  organizationId: string;
  activityEngaged: string[];
  supportsObserved: string[];
  duration: number;
  providerObservation: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistorySectionProps {
  sessions: SessionData[] | any; // Allow any for now to handle API response
  canEditSignedNotes: boolean;
  currentUser: any;
  canViewAllSessions?: boolean;
  canviewAllSessions?: boolean; // Support both casings for backward compatibility
}
