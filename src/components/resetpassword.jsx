import React, { useState } from "react";
import { supabase } from "../lib/Supabase"; // <-- adjust path
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetRequest = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("user_email")
    .ilike("user_email", email);

  if (error) {
    console.log("fail to check: " + error.message);
    toast.error("Error checking email");
    setIsLoading(false);
    return;
  }

  if (profile && profile.length > 0) {
    console.log("user found: ", profile[0]);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://dream-scholarships-o2h1.vercel.app/new-password",
    });

    if (resetError) {
      toast.error(resetError.message);
    } else {
      toast.success("Check your email for the password reset link!");
    }
  } else {
    toast.error("Email does not exist!");
  }

  setIsLoading(false);
};



  return (
    <div className="formholder" style={{width:'100%', height:"100vh"}}>
      <div style={{width:"100%", display:"flex", justifyContent:"center", transform:'translatey(250px)'}}>
      <div className="form-container">
        <div className="formheader">
        <h1>Password Reset</h1>
        </div>
        <form onSubmit={handleResetRequest}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="signbtn">
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
          </div>
        </form>
        <div className="signbtn">
           <button onClick={() => navigate("/form")} style={{color:'white', background:'darkblue'}}>
            <FontAwesomeIcon icon={faArrowCircleLeft}/> Back
          </button>
        </div>
      </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}
