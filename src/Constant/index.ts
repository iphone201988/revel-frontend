import { SupportLevel } from "../utils/enums/enum";



export const GoalBankCategory: string[] = [
  "FEDC 1 - Shared Attention & Regulation",
  "FEDC 2 - Engagement & Relating",
  "FEDC 3 - Two-Way Communication",
  "FEDC 4 - Complex Communication",
  "FEDC 5 - Emotional Ideas",
  "FEDC 6 - Emotional Thinking",
  "FEDC 7 - Multi-Causal Thinking",
  "FEDC 8 - Gray Area Thinking",
  "FEDC 9 - Reflective Thinking",
];

export const AuditActionOptions = {
  all: "All actions",
  "Provider Login": "Login",
  "Provider Logout": "Logout",
  "View Client": "View Client",
  "Create Client": "Create Client",
  "Update Client": "Update Client",
  "Start Session": "Start Session",
  "View Audit Logs": "View Audit Logs",
} 

export const AuditResourceOptions = {
  all: "All resources",
  Auth: "Authentication",
  Client: "Client",
  Session: "Session",
  Provider: "Provider",
  Goal: "Goal",
  "Audit Logs": "Audit Logs",
} 
export const AuditLogTableHeaders: string[] = [
  "Timestamp",
  "User",
  "Action",
  "Resource",
  "Status",
  "IP Address",
 
];

export const SupportLevelOptions = [
  {
    value: SupportLevel.Independent,
    label: "Independently",
  },
  {
    value: SupportLevel.Minimal,
    label: "Minimal Support",
  },
  {
    value: SupportLevel.Moderate,
    label: "Moderate Support",
  },
];
export const RoleOptions = [
  { value: "1", label: "Super Admin" },
  { value: "2", label: "Admin" },
  { value: "3", label: "User" },
];

export const ClientProfileFields = [
  { id: "interests", label: "Child's Interests & Preferences", key: "interests" },
  { id: "strengths", label: "Strengths & Learning Style", key: "strengths" },
  { id: "challenges", label: "Areas of Challenge", key: "challenges" },
  { id: "familyContext", label: "Family Context", key: "familyContext" },
  { id: "preferredActivities", label: "Preferred Activities for Engagement", key: "preferredActivities" },
  { id: "sensoryProcessing", label: "Sensory Processing", key: "sensoryProcessing" },
  { id: "communication", label: "Communication", key: "communication" },
  { id: "safetyConsiderations", label: "Safety Considerations", key: "safetyConsiderations" },
] 
