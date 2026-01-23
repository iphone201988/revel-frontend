import  { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import { Target, Plus, Calendar, Edit, TrendingUp } from "lucide-react";

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
import { GoalBankCategory, SupportLevelOptions } from "../../../Constant";
import { showSuccess } from "../../../components/CustomToast";

interface GoalsSectionProps {
  clientId: string;
  clientGoals: Goal[];
}

// Validation Schemas
const bankGoalSchema = Yup.object({
  targetDate: Yup.string()
    .required("Target date is required"),
  baselinePercentage: Yup.number()
    .min(0, "Baseline must be at least 0")
    .max(100, "Baseline cannot exceed 100")
    .required("Baseline percentage is required"),
});

const customGoalSchema = Yup.object({
  category: Yup.string()
    .required("Please select a FEDC category"),
  discription: Yup.string()
    .trim()
    .required("Goal description is required"),
  targetDate: Yup.string()
    .required("Target date is required"),
  baselinePercentage: Yup.number()
    .min(0, "Baseline must be between 0 and 100")
    .max(100, "Baseline must be between 0 and 100")
    .required("Baseline percentage is required"),
  masteryPercentage: Yup.number()
    .min(1, "Mastery percentage must be between 1 and 100")
    .max(100, "Mastery percentage must be between 1 and 100")
    .required("Mastery percentage is required"),
  acrossSession: Yup.number()
    .min(1, "Across sessions must be at least 1")
    .required("Session count is required"),
  supportLevel: Yup.string()
    .required("Support level is required"),
});

const editGoalSchema = Yup.object({
  targetDate: Yup.string()
    .required("Target date is required"),
  baselinePercentage: Yup.number()
    .min(1, "Baseline must be between 1 and 100")
    .max(100, "Baseline must be between 1 and 100")
    .required("Baseline percentage is required"),
});

const modifyCriteriaSchema = Yup.object({
  masteryPercentage: Yup.number()
    .min(1, "Mastery percentage must be between 1 and 100")
    .max(100, "Mastery percentage must be between 1 and 100")
    .required("Mastery percentage is required"),
  sessionCount: Yup.number()
    .min(1, "Session count must be at least 1")
    .required("Session count is required"),
  supportLevel: Yup.string()
    .required("Support level is required"),
});

export function GoalsSection({ clientId, clientGoals }: GoalsSectionProps) {
  const { data: goals } = useGetGoalsQuery();
  const [addItpGoalToClient, { isSuccess: addGoalSuccess }] =
    useAddItpGoalToClientMutation();
  const [updateItpGoal, { isSuccess: isUpdated }] = useUpdateItpGoalMutation();

  const navigate = useNavigate();
  const [isAddingGoalFromBank, setIsAddingGoalFromBank] = useState(false);
  const [isAddingCustomGoal, setIsAddingCustomGoal] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [isModifyingCriteria, setIsModifyingCriteria] = useState(false);
  const [selectedBankGoal, setSelectedBankGoal] = useState<Goal | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
  const [modifyingGoalId, setModifyingGoalId] = useState<number | null>(null);

  // Bank Goal Form
  const bankGoalFormik = useFormik({
    initialValues: {
      targetDate: "",
      baselinePercentage: 0,
      editedGoalText: "",
    },
    validationSchema: bankGoalSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!selectedBankGoal) return;

      try {
        await addItpGoalToClient({
          goalId: selectedBankGoal._id,
          clientId,
          targetDate: values.targetDate,
          baselinePercentage: Number(values.baselinePercentage),
        }).unwrap();

        setIsAddingGoalFromBank(false);
        setSelectedBankGoal(null);
        resetForm();
      } catch (err: any) {
        handleError(err);
      }
    },
  });

  // Custom Goal Form
  const customGoalFormik = useFormik({
    initialValues: {
      category: "",
      discription: "",
      targetDate: "",
      baselinePercentage: 0,
      masteryPercentage: 80,
      acrossSession: 5,
      supportLevel: SupportLevel.Independent,
    },
    validationSchema: customGoalSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        clientId,
        category: values.category,
        discription: values.discription,
        targetDate: values.targetDate,
        baselinePercentage: Number(values.baselinePercentage),
        criteriaForMastry: {
          masteryPercentage: Number(values.masteryPercentage),
          acrossSession: Number(values.acrossSession),
          supportLevel: values.supportLevel,
        },
      };

      try {
        await addItpGoalToClient(payload).unwrap();
        setIsAddingCustomGoal(false);
        resetForm();
      } catch (error) {
        handleError(error);
      }
    },
  });

  // Edit Goal Form
  const editGoalFormik = useFormik({
    initialValues: {
      targetDate: "",
      baselinePercentage: 0,
      category: "",
      discription: "",
    },
    validationSchema: editGoalSchema,
    onSubmit: async (values) => {
      try {
        // console.log("client goals....",clientGoals)
        const goalToUpdate = clientGoals.find(
          (item: any) => item?._id === editingGoalId
        );

        if (!goalToUpdate) return;

        await updateItpGoal({
          itpGoalId: goalToUpdate._id,
          clientId,
          data: {
            targetDate: values.targetDate,
            baselinePercentage: Number(values.baselinePercentage),
          },
        }).unwrap();

        setIsEditingGoal(false);
        setEditingGoalId(null);
      } catch (error: any) {
        handleError(error);
      }
    },
  });

  // Modify Criteria Form
  const modifyCriteriaFormik = useFormik({
    initialValues: {
      masteryPercentage: 80,
      sessionCount: 5,
      supportLevel: "",
    },
    validationSchema: modifyCriteriaSchema,
    onSubmit: async (values) => {
      try {
        const goalToUpdate = clientGoals.find(
          (item: any) => item?.goal?._id === modifyingGoalId
        );

        if (!goalToUpdate) {
          console.error("Goal not found");
          return;
        }

        await updateItpGoal({
          itpGoalId: goalToUpdate._id,
          clientId,
          data: {
            masteryPercentage: values.masteryPercentage,
            sessionCount: values.sessionCount,
            supportLevel: values.supportLevel,
          },
        }).unwrap().catch((error)=>handleError(error));

        setIsModifyingCriteria(false);
        setModifyingGoalId(null);
      } catch (error: any) {
        handleError(error);
      }
    },
  });

  const selectBankGoal = (goal: any) => {
    setSelectedBankGoal(goal);
    bankGoalFormik.setFieldValue("editedGoalText", goal?.discription);
  };

  const openEditGoal = (goal: any) => {
    setEditingGoalId(goal?._id);
    editGoalFormik.setValues({
      discription: goal?.goal?.discription,
      category: goal?.goal?.category,
      targetDate: goal?.targetDate,
      baselinePercentage: goal?.baselinePercentage,
    });
    setIsEditingGoal(true);
  };

  const openModifyCriteria = (goal: any) => {
    setModifyingGoalId(goal?.goal?._id);
    
    modifyCriteriaFormik.setValues({
      masteryPercentage: goal?.masteryPercentage || 80,
      sessionCount: goal?.sessionCount || 5,
      supportLevel: goal?.supportLevel || "",
    });
    setIsModifyingCriteria(true);
  };

  useEffect(() => {
    if (addGoalSuccess) {
      showSuccess("Goal is assigned to the client");
    }
  }, [addGoalSuccess]);

  useEffect(() => {
    if (isUpdated) {
      showSuccess("Client Goal updated successfully...");
    }
  }, [isUpdated]);

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#303630]">Current ITP Goals</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/goal-review", { state: { clientId } })}
            variant="outline"
            className="border-[#395159] text-[#395159]"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Review & Update Goals
          </Button>
          
          {/* Add from Goal Bank Dialog */}
          <Dialog
            open={isAddingGoalFromBank}
            onOpenChange={(open) => {
              setIsAddingGoalFromBank(open);
              if (!open) {
                setSelectedBankGoal(null);
                bankGoalFormik.resetForm();
              }
            }}
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
                <form onSubmit={bankGoalFormik.handleSubmit} className="space-y-4">
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
                      name="editedGoalText"
                      value={bankGoalFormik.values.editedGoalText}
                      onChange={bankGoalFormik.handleChange}
                      className="min-h-24"
                      placeholder="You can customize the goal text for this specific client..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetDate">Target Date</Label>
                    <Input
                      id="targetDate"
                      name="targetDate"
                      type="date"
                      value={bankGoalFormik.values.targetDate}
                      onChange={bankGoalFormik.handleChange}
                      onBlur={bankGoalFormik.handleBlur}
                      className="h-12"
                    />
                    {bankGoalFormik.touched.targetDate && bankGoalFormik.errors.targetDate && (
                      <p className="text-sm text-red-600">
                        {bankGoalFormik.errors.targetDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="baselinePercentage">Baseline Percentage</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="baselinePercentage"
                        name="baselinePercentage"
                        type="number"
                        min="0"
                        max="100"
                        value={bankGoalFormik.values.baselinePercentage}
                        onChange={bankGoalFormik.handleChange}
                        onBlur={bankGoalFormik.handleBlur}
                        className="h-12"
                        placeholder="0"
                      />
                      <span className="text-[#395159]">%</span>
                    </div>
                    {bankGoalFormik.touched.baselinePercentage && 
                     bankGoalFormik.errors.baselinePercentage && (
                      <p className="text-sm text-red-600">
                        {bankGoalFormik.errors.baselinePercentage}
                      </p>
                    )}
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
                        bankGoalFormik.resetForm();
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

          {/* Add Custom Goal Dialog */}
          <Dialog
            open={isAddingCustomGoal}
            onOpenChange={(open) => {
              setIsAddingCustomGoal(open);
              if (!open) customGoalFormik.resetForm();
            }}
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
              <form onSubmit={customGoalFormik.handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <SelectBox
                    htmlFor="category"
                    label="FEDC Category"
                    value={customGoalFormik.values.category}
                    onChange={(value) => customGoalFormik.setFieldValue("category", value)}
                    options={GoalBankCategory}
                    error={
                      customGoalFormik.touched.category
                        ? customGoalFormik.errors.category
                        : undefined
                    }
                    placeholder="Select FEDC category"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discription">Goal Description</Label>
                  <Textarea
                    id="discription"
                    name="discription"
                    value={customGoalFormik.values.discription}
                    onChange={customGoalFormik.handleChange}
                    onBlur={customGoalFormik.handleBlur}
                    className="min-h-24"
                    placeholder="Enter the custom goal for this client..."
                  />
                  {customGoalFormik.touched.discription && 
                   customGoalFormik.errors.discription && (
                    <p className="text-sm text-red-600">
                      {customGoalFormik.errors.discription}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customTargetDate">Target Date</Label>
                  <Input
                    id="customTargetDate"
                    name="targetDate"
                    type="date"
                    value={customGoalFormik.values.targetDate}
                    onChange={customGoalFormik.handleChange}
                    onBlur={customGoalFormik.handleBlur}
                    className="h-12"
                  />
                  {customGoalFormik.touched.targetDate && 
                   customGoalFormik.errors.targetDate && (
                    <p className="text-sm text-red-600">
                      {customGoalFormik.errors.targetDate}
                    </p>
                  )}
                </div>

                <div className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0] space-y-4">
                  <h4 className="text-[#303630]">Criteria for Mastery</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="masteryPercentage">
                        Mastery Percentage
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="masteryPercentage"
                          name="masteryPercentage"
                          type="number"
                          min="1"
                          max="100"
                          value={customGoalFormik.values.masteryPercentage}
                          onChange={customGoalFormik.handleChange}
                          onBlur={customGoalFormik.handleBlur}
                          className="h-12"
                        />
                        <span className="text-[#395159]">%</span>
                      </div>
                      {customGoalFormik.touched.masteryPercentage && 
                       customGoalFormik.errors.masteryPercentage && (
                        <p className="text-sm text-red-600">
                          {customGoalFormik.errors.masteryPercentage}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="acrossSession">Across Sessions</Label>
                      <Input
                        id="acrossSession"
                        name="acrossSession"
                        type="number"
                        min="1"
                        value={customGoalFormik.values.acrossSession}
                        onChange={customGoalFormik.handleChange}
                        onBlur={customGoalFormik.handleBlur}
                        className="h-12"
                      />
                      {customGoalFormik.touched.acrossSession && 
                       customGoalFormik.errors.acrossSession && (
                        <p className="text-sm text-red-600">
                          {customGoalFormik.errors.acrossSession}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportLevel">
                      Support Level Required for Mastery
                    </Label>
                    <Select
                      value={customGoalFormik.values.supportLevel}
                      onValueChange={(value) =>
                        customGoalFormik.setFieldValue("supportLevel", value)
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SupportLevelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {customGoalFormik.touched.supportLevel && 
                     customGoalFormik.errors.supportLevel && (
                      <p className="text-sm text-red-600">
                        {customGoalFormik.errors.supportLevel}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customBaselinePercentage">
                    Baseline Percentage
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="customBaselinePercentage"
                      name="baselinePercentage"
                      type="number"
                      min="0"
                      max="100"
                      value={customGoalFormik.values.baselinePercentage}
                      onChange={customGoalFormik.handleChange}
                      onBlur={customGoalFormik.handleBlur}
                      className="h-12"
                      placeholder="0"
                    />
                    <span className="text-[#395159]">%</span>
                  </div>
                  {customGoalFormik.touched.baselinePercentage && 
                   customGoalFormik.errors.baselinePercentage && (
                    <p className="text-sm text-red-600">
                      {customGoalFormik.errors.baselinePercentage}
                    </p>
                  )}
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

      {/* Goals List */}
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
                <p className="text-[#303630] mb-2">
                  {item.customDescription || item.goal?.discription}
                </p>
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
      <Dialog
        open={isEditingGoal}
        onOpenChange={(open) => {
          setIsEditingGoal(open);
          if (!open) {
            setEditingGoalId(null);
            editGoalFormik.resetForm();
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>
              Modify the goal details and settings.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editGoalFormik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editGoalCategory">FEDC Category</Label>
              <Input
                value={editGoalFormik.values.category}
                disabled
                className="h-12 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editGoalText">Goal Description</Label>
              <Input
                value={editGoalFormik.values.discription}
                disabled
                className="h-12 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editTargetDate">Target Date</Label>
              <Input
                id="editTargetDate"
                name="targetDate"
                type="date"
                value={editGoalFormik.values.targetDate}
                onChange={editGoalFormik.handleChange}
                onBlur={editGoalFormik.handleBlur}
                className="h-12"
              />
              {editGoalFormik.touched.targetDate && 
               editGoalFormik.errors.targetDate && (
                <p className="text-sm text-red-600">
                  {editGoalFormik.errors.targetDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="editBaselinePercentage">Baseline Percentage</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="editBaselinePercentage"
                  name="baselinePercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={editGoalFormik.values.baselinePercentage}
                  onChange={editGoalFormik.handleChange}
                  onBlur={editGoalFormik.handleBlur}
                  className="h-12"
                  placeholder="0"
                />
                <span className="text-[#395159]">%</span>
              </div>
              {editGoalFormik.touched.baselinePercentage && 
               editGoalFormik.errors.baselinePercentage && (
                <p className="text-sm text-red-600">
                  {editGoalFormik.errors.baselinePercentage}
                </p>
              )}
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
      <Dialog
        open={isModifyingCriteria}
        onOpenChange={(open) => {
          setIsModifyingCriteria(open);
          if (!open) {
            setModifyingGoalId(null);
            modifyCriteriaFormik.resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modify Goal Mastery Criteria</DialogTitle>
            <DialogDescription>
              Update the mastery criteria for this goal.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={modifyCriteriaFormik.handleSubmit} className="space-y-4">
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
                    <Input
                      id="criteriaMasteryPercentage"
                      name="masteryPercentage"
                      type="number"
                      min="0"
                      max="100"
                      value={modifyCriteriaFormik.values.masteryPercentage}
                      onChange={modifyCriteriaFormik.handleChange}
                      onBlur={modifyCriteriaFormik.handleBlur}
                      className="h-12"
                    />
                    <span className="text-[#395159]">%</span>
                  </div>
                  {modifyCriteriaFormik.touched.masteryPercentage && 
                   modifyCriteriaFormik.errors.masteryPercentage && (
                    <p className="text-sm text-red-600">
                      {modifyCriteriaFormik.errors.masteryPercentage}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="criteriaSessionCount">
                    Consecutive Sessions
                  </Label>
                  <Input
                    id="criteriaSessionCount"
                    name="sessionCount"
                    type="number"
                    min="1"
                    value={modifyCriteriaFormik.values.sessionCount}
                    onChange={modifyCriteriaFormik.handleChange}
                    onBlur={modifyCriteriaFormik.handleBlur}
                    className="h-12"
                  />
                  {modifyCriteriaFormik.touched.sessionCount && 
                   modifyCriteriaFormik.errors.sessionCount && (
                    <p className="text-sm text-red-600">
                      {modifyCriteriaFormik.errors.sessionCount}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="criteriaSupportLevel">
                  Support Level Required for Mastery
                </Label>
                <Select
                  value={modifyCriteriaFormik.values.supportLevel}
                  onValueChange={(value) =>
                    modifyCriteriaFormik.setFieldValue("supportLevel", value)
                  }
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
                {modifyCriteriaFormik.touched.supportLevel && 
                 modifyCriteriaFormik.errors.supportLevel && (
                  <p className="text-sm text-red-600">
                    {modifyCriteriaFormik.errors.supportLevel}
                  </p>
                )}
              </div>

              <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                <p className="text-sm text-[#395159]">
                  <strong>Criteria Summary:</strong> Goal will be considered
                  mastered when the client demonstrates the skill at{" "}
                  {modifyCriteriaFormik.values.masteryPercentage}% accuracy across{" "}
                  {modifyCriteriaFormik.values.sessionCount} consecutive sessions with{" "}
                  {modifyCriteriaFormik.values.supportLevel} support.
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