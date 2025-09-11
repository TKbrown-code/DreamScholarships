import { useState, useEffect } from "react";
import Footer from "./dashboardfooter";
import { supabase } from "../lib/Supabase.js";
import "../style/settings.css";

export default function Settings() {
  const [profile, setProfile] = useState({
    first_name: "",
    second_name: "",
    full_name: "",
    user_email: "",
    phone_number: "",
    country: "",
    city: "",
    bio: "",
    avatar_url: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        setMessage("❌ Failed to get user.");
        setLoading(false);
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError.message);
        setMessage("❌ Failed to load profile.");
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  // Validation
  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validatePassword = (val) => val.length >= 6;
  const validatePhone = (val) => /^[0-9+\-() ]{7,15}$/.test(val);

  // Save profile changes
  const updateProfile = async (updates, type) => {
    setActionLoading(type);
    setMessage("Updating...");

    const { error, data } = await supabase
      .from("profiles")
      .update({
        ...updates,
        full_name:
          updates.first_name || updates.second_name
            ? `${updates.first_name || profile.first_name} ${
                updates.second_name || profile.second_name
              }`.trim()
            : profile.full_name,
      })
      .eq("id", profile.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      setMessage("❌ Update failed.");
    } else {
      setProfile((prev) => ({ ...prev, ...data }));
      setMessage("✅ Update successful!");
    }
    setActionLoading(null);
  };

  // Update password
  const updatePassword = async () => {
    setActionLoading("password");
    setMessage("Verifying old password...");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("❌ User not found.");
      setActionLoading(null);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    });

    if (signInError) {
      setMessage("❌ Old password is incorrect.");
      setActionLoading(null);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setMessage("❌ Failed to update password.");
    } else {
      setMessage("✅ Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    }
    setActionLoading(null);
  };

  // Avatar upload
  const updateAvatar = async () => {
    if (!avatarFile) {
      setMessage("Please select an image first!");
      return;
    }

    if (avatarFile.size > 2 * 1024 * 1024) {
      setMessage("❌ File too large. Max 2MB.");
      return;
    }

    const fileExt = avatarFile.name.split(".").pop();
    const fileName = `${profile.user_id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true });

    if (uploadError) {
      setMessage("❌ Failed to upload avatar.");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    await updateProfile({ avatar_url: data.publicUrl }, "avatar");
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  useEffect(() => {
    if (!avatarFile) return;
    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  if (loading) return <p>Loading settings...</p>;

  return (
    <>
      <div className="settings">
        {message && <p className="status-msg">{message}</p>}

        {/* Security */}
        <div className="settings-section">
          <h3>🔒 Security</h3>
          <div className="settings-card">
            <h4>Change Password</h4>
            <input
              type="password"
              value={oldPassword}
              placeholder="Enter old password..."
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              value={newPassword}
              placeholder="Enter new password..."
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              disabled={
                !validatePassword(newPassword) ||
                !oldPassword ||
                actionLoading === "password"
              }
              onClick={updatePassword}
            >
              {actionLoading === "password" ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="settings-section">
          <h3>👤 Profile</h3>

          <div className="settings-card">
            <h4>Basic Info</h4>
            <span>First Name:</span>
            <input
              type="text"
              value={profile.first_name}
              placeholder="First name"
              onChange={(e) =>
                setProfile({ ...profile, first_name: e.target.value })
              }
            />
            <span>Second Name:</span>
            <input
              type="text"
              value={profile.second_name}
              placeholder="Second name"
              onChange={(e) =>
                setProfile({ ...profile, second_name: e.target.value })
              }
            />
            <span>Email:</span>
            <input
              type="email"
              value={profile.user_email}
              placeholder="Email"
              onChange={(e) =>
                setProfile({ ...profile, user_email: e.target.value })
              }
              disabled
            />
            <button
              disabled={!validateEmail(profile.user_email)}
              onClick={() => updateProfile(profile, "basic")}
            >
              {actionLoading === "basic" ? "Updating..." : "Update Basic Info"}
            </button>
          </div>

          <div className="settings-card">
            <h4>Contact Info</h4>
            <span>Phone number:</span>
            <input
              type="tel"
              value={profile.phone_number}
              placeholder="Phone number"
              onChange={(e) =>
                setProfile({ ...profile, phone_number: e.target.value })
              }
            />
            <span>Country:</span>
            <input
              type="text"
              value={profile.country}
              placeholder="Country"
              onChange={(e) =>
                setProfile({ ...profile, country: e.target.value })
              }
            />
            <span>City:</span>
            <input
              type="text"
              value={profile.city}
              placeholder="City"
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
            />
            <button
              disabled={!validatePhone(profile.phone_number)}
              onClick={() => updateProfile(profile, "contact")}
            >
              {actionLoading === "contact" ? "Updating..." : "Update Contact"}
            </button>
          </div>

          <div className="settings-card">
            <h4>Bio</h4>
            <textarea
              value={profile.bio || ""}
              placeholder="Write something about yourself..."
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
            <button
              disabled={actionLoading === "bio"}
              onClick={() => updateProfile({ bio: profile.bio }, "bio")}
            >
              {actionLoading === "bio" ? "Updating..." : "Update Bio"}
            </button>
          </div>

          <div className="settings-card">
            <h4>Avatar</h4>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
            {avatarPreview && (
              <div className="avatar-preview">
                <p>Preview:</p>
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
            <button
              disabled={actionLoading === "avatar"}
              onClick={updateAvatar}
            >
              {actionLoading === "avatar" ? "Uploading..." : "Update Avatar"}
            </button>
          </div>
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </>
  );
}
