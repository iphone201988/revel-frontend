import { useEffect, useState } from "react";
import { AppHeader } from "../../../components/AppHeader";
import {
  ArrowLeft,
  Play,
  Clock,
  Users as UsersIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { Textarea } from "../../../components/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";
import { RadioGroup, RadioGroupItem } from "../../../components/Radio-group";
import { useLocation, useNavigate } from "react-router-dom";
import { useStartSessionMutation } from "../../../redux/api/provider";
import { handleError } from "../../../utils/helper";
import { SessionType } from "../../../utils/enums/enum";
import { useFormik } from "formik";
import { showSuccess } from "../../../components/CustomToast";

export function SessionInitiationScreen() {
  const navigate = useNavigate();
  const combineDateAndTime = (date: string, time: string) => {
    return new Date(`${date}T${time}:00`).toISOString();
  };

  const [startSession, { data, isSuccess }] = useStartSessionMutation();

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const location = useLocation();

  const clients = location?.state?.clients;
  const client = location?.state?.client;
  const currentUser = location?.state?.currentUser;

  // Pre-populate from sessionInitData if coming from calendar, otherwise use defaults
  const sessionInitData = data?.data;
  const [sessionType, setSessionType] = useState(
    SessionType?.Progress_Monitoring
  );

  useEffect(() => {
    if (isSuccess) {
      showSuccess("Session Started");
      navigate("/session-data-collection", {
        state: { sessionInitData: data?.data },
      });
    }
  }, [data]);

  const formik = useFormik({
    initialValues: {
      selectedClient: sessionInitData?.clientId || "",
      sessionType: SessionType.Progress_Monitoring,
      sessionDate: sessionInitData?.sessionDate || getTodayDate(),
      startTime: sessionInitData?.startTime || "",
      endTime: sessionInitData?.endTime || "",
      attendees: "",
      clientVariables: "",
    },

    validate: (values) => {
      const errors: any = {};

      if (!values.selectedClient) errors.selectedClient = "Client is required";
      if (!values.sessionDate) errors.sessionDate = "Session date is required";
      if (!values.startTime) errors.startTime = "Start time is required";
      if (!values.endTime) errors.endTime = "End time is required";

      if (
        values.startTime &&
        values.endTime &&
        values.endTime <= values.startTime
      ) {
        errors.endTime = "End time must be after start time";
      }

      return errors;
    },

    onSubmit: (values) => {
      const sessionData = {
        clientId: values.selectedClient,
        sessionType: values.sessionType,
        dateOfSession: values.sessionDate,
        startTime: combineDateAndTime(values.sessionDate, values.startTime),
        endTime: combineDateAndTime(values.sessionDate, values.endTime),
        present: values.attendees || undefined,
        clientVariables: values.clientVariables || undefined,
      };

      startSession(sessionData).unwrap().catch(handleError);
    },
  });

  return (
    <div className="min-h-screen bg-[#efefef]">
      <AppHeader />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-6 border-[#395159] text-[#395159]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="p-8 bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#395159] rounded-lg">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-[#303630]">Start New Session</h2>
              <p className="text-[#395159]">
                Set up session details before data collection
              </p>
            </div>
          </div>

          {sessionInitData && (
            <div className="mb-6 p-4 bg-[#efefef] rounded-lg border border-[#395159]">
              <p className="text-sm text-[#395159]">
                <strong>Pre-populated from Calendar:</strong> Session details
                have been auto-filled from your scheduled appointment. You can
                still edit any field as needed.
              </p>
            </div>
          )}

          <form onSubmit={formik?.handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="client">Select Client *</Label>
              <Select
                value={formik.values.selectedClient}
                onValueChange={(val) =>
                  formik.setFieldValue("selectedClient", val)
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose a client" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(clients) && clients.length > 0 ? (
                    clients.map((c: any) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name} (Age {c.age})
                      </SelectItem>
                    ))
                  ) : client ? (
                    <SelectItem key={client._id} value={client._id}>
                      {client.name} (Age {client.age})
                    </SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
              {formik.touched.selectedClient &&
                typeof formik.errors.selectedClient === "string" && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.selectedClient}
                  </p>
                )}
            </div>

            <div className="space-y-2 p-5 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
              <Label>Session Provider</Label>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-[#303630]">{currentUser?.name}</p>
                <p className="text-sm text-[#395159] mt-1">
                  {currentUser?.credential} • {currentUser?.clinicRole}
                </p>
              </div>
              <p className="text-sm text-[#395159]">
                Automatically assigned based on your login
              </p>
            </div>

            <div className="space-y-3 p-5 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
              <Label>Session Type *</Label>
              <RadioGroup value={sessionType} onValueChange={setSessionType}>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-[#ccc9c0]">
                  <RadioGroupItem
                    value={SessionType?.Progress_Monitoring}
                    id="progress"
                  />
                  <label htmlFor="progress" className="flex-1 cursor-pointer">
                    <p className="text-[#303630]">Progress Monitoring</p>
                    <p className="text-sm text-[#395159]">
                      Regular session to track ongoing progress toward ITP goals
                    </p>
                  </label>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-[#ccc9c0]">
                  <RadioGroupItem
                    value={SessionType?.Baseline_Data_Collection}
                    id="baseline"
                  />
                  <label htmlFor="baseline" className="flex-1 cursor-pointer">
                    <p className="text-[#303630]">Baseline Data Collection</p>
                    <p className="text-sm text-[#395159]">
                      Initial assessment to establish baseline performance
                      levels
                    </p>
                  </label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionDate">Date of Session *</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#395159]" />
                <Input
                  type="date"
                  name="sessionDate"
                  value={formik.values.sessionDate}
                  onChange={formik.handleChange}
                  className="h-12 pl-10"
                />
                {formik.touched.sessionDate &&
                  typeof formik.errors.sessionDate === "string" && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.sessionDate}
                    </p>
                  )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#395159]" />
                  <Input
                    type="time"
                    name="startTime"
                    value={formik.values.startTime}
                    onChange={formik.handleChange}
                    className="h-12 pl-10"
                  />
                  {formik.touched.startTime &&
                    typeof formik.errors.startTime === "string" && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.startTime}
                      </p>
                    )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Scheduled End Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#395159]" />
                  <Input
                    type="time"
                    name="endTime"
                    value={formik.values.endTime}
                    onChange={formik.handleChange}
                    className="h-12 pl-10"
                  />
                  {formik.touched.endTime &&
                    typeof formik.errors.endTime === "string" && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.endTime}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendees">Who is present in this session?</Label>
              <div className="relative">
                <UsersIcon className="absolute left-3 top-3 w-5 h-5 text-[#395159]" />
                <Input
                  type="text"
                  name="attendees"
                  style={{ paddingLeft: "35px" }}
                  value={formik.values.attendees}
                  onChange={formik.handleChange}
                  placeholder="e.g.  Therapist, Parent, Sibling"
                />
              </div>
              <p className="text-sm text-[#395159]">
                List all individuals present during this session
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientVariables">Client Variables</Label>
              <Textarea
                name="clientVariables"
                value={formik.values.clientVariables}
                placeholder="Note any relevant variables: sleep quality, medication changes, recent events, mood observations, etc."
                className="min-h-32"
                onChange={formik.handleChange}
              />

              <p className="text-sm text-[#395159]">
                This information helps contextualize today's session data and
                will be included in the AI-generated note.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 h-14 bg-[#395159] hover:bg-[#303630] text-white"
              >
                <Play className="w-5 h-5 mr-2" />
                Begin Data Collection
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="h-14 border-[#395159] text-[#395159]"
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
