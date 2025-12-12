import  { useEffect } from "react";
import { AppHeader } from "../../../../../components/AppHeader";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Button } from "../../../../../components/Button";
import { Card } from "../../../../../components/Card";
import { Input } from "../../../../../components/Input";
import { Label } from "../../../../../components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/Select";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneInput, { type CountryData } from "react-phone-input-2";
import { useAddProviderMutation } from "../../../../../redux/api/provider";

export function ProviderAddScreen() {
  const navigate = useNavigate();

  const [addProvider, {data, isSuccess}] = useAddProviderMutation()

  // -------------------- VALIDATION --------------------
  const providerSchema = Yup.object({
    name: Yup.string().trim().required("Provider name is required"),
    credential: Yup.string().trim().required("Credential is required"),
    clinicRole: Yup.string().trim().required("Clinic role is required"),
    systemRole: Yup.string().trim().required("System role is required"),
    email: Yup.string()
      .trim()
      .email("Enter valid email")
      .required("Email is required"),
    phone: Yup.string().optional(),
    countryCode: Yup.string().optional(),
    licenseNumber: Yup.string().optional(),
   
  });

  // -------------------- FORMIK --------------------
  const formik = useFormik({
    initialValues: {
      name: "",
      credential: "",
      clinicRole: "",
      systemRole: "",
      email: "",
      phone: "",
      countryCode: "",
      licenseNumber: "",
      
    },
    validationSchema: providerSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
    
        addProvider(values)
     
      navigate("/admin");
    },
  });
  useEffect(()=>{
    if (isSuccess) {
      toast.success("Provider added Successfully")
    }
  },[data])

  // const needsSupervisor =
  //   formik.values.clinicRole?.toLowerCase().includes("level 1") ||
  //   formik.values.clinicRole?.toLowerCase().includes("level 2") ||
  //   formik.values.clinicRole?.toLowerCase().includes("level1") ||
  //   formik.values.clinicRole?.toLowerCase().includes("level2");

  const errorText = (field: keyof typeof formik.values) => {
  const error = formik.errors[field];
  return error ? <p className="text-sm text-red-600">{error}</p> : null;
};


  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader     
        onLogout={()=>{}}
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Button
          onClick={() => navigate("/admin")}
          variant="outline"
          className="mb-6 border-[#395159] text-[#395159]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>

        <Card className="p-8 bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#395159] rounded-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-[#303630]">Add New Provider</h2>
              <p className="text-[#395159]">
                Enter provider information and credentials
              </p>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* NAME + CREDENTIAL */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Provider Name *</Label>
                <Input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  placeholder="Enter full name"
                  className="h-12"
                />
                {errorText("name")}
              </div>

              <div className="space-y-2">
                <Label>Credentials *</Label>
                <Input
                  name="credential"
                  value={formik.values.credential}
                  onChange={formik.handleChange}
                  placeholder="PhD, BCBA, MS"
                  className="h-12"
                />
                {errorText("credential")}
              </div>
            </div>

            {/* CLINIC ROLE + SYSTEM ROLE */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Clinic Role *</Label>
                <Input
                  name="clinicRole"
                  value={formik.values.clinicRole}
                  onChange={formik.handleChange}
                  placeholder="e.g., QSP, Level 1, Level 2"
                  className="h-12"
                />
                {errorText("clinicRole")}
              </div>

              <div className="space-y-2">
                <Label>System Role *</Label>
                <Select
                  value={formik.values.systemRole}
                  onValueChange={(v) => formik.setFieldValue("systemRole", v)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select system role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Super Admin</SelectItem>
                    <SelectItem value="2">Admin</SelectItem>
                    <SelectItem value="3">User</SelectItem>
                  </SelectContent>
                </Select>
                {errorText("systemRole")}
              </div>
            </div>

            {/* SUPERVISOR FIELD */}
            {/* {needsSupervisor && (
              <div className="space-y-2 p-4 bg-[#efefef] rounded-lg border">
                <Label>Clinical Supervisor *</Label>
                <Select
                  value={formik.values.supervisor}
                  onValueChange={(v) => formik.setFieldValue("supervisor", v)}
                >
                  <SelectTrigger className="h-12 bg-white">
                    <SelectValue placeholder="Select Clinical Supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supervisor1">
                      Dr. Emily Anderson, PhD
                    </SelectItem>
                    <SelectItem value="supervisor2">
                      James Rodriguez, MSW
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )} */}

            {/* EMAIL + PHONE */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  name="email"
                  type="email"
                  className="h-12"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  placeholder="provider@example.com"
                />
                {errorText("email")}
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <PhoneInput
                  country="in"
                  enableSearch
                  value={`${formik.values.countryCode}${formik.values.phone}`}
                  onChange={(value: string, data: CountryData) => {
                    const dialCode = `+${data?.dialCode}`;
                    const localNumber = value.replace(data?.dialCode, "");

                    formik.setFieldValue("countryCode", dialCode);
                    formik.setFieldValue("phone", localNumber);
                  }}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* LICENSE NUMBER */}
            <div className="space-y-2">
              <Label>License Number</Label>
              <Input
                name="licenseNumber"
                value={formik.values.licenseNumber}
                onChange={formik.handleChange}
                className="h-12"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white"
              >
                Add Provider
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin")}
                className="h-12 border-[#395159] text-[#395159]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
