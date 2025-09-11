import React, { useState } from "react";
import {
  faEnvelope,
  faLock,
  faHome,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function PasswordReset() {
  const [step, setStep] = useState(1); // Step 1: email, Step 2: token + new password
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const EDGE_FUNCTION_URL =
    "https://wqtzshzowmhurrpznbpo.supabase.co/functions/v1/passwordReset"; // Replace with your actual URL

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to generate token");
        return;
      }

      toast.success("Token sent to your email!");
      setStep(2);
    } catch (err) {
      console.error("Token request error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!token || !newPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to reset password");
        return;
      }

      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Password reset error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-holder">
      <div className="form-container">
       

        <div className="formheader">
          <h1>Password Reset</h1>
          <span>
            {step === 1 ? "Enter your email" : "Enter token & new password"}
          </span>
        </div>

        <form onSubmit={step === 1 ? handleEmailSubmit : handlePasswordReset}>
          {step === 1 && (
            <div>
              <label>
                <FontAwesomeIcon icon={faEnvelope} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>
          )}

          {step === 2 && (
            <>
              <div>
                <label>
                  Token
                  <input
                    type="text"
                    placeholder="Enter token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="password-wrapper">
                <label>
                  <FontAwesomeIcon icon={faLock} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </label>
              </div>
            </>
          )}

          <div className="signbtn">
            <button type="submit" disabled={isLoading}>
              {isLoading
                ? "Processing..."
                : step === 1
                ? "Send Token"
                : "Reset Password"}
            </button>
             <button className="home-btn" onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHome} /> Home
        </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}