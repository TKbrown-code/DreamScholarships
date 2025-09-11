import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const accessToken = searchParams.get("access_token"); // Supabase sends this
  const type = searchParams.get("type"); // should be 'recovery'

  useEffect(() => {
    if (type !== "recovery" || !accessToken) {
      toast.error("Invalid or expired link");
      navigate("/");
    }
  }, [type, accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser(
        { password: newPassword },
        accessToken
      );
      if (error) throw error;

      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/form"), 2000);
    } catch (err) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-holder">
      <h1>Set New Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password (min 6 chars)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}
