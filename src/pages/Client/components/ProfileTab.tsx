import { toast } from "react-toastify";
import { Button } from "../../../components/Button";
import { Textarea } from "../../../components/Textarea";
import { Label } from "../../../components/Label";
import { AlertTriangle, Calendar, Shield, UserCheck } from "lucide-react";
import { Card } from "../../../components/Card";
import { Input } from "../../../components/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/Select";
import { TabsContent } from "../../../components/Tabs";
import { useGetAllClientsQuery } from "../../../redux/api/provider";




const Profile = () => {
  const {data} = useGetAllClientsQuery();
  console.log(data);
  
  return (
    
      <TabsContent value="profile">
            <div className="space-y-6">
              {/* Administrative Information Section */}
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
                          {providersList.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name} - {provider.credential}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-[#395159]">
                        Primary professional responsible for treatment plan oversight
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clinicalSupervisor">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[#395159]" />
                          Clinical Supervisor *
                        </div>
                      </Label>
                      <Select value={clinicalSupervisor} onValueChange={setClinicalSupervisor}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Clinical Supervisor" />
                        </SelectTrigger>
                        <SelectContent>
                          {providersList.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name} - {provider.credential}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-[#395159]">
                        Can be the same as QSP or a different provider
                      </p>
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
                    <p className="text-sm text-[#395159]">
                      Review date for entire treatment plan. Alerts will appear 60 and 30 days before this date.
                    </p>
                  </div>

                  <Button 
                    className="bg-[#395159] hover:bg-[#303630] text-white h-12"
                    onClick={() => toast.success('Administrative information updated successfully')}
                  >
                    Save Administrative Information
                  </Button>
                </div>
              </Card>

              {/* Client Profile Section */}
              <Card className="p-6 bg-white">
                <div className="mb-6">
                  <h3 className="text-[#303630] mb-2">Client Profile for AI Note Generation</h3>
                  <p className="text-[#395159]">
                    This information will be used by the AI to create personalized, context-aware session notes.
                  </p>
                </div>

                <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="interests">Child's Interests & Preferences</Label>
                  <Textarea
                    id="interests"
                    value={clientProfile.interests}
                    onChange={(e) => setClientProfile({ ...clientProfile, interests: e.target.value })}
                    className="min-h-20"
                    placeholder="What does the child enjoy? Favorite toys, activities, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strengths">Strengths & Learning Style</Label>
                  <Textarea
                    id="strengths"
                    value={clientProfile.strengths}
                    onChange={(e) => setClientProfile({ ...clientProfile, strengths: e.target.value })}
                    className="min-h-20"
                    placeholder="What are the child's strengths? How do they learn best?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenges">Areas of Challenge</Label>
                  <Textarea
                    id="challenges"
                    value={clientProfile.challenges}
                    onChange={(e) => setClientProfile({ ...clientProfile, challenges: e.target.value })}
                    className="min-h-20"
                    placeholder="What challenges does the child face? Sensory sensitivities, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="familyContext">Family Context</Label>
                  <Textarea
                    id="familyContext"
                    value={clientProfile.familyContext}
                    onChange={(e) => setClientProfile({ ...clientProfile, familyContext: e.target.value })}
                    className="min-h-20"
                    placeholder="Relevant family information, siblings, home environment, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredActivities">Preferred Activities for Engagement</Label>
                  <Textarea
                    id="preferredActivities"
                    value={clientProfile.preferredActivities}
                    onChange={(e) => setClientProfile({ ...clientProfile, preferredActivities: e.target.value })}
                    className="min-h-20"
                    placeholder="Activities that help engage this child during sessions"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sensoryProcessing">Sensory Processing</Label>
                  <Textarea
                    id="sensoryProcessing"
                    value={clientProfile.sensoryProcessing}
                    onChange={(e) => setClientProfile({ ...clientProfile, sensoryProcessing: e.target.value })}
                    className="min-h-20"
                    placeholder="Sensory preferences, sensitivities, seeking behaviors, regulation strategies"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="communication">Communication</Label>
                  <Textarea
                    id="communication"
                    value={clientProfile.communication}
                    onChange={(e) => setClientProfile({ ...clientProfile, communication: e.target.value })}
                    className="min-h-20"
                    placeholder="Current communication level, expressive/receptive language, AAC use, communication style"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="safetyConsiderations" className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Safety Considerations
                  </Label>
                  <Textarea
                    id="safetyConsiderations"
                    value={clientProfile.safetyConsiderations || ''}
                    onChange={(e) => setClientProfile({ ...clientProfile, safetyConsiderations: e.target.value })}
                    className="min-h-24 border-amber-200 focus:border-amber-400"
                    placeholder="Document any safety concerns, allergies, elopement risks, medical needs, behavioral safety considerations, environmental modifications needed, etc."
                  />
                  <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
                    <strong>Important:</strong> Document any safety-related information that providers should be aware of when working with this client, including allergies, elopement risks, medical conditions, sensory triggers that may lead to unsafe behaviors, or required environmental modifications.
                  </p>
                </div>

                <Button 
                  className="bg-[#395159] hover:bg-[#303630] text-white h-12"
                  onClick={() => toast.success('Client profile updated successfully')}
                >
                  Save Profile
                </Button>
              </div>
            </Card>
            </div>
          </TabsContent>
   
  )
}

export default Profile

  