export const SystemRoles = {
  1: "1",
  2: "2",
  3: "3", 
} as const;


export const SupportLevel = {
  Independent: "Independent",
  Minimal: "Minimal",
  Moderate: "Moderate",
} as const;

export type SupportLevelType = (typeof SupportLevel)[keyof typeof SupportLevel];

export const SessionType = {
  Progress_Monitoring: "Progress Monitoring",
  Baseline_Data_Collection: "Baseline Data Collection",
};

export const GoalStatus = {
  Mastered: "Mastered",
  Discontinued: "Discontinued",
  InProgress: "InProgress",
};

export const REPORT_STATUS = {
  DRAFT: "DRAFT",
  SIGNED: "SIGNED",
  PENDNG_QSP_SIGNATURE:"PENDNG_QSP_SIGNATURE"
}