import React, { useState, useEffect } from "react";
import { AppHeader } from "../../../../../components/AppHeader";
import { ArrowLeft, Shield, Save, User, Lock } from "lucide-react";
import { Button } from "../../../../../components/Button";
import { Card } from "../../../../../components/Card";
import { Label } from "../../../../../components/Label";
import { Switch } from "../../../../../components/Switch";
// import { Screen } from '../types/navigation';
import { toast } from "react-toastify";
import { Badge } from "../../../../../components/Badge";
import { Alert, AlertDescription } from "../../../../../components/Alert";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useUpdateProviderPermissionsMutation,
  useViewPermissionsQuery,
} from "../../../../../redux/api/provider";
import {
  handleError,
  mapPermissionsToBooleans,
  PERMISSION_MAP,
  permissionCategories,
} from "../../../../../utils/helper";



import type { ProviderPermissions } from "../../../../../Types/types";


export function ProviderPermissionsScreen() {
  const location = useLocation();

  const [providerData, setProviderData] = useState<ProviderPermissions | null>(
    null
  );
  const provider = location.state.provider;

  

  const { data } = useViewPermissionsQuery(provider._id, {
    skip: !provider?._id,
  });

  useEffect(() => {
    if (data?.data) {
      setProviderData({
        ...provider,
        permissions: mapPermissionsToBooleans(data.data),
      });
    }
  }, [data]);

  const navigate = useNavigate();

  const handlePermissionToggle = (
    permissionKey: keyof ProviderPermissions["permissions"]
  ) => {
    if (!providerData) return;
    if (providerData.systemRole === "Super Admin") return;

    setProviderData((prev) =>
      prev
        ? {
            ...prev,
            permissions: {
              ...prev.permissions,
              [permissionKey]: !prev.permissions[permissionKey],
            },
          }
        : prev
    );
  };

  const mapBooleansToPermissionsArray = (
    permissions: ProviderPermissions["permissions"]
  ) => {
    return Object.entries(permissions)
      .filter(([_, value]) => value)
      .map(([key]) => PERMISSION_MAP[key as keyof typeof PERMISSION_MAP]);
  };
  const [updatePermissions] = useUpdateProviderPermissionsMutation();

  const handleSavePermissions = async () => {
    if (!providerData) return;

    if (providerData.systemRole === "Super Admin") {
      toast.error("Super Admin permissions cannot be modified");
      return;
    }

    const permissionsArray = mapBooleansToPermissionsArray(
      providerData.permissions
    );

    try {
      await updatePermissions({
        providerId: providerData._id,
        permissions: permissionsArray,
      }).unwrap().catch((error)=> handleError(error));

      
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update permissions");
    }
  };

  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader onLogout={() => {}} />

      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate("/permissions")}
            variant="outline"
            className="border-[#395159] text-[#395159]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Permissions
          </Button>

          <Button
            onClick={handleSavePermissions}
            className="bg-[#395159] hover:bg-[#303630] text-white"
            disabled={provider.systemRole === "1"}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="mb-6 p-4 bg-white border-l-4 border-[#395159] rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#395159] mt-0.5" />
            <div>
              <h3 className="text-[#303630] mb-1">Super Admin Access Only</h3>
              <p className="text-[#395159] text-sm">
                Configure what this provider can do within the system. Changes
                take effect immediately upon saving.
              </p>
            </div>
          </div>
        </div>

        {provider.systemRole === "Super Admin" && (
          <Alert className="mb-6 border-[#395159] bg-[#395159]/5">
            <Lock className="h-4 w-4 text-[#395159]" />
            <AlertDescription className="text-[#303630]">
              <strong>Super Admin Permissions Locked:</strong> Super Admins
              automatically have all permissions enabled. To modify permissions,
              first change this provider's role to Admin or User in the Provider
              Edit screen.
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-6 bg-white mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#395159] flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-[#303630] mb-2">{provider.name}</h2>
              <div className="flex gap-4 text-sm text-[#395159] mb-3">
                <span>{provider.credential}</span>
                <span>• {provider.clinicRole}</span>
              </div>
              <Badge
                className={
                  provider.systemRole === "Super Admin"
                    ? "bg-[#395159] text-white"
                    : provider.systemRole === "Admin"
                    ? "bg-[#303630] text-white"
                    : "bg-[#ccc9c0] text-[#303630]"
                }
              >
                {provider.systemRole}
              </Badge>
            </div>
          </div>
        </Card>

        <h2 className="text-[#303630] mb-6">Permissions</h2>

        <div className="space-y-6">
          {permissionCategories.map((category) => (
            <Card key={category.category} className="p-6 bg-white">
              <h3 className="text-[#303630] mb-4">{category.category}</h3>
              <div className="space-y-4">
                {category.permissions.map((permission) => (
                  <div
                    key={permission.key}
                    className="flex items-start justify-between p-4 bg-[#efefef] rounded-lg"
                  >
                    <div className="flex-1">
                      <Label
                        htmlFor={`${provider.id}-${permission.key}`}
                        className="text-[#303630] cursor-pointer"
                      >
                        {permission.label}
                      </Label>
                      <p className="text-sm text-[#395159] mt-1">
                        {permission.description}
                      </p>
                    </div>
                    <Switch
                      id={`${provider._id}-${permission.key}`}
                     checked={providerData?.permissions[permission.key] ?? false}
                      onCheckedChange={() =>
                        handlePermissionToggle(permission.key)
                      }
                      className="data-[state=checked]:bg-[#395159]"
                      disabled={provider.systemRole === "1"}
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSavePermissions}
            className="bg-[#395159] hover:bg-[#303630] text-white h-12 px-8"
            disabled={provider.systemRole === "1"}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
