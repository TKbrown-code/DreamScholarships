import { useState, useEffect } from "react";
import { supabase } from "../lib/Supabase";

export function useProfileAvatar(userId) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchAvatar = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch only avatar_path from the profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("avatar_path")
          .eq("user_id", userId)
          .single();

        if (profileError) throw profileError;
        if (!profile || !profile.avatar_path) {
          setAvatarUrl(null);
          return;
        }

        // Download the file from Supabase Storage
        const { data: fileData, error: downloadError } = await supabase
          .storage
          .from("avatars")
          .download(profile.avatar_path);

        if (downloadError) throw downloadError;

        // Convert Blob to temporary URL
        const blobUrl = URL.createObjectURL(fileData);
        setAvatarUrl(blobUrl);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch avatar");
      } finally {
        setLoading(false);
      }
    };

    fetchAvatar();
  }, [userId]);

  return { avatarUrl, loading, error };
}