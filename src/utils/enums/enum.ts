export const SystemRoles = {
 1: "SuperAdmin",
  2: "Admin",
  3:"User",
};

export const SupportLevel = {
  Independent: "Independent",
  Minimal: "Minimal Support",
  Moderate: "Moderate Support",
} as const;

export type SupportLevelType =
  (typeof SupportLevel)[keyof typeof SupportLevel];


export const SessionType = {
  Progress_Monitoring:"Progress Monitoring",
Baseline_Data_Collection:"Baseline Data Collection"
}