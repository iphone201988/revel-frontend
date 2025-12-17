import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Badge } from "../../../components/Badge";
import { Label } from "../../../components/Label";
import {
  Minus,
  Plus,
  RotateCcw,
  Play,
  Pause,
  Timer,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/Collapsible";
import type { GoalState, Goal, GoalDataPanelProps } from "./types";
import { RemovedGoalsPanel } from "./RemovedGoalPanel";
import { SupportLevel } from "../../../utils/enums/enum";

export function GoalDataPanel({
  activeGoals,
  removedGoals,
  goalStates,
  collapsedGoals,
  showSupportSelector,
  onCollapseAll,
  onExpandAll,
  onToggleCollapse,
  onRemoveGoal,
  onReAddGoal,
  onSetSupportSelector,
  onAddTrial,
  onResetCounter,
  onIncrementCounter,
  onDecrementCounter,
  onToggleGoalTimer,
  onResetGoalTimer,
  onDecrementSuccessful,
  onIncrementSuccessful,
  onDecrementMissed,
  onIncrementMissed,
  formatTime,
  isRemovedOpen,
  onToggleRemoved,
}: GoalDataPanelProps) {
  return (
    <div className="col-span-2 space-y-4">
      <RemovedGoalsPanel
        removedGoals={removedGoals}
        isOpen={isRemovedOpen}
        onToggle={onToggleRemoved}
        onReAdd={onReAddGoal}
      />

      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#303630]">ITP Goals Data Collection</h3>
          <div className="flex items-center gap-2">
            {activeGoals.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const anyExpanded = activeGoals.some(
                    (goal) => !collapsedGoals[goal.id]
                  );
                  if (anyExpanded) onCollapseAll();
                  else onExpandAll();
                }}
                className="border-[#395159] text-[#395159] hover:bg-[#efefef]"
              >
                {activeGoals.some((goal) => !collapsedGoals[goal.id]) ? (
                  <>
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Collapse All
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Expand All
                  </>
                )}
              </Button>
            )}
            {activeGoals.length === 0 && (
              <Badge
                variant="outline"
                className="border-amber-500 text-amber-700 bg-amber-50"
              >
                All goals removed
              </Badge>
            )}
          </div>
        </div>

        {activeGoals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#395159] mb-2">
              No goals selected for this session
            </p>
            <p className="text-sm text-[#303630]">
              All goals have been removed. Re-add goals from the section above
              to collect data.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeGoals.map((goal) => {
              const state = goalStates[goal.id];
              if (!state) return null;

              const isCollapsed = collapsedGoals[goal.id] || false;

              return (
                <Collapsible
                  key={goal.id}
                  open={!isCollapsed}
                  onOpenChange={() => onToggleCollapse(goal.id)}
                >
                  <div className="p-5 bg-[#efefef] rounded-lg border border-[#ccc9c0] relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveGoal(goal.id)}
                      className="absolute top-2 right-2 h-8 w-8 p-0 text-[#395159] hover:text-red-600 hover:bg-red-50 z-10"
                      title="Remove goal from this session"
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-0 mb-4 hover:bg-transparent"
                      >
                        <div className="flex items-start gap-3 pr-8 text-left">
                          <div className="mt-1">
                            {isCollapsed ? (
                              <ChevronRight className="w-5 h-5 text-[#395159]" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-[#395159]" />
                            )}
                          </div>
                          <div>
                            <Badge className="bg-[#395159] text-white mb-2">
                              {goal.category}
                            </Badge>
                            <p className="text-[#303630]">{goal.goal}</p>
                            {isCollapsed &&
                              state.successfulOpportunities +
                                state.missedOpportunities >
                                0 && (
                                <p className="text-sm text-[#395159] mt-1">
                                  {Math.round(
                                    (state.successfulOpportunities /
                                      (state.successfulOpportunities +
                                        state.missedOpportunities)) *
                                      100
                                  )}
                                  % ({state.successfulOpportunities}/
                                  {state.successfulOpportunities +
                                    state.missedOpportunities}{" "}
                                  trials)
                                </p>
                              )}
                          </div>
                        </div>
                      </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      {/* Trial-by-Trial Tracking with Support Levels */}
                      <div className="mb-4 p-4 bg-white rounded-lg border border-[#ccc9c0]">
                        <Label className="text-[#395159] mb-3 block">
                          Trial-by-Trial Tracking
                        </Label>

                        {showSupportSelector?.goalId === goal.id && (
                          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-900 mb-3">
                              Select support level for this{" "}
                              {showSupportSelector?.type === "success"
                                ? "successful"
                                : "missed"}{" "}
                              trial:
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  onAddTrial(
                                    goal.id,
                                    showSupportSelector?.type,
                                    SupportLevel.Independent
                                  )
                                }
                                className="bg-[#395159] hover:bg-[#303630] text-white h-10"
                              >
                                Independent
                              </Button>
                              <Button
                                size="sm"
                                onClick={() =>
                                  onAddTrial(
                                    goal.id,
                                    showSupportSelector?.type,
                                    SupportLevel.Minimal
                                  )
                                }
                                className="bg-[#395159] hover:bg-[#303630] text-white h-10"
                              >
                                Minimal
                              </Button>
                              <Button
                                size="sm"
                                onClick={() =>
                                  onAddTrial(
                                    goal.id,
                                    showSupportSelector.type,
                                    SupportLevel.Moderate
                                  )
                                }
                                className="bg-[#395159] hover:bg-[#303630] text-white h-10"
                              >
                                Moderate
                              </Button>
                              {/* <Button
                        size="sm"
                        onClick={() => onAddTrial(goal.id, showSupportSelector?.type, 'maximum')}
                        className="bg-[#395159] hover:bg-[#303630] text-white h-10"
                      >
                        Maximum
                      </Button> */}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onSetSupportSelector(null)}
                              className="w-full mt-2 text-[#395159]"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <div className="text-sm text-[#303630] text-center">
                              Successful
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => onDecrementSuccessful(goal.id)}
                                disabled={state.successfulOpportunities === 0}
                                variant="outline"
                                className="bg-green-50 border-green-500 text-green-600 hover:bg-green-100 w-10 h-10 p-0"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <div className="flex-1 px-3 py-2 bg-green-50 rounded border border-green-500 text-center">
                                <span className="text-green-700">
                                  {state.successfulOpportunities}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => onIncrementSuccessful(goal.id)}
                                className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 p-0"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm text-[#303630] text-center">
                              Missed
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => onDecrementMissed(goal.id)}
                                disabled={state.missedOpportunities === 0}
                                variant="outline"
                                className="bg-red-50 border-red-500 text-red-600 hover:bg-red-100 w-10 h-10 p-0"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <div className="flex-1 px-3 py-2 bg-red-50 rounded border border-red-500 text-center">
                                <span className="text-red-700">
                                  {state.missedOpportunities}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => onIncrementMissed(goal.id)}
                                className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 p-0"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {state.successfulOpportunities +
                          state.missedOpportunities >
                          0 && (
                          <div className="mt-3 pt-3 border-t border-[#ccc9c0] space-y-2">
                            <div className="text-sm text-[#395159] text-center">
                              Accuracy:{" "}
                              {Math.round(
                                (state.successfulOpportunities /
                                  (state.successfulOpportunities +
                                    state.missedOpportunities)) *
                                  100
                              )}
                              %
                              <span className="text-[#303630] ml-2">
                                ({state.successfulOpportunities}/
                                {state.successfulOpportunities +
                                  state.missedOpportunities}{" "}
                                trials)
                              </span>
                            </div>
                            <div className="text-xs text-[#395159] text-center">
                              Support Levels:
                              {state.supportLevelCounts.independent.count > 0 && (
                                <span className="ml-2">
                                  Indep:{" "}
                                  {state.supportLevelCounts.independent.count}
                                </span>
                              )}
                              {state.supportLevelCounts.minimal.count > 0 && (
                                <span className="ml-2">
                                  Min: {state.supportLevelCounts.minimal.count}
                                </span>
                              )}
                              {state.supportLevelCounts.moderate.count > 0 && (
                                <span className="ml-2">
                                  Mod: {state.supportLevelCounts.moderate.count}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mb-4 p-4 bg-white rounded-lg border border-[#ccc9c0]">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-[#395159]">Counter</Label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onResetCounter(goal.id)}
                            className="border-[#395159] text-[#395159] h-8"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Reset
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={() => onDecrementCounter(goal.id)}
                            variant="outline"
                            className="h-10 w-10 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <div className="flex-1 text-center p-3 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
                            <span className="text-[#303630] text-xl">
                              {state.counter}
                            </span>
                          </div>
                          <Button
                            onClick={() => onIncrementCounter(goal.id)}
                            variant="outline"
                            className="h-10 w-10 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-lg border border-[#ccc9c0]">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-[#395159]">Timer</Label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onResetGoalTimer(goal.id)}
                            className="border-[#395159] text-[#395159] h-8"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Reset
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={() => onToggleGoalTimer(goal.id)}
                            className="bg-[#395159] hover:bg-[#303630] text-white h-10 px-4"
                          >
                            {state.timerRunning ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Start
                              </>
                            )}
                          </Button>
                          <div className="flex-1 text-center p-3 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
                            <div className="flex items-center justify-center gap-2">
                              <Timer className="w-4 h-4 text-[#395159]" />
                              <span className="text-[#303630] text-xl">
                                {formatTime(state.timerSeconds)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
