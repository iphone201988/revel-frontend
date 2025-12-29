import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../components/Dailog";
import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import { Textarea } from "../../../../components/Textarea";
import { Label } from "../../../../components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/Select";
import { useFormik } from "formik";
import { SupportLevelOptions } from "../../../../Constant";
import { SupportLevel } from "../../../../utils/enums/enum";
import { goalSchema } from "../../../../Schema";

import { useEditGoalMutation } from "../../../../redux/api/provider";
import { SelectBox } from "../../../../components/SelectBox";
import { GoalBankCategory } from "../../../../Constant";
import { handleError } from "../../../../utils/helper";
import { showError, showSuccess } from "../../../../components/CustomToast";

const EditGoalPopup = ({ open, onClose, goal }: any) => {
  const [editGoal, { isLoading }] = useEditGoalMutation();

  const formik = useFormik({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      category: goal?.category || "",
      discription: goal?.discription || "",
      masteryPercentage:
        goal?.criteriaForMastry?.masteryPercentage?.toString() || "80",
      masterySessionCount:
        goal?.criteriaForMastry?.acrossSession?.toString() || "5",
      supportLevel:
        goal?.criteriaForMastry?.supportLevel || SupportLevel.Independent,
      masteryBaseline: goal?.masteryBaseline?.toString() || "0",
    },
    validationSchema: goalSchema,
    onSubmit: async (values) => {
      try {
        await editGoal({
          goalId: goal._id,
          data: {
            category: values.category,
            discription: values.discription,
            masteryBaseline: Number(values.masteryBaseline),
            criteriaForMastry: {
              masteryPercentage: Number(values.masteryPercentage),
              acrossSession: Number(values.masterySessionCount),
              supportLevel: values.supportLevel,
            },
          },
        }).unwrap().catch((error)=>handleError(error));

       showSuccess("Goal updated successfully");
        onClose();
      } catch (error: any) {
      showError(error?.data?.message || "Failed to update goal");
      }
    },
  });

  const errorText = (field: keyof typeof formik.values) =>
    formik.errors[field] as string | undefined;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
          <DialogDescription>
            Update the goal information below. Changes will be saved to the goal
            bank.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Goal Category */}
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

          {/* Goal Description */}
          <div className="space-y-2">
            <Label htmlFor="discription">Goal Description</Label>
            <Textarea
              id="discription"
              name="discription"
              value={formik.values.discription}
              onChange={formik.handleChange}
              className="min-h-24"
            />
            {errorText("discription") && (
              <p className="text-sm text-red-600">
                {errorText("discription")}
              </p>
            )}
          </div>

          {/* Criteria for Mastery */}
          <div className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0] space-y-4">
            <h4 className="text-[#303630]">Criteria for Mastery</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mastery Percentage</Label>
                <div className="flex items-center gap-2">
                  <Input
                    name="masteryPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formik.values.masteryPercentage}
                    onChange={formik.handleChange}
                    className="h-12"
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
                <Label>Across Sessions</Label>
                <Input
                  name="masterySessionCount"
                  type="number"
                  min="1"
                  value={formik.values.masterySessionCount}
                  onChange={formik.handleChange}
                  className="h-12"
                />
                {errorText("masterySessionCount") && (
                  <p className="text-sm text-red-600">
                    {errorText("masterySessionCount")}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Support Level Required for Mastery</Label>
              <Select
                value={formik.values.supportLevel}
                onValueChange={(v) =>
                  formik.setFieldValue("supportLevel", v )
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SupportLevelOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
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

          {/* Baseline */}
          <div className="space-y-2">
            <Label>Baseline Percentage</Label>
            <div className="flex items-center gap-2">
              <Input
                name="masteryBaseline"
                type="number"
                min="0"
                max="100"
                value={formik.values.masteryBaseline}
                onChange={formik.handleChange}
                className="h-12"
              />
              <span className="text-[#395159]">%</span>
            </div>
            {errorText("masteryBaseline") && (
              <p className="text-sm text-red-600">
                {errorText("masteryBaseline")}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white"
            >
              {isLoading ? "Updating..." : "Update Goal"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-12"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGoalPopup;
