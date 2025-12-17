

import { PlusCircle } from 'lucide-react';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Badge } from '../../../components/Badge';

interface RemovedGoalsPanelProps {
  removedGoals: { id: number; category: string; goal: string }[];
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  onReAdd: (goalId: number) => void;
}

export function RemovedGoalsPanel({ removedGoals, isOpen, onToggle, onReAdd }: RemovedGoalsPanelProps) {
  if (removedGoals.length === 0) return null;

  return (
    <Card className="p-4 bg-amber-50 border-amber-200">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between p-2 hover:bg-amber-100"
        onClick={() => onToggle(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-amber-700" />
          <span className="text-amber-900">
            {removedGoals.length} Removed Goal{removedGoals.length > 1 ? 's' : ''} - Click to Re-add
          </span>
        </div>
        <span className="text-amber-700 text-sm">
          {isOpen ? '▼' : '▶'}
        </span>
      </Button>
      {isOpen && (
        <div className="pt-4 space-y-2">
          {removedGoals.map((goal) => (
            <div
              key={goal.id}
              className="flex items-center justify-between p-3 bg-white rounded border border-amber-200"
            >
              <div className="flex-1">
                <Badge className="bg-[#395159] text-white mb-1 text-xs">
                  {goal.category}
                </Badge>
                <p className="text-[#303630] text-sm">{goal.goal}</p>
              </div>
              <Button
                size="sm"
                onClick={() => onReAdd(goal.id)}
                className="ml-3 bg-[#395159] hover:bg-[#303630] text-white"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Re-add
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

