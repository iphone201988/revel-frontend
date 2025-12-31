import { useEffect } from "react";
import { AppHeader } from "../../../../../components/AppHeader";
import {
  ArrowLeft,
  User,
  // Lock,
  // Shield,
  // Key,
  // RefreshCw,
  // Trash2,
} from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  // TabsList,
  // TabsTrigger,
} from "../../../../../components/Tabs";
// import { Switch } from "../../../../../components/Switch";
import { Badge } from "../../../../../components/Badge";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "../../../../../components/AlertDailog";

import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SystemRoles } from "../../../../../utils/enums/enum";
import { useUpdateProviderMutation } from "../../../../../redux/api/provider";
import { handleError } from "../../../../../utils/helper";
import { addProviderSchema } from "../../../../../Schema";
import { showSuccess } from "../../../../../components/CustomToast";

export function ProviderEditScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location?.state?.provider;
  console.log(provider);

  const [updateProvider, { data, isSuccess }] = useUpdateProviderMutation();

  // -----------------------------
  // FORM VALIDATION
  // -----------------------------
  const formik = useFormik({
    initialValues: {
      // backend-mapped values
      name: provider?.name || "",
      clinicRole: provider?.clinicRole || "",
      systemRole: provider?.systemRole || "",
      email: provider?.email || "",
      phone: provider?.phone || "",

      // fields that were in your UI but NOT in backend
      credential: provider?.credential || "",
      // supervisor: provider?.supervisor || "",
      licenseNumber: provider?.licenseNumber || "",
    },

    validationSchema: addProviderSchema,

    onSubmit: (values) => {
      updateProvider({
        providerId: provider?._id,
        body: values,
      })
        .unwrap()
        .catch((error) => handleError(error));
    },
  });

  useEffect(() => {
    if (isSuccess) {
      showSuccess("Provider updated successfully!");
      navigate("/admin");
    }
  }, [data]);

  // -----------------------------
  // PASSWORD FORM
  // -----------------------------
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      currentPassword: Yup.string().required(),
      newPassword: Yup.string().min(8).required(),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords do not match")
        .required(),
    }),

    onSubmit: () => {
      showSuccess("Password updated successfully");
      passwordFormik.resetForm();
    },
  });

  // -----------------------------
  // 2FA STATE
  // -----------------------------
  // const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(true);
  // const [backupCodesGenerated, setBackupCodesGenerated] = React.useState(true);
  // console.log(backupCodesGenerated);

  // const handleToggle2FA = () => {
  //   setTwoFactorEnabled(!twoFactorEnabled);
  //  showSuccess(twoFactorEnabled ? "2FA Disabled" : "2FA Enabled");
  // };

  // const handleGenerateBackupCodes = () => {
  //   setBackupCodesGenerated(true);
  //  showSuccess("Backup codes generated");
  // };

  // const handleReset2FA = () => {
  //   setTwoFactorEnabled(false);
  //   setBackupCodesGenerated(false);
  //  showSuccess("2FA device reset");
  // };

  // LEVEL SUPERVISOR LOGIC
  // const needsSupervisor =
  //   formik.values.clinicRole.toLowerCase().includes("level 1") ||
  //   formik.values.clinicRole.toLowerCase().includes("level 2");

  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <Button
          onClick={() => navigate("/admin")}
          variant="outline"
          className="mb-6 border-[#395159] text-[#395159]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#395159] rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-[#303630]">Edit Provider</h2>
              <p className="text-[#395159]">{formik.values.name}</p>
            </div>
          </div>
          <Badge className="bg-[#395159] text-white px-4 py-2">
            {formik.values.systemRole === "1"
              ? "Super Admin"
              : formik.values.systemRole === "2"
              ? "Admin"
              : "User"}
          </Badge>
        </div>

        <Tabs defaultValue="information" className="w-full">
          {/* <TabsList className="mb-6 bg-white border border-[#ccc9c0]">
            <TabsTrigger
              value="information"
              className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Provider Information
            </TabsTrigger> */}

            {/* <TabsTrigger
              value="password"
              className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              Password
            </TabsTrigger>

            <TabsTrigger
              value="2fa"
              className="data-[state=active]:bg-[#395159] data-[state=active]:text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              Two-Factor Auth
            </TabsTrigger> */}
          {/* </TabsList> */}

          {/* ---------------------- */}
          {/* PROVIDER INFORMATION */}
          {/* ---------------------- */}

          <TabsContent value="information">
            <Card className="p-8 bg-white">
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* NAME + credential */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Provider Name *</Label>
                    <Input
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>credential *</Label>
                    <Input
                      name="credential"
                      value={formik.values.credential}
                      onChange={formik.handleChange}
                      className="h-12"
                    />
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
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>System Role *</Label>
                    <Select
                      value={formik.values.systemRole.toString()}
                      onValueChange={(v) =>
                        formik.setFieldValue("systemRole", Number(v))
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select System Role" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="1">{SystemRoles[1]}</SelectItem>
                        <SelectItem value="2">{SystemRoles[2]}</SelectItem>
                        <SelectItem value="3">{SystemRoles[3]}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* SUPERVISOR only if Level */}
                {/* {needsSupervisor && (
                  <div className="space-y-2 p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
                    <Label>Clinical Supervisor *</Label>
                    <Select
                      value={formik.values.supervisor}
                      onValueChange={(v) =>
                        formik.setFieldValue("supervisor", v)
                      }
                    >
                      <SelectTrigger className="h-12 bg-white">
                        <SelectValue placeholder="Select supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emily-anderson">
                          Dr. Emily Anderson
                        </SelectItem>
                        <SelectItem value="james-rodriguez">
                          James Rodriguez
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
                      type="email"
                      name="email"
                       disabled
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      className="h-12"
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

                {/* SAVE BUTTONS */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-[#395159] text-white"
                  >
                    Save Changes
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
          </TabsContent>

          {/* ---------------------- */}
          {/* PASSWORD CHANGE */}
          {/* ---------------------- */}
          {/* <TabsContent value="password">
            <Card className="p-8 bg-white">
              <form
                onSubmit={passwordFormik.handleSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label>Current Password *</Label>
                  <Input
                    type="password"
                    name="currentPassword"
                    value={passwordFormik.values.currentPassword}
                    onChange={passwordFormik.handleChange}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label>New Password *</Label>
                  <Input
                    type="password"
                    name="newPassword"
                    value={passwordFormik.values.newPassword}
                    onChange={passwordFormik.handleChange}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password *</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={passwordFormik.values.confirmPassword}
                    onChange={passwordFormik.handleChange}
                    className="h-12"
                  />
                </div>

                <Button
                  type="submit"
                  className="h-12 bg-[#395159] text-white flex-1"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </form>
            </Card>
          </TabsContent> */}

          {/* ---------------------- */}
          {/* 2FA TAB */}
          {/* ---------------------- */}
          {/* <TabsContent value="2fa">
            <Card className="p-8 bg-white">
              <div className="space-y-6">
              
                <div className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0] flex justify-between">
                  <div>
                    <h4 className="text-[#303630] mb-1">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-[#395159]">
                      {twoFactorEnabled
                        ? "2FA is enabled"
                        : "Enable 2FA for extra security"}
                    </p>
                  </div>

                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={handleToggle2FA}
                    className="data-[state=checked]:bg-[#395159]"
                  />
                </div>

               
                {twoFactorEnabled && (
                  <div className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0] flex justify-between">
                    <div>
                      <h4 className="text-[#303630] mb-1">Backup Codes</h4>
                      <p className="text-sm text-[#395159]">
                        Use backup codes when 2FA device is unavailable.
                      </p>
                    </div>
                    <Button
                      onClick={handleGenerateBackupCodes}
                      variant="outline"
                      className="border-[#395159] text-[#395159]"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Generate Codes
                    </Button>
                  </div>
                )}

              
                {twoFactorEnabled && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex justify-between">
                    <div>
                      <h4 className="text-red-800 mb-1">Reset 2FA Device</h4>
                      <p className="text-sm text-red-600">
                        This will require user to set up 2FA again.
                      </p>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-red-500 text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Reset Device
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset 2FA Device?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleReset2FA}>
                            Reset
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}
