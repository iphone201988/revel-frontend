import { useEffect, useState } from "react";
import { useFormik } from "formik";

import { ArrowLeft, UserPlus, X, Search, ChevronDown } from "lucide-react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";
import { Badge } from "../../../components/Badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../components/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/PopOver";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/Dailog";
import { toast } from "react-toastify";

import {
  useAddClientMutation,
  useGetAllClientsQuery,
  useGetProvidersQuery,
} from "../../../redux/api/provider";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { clientSchema } from "../../../Schema";
import EditClientDialog from "./EditClient/EditClient";

export function ClientManagement() {
  const [providerSearchOpen, setProviderSearchOpen] = useState(false);
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);

  const [editClientOpen, setEditClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);


  const { data: clients }: any = useGetAllClientsQuery();
  const { data: providers }: any = useGetProvidersQuery();
  const [addClient, { data, isSuccess }] = useAddClientMutation();


  useEffect(() => {
    if (isSuccess) {
      toast.success("Client added successfully.");
    }
  }, [data]);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      dob: "",
      diagnosis: "",
      parentName: "",
      email: "",
      phone: "",
      countryCode: "",
      assignedProvider: [] as string[],
      qsp: "",
      clinicalSupervisor: "",
      reviewDate: "",
    },
    validationSchema: clientSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values, helpers) => {
      addClient(values);
      helpers.resetForm();
      setAddClientDialogOpen(false);
    },
  });

  const addProvider = (providerId: string) => {
    if (!formik.values.assignedProvider.includes(providerId)) {
      formik.setFieldValue("assignedProvider", [
        ...formik.values.assignedProvider,
        providerId,
      ]);
    }
    setProviderSearchOpen(false);
  };

  const removeProvider = (providerId: string) => {
    formik.setFieldValue(
      "assignedProvider",
      formik.values.assignedProvider.filter((id) => id !== providerId)
    );
  };

  const errorText = (field: keyof typeof formik.values) =>
    formik.errors[field] as string | undefined;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="border-[#395159] text-[#395159]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <h2 className="text-[#303630] mb-6">Administration</h2>

      <Card className="p-6 bg-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[#303630] mb-2">Client Management</h3>
            <p className="text-[#395159]">
              Add new clients or manage existing client information
            </p>
          </div>
          <Dialog
            open={addClientDialogOpen}
            onOpenChange={setAddClientDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-[#395159] hover:bg-[#303630] text-white h-12">
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-[#303630]">
                  Add New Client
                </DialogTitle>
                <DialogDescription>
                  Enter the client information below to add a new client to the
                  system.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Client Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter client's full name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />

                  {errorText("name") && (
                    <p className="text-sm text-red-600">{errorText("name")}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formik.values.dob}
                    onChange={formik.handleChange}
                  />

                  {errorText("dob") && (
                    <p className="text-sm text-red-600">{errorText("dob")}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input
                    id="diagnosis"
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

                <div className="space-y-2">
                  <Label htmlFor="parentGuardian">Parent/Guardian Name</Label>
                  <Input
                    id="parentName"
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

                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />

                  {errorText("email") && (
                    <p className="text-sm text-red-600">{errorText("email")}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <PhoneInput
                    country="in"
                    enableSearch
                    value={`${formik.values.countryCode}${formik.values.phone}`}
                    onChange={(value, data) => {
                      if (data && "dialCode" in data) {
                        // <-- type guard
                        const dialCode = `+${data.dialCode}`;

                        // Remove country code from number
                        const localNumber = value.replace(dialCode, "");

                        formik.setFieldValue("countryCode", dialCode);
                        formik.setFieldValue("phone", localNumber);
                      }
                    }}
                    onBlur={() => {
                      formik.setFieldTouched("phone", true);
                      formik.setFieldTouched("countryCode", true);
                    }}
                    placeholder="(555) 123-4567"
                  />
                  {errorText("phone") && (
                    <p className="text-sm text-red-600">{errorText("phone")}</p>
                  )}
                </div>

                <div className="space-y-2 p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0]">
                  <Label>Assign Providers *</Label>
                  <p className="text-sm text-[#395159] mb-3">
                    Search and select providers who will work with this client
                  </p>
                  {errorText("assignedProvider") && (
                    <p className="text-sm text-red-600">
                      {errorText("assignedProvider")}
                    </p>
                  )}

                  <Popover
                    open={providerSearchOpen}
                    onOpenChange={setProviderSearchOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={providerSearchOpen}
                        className="w-full h-12 justify-between bg-white"
                      >
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4 text-[#395159]" />
                          <span className="text-[#395159]">
                            Search providers...
                          </span>
                        </div>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search providers..." />
                        <CommandList>
                          <CommandEmpty>No provider found.</CommandEmpty>
                          <CommandGroup>
                            {providers?.data
                              .filter(
                                (p: any) =>
                                  !formik.values.assignedProvider.includes(
                                    p._id
                                  )
                              )
                              .map((provider: any) => (
                                <CommandItem
                                  key={provider._id}
                                  value={provider.name}
                                  onSelect={() => addProvider(provider._id)}
                                >
                                  <div className="flex flex-col">
                                    <span className="text-[#303630]">
                                      {provider.name}
                                    </span>
                                    <span className="text-sm text-[#395159]">
                                      {provider.credentials}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {formik.values.assignedProvider.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formik.values.assignedProvider.map((providerId) => {
                        const provider = providers?.data?.find(
                          (p: any) => p._id === providerId
                        );
                        return provider ? (
                          <Badge
                            key={providerId}
                            className="bg-[#395159] text-white px-3 py-2 flex items-center gap-2"
                          >
                            <div className="flex flex-col items-start">
                              <span>{provider.name}</span>
                              <span className="text-xs opacity-90">
                                {provider.credentials}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeProvider(providerId)}
                              className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qsp">
                    Qualified Supervising Professional (QSP)
                  </Label>
                  <Select
                    value={formik.values.qsp}
                    onValueChange={(val) => formik.setFieldValue("qsp", val)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select QSP" />
                    </SelectTrigger>

                    <SelectContent>
                      {providers?.data?.map((p: any) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name} {p.credentials}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicalSupervisor">
                    Clinical Supervisor
                  </Label>
                  <Select
                    value={formik.values.clinicalSupervisor}
                    onValueChange={(val) =>
                      formik.setFieldValue("clinicalSupervisor", val)
                    }
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select Clinical Supervisor" />
                    </SelectTrigger>

                    <SelectContent>
                      {providers?.data?.map((p: any) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name} {p.credentials}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewDate">Plan Review Date</Label>
                  <Input
                    id="reviewDate"
                    name="reviewDate"
                    type="date"
                    value={formik.values.reviewDate}
                    onChange={formik.handleChange}
                  />
                  |{" "}
                  {errorText("reviewDate") && (
                    <p className="text-sm text-red-600">
                      {errorText("reviewDate")}
                    </p>
                  )}
                  <p className="text-sm text-[#395159]">
                    ITP review date - alerts will appear at 60 and 30 days
                    before
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#395159] hover:bg-[#303630] text-white"
                >
                  Add Client
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <h3 className="text-[#303630] mb-6">Current Clients</h3>
        <div className="space-y-3">
          {clients?.data.map((client: any, index: number): any => (
            <div
              key={index}
              className="p-4 bg-[#efefef] rounded-lg border border-[#ccc9c0]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#303630]">{client.name}</p>
                  <div className="flex gap-4 mt-1 text-sm text-[#395159]">
                    <span>DOB: {moment(client.dob).format("DD-MM-YYYY")}</span>
                    <span>Dx: {client.diagnosis}</span>
                  </div>
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-white text-[#395159] text-xs rounded border border-[#ccc9c0]">
                      Provider: {client.qsp?.name}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#395159] text-[#395159]"
                  onClick={() => {
                    setSelectedClient(client);
                    setEditClientOpen(true);
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {selectedClient && (
  <EditClientDialog
    open={editClientOpen}
    onOpenChange={setEditClientOpen}
    client={selectedClient}
  />
)}
    </>
  );
}
