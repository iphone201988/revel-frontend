import { Mail, Shield } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import OTPInput from "react-otp-input";
import { useEffect, useState } from "react";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../../../redux/api/provider"; 
import { useLocation, useNavigate } from "react-router-dom";
import { handleError } from "../../../utils/helper";
import { showSuccess } from "../../../components/CustomToast";

const VerifyOtp = () => {
  const location = useLocation();
  const email = location?.state?.Email;
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const [verifyOtp, { data, isLoading, isSuccess }] = useVerifyOtpMutation();
  const [sendOtp, { data: otpData }] = useSendOtpMutation();

  useEffect(() => {
    if (isSuccess) {
      console.log("profile data", data);
      showSuccess("Account Verified Successfully");
      localStorage.setItem("token", data?.data?.token);
      navigate("/");
    }
  }, [data]);
  const handleResend = () => {
    sendOtp({ email })
      .unwrap()
      .catch((error) => handleError(error));
  };

  useEffect(() => {
    if (otpData?.success) {
      showSuccess("New verification code sent to your email");
      localStorage.setItem("token", data?.data?.token);
    }
  }, [otpData]);
  const handleVerify = () => {
    verifyOtp({ otp: Number(otp), email: email })
      .unwrap()
      .catch((error) => handleError(error));
  };
  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#395159] to-[#303630] p-8">
        <Card className="w-full max-w-md p-8 bg-white shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#395159] rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="mb-2 text-[#303630]">Two-Factor Authentication</h2>
            <p className="text-[#395159]">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div className="bg-[#efefef] border border-[#395159] rounded-lg p-4 mb-6 flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#395159] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[#303630]">Check your email</p>
              <p className="text-sm text-[#395159]">
                We've sent a secure verification code to {email}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputType="number"
              containerStyle="flex justify-between gap-2 "
              inputStyle="!w-20 h-14"
              renderSeparator={<span></span>}
              renderInput={(props) => <input {...props} />}
            /> */}
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              // use text + inputMode instead of inputType="number"
              inputType="text"
              containerStyle="flex justify-between gap-2"
              inputStyle={{
                width: "3rem",
                height: "3rem",
                borderRadius: "0.5rem",
                border: "2px solid #395159",
                textAlign: "center",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#303630",
                backgroundColor: "#ffffff",
                outline: "none",
              }}
              renderSeparator={<span className="w-2" />}
              renderInput={(props) => (
                <input
                  {...props}
                  inputMode="numeric" // mobile numeric keyboard
                  pattern="[0-9]*" // restrict to digits
                  maxLength={1}
                />
              )}
            />

            {/* </div> */}

            <Button
              onClick={handleVerify}
              className="w-full h-12 bg-[#395159] hover:bg-[#303630] text-white"
              disabled={otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Button>

            <Button
              onClick={handleResend}
              variant="outline"
              className="w-full h-12 border-[#395159] text-[#395159]"
            >
              Resend Code
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-[#395159]">
            Code expires in 10 minutes
          </div>
        </Card>

        <footer className="mt-8 text-center text-sm text-[#ccc9c0]">
          Copyright © Revel Weber 2025
        </footer>
      </div>
    </div>
  );
};

export default VerifyOtp;
