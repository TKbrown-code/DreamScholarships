import React, { useEffect, useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Status() {
  const { profile } = useProfile();
  const { user } = useAuth();
  const userId = user?.id;

  const [isRegistered, setIsRegistered] = useState(null); // null = loading, false = not registered
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        // ✅ Check registration
        const { data: regData, error: regError } = await supabase
          .from("profiles")
          .select("Registered")
          .eq("id", userId)
          .maybeSingle();

        if (regError) throw new Error(`Register fetch failed: ${regError.message}`);
        const registered = regData?.Registered === true;
        setIsRegistered(registered);

        // ✅ Only fetch status if registered
        if (registered) {
          const { data: statusData, error: statusError } = await supabase
            .from("Status")
            .select("*")
            .eq("id", userId)
            .maybeSingle();

          if (statusError) throw new Error(`Status fetch failed: ${statusError.message}`);
          setStatus(statusData);
        }
      } catch (err) {
        console.error(err.message);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <p>Loading status...</p>;
  if (errorMsg) return <p style={{ color: "red" }}>Error: {errorMsg}</p>;

  if (!isRegistered) {
    return <p>You are not registered yet. Please complete registration to view your status.</p>;
  }

  if (!status) {
    return <p>No status data available.</p>;
  }

  return (
    <div className="Status">
      <h2>{status.scholarship_type || "No Scholarship Type"}</h2>
      <p><strong>Status:</strong> {status.status || "No status set"}</p>
      <p><strong>School:</strong> {status.School || "Not provided"}</p>
      <p><strong>City:</strong> {status.City || "Not provided"}</p>
    </div>
  );
}
