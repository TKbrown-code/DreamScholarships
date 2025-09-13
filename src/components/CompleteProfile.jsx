import React, { useState } from "react";
import { supabase } from "../lib/Supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faGlobe, faCity, faImage } from "@fortawesome/free-solid-svg-icons";

export default function CompleteProfile() {
  const [profile, setProfile] = useState({
    country: "",
    city: "",
    avatar_url: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(`public/${Date.now()}_${file.name}`, file);

    if (error) {
      console.error(error);
      return;
    }
    setProfile(prev => ({ ...prev, avatar_url: data.path }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase
      .from("profiles")
      .update({
        country: profile.country,
        city: profile.city,
        avatar_url: profile.avatar_url,
      })
      .eq("user_id", user.id);

    setLoading(false);
    if (error) console.error(error);
    else window.location.href = "/dashboard"; // ✅ final destination
  };

  return (
    <section className="formsection" style={{overflowX:'hidden'}}>
      <div className="form-container" style={{ width: "100%" }}>
        <div className="formheader">
          <h1>Complete Your Profile</h1>
          <span>We need a bit more info before continuing</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <span>Country:</span>
            <label>
              <FontAwesomeIcon icon={faGlobe} />
              <input 
                type="text" 
                name="country" 
                value={profile.country} 
                onChange={handleChange} 
                disabled={loading} 
              />
            </label>
          </div>
          <div>
            <span>City:</span>
            <label>
              <FontAwesomeIcon icon={faCity} />
              <input 
                type="text" 
                name="city" 
                value={profile.city} 
                onChange={handleChange} 
                disabled={loading} 
              />
            </label>
          </div>
          <div>
            <span>Profile Picture:</span>
            <label>
              <FontAwesomeIcon icon={faImage} />
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={loading} />
            </label>
          </div>

          <div className="signbtn">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
