import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/Supabase";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-regular-svg-icons";

export default function NewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase will detect the reset token in URL and create a session automatically
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        console.log("Recovery session ready", session);
      }
    });
  }, []);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!, Return to sign in!");
      navigate("/form");
    }

    setIsLoading(false);
  };

  return (
     <div className="formholder" style={{width:'100%', height:"100vh", background:"linear-gradient(-45deg, rgb(113, 238, 113), rgb(255, 255, 255))"}}>
      <div style={{width:"100%", display:"flex", justifyContent:"center", transform:'translatey(250px)'}}>
        <div className="form-container">
        <div className="formheader">
        <h1>Set New Password</h1>
        </div>
        <form onSubmit={handlePasswordUpdate}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{border:"lightgreen solid 0.5px", width:'100%'}}
          />
          <button style={{padding:"5px", background:"darkblue", color:"white"}} type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
        <div>
         <span onClick={() => navigate("/form")} style={{color:"red", cursor:"pointer"}}> <FontAwesomeIcon icon={faArrowAltCircleLeft}/> Return</span>
        </div>
      </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}
