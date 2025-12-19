import React, { useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../components/Dailog";
import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import { Label } from "../../../../components/Label";
import { useUpdateClientMutation } from "../../../../redux/api/provider";
import { editClientSchema } from "../../../../Schema";


interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: any;
}

const EditClientDialog: React.FC<EditClientDialogProps> = ({
  open,
  onOpenChange,
  client,
}) => {
  const [updateClient, { isLoading }] =
    useUpdateClientMutation();

  const formik = useFormik({
    enableReinitialize: true, // 👈 IMPORTANT for edit
    initialValues: {
      name: client?.name || "",
      dob: client?.dob?.slice(0, 10) || "",
      diagnosis: client?.diagnosis || "",
      parentName: client?.parentName || "",
      email: client?.email || "",
      phone: client?.phone || "",
      reviewDate: client?.reviewDate?.slice(0, 10) || "",
    },
    validationSchema: editClientSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
        console.log(values,"valieudjhaskdfalksdjflkasjdflkjaslkdfjalkjsdfkas");
        
      try {
        await updateClient({
          clientId: client._id,
          data:values,
        }).unwrap();

        toast.success("Client updated successfully");
        onOpenChange(false);
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to update client");
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  const errorText = (field: keyof typeof formik.values) =>
    formik.errors[field] as string | undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#303630]">
            Edit Client Information
          </DialogTitle>
          <DialogDescription>
            Update the client information below. Changes will be saved to the
            system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Client Name */}
          <div className="space-y-1">
            <Label>Client Name</Label>
            <Input
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            {errorText("name") && (
              <p className="text-sm text-red-600">{errorText("name")}</p>
            )}
          </div>

          {/* DOB */}
          <div className="space-y-1">
            <Label>Date of Birth</Label>
            <Input
              type="date"
              name="dob"
              value={formik.values.dob}
              onChange={formik.handleChange}
            />
            {errorText("dob") && (
              <p className="text-sm text-red-600">{errorText("dob")}</p>
            )}
          </div>

          {/* Diagnosis */}
          <div className="space-y-1">
            <Label>Diagnosis</Label>
            <Input
              name="diagnosis"
              value={formik.values.diagnosis}
              onChange={formik.handleChange}
            />
            {errorText("diagnosis") && (
              <p className="text-sm text-red-600">
                {errorText("diagnosis")}
              </p>
            )}
          </div>

          {/* Parent */}
          <div className="space-y-1">
            <Label>Parent / Guardian Name</Label>
            <Input
              name="parentName"
              value={formik.values.parentName}
              onChange={formik.handleChange}
            />
            {errorText("parentName") && (
              <p className="text-sm text-red-600">
                {errorText("parentName")}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label>Contact Email</Label>
            <Input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {errorText("email") && (
              <p className="text-sm text-red-600">{errorText("email")}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label>Contact Phone</Label>
            <Input
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
            />
            {errorText("phone") && (
              <p className="text-sm text-red-600">{errorText("phone")}</p>
            )}
          </div>

          {/* Review Date */}
          <div className="space-y-1">
            <Label>Plan Review Date</Label>
            <Input
              type="date"
              name="reviewDate"
              value={formik.values.reviewDate}
              onChange={formik.handleChange}
            />
            {errorText("reviewDate") && (
              <p className="text-sm text-red-600">
                {errorText("reviewDate")}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#395159] hover:bg-[#303630] text-white"
            >
              {isLoading ? "Updating..." : "Update Client"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;
