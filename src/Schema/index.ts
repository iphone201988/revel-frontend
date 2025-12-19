import * as Yup from 'yup'
export const goalSchema = Yup.object({
  category: Yup.string().trim().required("Goal category is required"),
  discription: Yup.string().trim().required("Goal description is required"),
  masteryPercentage: Yup.number()
    .min(0)
    .max(100)
    .required("Mastery % required"),
  masterySessionCount: Yup.number().min(1).required("Session count required"),
  supportLevel: Yup.string().required("Support level required"),
  masteryBaseline: Yup.number().min(0).max(100).required("Baseline required"),
});
export const clientSchema = Yup.object({
  name: Yup.string().trim().required("Client name is required"),
  dob: Yup.string().trim().required("Date of birth is required"),
  diagnosis: Yup.string().trim().required("Diagonis is required"),
  parentName: Yup.string().trim().required("Parent Name is required"),
  email: Yup.string().trim().email("Enter a valid email").required(),
  phone: Yup.string().trim().required('Phone Number is required'),
  countryCode: Yup.string().trim().required(),
  assignedProvider: Yup.array()
    .of(Yup.string())
    .min(1, "Assign at least one provider"),
  qsp: Yup.string().trim().optional(),
  clinicalSupervisor: Yup.string().trim().optional(),
  reviewDate: Yup.string().trim().required("Review date is required"),
});

export const addProviderSchema =   Yup.object({
      name: Yup.string().required("Provider name is required"),
      credential: Yup.string().required("credential is required"),
      clinicRole: Yup.string().required("Clinic role is required"),
      systemRole: Yup.string().required("System role is required"),
      email: Yup.string().email().required("Email is required"),
      phone: Yup.string().nullable()
    })

    // schemas/editClientSchema.ts


export const editClientSchema = Yup.object({
  name: Yup.string().required("Client name is required"),
  dob: Yup.string().required("Date of birth is required"),
  diagnosis: Yup.string().required("Diagnosis is required"),
  parentName: Yup.string().required("Parent/Guardian name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  reviewDate: Yup.string().required("Review date is required"),
});
