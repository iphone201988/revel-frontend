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
