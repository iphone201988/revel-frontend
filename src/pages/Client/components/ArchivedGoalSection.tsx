
import { Card } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { Separator } from '../../../components/Seprator';
import { AlertTriangle, Archive, CheckCircle2 } from 'lucide-react';
import type { Goal } from './types';


interface ArchivedGoalsSectionProps {
  goals: Goal[];
}

export function ArchivedGoalsSection({ goals }: ArchivedGoalsSectionProps) {
  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[#303630] mb-2">Archived Goals</h3>
          <p className="text-[#395159]">Goals that have been mastered or discontinued</p>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <Archive className="w-12 h-12 text-[#ccc9c0] mx-auto mb-4" />
          <p className="text-[#395159]">No archived goals yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div
              key={goal._id}
              className="p-5 bg-[#efefef] rounded-lg border border-[#ccc9c0]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge 
                      className={`${
                        goal.status === 'mastered' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-amber-600 hover:bg-amber-700'
                      } text-white`}
                    >
                      {goal.status === 'mastered' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Mastered
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Discontinued
                        </>
                      )}
                    </Badge>
                    <span className="text-sm text-[#395159]">
                      Archived: {goal.archivedDate}
                    </span>
                  </div>
                  <div className="mb-2">
                    <Badge variant="outline" className="text-[#395159] border-[#395159] mb-2">
                      {goal.category}
                    </Badge>
                  </div>
                  <p className="text-[#303630] mb-3">{goal?.category}</p>
                </div>
              </div>

              <Separator className="my-3 bg-[#ccc9c0]" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#395159]">Original Mastery Criteria:</span>
                  <p className="text-[#303630]">
                    {goal.masteryPercentage}% across {goal.masterySessionCount} sessions
                  </p>
                </div>
                {goal.status === 'mastered' && goal.finalSuccessRate && (
                  <div>
                    <span className="text-[#395159]">Final Success Rate:</span>
                    <p className="text-[#303630]">{goal.finalSuccessRate}</p>
                  </div>
                )}
                {goal.status === 'discontinued' && goal.reason && (
                  <div className="col-span-2">
                    <span className="text-[#395159]">Reason:</span>
                    <p className="text-[#303630]">{goal.reason}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

