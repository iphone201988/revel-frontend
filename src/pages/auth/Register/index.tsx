import {
  Shield,
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import { Card } from "../../../components/Card";
import { Label } from "../../../components/Label";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { useOrgRegistrationMutation } from "../../../redux/api/provider";
import { toast } from "react-toastify";

import { handleError } from "../../../utils/helper";
const Register = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToHIPAA, setAgreedToHIPAA] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const stepSchemas = [
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
      password: Yup.string()
        .min(8)
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Confirm password is required"),
    }),
  ];
  const [orgRegistration, { data }] = useOrgRegistrationMutation();

  const formik = useFormik({
    initialValues: {
      clinicName: "",
      ownerFirstName: "",
      ownerLastName: "",
      email: "",
      countryCode: "",
      phone: "",
      clinicAddress: "",
      clinicCity: "",
      clinicState: "",
      clinicZip: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: stepSchemas[step - 1],

    onSubmit: (values) => {
          const { confirmPassword, ...payload } = values;
      orgRegistration(payload).unwrap().catch((error)=> handleError(error));
      // API call here
    },
  });

  useEffect(() => {
    if (data?.success) {
      toast.success("Organization registered successfully..");
      navigate('/verify' , {state: {Email:formik?.values?.email}})
    }
  }, [data]);

  const markFieldsTouched = (fields: string[]) => {
    const touched: Record<string, boolean> = {};

    fields.forEach((f) => (touched[f] = true));

    formik.setTouched({ ...formik.touched, ...touched }, true);
  };
  const stepFields: Record<number, string[]> = {
    1: ["clinicName", "ownerFirstName", "ownerLastName", "email"],
    2: ["phone", "clinicAddress", "clinicCity", "clinicState", "clinicZip"],
    3: ["password", "confirmPassword"],
  };

  const handleNext = async () => {
    const errors: any = await formik.validateForm();
    const currentFields = stepFields[step];

    const stepHasErrors = currentFields.some((field) => errors[field]);

    if (stepHasErrors) {
      markFieldsTouched(currentFields);
      return; // ❌ STOP navigation
    }

    setStep((prev) => prev + 1);
  };

  return (
    <>
      <div className="min-h-screen bg-[#efefef] flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#395159] rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-[#303630] mb-2">
              Create Your DIR DataFlow Account
            </h1>
            <p className="text-[#395159]">
              Start your 30-day free trial • No credit card required
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className={`h-2 w-24 rounded-full ${
                step >= 1 ? "bg-[#395159]" : "bg-[#ccc9c0]"
              }`}
            />
            <div
              className={`h-2 w-24 rounded-full ${
                step >= 2 ? "bg-[#395159]" : "bg-[#ccc9c0]"
              }`}
            />
            <div
              className={`h-2 w-24 rounded-full ${
                step >= 3 ? "bg-[#395159]" : "bg-[#ccc9c0]"
              }`}
            />
          </div>

          <Card className="p-8 bg-white">
            <form onSubmit={formik?.handleSubmit}>
              {/* Step 1: Clinic & Owner Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-[#303630] mb-2">
                      Clinic & Owner Information
                    </h2>
                    <p className="text-sm text-[#395159]">Step 1 of 3</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clinicName">Clinic Name *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#395159]" />
                      <Input
                        id="clinicName"
                        type="text"
                        value={formik?.values.clinicName}
                        onChange={formik?.handleChange}
                        className="h-12 pl-10"
                        placeholder="Infinity Therapy LLC"
                        required
                      />
                      {formik.touched.clinicName &&
                        formik.errors.clinicName && (
                          <p className="text-sm text-red-500">
                            {formik.errors.clinicName}
                          </p>
                        )}
                    </div>
                    <p className="text-sm text-[#395159]">
                      This name will appear on all session notes and reports
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ownerFirstName">
                        Account Owner First Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#395159]" />
                        <Input
                          id="ownerFirstName"
                          type="text"
                          value={formik?.values?.ownerFirstName}
                          onChange={formik?.handleChange}
                          className="h-12 pl-10"
                          placeholder="John"
                          required
                        />
                        {formik.touched.ownerFirstName &&
                          formik.errors.ownerFirstName && (
                            <p className="text-sm text-red-500">
                              {formik.errors.ownerFirstName}
                            </p>
                          )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerLastName">Last Name *</Label>
                      <Input
                        id="ownerLastName"
                        type="text"
                        value={formik?.values?.ownerLastName}
                        onChange={formik?.handleChange}
                        className="h-12"
                        placeholder="Smith"
                        required
                      />
                      {formik.touched.ownerLastName &&
                        formik.errors.ownerLastName && (
                          <p className="text-sm text-red-500">
                            {formik.errors.ownerLastName}
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#395159]" />
                      <Input
                        id="email"
                        type="email"
                        value={formik?.values?.email}
                        onChange={formik?.handleChange}
                        className="h-12 pl-10"
                        placeholder="john.smith@clinic.com"
                        required
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-sm text-red-500">
                          {formik.errors.email}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-[#395159]">
                      This will be your login email
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Contact & Location */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-[#303630] mb-2">Contact & Location</h2>
                    <p className="text-sm text-[#395159]">Step 2 of 3</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative ">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#395159]" />
                      <div className="h-12 pl-10">
                        <PhoneInput
                          country="in"
                          enableSearch
                          value={`${formik.values.countryCode}${formik.values.phone}`}
                          onChange={(value, data) => {
                            const dialCode = `+${data?.dialCode}`;

                            // Remove country code from number
                            const localNumber = value.replace(
                              data?.dialCode,
                              ''
                            );

                            formik.setFieldValue("countryCode", dialCode);
                            formik.setFieldValue("phone", localNumber);
                          }}
                          onBlur={() => {
                            formik.setFieldTouched("phone", true);
                            formik.setFieldTouched("countryCode", true);
                          }}
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      {/* <Input
                        id="phone"
                        type="tel"
                        value={formik?.values?.phone}
                        onChange={formik?.handleChange}
                        className="h-12 pl-10"
                        placeholder="(555) 123-4567"
                        required
                      /> */}
                      {formik.touched.phone && formik.errors.phone && (
                        <p className="text-sm text-red-500">
                          {formik.errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clinicAddress">Clinic Address *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#395159]" />
                      <Input
                        id="clinicAddress"
                        type="text"
                        value={formik?.values?.clinicAddress}
                        onChange={formik?.handleChange}
                        className="h-12 pl-10"
                        placeholder="123 Main Street"
                        required
                      />
                      {formik.touched.clinicAddress &&
                        formik.errors.clinicAddress && (
                          <p className="text-sm text-red-500">
                            {formik.errors.clinicAddress}
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="clinicCity">City *</Label>
                      <Input
                        id="clinicCity"
                        type="text"
                        value={formik?.values?.clinicCity}
                        onChange={formik?.handleChange}
                        className="h-12"
                        placeholder="Austin"
                        required
                      />
                      {formik.touched.clinicCity &&
                        formik.errors.clinicCity && (
                          <p className="text-sm text-red-500">
                            {formik.errors.clinicCity}
                          </p>
                        )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinicState">State *</Label>
                      <Input
                        id="clinicState"
                        type="text"
                        value={formik?.values?.clinicState}
                        onChange={formik?.handleChange}
                        className="h-12"
                        placeholder="TX"
                        maxLength={2}
                        required
                      />
                      {formik.touched.clinicState &&
                        formik.errors.clinicState && (
                          <p className="text-sm text-red-500">
                            {formik.errors.clinicState}
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clinicZip">ZIP Code *</Label>
                    <Input
                      id="clinicZip"
                      type="text"
                      value={formik?.values?.clinicZip}
                      onChange={formik?.handleChange}
                      className="h-12"
                      placeholder="78701"
                      maxLength={10}
                      required
                    />
                    {formik.touched.clinicZip && formik.errors.clinicZip && (
                      <p className="text-sm text-red-500">
                        {formik.errors.clinicZip}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Security & Agreements */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-[#303630] mb-2">
                      Security & Agreements
                    </h2>
                    <p className="text-sm text-[#395159]">Step 3 of 3</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Create Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#395159]" />
                      <Input
                        id="password"
                        type="password"
                        value={formik?.values?.password}
                        onChange={formik?.handleChange}
                        className="h-12 pl-10"
                        placeholder="Minimum 8 characters"
                        required
                      />
                      {formik.touched.password && formik.errors.password && (
                        <p className="text-sm text-red-500">
                          {formik.errors.password}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#395159]" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formik?.values?.confirmPassword}
                        onChange={formik?.handleChange}
                        className="h-12 pl-10"
                        placeholder="Re-enter password"
                        required
                      />
                      {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword && (
                          <p className="text-sm text-red-500">
                            {formik.errors.confirmPassword}
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="space-y-4 p-4 bg-[#efefef] rounded-lg">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4"
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-[#303630] cursor-pointer"
                      >
                        I agree to the DIR DataFlow{" "}
                        <span className="text-[#395159] underline">
                          Terms of Service
                        </span>{" "}
                        and{" "}
                        <span className="text-[#395159] underline">
                          Privacy Policy
                        </span>
                      </label>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="hipaa"
                        checked={agreedToHIPAA}
                        onChange={(e) => setAgreedToHIPAA(e.target.checked)}
                        className="mt-1 w-4 h-4"
                      />
                      <label
                        htmlFor="hipaa"
                        className="text-sm text-[#303630] cursor-pointer"
                      >
                        I acknowledge that I have read and agree to the{" "}
                        <span className="text-[#395159] underline">
                          HIPAA Business Associate Agreement (BAA)
                        </span>{" "}
                        and understand my responsibilities for maintaining
                        client data security and confidentiality
                      </label>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-900">
                      <strong>Important:</strong> DIR DataFlow is designed for
                      clinical documentation and progress monitoring. This
                      platform should not be used to collect personally
                      identifiable information (PII) beyond what is necessary
                      for clinical care. Always follow HIPAA guidelines and your
                      organization's security policies.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {step > 1 && (
                  <Button
                    type="button"
                    onClick={() => setStep((prev) => prev - 1)}
                    variant="outline"
                    className="flex-1 h-12 border-[#395159] text-[#395159]"
                  >
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-[#395159] hover:bg-[#303630] text-white"
                  >
                    Create Account & Start Trial
                  </Button>
                )}
              </div>
            </form>

            {step === 1 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-[#395159]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-[#395159] underline hover:text-[#303630]"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}
          </Card>

          {/* Trial Information */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-[#ccc9c0]">
            <h3 className="text-[#303630] mb-2">
              What's Included in Your Trial
            </h3>
            <ul className="space-y-2 text-sm text-[#395159]">
              <li>✓ Full access to all features for 30 days</li>
              <li>✓ Unlimited providers (first 5 included)</li>
              <li>✓ $22/month per client after trial</li>
              <li>✓ No credit card required to start</li>
              <li>✓ Cancel anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
