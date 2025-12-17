export interface  ClientProfile {
  interests: string;
  strengths: string;
  challenges: string;
  familyContext: string;
  preferredActivities: string;
  sensoryProcessing: string;
  communication: string;
  safetyConsiderations?: string;
}

export interface Goal {
   _id: number;
  category: string;
  discription: string;
  status?: string;
  targetDate?: string;
  masteryPercentage?: string;
  masterySessionCount?: string;
  supportLevel?: string;
  baselinePercentage?: number;
  finalSuccessRate?: string;
  archivedDate?: string;
  reason?: string;
}

export interface ClientData {
  name: string;
  dob: string;
  age: number;
  diagnosis: string;
  parentGuardian: string;
  qsp: string;
  clinicalSupervisor: string;
  planReviewDate: string;
  profile: ClientProfile;
  goals: Goal[];
}

export interface Provider {
  id: string;
  name: string;
  credential: string;
}

export interface SessionEntry {
  date: string;
  startTime?: string;
  endTime?: string;
  duration: string;
  provider: string;
  providerId: string;
  status: string;
  goals: string;
  summary: string;
  isAIGenerated?: boolean;
  attendees?: { parent: boolean; sibling: boolean; peer: boolean; therapist: boolean };
  clientVariables?: string;
  fedcObserved?: string[];
  activitiesEngaged?: string[];
  supportsObserved?: string[];
  sessionNotes?: string;
  treatmentChanges?: string;
  recommendations?: string[];
  goalStates?: Record<
    string,
    {
      name: string;
      successfulOpportunities: number;
      missedOpportunities: number;
      supportLevelCounts?: Record<string, number>;
    }
  >;
  qspSignatureRequired?: boolean;
  qspSignatureStatus?: 'signed' | 'warning' | 'critical' | 'pending';
}


export interface ProfileSectionProps {
  providers: Provider[];
  initialProfile: ClientProfile  ;
  initialQsp: string;
  initialClinicalSupervisor: any;
  initialPlanReviewDate: any;
  clientId:any
}