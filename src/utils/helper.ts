
import type { PermissionKey } from "../Types/types";
import { showError } from "../components/CustomToast";

export const handleError = (error: any) => {
  console.log(error, "message>>>>>>>>>>>>>>>>>>>>>>>");
  
 showError(error?.data?.message);
};

export const PERMISSION_MAP = {
  viewAssignedClients: "ViewAssignedClients",
  viewAllClients: "ViewAllClients",
  addEditClients: "AddEditClients",
  deleteClients: "DeleteClients",

  viewSessionData: "ViewSessionData",
  viewAllSessions: "ViewAllSessions",
  enterSessionData: "EnterSessionData",
  collectFEDCData: "CollectFEDCData",

  generateAINotes: "GenerateAINotes",
  editSignedNotes: "EditSignedNotes",
  editNarrativeReports: "EditNarrativeReports",

  addClientGoals: "AddClientGoals",
  editClientGoals: "EditClientGoals",
  editMasteryCriteria: "EditMasteryCriteria",
  viewGoalBank: "ViewGoalBank",
  editGoalBank: "EditGoalBank",

  scheduleSessions: "ScheduleSessions",
  viewProgressReports: "ViewProgressReports",
  exportData: "ExportData",

  accessAdminPanel: "AccessAdmin",
  manageProviders: "ManageProviders",
  qspSignatureRequired: "QspSignatureRequired",
  managePermissions: "ManagePermissions",
} as const;

export const mapPermissionsToBooleans = (permissions: string[]) => {
  const result: any = {};

  Object.keys(PERMISSION_MAP).forEach((key) => {
    result[key] = permissions.includes(
      PERMISSION_MAP[key as keyof typeof PERMISSION_MAP]
    );
  });

  return result;
};

export const permissionCategories: {
  category: string;
  permissions: {
    key: PermissionKey;
    label: string;
    description: string;
  }[];
}[] = [
  {
    category: "Client Management",
    permissions: [
      {
        key: "viewAssignedClients",
        label: "View Assigned Clients",
        description: "View only clients assigned to this provider",
      },
      {
        key: "viewAllClients",
        label: "View All Clients",
        description: "View all clients in the organization",
      },
      {
        key: "addEditClients",
        label: "Add / Edit Clients",
        description: "Create and modify client records",
      },
      {
        key: "deleteClients",
        label: "Delete Clients",
        description: "Remove client records from the system",
      },
    ],
  },
  {
    category: "Session Data",
    permissions: [
      {
        key: "viewSessionData",
        label: "View Session Data",
        description: "Access session notes and data",
      },
      {
        key: "viewAllSessions",
        label: "View All Sessions",
        description: "View all providers’ sessions",
      },
      {
        key: "enterSessionData",
        label: "Enter Session Data",
        description: "Record session data and observations",
      },
      {
        key: "collectFEDCData",
        label: "Collect FEDC Data",
        description: "Access FEDC observation data collection",
      },
      {
        key: "generateAINotes",
        label: "Generate AI Notes",
        description: "Use AI to generate clinical notes",
      },
      {
        key: "editSignedNotes",
        label: "Edit Signed Notes",
        description: "Modify signed session notes",
      },
      {
        key: "editNarrativeReports",
        label: "Edit Narrative Reports",
        description: "Edit progress reports",
      },
      {
        key:"qspSignatureRequired",
        label:'QSP Signature Required',
        description:"Required QSP Signature"
      }
    ],
  },
  {
    category: "Goal Management",
    permissions: [
      {
        key: "addClientGoals",
        label: "Add Client Goals",
        description: "Add goals to treatment plans",
      },
      {
        key: "editClientGoals",
        label: "Edit Client Goals",
        description: "Modify client goals",
      },
      {
        key: "editMasteryCriteria",
        label: "Edit Mastery Criteria",
        description: "Modify mastery criteria",
      },
      {
        key: "viewGoalBank",
        label: "View Goal Bank",
        description: "Access goal templates",
      },
      {
        key: "editGoalBank",
        label: "Edit Goal Bank",
        description: "Create and modify goal templates",
      },
    ],
  },
  {
    category: "Scheduling & Reports",
    permissions: [
      {
        key: "scheduleSessions",
        label: "Schedule Sessions",
        description: "Create and manage session appointments",
      },
      {
        key: "viewProgressReports",
        label: "View Progress Reports",
        description: "Access progress analytics",
      },
      {
        key: "exportData",
        label: "Export Data",
        description: "Export reports and data files",
      },
    ],
  },
  {
    category: "Administration",
    permissions: [
      {
        key: "accessAdminPanel",
        label: "Access Admin Panel",
        description: "Access administrative interface",
      },
      {
        key: "manageProviders",
        label: "Manage Providers",
        description: "Add, edit, and remove providers",
      },
      {
        key: "managePermissions",
        label: "Manage Permissions",
        description: "Configure provider permissions",
      },
    ],
  },
];

export const handleDownloadFunction = async (blob: any, fileName?: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${fileName}.pdf`;

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};

export const isAtLeast16YearsOld = (dob?: string) => {
  if (!dob) return false;

  const birthDate = new Date(dob);
  const today = new Date();

  const age =
    today.getFullYear() -
    birthDate.getFullYear() -
    (today <
    new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    )
      ? 1
      : 0);

  return age >= 16;
};


export type UrgencyLevel = 'normal' | 'warning' | 'critical';

export function getDaysPassed(date: string | Date): number {
  if (!date) return 0;

  const reportDate = new Date(date);
  const today = new Date();

  reportDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = today.getTime() - reportDate.getTime();
  return diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0;
}

export function getUrgencyLevel(days: number): UrgencyLevel {
  if (days >= 5) return 'critical';
  if (days >= 3) return 'warning';
  return 'normal';
}
