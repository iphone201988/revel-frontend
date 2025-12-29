import { useEffect, useState } from "react";
import { AppHeader } from "../../../components/AppHeader";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { CheckCircle2 } from "lucide-react";
import { SessionHeader } from "../components/SessionHeader";
import { GoalDataPanel } from "../components/GoalDataPanel";
import { SupportsPanel } from "../components/SupportPanel";
import { ActivitiesPanel } from "../components/ActivitiesPanel";
import { ObservationsCard } from "../components/ObsevationCard";
import type {
  GoalState,
  TrialEntry,
  Goal,
  ITPGoalItem,
} from "../components/types";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useAbandonSessionMutation,
  useCollectSessionDataMutation,
  useGetClientProfileQuery,
  useGetActivitiesQuery,
  useGetSupportsQuery,
  useAddActivityMutation,
  useAddSupportMutation,
} from "../../../redux/api/provider";
import { SupportLevel, type SupportLevelType } from "../../../utils/enums/enum";
import { handleError } from "../../../utils/helper";
import { showError, showInfo, showSuccess } from "../../../components/CustomToast";

export function SessionDataCollectionScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: activitiesRes } = useGetActivitiesQuery();
  const { data: supportsRes } = useGetSupportsQuery();

  const [addActivityApi] = useAddActivityMutation();
  const [addSupportApi] = useAddSupportMutation();

  const activitiesList: string[] = activitiesRes?.data ?? [];
  const supportsList: string[] = supportsRes?.data ?? [];

  const sessionInitData = location?.state?.sessionInitData;
  const clientId = sessionInitData?.client;

  const { data } = useGetClientProfileQuery({ clientId }, { skip: !clientId });

  const clientData = data?.data;
  const clientGoals: ITPGoalItem[] = clientData?.itpGoals ?? [];

  const [collectSessionData, { data: collectedData, isSuccess }] =
    useCollectSessionDataMutation();

  /* -------------------- STATE -------------------- */

  const [goalStates, setGoalStates] = useState<Record<string, GoalState>>({});
  const [supportsObserved, setSupportsObserved] = useState<string[]>([]);
  const [activitiesEngaged, setActivitiesEngaged] = useState<string[]>([]);
  const [providerObservations, setProviderObservations] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showSupportOther, setShowSupportOther] = useState(false);
  const [supportOtherText, setSupportOtherText] = useState("");
  const [showActivityOther, setShowActivityOther] = useState(false);
  const [activityOtherText, setActivityOtherText] = useState("");
  const [removedGoalIds, setRemovedGoalIds] = useState<string[]>([]);
  const [isRemovedGoalsOpen, setIsRemovedGoalsOpen] = useState(false);
  const [collapsedGoals, setCollapsedGoals] = useState<Record<string, boolean>>(
    {}
  );

  const [showSupportSelector, setShowSupportSelector] = useState<{
    goalId: string;
    type: "success" | "miss";
  } | null>(null);

  /* -------------------- INIT GOAL STATES -------------------- */

  useEffect(() => {
    if (!clientGoals.length) return;

    const initialState: Record<string, GoalState> = {};

    clientGoals.forEach((item: ITPGoalItem) => {
      const goalId = item.goal._id;

      initialState[goalId] = {
        counter: 0,
        timerSeconds: 0,
        timerRunning: false,
        supportLevelCounts: {
          independent: { count: 0, success: 0, miss: 0 },
          minimal: { count: 0, success: 0, miss: 0 },
          moderate: { count: 0, success: 0, miss: 0 },
        },

        history: [],
        successfulOpportunities: 0,
        missedOpportunities: 0,
      };
    });

    setGoalStates(initialState);
  }, [clientGoals]);

  /* -------------------- SESSION TIMER -------------------- */

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  /* -------------------- GOAL TIMERS -------------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setGoalStates((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((goalId) => {
          if (updated[goalId].timerRunning) {
            updated[goalId] = {
              ...updated[goalId],
              timerSeconds: updated[goalId].timerSeconds + 1,
            };
          }
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* -------------------- HELPERS -------------------- */

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  /* -------------------- GOAL ACTIONS -------------------- */

  const incrementCounter = (goalId: string) => {
    setGoalStates((prev) => ({
      ...prev,
      [goalId]: { ...prev[goalId], counter: prev[goalId].counter + 1 },
    }));
  };

  const decrementCounter = (goalId: string) => {
    setGoalStates((prev) => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        counter: Math.max(0, prev[goalId].counter - 1),
      },
    }));
  };

  const resetCounter = (goalId: string) => {
    setGoalStates((prev) => ({
      ...prev,
      [goalId]: { ...prev[goalId], counter: 0 },
    }));
    showSuccess("Counter reset");
  };

  const toggleGoalTimer = (goalId: string) => {
    setGoalStates((prev) => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        timerRunning: !prev[goalId].timerRunning,
      },
    }));
  };

  const resetGoalTimer = (goalId: string) => {
    setGoalStates((prev) => ({
      ...prev,
      [goalId]: { ...prev[goalId], timerSeconds: 0, timerRunning: false },
    }));
    showSuccess("Timer reset");
  };

  /* -------------------- TRIALS -------------------- */

  const supportLevelToKey = (
    level: SupportLevelType
  ): TrialEntry["supportLevel"] => {
    switch (level) {
      case SupportLevel.Independent:
        return "independent";
      case SupportLevel.Minimal:
        return "minimal";
      case SupportLevel.Moderate:
        return "moderate";
      default:
        throw new Error("Invalid support level");
    }
  };

  const addTrial = (
    goalId: string,
    type: "success" | "miss" | null | undefined,
    supportLevel: SupportLevelType
  ) => {
    setGoalStates((prev: any) => {
      if (!prev) return;
      const key = supportLevelToKey(supportLevel);

      const history: TrialEntry[] = [
        ...prev[goalId].history,
        { type, supportLevel: key, timestamp: Date.now() },
      ];

      const supportLevelCounts = history.reduce(
        (acc, trial) => {
          acc[trial.supportLevel].count++;
          acc[trial.supportLevel][trial.type]++;
          return acc;
        },
        {
          independent: { count: 0, success: 0, miss: 0 },
          minimal: { count: 0, success: 0, miss: 0 },
          moderate: { count: 0, success: 0, miss: 0 },
        }
      );

      return {
        ...prev,
        [goalId]: {
          ...prev[goalId],
          history,
          supportLevelCounts,
          successfulOpportunities: history.filter((t) => t.type === "success")
            .length,
          missedOpportunities: history.filter((t) => t.type === "miss").length,
        },
      };
    });
  };

  /* -------------------- REMOVE / RE-ADD GOALS -------------------- */

  const removeGoal = (goalId: string) => {
    setRemovedGoalIds((prev) => [...prev, goalId]);
    showSuccess("Goal removed from session");
  };

  const reAddGoal = (goalId: string) => {
    setRemovedGoalIds((prev) => prev.filter((id) => id !== goalId));
    showSuccess("Goal re-added to session");
  };

  // Transform API data to Goal interface
  const activeGoals: Goal[] = clientGoals
    .filter((item: ITPGoalItem) => !removedGoalIds.includes(item.goal._id))
    .map((item: ITPGoalItem) => ({
      _id: item._id,
      id: item.goal._id,
      category: item.goal.category,
      goal: item.goal.discription,
      targetDate: item.targetDate,
      baselinePercentage: item.baselinePercentage,
      criteriaForMastry: item.goal.criteriaForMastry,
    }));

  const removedGoals: Goal[] = clientGoals
    .filter((item: ITPGoalItem) => removedGoalIds.includes(item.goal._id))
    .map((item: ITPGoalItem) => ({
      _id: item._id,
      id: item.goal._id,
      category: item.goal.category,
      goal: item.goal.discription,
      targetDate: item.targetDate,
      baselinePercentage: item.baselinePercentage,
      criteriaForMastry: item.goal.criteriaForMastry,
    }));

  /* -------------------- COMPLETE SESSION -------------------- */

  const handleCompleteSession = async () => {
    try {
      if (!sessionInitData?._id) {
       showError("Session ID missing");
        return;
      }

      const goals_dataCollection = Object.entries(goalStates)
        .filter(([goalId]) => !removedGoalIds.includes(goalId))
        .map(([goalId, state]) => {
          const total =
            state.successfulOpportunities + state.missedOpportunities;

          const accuracy =
            total > 0
              ? Math.round((state.successfulOpportunities / total) * 100)
              : 0;

          return {
            goalId,
            accuracy,
            total,
            counter: state.counter,
            supportLevel: {
              independent: state.supportLevelCounts.independent,
              minimal: state.supportLevelCounts.minimal,
              modrate: state.supportLevelCounts.moderate,
            },

            time: new Date(),
          };
        });

      await collectSessionData({
        sessionId: sessionInitData._id,
        clientId,
        duration: elapsedTime,
        providerObservation: providerObservations,
        activityEngaged: activitiesEngaged,
        supportsObserved,
        goals_dataCollection,
      })
        .unwrap()
        .catch((error) => handleError(error));
    } catch (err: any) {
      console.error(err);
     showError(err?.data?.message || "Failed to collect session data");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      showSuccess("Session data collected successfully");
      navigate("/ai-note-summery", {
        state: { sessionData: collectedData?.data },
      });
    }
  });

  const [abandonSession] = useAbandonSessionMutation();

  const handleBackToDashboard = async () => {
    await abandonSession(sessionInitData._id);
    showInfo("Session abandoned");
    navigate("/");
  };

  const removeLastTrial = (goalId: string, type: "success" | "miss") => {
    setGoalStates((prev: any) => {
      const history = prev[goalId]?.history || [];
      if (!history.length) return prev;

      const reversed = [...history].reverse();
      const indexFromEnd = reversed.findIndex((t) => t.type === type);
      if (indexFromEnd === -1) return prev;

      const actualIndex = history.length - 1 - indexFromEnd;
      const newHistory = history.filter(
        (_: any, idx: any) => idx !== actualIndex
      );

      const supportLevelCounts = newHistory.reduce(
        (acc: any, trial: any) => {
          const level = trial.supportLevel;

          acc[level].count++;

          if (trial.type === "success") acc[level].success++;
          else acc[level].miss++;

          return acc;
        },
        {
          independent: { count: 0, success: 0, miss: 0 },
          minimal: { count: 0, success: 0, miss: 0 },
          moderate: { count: 0, success: 0, miss: 0 },
        }
      );

      return {
        ...prev,
        [goalId]: {
          ...prev[goalId],
          history: newHistory,
          supportLevelCounts,
          successfulOpportunities: newHistory.filter(
            (t: any) => t.type === "success"
          ).length,
          missedOpportunities: newHistory.filter((t: any) => t.type === "miss")
            .length,
        },
      };
    });
  };

  const expandAllGoals = () => {
    setCollapsedGoals({});
  };

  const incrementSuccessful = (goalId: string) => {
    setShowSupportSelector({ goalId, type: "success" });
  };

  const decrementSuccessful = (goalId: string) => {
    removeLastTrial(goalId, "success");
  };

  const incrementMissed = (goalId: string) => {
    setShowSupportSelector({ goalId, type: "miss" });
  };

  const decrementMissed = (goalId: string) => {
    removeLastTrial(goalId, "miss");
  };

  const collapseAllGoals = () => {
    const allCollapsed: Record<string, boolean> = {};

    activeGoals.forEach((goal: Goal) => {
      allCollapsed[goal.id] = true;
    });

    setCollapsedGoals(allCollapsed);
  };

  const handleSupportOtherToggle = () => {
    if (showSupportOther && supportOtherText.trim()) {
      setSupportsObserved((prev) => [...prev, supportOtherText.trim()]);
      setSupportOtherText("");
    }
    setShowSupportOther(!showSupportOther);
  };

  const handleActivityOtherToggle = () => {
    if (showActivityOther && activityOtherText.trim()) {
      setActivitiesEngaged((prev) => [...prev, activityOtherText.trim()]);
      setActivityOtherText("");
    }
    setShowActivityOther(!showActivityOther);
  };

  const addCustomSupport = async () => {
    if (!supportOtherText.trim()) return;

    const value = supportOtherText.trim();

    setSupportsObserved((prev) => [...prev, value]);

    try {
      await addSupportApi({ support: value }).unwrap();
      showSuccess("Custom support added");
    } catch (err) {
      handleError(err);
    }

    setSupportOtherText("");
    setShowSupportOther(false);
  };

  const addCustomActivity = async () => {
    if (!activityOtherText.trim()) return;

    const value = activityOtherText.trim();

    setActivitiesEngaged((prev) => [...prev, value]);

    try {
      await addActivityApi({ activity: value }).unwrap();
      showSuccess("Custom activity added");
    } catch (err) {
      handleError(err);
    }

    setActivityOtherText("");
    setShowActivityOther(false);
  };

  const toggleSupport = (support: string) => {
    setSupportsObserved((prev) =>
      prev.includes(support)
        ? prev.filter((s) => s !== support)
        : [...prev, support]
    );
  };

  const toggleActivity = (activity: string) => {
    setActivitiesEngaged((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const toggleGoalCollapse = (goalId: string) => {
    setCollapsedGoals((prev) => ({
      ...prev,
      [goalId]: !prev[goalId],
    }));
  };
  const handleSetSupportSelector = (
    payload: { goalId: string; type: "success" | "miss" } | null
  ) => {
    if (!payload) {
      setShowSupportSelector(null);
      return;
    }

    setShowSupportSelector({ goalId: payload.goalId, type: payload.type });
  };

  /* -------------------- RENDER -------------------- */

  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader />

      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <SessionHeader
          clientName={sessionInitData?.clientName}
          elapsedTime={elapsedTime}
          formatTime={formatTime}
          isTimerRunning={isTimerRunning}
          onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
          onBackConfirm={handleBackToDashboard}
        />

        <div className="grid grid-cols-3 gap-6">
          <GoalDataPanel
            activeGoals={activeGoals}
            removedGoals={removedGoals}
            goalStates={goalStates}
            collapsedGoals={collapsedGoals}
            showSupportSelector={showSupportSelector}
            onCollapseAll={collapseAllGoals}
            onExpandAll={expandAllGoals}
            onToggleCollapse={toggleGoalCollapse}
            onRemoveGoal={removeGoal}
            onReAddGoal={reAddGoal}
            onSetSupportSelector={handleSetSupportSelector}
            onAddTrial={addTrial}
            onResetCounter={resetCounter}
            onIncrementCounter={incrementCounter}
            onDecrementCounter={decrementCounter}
            onToggleGoalTimer={toggleGoalTimer}
            onResetGoalTimer={resetGoalTimer}
            onIncrementSuccessful={incrementSuccessful}
            onDecrementSuccessful={decrementSuccessful}
            onIncrementMissed={incrementMissed}
            onDecrementMissed={decrementMissed}
            isRemovedOpen={isRemovedGoalsOpen}
            onToggleRemoved={setIsRemovedGoalsOpen}
            formatTime={formatTime}
          />

          <div className="space-y-4">
            {/* <FedcPanel fedcObserved={fedcObserved} onToggle={ontoggle} /> */}

            <Card className="p-6 bg-white">
              <h3 className="text-[#303630] mb-4">Supports Observed</h3>
              <SupportsPanel
                supports={supportsList} // 👈 fetched from API
                supportsObserved={supportsObserved}
                showSupportOther={showSupportOther}
                supportOtherText={supportOtherText}
                onToggleSupport={toggleSupport}
                onToggleOther={handleSupportOtherToggle}
                onChangeOtherText={setSupportOtherText}
                onAddCustomSupport={addCustomSupport}
              />
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-[#303630] mb-4">Activities Engaged</h3>
              <ActivitiesPanel
                activities={activitiesList} // 👈 fetched from API
                activitiesEngaged={activitiesEngaged}
                showActivityOther={showActivityOther}
                activityOtherText={activityOtherText}
                onToggleActivity={toggleActivity}
                onToggleOther={handleActivityOtherToggle}
                onChangeOtherText={setActivityOtherText}
                onAddCustomActivity={addCustomActivity}
              />
            </Card>
          </div>
        </div>

        <ObservationsCard
          providerObservations={providerObservations}
          onChange={setProviderObservations}
        />

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleCompleteSession}
            className="h-14 bg-[#395159] hover:bg-[#303630] text-white px-8"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Complete Session & Generate Note
          </Button>
        </div>
      </div>
    </div>
  );
}
