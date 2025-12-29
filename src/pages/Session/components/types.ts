

export interface TrialEntry {
  type: 'success' | 'miss';
  supportLevel: 'independent' | 'minimal' | 'moderate';
  timestamp: number;
}

export interface SupportStats {
  count: number;
  success: number;
  miss: number;
}

export interface SupportLevelCounts {
  independent: SupportStats;
  minimal: SupportStats;
  moderate: SupportStats;
}


export interface GoalState {
  counter: number;
  timerSeconds: number;
  timerRunning: boolean;
  supportLevelCounts: SupportLevelCounts;
  history: TrialEntry[];
  successfulOpportunities: number;
  missedOpportunities: number;
}

export interface CriteriaForMastery {
  masteryPercentage: number;
  acrossSession: number;
  supportLevel: string;
}

export interface GoalBankItem {
  _id: string;
  category: string;
  discription: string;
  organizationId: string;
  criteriaForMastry: CriteriaForMastery;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ITPGoalItem {
  goal: GoalBankItem;
  targetDate: string;
  baselinePercentage: number;
  _id: string;
}

export interface Goal {
  _id: any; // ITP goal item ID
  id:any
  // goalId: any; // Actual goal ID from GoalBank
  category: string;
  goal: string;
  targetDate: string;
  baselinePercentage: number;
  criteriaForMastry: CriteriaForMastery;
}

export interface GoalDataPanelProps {
  activeGoals: Goal[];
  removedGoals: Goal[];
  goalStates: { [key: string]: GoalState };
  collapsedGoals: { [key: string]: boolean };
  showSupportSelector: { goalId: string; type: 'success' | 'miss' } |null;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  onToggleCollapse: (goalId: string) => void;
  onRemoveGoal: (goalId: string) => void;
  onReAddGoal: (goalId: string) => void;
  onSetSupportSelector: (payload: { goalId: string; type: 'success' | 'miss' } | null) => void;
  onAddTrial: (goalId: string, type: 'success' | 'miss'|null|undefined, SupportLevel: 'Independent' | 'Minimal' | 'Moderate' ) => void;
  onResetCounter: (goalId: string) => void;
  onIncrementCounter: (goalId: string) => void;
  onDecrementCounter: (goalId: string) => void;
  onToggleGoalTimer: (goalId: string) => void;
  onResetGoalTimer: (goalId: string) => void;
  onDecrementSuccessful: (goalId: string) => void;
  onIncrementSuccessful: (goalId: string) => void;
  onDecrementMissed: (goalId: string) => void;
  onIncrementMissed: (goalId: string) => void;
  formatTime: (seconds: number) => string;
  isRemovedOpen: boolean;
  onToggleRemoved: (open: boolean) => void;
}


