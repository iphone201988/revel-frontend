import * as Yup from "yup";
import { isAtLeast16YearsOld } from "../utils/helper";
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
  dob: Yup.string()
    .required("Date of birth is required")
    .test("min-age", "Client must be at least 16 years old", (value) =>
      isAtLeast16YearsOld(value)
    ),
  diagnosis: Yup.string().trim().required("Diagonis is required"),
  parentName: Yup.string().trim().required("Parent Name is required"),
  email: Yup.string().trim().email("Enter a valid email").required(),
  phone: Yup.string().trim().required("Phone Number is required"),
  countryCode: Yup.string().trim().required(),
  assignedProvider: Yup.array()
    .of(Yup.string())
    .min(1, "Assign at least one provider"),
  qsp: Yup.string().trim().optional(),
  clinicalSupervisor: Yup.string().trim().optional(),
  reviewDate: Yup.string().trim().required("Review date is required"),
});

export const addProviderSchema = Yup.object({
  name: Yup.string().required("Provider name is required"),
  credential: Yup.string().required("credential is required"),
  clinicRole: Yup.string().required("Clinic role is required"),
  systemRole: Yup.string().required("System role is required"),
  email: Yup.string().email().required("Email is required"),
  phone: Yup.string().nullable(),
});

// schemas/editClientSchema.ts

export const editClientSchema = Yup.object({
  name: Yup.string().trim().required("Client name is required"),
  dob: Yup.string().trim().required("Date of birth is required"),
  diagnosis: Yup.string().trim().required("Diagnosis is required"),
  parentName: Yup.string().trim().required("Parent/Guardian name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  phone: Yup.string().trim().required("Phone number is required"),
  reviewDate: Yup.string().trim().required("Review date is required"),
});

export const stepSchemas = [
  Yup.object({
    clinicName: Yup.string().min(2).required("Clinic name is required"),
    ownerFirstName: Yup.string().min(2).required("First name is required"),
    ownerLastName: Yup.string().min(2).required("Last name is required"),
    email: Yup.string().email().required("Email is required"),
  }),

  Yup.object({
    phone: Yup.string().required("Phone is required"),
    clinicAddress: Yup.string().min(5).required("Address is required"),
    clinicCity: Yup.string().required("City is required"),
    clinicState: Yup.string().required("State is required"),
    clinicZip: Yup.string()
      .matches(/^[0-9]{5,6}$/, "Invalid ZIP")
      .required("ZIP is required"),
  }),

  Yup.object({
    password: Yup.string().min(8).required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm password is required"),
  }),
];

export const providerSchema = Yup.object({
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
