import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Target, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Badge } from "../../../components/Badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/Dailog";
import { Label } from "../../../components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";
import { Textarea } from "../../../components/Textarea";
import { Input } from "../../../components/Input";
import { toast } from "react-toastify";
import {
  useAddGoalMutation,
  useGetGoalsQuery,
} from "../../../redux/api/provider";
import { handleError } from "../../../utils/helper";
import { SupportLevel } from "../../../utils/enums/enum";
import { useNavigate } from "react-router-dom";
import { GoalBankCategory, SupportLevelOptions } from "../../../Constant";
import { SelectBox } from "../../../components/SelectBox";
import { goalSchema } from "../../../Schema";

export function GoalBankManagement() {
  const navigate = useNavigate();
  const [addGoal, { data, isSuccess }] = useAddGoalMutation();

  const { data: goals } = useGetGoalsQuery();
  console.log(goals, "goalllll");

  const [isAddingGoal, setIsAddingGoal] = useState(false);

  const formik = useFormik({
    initialValues: {
      category: "",
      discription: "",
      masteryPercentage: "80",
      masterySessionCount: "5",
      supportLevel: SupportLevel?.Independent,
      masteryBaseline: "0",
    },
    validationSchema: goalSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values, helpers) => {
      const payload = {
        category: values.category,
        discription: values.discription,
        masteryBaseline: Number(values.masteryBaseline),

        criteriaForMastry: {
          masteryPercentage: Number(values.masteryPercentage),
          acrossSession: Number(values.masterySessionCount),
          supportLevel: values.supportLevel,
        },
      };
      addGoal(payload)
        .unwrap()
        .catch((error) => handleError(error));

      console.log("FINAL PAYLOAD SENT TO API:", payload);

      // === Call your API here ===
      // await addGoal(payload);

      toast.success("Goal added to bank successfully");
      helpers.resetForm();
      setIsAddingGoal(false);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Goal is added to the Goalbank");
    }
  }, [data]);

  const errorText = (field: keyof typeof formik.values) =>
    formik.errors[field] as string | undefined;

  return (
    <>
      <Button
        onClick={() => navigate("/")}
        variant="outline"
        className="border-[#395159] text-[#395159] mb-3"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
      <Card className="p-6 bg-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[#303630] mb-2">Goal Bank Management</h3>
            <p className="text-[#395159]">
              Add and manage clinic-wide goals for ITP planning
            </p>
          </div>
          <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
            <DialogTrigger asChild>
              <Button className="bg-[#395159] hover:bg-[#303630] text-white h-12">
                <Plus className="w-5 h-5 mr-2" />
                Add Goal to Bank
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Goal to Bank</DialogTitle>
                <DialogDescription>
                  Create a new goal template that can be used across multiple
                  clients.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <SelectBox
                    htmlFor="category"
                    label="Goal Category"
                    value={formik.values.category}
                    onChange={(val) => formik.setFieldValue("category", val)}
                    options={GoalBankCategory}
                    error={errorText("category")}
                    placeholder="Select category"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discription">Goal Description</Label>
                  <Textarea
                    id="discription"
                    name="discription"
                    placeholder="Enter the goal/objective description"
                    value={formik.values.discription}
                    onChange={formik.handleChange}
                    className="min-h-24"
                    required
                  />
                  {errorText("discription") && (
                    <p className="text-sm text-red-600">
                      {errorText("discription")}
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
                          min="0"
                          max="100"
                          value={formik.values.masteryPercentage}
                          onChange={formik.handleChange}
                          className="h-12"
                          required
                        />
                        <span className="text-[#395159]">%</span>
                      </div>
                      {errorText("masteryPercentage") && (
                        <p className="text-sm text-red-600">
                          {errorText("masteryPercentage")}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="masterySessionCount">
                        Across Sessions
                      </Label>
                      <Input
                        id="masterySessionCount"
                        name="masterySessionCount"
                        type="number"
                        min="1"
                        value={formik.values.masterySessionCount}
                        onChange={formik.handleChange}
                        className="h-12"
                        required
                      />
                      {errorText("masterySessionCount") && (
                        <p className="text-sm text-red-600">
                          {errorText("masterySessionCount")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportLevel">
                      Support Level Required for Mastery
                    </Label>
                    <Select
                      value={formik.values.supportLevel}
                      onValueChange={(v) =>
                        formik.setFieldValue("supportLevel", v)
                      }
                      required
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
                    {errorText("supportLevel") && (
                      <p className="text-sm text-red-600">
                        {errorText("supportLevel")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="masteryBaseline">Baseline Percentage</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="masteryBaseline"
                      name="masteryBaseline"
                      type="number"
                      min="0"
                      max="100"
                      value={formik.values.masteryBaseline}
                      onChange={formik.handleChange}
                      className="h-12"
                      placeholder="0"
                      required
                    />
                    <span className="text-[#395159]">%</span>
                  </div>
                  {errorText("masteryBaseline") && (
                    <p className="text-sm text-red-600">
                      {errorText("masteryBaseline")}
                    </p>
                  )}
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
                    Add to Goal Bank
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingGoal(false)}
                    className="h-12"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-6 h-6 text-[#395159]" />
          <h3 className="text-[#303630]">Clinic-Wide Goal Bank</h3>
          <Badge className="bg-[#395159] text-white ml-2">
            {goals?.data?.length} Goals
          </Badge>
        </div>

        <div className="space-y-8">
          {goals?.data?.map((goal: any) => (
            <div key={goal}>
              <h3 className="text-[#395159] mb-3 pb-2 border-b border-[#ccc9c0]">
                {goal?.category}
              </h3>
              <div className="space-y-3">
                <div
                  key={goal.id}
                  className="p-5 bg-[#efefef] rounded-lg border border-[#ccc9c0] hover:border-[#395159] transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-[#303630] mb-3">{goal.discription}</p>
                      <div className="flex items-center gap-6 text-sm text-[#395159]">
                        <div>
                          <span className="font-medium">Mastery Criteria:</span>{" "}
                          {goal?.criteriaForMastry?.masteryPercentage}% across{" "}
                          {goal?.criteriaForMastry?.acrossSession} sessions
                        </div>
                        <div>
                          <span className="font-medium">Support Level:</span>{" "}
                          {goal?.criteriaForMastry?.supportLevel ===
                          SupportLevel?.Independent
                            ? "Independently"
                            : goal.supportLevel === SupportLevel?.Minimal
                            ? "Minimal Support"
                            : "Moderate Support"}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#395159] text-[#395159]"
                        onClick={() => toast.success("Edit goal coming soon")}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => toast.success("Delete goal coming soon")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
