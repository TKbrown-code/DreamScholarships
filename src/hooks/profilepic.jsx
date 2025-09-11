import React, { useEffect, useId, useRef, useState } from "react";
import { supabase } from "../lib/Supabase";
import { useAuth } from "../context/AuthContext";
import "../style/AvatarPicker.css"; // import CSS file

export default function AvatarPicker({ size = 128, accept = "image/*", shape = "circle", disabled = false }) {
  const inputRef = useRef(null);
  const id = useId();
  const { user } = useAuth();
  const userId = user?.id;

  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

const uploadAvatar = async (file) => {
  try {
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;        // just the filename
    const filePath = `${userId}/${fileName}`;        // save inside profiles folder

    // upload
    let { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // get public URL
    const { data: { publicUrl }, error: urlError } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    if (urlError) throw urlError;

    // save filename and path in table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: fileName, avatar_path: filePath })
      .eq("user_id", userId);

    if (profileError) throw profileError;

    setPreviewUrl(publicUrl);
    setModalOpen(true); // open modal
  } catch (error) {
    alert(error.message);
  } finally {
    setUploading(false);
  }
};

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(url);
    uploadAvatar(file);
  };

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const onClick = () => {
    if (disabled || uploading) return;
    inputRef.current?.click();
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || uploading) return;
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const shapeClass = shape === "square" ? "square" : shape === "rounded" ? "rounded" : "circle";

  return (
    <form className="avatar-form" noValidate>
      <div className="avatar-page">
        <div className="avater-header">
              <h2>Please Input A profile picture!😊</h2>
        </div>
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={onInputChange}
          disabled={disabled || uploading}
        />

        <div
          className={`avatar-picker ${shapeClass} ${isDragging ? "dragging" : ""}`}
          style={{ width: size, height: size}}
          onClick={onClick}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Profile preview" className={`avatar-img ${shapeClass}`} />
          ) : (
            <span className="avatar-placeholder">{uploading ? "Uploading..." : "Click or Drop"}</span>
          )}
        </div>

        <div className="actions">
          <button
            type="button"
            className="skip-btn"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Skip
          </button>
        </div>
         <div className="avater-footer">
          <span>We are almost done!🥳🎉</span>
          </div>     
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>🎉 Account Created Successfully</h2>
              <p>Your profile picture has been uploaded.</p>
              <button
                type="button"
                className="go-btn"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
