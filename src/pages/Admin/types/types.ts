export interface Provider {
  id: string;
  name: string;
  credential: string;
  level?: string;
  role?: string;
  clients?: string;
}

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

