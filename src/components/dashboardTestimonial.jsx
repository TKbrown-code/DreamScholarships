import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useProfileAvatar } from "../hooks/avaterpic";
import { motion, AnimatePresence } from "framer-motion";
import "../style/dashboardmain.css";
import { useProfile } from "../hooks/useProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import Footer from "./dashboardfooter"

export default function Testimonials() {
  const { user } = useAuth();
  const userId = user?.id || null;
  const { avatarUrl } = useProfileAvatar(userId);
  const { profile } = useProfile();

  const [testimonial, setTestimonial] = useState("");
  const [loading, setLoading] = useState(false);
  const [myTestimonials, setMyTestimonials] = useState([]);
  const [pic, setPic] = useState(null);

  // Current timestamp
  const now = new Date();

  // Submit testimonial
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!testimonial.trim()) return;

    setLoading(true);

    const { error } = await supabase.from("testimonials").insert([
      {
        user_id: userId,
        name: profile?.full_name || "Anonymous",
        testimony: testimonial,
        avatar_path: profile?.avatar_path || null,
        send_at: now.toISOString(),
      },
    ]);

    if (error) {
      console.error("Error submitting testimonial:", error.message);
    } else {
      await fetchTestimonials();
    }

    setLoading(false);
    setTestimonial("");
  };

  // Fetch testimonials
  const fetchTestimonials = async () => {
    if (!userId) return;

    const { data: testimonyData, error: testimonyError } = await supabase
      .from("testimonials")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: false });

    if (testimonyError) {
      console.error("Failed to fetch testimonials:", testimonyError.message);
    } else {
      setMyTestimonials(testimonyData);
    }

    // Fetch avatar if available
    if (profile?.avatar_path) {
      try {
        const { data: fileData, error: downloadError } = await supabase.storage
          .from("avatars")
          .download(profile.avatar_path);

        if (!downloadError) {
          const blobUrl = URL.createObjectURL(fileData);
          setPic(blobUrl);
        }
      } catch (err) {
        console.error("Unexpected error downloading avatar:", err);
      }
    }
  };

  // Delete a testimonial
  const deleteTestimony = async (id) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
      console.log("Error deleting testimony:", error.message);
    } else {
      setMyTestimonials(myTestimonials.filter((t) => t.id !== id));
    }
  };

  const enterbtn = (e) => {
     if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent new line
      handleSubmit(e);
  }
}

  // Fetch on mount and when profile changes
  useEffect(() => {
    if (profile) {
      fetchTestimonials();
    }
  }, [profile]);

  return (
    <>
    <div className="testimonials-dashboard">
      <div className="section">
       <FontAwesomeIcon icon={faQuoteLeft}/> Testimonial
      </div>
      {/* Input */}
      <form className="testimonial-input" onSubmit={handleSubmit}>
        <div className="dashtestimonial-head">
        <h3>Have something to tell the world about Dream Scholarship?🤷</h3>
      </div>
        <textarea
          value={testimonial}
          onChange={(e) => setTestimonial(e.target.value)}
          placeholder="Share your testimonial..."
          rows={3}
          onKeyDown={enterbtn}
        />
        <div className="inputbtn">
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button onClick={() => setTestimonial("")}>Reset</button>
        </div>
       
      </form>

      {/* List */}
      <div className="testimonial-list">
        {myTestimonials.length === 0 && (
          <p className="no-testimonials">No testimonials yet.</p>
        )}

        <AnimatePresence>
          {myTestimonials.map((t) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="dashboard-testimonial-card"
              key={t.id}
            >
              <div className="testimonial-header">
                <img
                  className="testimonial-avatar"
                  src={
                    pic ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      t.name
                    )}&background=cccccc&color=333&size=48`
                  }
                  alt={t.name}
                />
                <div className="testimonial-meta">
                  <span className="testimonial-name">{t.name}</span>
                  <p className="testimonial-text">{t.testimony}</p>
                  <span className="testimonial-date">
                    {new Date(t.send_at).toLocaleString()}
                  </span>
                  <div className="testimonialbtn">
                    <button onClick={() => deleteTestimony(t.id)}>Delete</button>
                    <button>Edit</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
    <div className="footer">
        <Footer/>
      </div>
    </>
  );
}
