import { useEffect, useState } from "react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Label } from "../../../components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";
import { Input } from "../../../components/Input";

import { Shield, UserCheck, Calendar } from "lucide-react";
import type {  ProfileSectionProps } from "./types";
import { toast } from "react-toastify";
import moment from "moment";
import { useUpdateClientMutation } from "../../../redux/api/provider";
import { handleError } from "../../../utils/helper";
import { ClientProfileTextarea } from "../../../components/SelectBox";
import { ClientProfileFields } from "../../../Constant";


export function ProfileSection({
  providers,
  initialProfile,
  initialQsp,
  initialClinicalSupervisor,
  initialPlanReviewDate,
  clientId
}: ProfileSectionProps) {
  const [clientProfile, setClientProfile] = useState<any>(
    initialProfile || {}
  );
  const [qsp, setQsp] = useState(initialQsp);
  const [clinicalSupervisor, setClinicalSupervisor] = useState(
    initialClinicalSupervisor?._id || ""
  );
  const [planReviewDate, setPlanReviewDate] = useState(
    moment(initialPlanReviewDate).format("YYYY-MM-DD")
  );

  const [updateClient, { isSuccess }] = useUpdateClientMutation();

  const handleUpdateInfo = async () => {
    const profileData = {
      interests: clientProfile.interests || "",
      strengths: clientProfile.strengths || "",
      challenges: clientProfile.challenges || "",
      familyContext: clientProfile.familyContext || "",
      preferredActivities: clientProfile.preferredActivities || "",
      sensoryProcessing: clientProfile.sensoryProcessing || "",
      communication: clientProfile.communication || "",
      safetyConsiderations: clientProfile.safetyConsiderations || "",
    };
    try {
      await updateClient({
        clientId:clientId,
        data: {
          qsp,
          clinicalSupervisor,
          reviewDate: planReviewDate,
          clientProfile:profileData,
        },
      }).unwrap();
      toast.success("Client information updated successfully");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // Optionally, refresh data or show success
      console.log("Client updated successfully");
    }
  }, [isSuccess]);

  return (
    <div className="space-y-6">
      {/* Administrative Information */}
      <Card className="p-6 bg-white border-2 border-[#395159]">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-[#395159]" />
            <h3 className="text-[#303630]">Administrative Information</h3>
          </div>
          <p className="text-[#395159]">
            Required information for treatment plan management and supervision
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="qsp">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#395159]" />
                  Qualified Supervising Professional (QSP) *
                </div>
              </Label>
              <Select value={qsp} onValueChange={setQsp}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select QSP" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider:any) => (
                    <SelectItem key={provider._id} value={provider._id}>
                      {provider.name} - {provider.credential}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicalSupervisor">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#395159]" />
                  Clinical Supervisor *
                </div>
              </Label>
              <Select
                value={clinicalSupervisor}
                onValueChange={setClinicalSupervisor}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select Clinical Supervisor" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider:any) => (
                    <SelectItem key={provider._id} value={provider._id}>
                      {provider.name} - {provider.credential}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
            <Label htmlFor="planReviewDate">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#395159]" />
                Individual Treatment Plan Review Date *
              </div>
            </Label>
            <Input
              id="planReviewDate"
              type="date"
              value={planReviewDate}
              onChange={(e) => setPlanReviewDate(e.target.value)}
              className="h-12 bg-white"
            />
          </div>

          <Button
            className="bg-[#395159] hover:bg-[#303630] text-white h-12"
            type="button"
            onClick={handleUpdateInfo}
          >
            Save Administrative Information
          </Button>
        </div>
      </Card>

      {/* Client Profile Information */}
      <Card className="p-6 bg-white">
        <div className="mb-6">
          <h3 className="text-[#303630] mb-2">
            Client Profile for AI Note Generation
          </h3>
          <p className="text-[#395159]">
            This information will be used by the AI to create personalized
            session notes.
          </p>
        </div>

        <div className="space-y-6">
          {ClientProfileFields.map((field:any) => (
            <ClientProfileTextarea
              key={field.id}
              field={field}
              value={clientProfile?.[field.key] || ""}
              onChange={(val:any) =>
                setClientProfile({ ...clientProfile, [field.key]: val })
              }
            />
          ))}

          <Button
            className="bg-[#395159] hover:bg-[#303630] text-white h-12"
            type="button"
            onClick={handleUpdateInfo}
          >
            Save Profile
          </Button>
        </div>
      </Card>
    </div>
  );
}
