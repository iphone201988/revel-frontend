import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProviderLoginMutation } from "../../../redux/api/provider";
import { handleError } from "../../../utils/helper";
import { showSuccess } from "../../../components/CustomToast";
// import logo from "figma:asset/7dfbdfbff0b23ecbbf097ad313f5fd32c091c7f7.png";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [providerLogin, { data, isLoading, isSuccess }] =
    useProviderLoginMutation();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const values = {
      email: email,
      password: password,
    };

    providerLogin(values)
      .unwrap()
      .catch((error) => handleError(error));
  };

  useEffect(() => {
    if (isSuccess) {
      showSuccess("Login successful! Sending 2FA code to your email...");
      navigate("/verify", { state: { Email: email } });
    }
  }, [data]);
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#395159] to-[#303630] p-8">
        <Card className="w-full max-w-md p-8 bg-white shadow-2xl">
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              {/* <img src={""} alt="DIR DataFlow" className="h-56 w-auto" /> */}
            </div>
            <p className="text-[#395159]">
              Brought to you by Infinity Therapy LLC
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#395159]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="provider@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#395159]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full h-12 text-white transition
    ${
      isFormValid
        ? "bg-[#395159] hover:bg-[#303630]"
        : "bg-gray-400 cursor-not-allowed"
    }
  `}
            >
              {isLoading ? "Processing..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-[#395159]">
                <Lock className="inline w-4 h-4 mr-1" />
                Encrypted Connection Active
              </p>
            </div>

            <div className="text-center pt-4 border-t border-[#ccc9c0]">
              <p className="text-sm text-[#395159]">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-[#395159] underline hover:text-[#303630]"
                >
                  Start your free trial
                </button>
              </p>
            </div>
          </div>
        </Card>

        <footer className="mt-8 text-center text-sm text-[#ccc9c0]">
          Copyright © Revel Weber 2025
        </footer>
      </div>
    </>
  );
};

export default Login;
