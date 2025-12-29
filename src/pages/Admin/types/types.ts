

export interface Goal {
  id: number;
  category: string;
  goal: string;
  masteryPercentage: string;
  masterySessionCount: string;
  supportLevel: 'independent' | 'minimal' | 'moderate';
}

export interface ActivityLog {
  user: string;
  action: string;
  resource: string;
  time: string;
  status: string;
}

