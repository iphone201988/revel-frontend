import React, { useEffect, useState } from "react";
import { Badge } from "../../../components/Badge";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/Dailog";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";
import { Textarea } from "../../../components/Textarea";
import { Target, Plus, Calendar, Edit } from "lucide-react";
import { toast } from "react-toastify";
import type { Goal } from "./types";
import { useNavigate } from "react-router-dom";
import {
  useAddItpGoalToClientMutation,
  useGetGoalsQuery,
  useUpdateItpGoalMutation,
} from "../../../redux/api/provider";
import { handleError } from "../../../utils/helper";
import moment from "moment";
import { SupportLevel } from "../../../utils/enums/enum";
import { SelectBox } from "../../../components/SelectBox";
import { GoalBankCategory } from "../../../Constant";

interface GoalsSectionProps {
  clientId: string;
  clientGoals: Goal[];
}

export function GoalsSection({ clientId, clientGoals }: GoalsSectionProps) {
  const { data: goals } = useGetGoalsQuery();

  const [addItpGoalToClient] = useAddItpGoalToClientMutation();

  const [updateItpGoal] = useUpdateItpGoalMutation(); //done

  const navigate = useNavigate();
  const [isAddingGoalFromBank, setIsAddingGoalFromBank] = useState(false);
  const [isAddingCustomGoal, setIsAddingCustomGoal] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);

  const [selectedBankGoal, setSelectedBankGoal] = useState<Goal | null>(null);
  const [editedGoalText, setEditedGoalText] = useState("");
  const [goalTargetDate, setGoalTargetDate] = useState("");
  const [baselineData, setBaselineData] = useState("0");

  const [customGoalCategory, setCustomGoalCategory] = useState("");
  const [customGoalText, setCustomGoalText] = useState("");
  const [customGoalTargetDate, setCustomGoalTargetDate] = useState("");
  const [customBaselineData, setCustomBaselineData] = useState("0");
  const [customMasteryPercentage, setCustomMasteryPercentage] = useState("80");
  const [customMasterySessionCount, setCustomMasterySessionCount] =
    useState("5");
  const [customSupportLevel, setCustomSupportLevel] = useState("");

  const [editGoalText, setEditGoalText] = useState("");
  const [editGoalCategory, setEditGoalCategory] = useState("");
  const [editGoalTargetDate, setEditGoalTargetDate] = useState("");
  const [editGoalBaseline, setEditGoalBaseline] = useState("0");

  const [isModifyingCriteria, setIsModifyingCriteria] = useState(false);
  const [modifyingGoalId, setModifyingGoalId] = useState<number | null>(null);
  const [criteriaMasteryPercentage, setCriteriaMasteryPercentage] =
    useState("80");
  const [criteriaMasterySessionCount, setCriteriaMasterySessionCount] =
    useState("5");
  const [criteriaSupportLevel, setCriteriaSupportLevel] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const selectBankGoal = (goal: any) => {
    setSelectedBankGoal(goal);
    setEditedGoalText(goal?.discription);
  };

  const handleAddGoalFromBank = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBankGoal) return;

    try {
      await addItpGoalToClient({
        goalId: selectedBankGoal._id,
        clientId,
        targetDate: goalTargetDate,
        baselinePercentage: Number(baselineData),
      })
        .unwrap()
        .catch((error) => handleError(error));

      toast.success("Goal assigned to client");

      setIsAddingGoalFromBank(false);
      setSelectedBankGoal(null);
      setEditedGoalText("");
      setGoalTargetDate("");
      setBaselineData("0");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add goal");
    }
  }; //done

  const handleAddCustomGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔹 Frontend validation
    const errors: Record<string, string> = {};

    if (!customGoalCategory) errors.category = "Please select a FEDC category";
    if (!customGoalText.trim())
      errors.description = "Goal description is required";
    if (!customGoalTargetDate) errors.targetDate = "Target date is required";

    if (Number(customBaselineData) < 0 || Number(customBaselineData) > 100) {
      errors.baseline = "Baseline percentage must be between 0 and 100";
    }

    if (
      Number(customMasteryPercentage) < 1 ||
      Number(customMasteryPercentage) > 100
    ) {
      errors.masteryPercentage = "Mastery percentage must be between 1 and 100";
    }

    if (Number(customMasterySessionCount) < 1) {
      errors.sessionCount = "Across sessions must be at least 1";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      clientId,
      category: customGoalCategory,
      discription: customGoalText,
      targetDate: customGoalTargetDate,
      baselinePercentage: Number(customBaselineData),
      criteriaForMastry: {
        masteryPercentage: Number(customMasteryPercentage),
        acrossSession: Number(customMasterySessionCount),
        supportLevel: customSupportLevel,
      },
    };

    try {
      await addItpGoalToClient(payload).unwrap();

      // ✅ Reset state after success
      setIsAddingCustomGoal(false);
      setCustomGoalCategory("");
      setCustomGoalText("");
      setCustomGoalTargetDate("");
      setCustomBaselineData("0");
      setCustomMasteryPercentage("80");
      setCustomMasterySessionCount("5");
      setCustomSupportLevel(SupportLevel.Independent);
      setFormErrors({});
    } catch (error) {
      console.error(error);
    }
  }; //done

  const openEditGoal = (goal: any) => {
    setEditingGoalId(goal?._id);
    setEditGoalText(goal?.goal?.discription);
    setEditGoalCategory(goal?.goal?.category);
    setEditGoalTargetDate(goal?.targetDate);
    setEditGoalBaseline(goal?.baselinePercentage);
    setIsEditingGoal(true);
  }; // done

  const handleEditGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const goalToUpdate = clientGoals.find(
        (item: any) => item._id === editingGoalId
      );

      if (!goalToUpdate) return;

      await updateItpGoal({
        itpGoalId: goalToUpdate._id,
        clientId,
        data: {
          targetDate: editGoalTargetDate || goalToUpdate.targetDate,
          baselinePercentage: Number(editGoalBaseline),
        },
      })
        .unwrap()
        .catch((error) => handleError(error));

      setIsEditingGoal(false);
      setEditingGoalId(null);
    } catch (error: any) {
      handleError(error);
    }
  }; //done

  const openModifyCriteria = (goal: any) => {
    setModifyingGoalId(goal?.goal?._id);
    setCriteriaMasteryPercentage(
      goal?.goal?.criteriaForMastry?.masteryPercentage
    );
    setCriteriaMasterySessionCount(
      goal?.goal?.criteriaForMastry?.acrossSession
    );
    setCriteriaSupportLevel(goal?.goal?.criteriaForMastry?.supportLevel);
    setIsModifyingCriteria(true);
  }; //done

  const handleModifyCriteria = (e: React.FormEvent) => {
    e.preventDefault();
    // toast.success("Goal criteria updated successfully");
    setIsModifyingCriteria(false);
    setModifyingGoalId(null);
  }; // done

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#303630]">Current ITP Goals</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/goal-review")} //clientId
            variant="outline"
            className="border-[#395159] text-[#395159]"
          >
            <Target className="w-4 h-4 mr-2" />
            Review & Update Goals
          </Button>
          <Dialog
            open={isAddingGoalFromBank}
            onOpenChange={setIsAddingGoalFromBank}
          >
            <DialogTrigger asChild>
              <Button className="bg-[#395159] hover:bg-[#303630] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add from Goal Bank
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Goal from Bank</DialogTitle>
                <DialogDescription>
                  Select a goal from the goal bank to add to this client's
                  treatment plan.
                </DialogDescription>
              </DialogHeader>
              {!selectedBankGoal ? (
                <div className="space-y-3">
                  <p className="text-[#395159]">
                    Select a goal from the bank to add to this client's chart:
                  </p>
                  {goals?.data?.map((goal: any) => (
                    <div
                      key={goal._id}
                      className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0] hover:border-[#395159] cursor-pointer transition-all"
                      onClick={() => selectBankGoal(goal)}
                    >
                      <Badge className="bg-[#395159] text-white mb-2">
                        {goal?.category}
                      </Badge>
                      <p className="text-[#303630]">{goal?.discription}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-[#395159]">
                        <span>
                          Mastery: {goal?.criteriaForMastry?.masteryPercentage}%
                          across {goal?.criteriaForMastry?.acrossSession}{" "}
                          sessions
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleAddGoalFromBank} className="space-y-4">
                  <div className="p-4 bg-[#efefef] rounded-lg border border-[#395159]">
                    <Badge className="bg-[#395159] text-white mb-2">
                      {selectedBankGoal.category}
                    </Badge>
                    <p className="text-sm text-[#395159] mb-2">
                      Original goal from bank:
                    </p>
                    <p className="text-[#303630]">
                      {selectedBankGoal?.discription}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="editedGoalText">Edit Goal (Optional)</Label>
                    <Textarea
                      id="editedGoalText"
                      value={editedGoalText}
                      onChange={(e: any) => setEditedGoalText(e.target.value)}
                      className="min-h-24"
                      placeholder="You can customize the goal text for this specific client..."
                    />
                    <p className="text-sm text-[#395159]">
                      The goal text can be edited to match this client's
                      specific needs
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goalTargetDate">Target Date</Label>
                    <Input
                      id="goalTargetDate"
                      type="date"
                      value={goalTargetDate}
                      onChange={(e: any) => setGoalTargetDate(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="baselineData">Baseline Percentage</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="baselineData"
                        type="number"
                        min="0"
                        max="100"
                        value={baselineData}
                        onChange={(e: any) => setBaselineData(e.target.value)}
                        className="h-12"
                        placeholder="0"
                        required
                      />
                      <span className="text-[#395159]">%</span>
                    </div>
                    <p className="text-sm text-[#395159]">
                      Enter the client's current performance percentage for this
                      goal (0-100%)
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white"
                    >
                      Add Goal to Client Chart
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedBankGoal(null);
                        setEditedGoalText("");
                        setGoalTargetDate("");
                        setBaselineData("0");
                      }}
                      className="h-12"
                    >
                      Back to Selection
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
          <Dialog
            open={isAddingCustomGoal}
            onOpenChange={setIsAddingCustomGoal}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-[#395159] text-[#395159]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Custom Goal</DialogTitle>
                <DialogDescription>
                  Create a custom goal specifically for this client.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCustomGoal} className="space-y-4">
                <div className="space-y-2">
                  <SelectBox
                    htmlFor="customGoalCategory"
                    label="FEDC Category"
                    value={customGoalCategory}
                    onChange={setCustomGoalCategory}
                    options={GoalBankCategory}
                    error={formErrors.category}
                    placeholder="Select FEDC category"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customGoalText">Goal Description</Label>
                  <Textarea
                    id="customGoalText"
                    value={customGoalText}
                    onChange={(e: any) => setCustomGoalText(e.target.value)}
                    className="min-h-24"
                    placeholder="Enter the custom goal for this client..."
                    required
                  />
                  {formErrors.description && (
                    <p className="text-sm text-red-600">
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customGoalTargetDate">Target Date</Label>
                  <Input
                    id="customGoalTargetDate"
                    type="date"
                    value={customGoalTargetDate}
                    onChange={(e: any) =>
                      setCustomGoalTargetDate(e.target.value)
                    }
                    className="h-12"
                    required
                  />
                  {formErrors.targetDate && (
                    <p className="text-sm text-red-600">
                      {formErrors.targetDate}
                    </p>
                  )}
                </div>

                <div className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0] space-y-4">
                  <h4 className="text-[#303630]">Criteria for Mastery</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customMasteryPercentage">
                        Mastery Percentage
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="customMasteryPercentage"
                          type="number"
                          min="0"
                          max="100"
                          value={customMasteryPercentage}
                          onChange={(e: any) =>
                            setCustomMasteryPercentage(e.target.value)
                          }
                          className="h-12"
                          required
                        />

                        <span className="text-[#395159]">%</span>
                      </div>
                      {formErrors.masteryPercentage && (
                        <p className="text-sm text-red-600">
                          {formErrors.masteryPercentage}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customMasterySessionCount">
                        Across Sessions
                      </Label>
                      <Input
                        id="customMasterySessionCount"
                        type="number"
                        min="1"
                        value={customMasterySessionCount}
                        onChange={(e: any) =>
                          setCustomMasterySessionCount(e.target.value)
                        }
                        className="h-12"
                        required
                      />
                      {formErrors.sessionCount && (
                        <p className="text-sm text-red-600">
                          {formErrors.sessionCount}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customSupportLevel">
                      Support Level Required for Mastery
                    </Label>
                    <Select
                      value={customSupportLevel}
                      onValueChange={setCustomSupportLevel}
                      required
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SupportLevel?.Independent}>
                          Independently
                        </SelectItem>
                        <SelectItem value={SupportLevel?.Minimal}>
                          Minimal Support
                        </SelectItem>
                        <SelectItem value={SupportLevel?.Moderate}>
                          Moderate Support
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customBaselineData">
                    Baseline Percentage
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="customBaselineData"
                      type="number"
                      min="0"
                      max="100"
                      value={customBaselineData}
                      onChange={(e: any) =>
                        setCustomBaselineData(e.target.value)
                      }
                      className="h-12"
                      placeholder="0"
                      required
                    />
                    <span className="text-[#395159]">%</span>
                  </div>
                  <p className="text-sm text-[#395159]">
                    Enter the client's current performance percentage for this
                    goal (0-100%)
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white"
                  >
                    Add Custom Goal
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingCustomGoal(false)}
                    className="h-12"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-3">
        {clientGoals?.map((item: any) => (
          <div
            key={item._id}
            className="p-5 bg-[#efefef] rounded-lg border border-[#ccc9c0]"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#395159] text-white">
                    {item?.goal?.category}
                  </Badge>

                  {item?.targetDate && (
                    <Badge
                      variant="outline"
                      className="border-[#395159] text-[#395159]"
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Target: {moment(item?.targetDate).format("DD-MM-YYYY")}
                    </Badge>
                  )}
                </div>

                {/* ✅ goal description */}
                <p className="text-[#303630] mb-2">
                  {item.customDescription || item.goal?.discription}
                </p>

                {/* optional info */}
                <p className="text-sm text-[#395159]">
                  Baseline: {item.baselinePercentage}%
                </p>

                <div className="flex gap-3 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#395159] text-[#395159]"
                    onClick={() => openEditGoal(item)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Goal
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#395159] text-[#395159]"
                    onClick={() => openModifyCriteria(item)}
                  >
                    <Target className="w-4 h-4 mr-1" />
                    Modify Criteria
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Goal Dialog */}
      <Dialog open={isEditingGoal} onOpenChange={setIsEditingGoal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>
              Modify the goal details and settings.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditGoal} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editGoalCategory">FEDC Category</Label>
              <Input
                value={editGoalCategory}
                disabled
                className="h-12 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editGoalText">Goal Description</Label>
              <Input
                value={editGoalText}
                disabled
                className="h-12 bg-gray-100 cursor-not-allowed"
              />
              {/* <Textarea
                id="editGoalText"
                value={editGoalText}
                onChange={(e: any) => setEditGoalText(e.target.value)}
                className="min-h-24"
                required
              /> */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="editGoalTargetDate">Target Date</Label>
              <Input
                id="editGoalTargetDate"
                type="date"
                value={editGoalTargetDate}
                onChange={(e: any) => setEditGoalTargetDate(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editGoalBaseline">Baseline Percentage</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="editGoalBaseline"
                  type="number"
                  min="0"
                  max="100"
                  value={editGoalBaseline}
                  onChange={(e: any) => setEditGoalBaseline(e.target.value)}
                  className="h-12"
                  placeholder="0"
                />
                <span className="text-[#395159]">%</span>
              </div>
              <p className="text-sm text-[#395159]">
                Enter the client's baseline performance percentage for this goal
                (0-100%)
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingGoal(false)}
                className="h-12"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modify Criteria Dialog */}
      <Dialog open={isModifyingCriteria} onOpenChange={setIsModifyingCriteria}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modify Goal Mastery Criteria</DialogTitle>
            <DialogDescription>
              Update the mastery criteria for this goal.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleModifyCriteria} className="space-y-4">
            <div className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
              <p className="text-sm text-[#395159] mb-2">Current Goal:</p>
              {modifyingGoalId && (
                <>
                  <Badge className="bg-[#395159] text-white mb-2">
                    {
                      clientGoals?.find(
                        (g: any) => g?.goal?._id === modifyingGoalId
                      )?.goal?.category
                    }
                  </Badge>
                  <p className="text-[#303630]">
                    {
                      clientGoals.find(
                        (g: any) => g?.goal?._id === modifyingGoalId
                      )?.goal?.discription
                    }
                  </p>
                </>
              )}
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-[#303630] mb-4">Mastery Criteria</h4>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="criteriaMasteryPercentage">
                    Mastery Percentage
                  </Label>
                  <div className="flex items-center gap-2">
                    {/* <Input
                      id="criteriaMasteryPercentage"
                      type="number"
                      min="0"
                      max="100"
                      value={criteriaMasteryPercentage}
                      onChange={(e: any) =>
                        setCriteriaMasteryPercentage(e.target.value)
                      }
                      className="h-12"
                      required
                    /> */}

                    <Input
                      value={criteriaMasteryPercentage}
                      disabled
                      className="h-12 bg-gray-100 cursor-not-allowed"
                    />
                    <span className="text-[#395159]">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="criteriaMasterySessionCount">
                    Consecutive Sessions
                  </Label>
                  {/* <Input
                    id="criteriaMasterySessionCount"
                    type="number"
                    min="1"
                    value={criteriaMasterySessionCount}
                    onChange={(e: any) =>
                      setCriteriaMasterySessionCount(e.target.value)
                    }
                    className="h-12"
                    required
                  /> */}
                  <Input
                    value={criteriaMasterySessionCount}
                    disabled
                    className="h-12 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="criteriaSupportLevel">
                  Support Level Required for Mastery
                </Label>
                <Input
                  value={criteriaSupportLevel}
                  disabled
                  className="h-12 bg-gray-100 cursor-not-allowed"
                />
                {/* <Select
                  value={criteriaSupportLevel}
                  onValueChange={setCriteriaSupportLevel}
                  required
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SupportLevel?.Independent}>
                      Independently
                    </SelectItem>
                    <SelectItem value={SupportLevel?.Minimal}>
                      Minimal Support
                    </SelectItem>
                    <SelectItem value={SupportLevel?.Moderate}>
                      Moderate Support
                    </SelectItem>
                  </SelectContent>
                </Select> */}
              </div>

              <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                <p className="text-sm text-[#395159]">
                  <strong>Criteria Summary:</strong> Goal will be considered
                  mastered when the client demonstrates the skill at{" "}
                  {criteriaMasteryPercentage}% accuracy across{" "}
                  {criteriaMasterySessionCount} consecutive sessions with{" "}
                  {criteriaSupportLevel} support.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white"
              >
                Save Criteria
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModifyingCriteria(false)}
                className="h-12"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
