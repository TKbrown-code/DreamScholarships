import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "../style/testimonial.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Testimonial() {
  const [testimonialList, setTestimonialList] = useState([]);

  useEffect(() => {
    const blobUrls = []; // track all blob URLs for cleanup

    const fetchTestimonials = async () => {
      const { data: testimonyData, error } = await supabase
        .from("testimonials")
        .select("id, name, testimony, send_at, avatar_path, position")
        .order("id", { ascending: false });

      if (error) {
        console.error("Failed to fetch testimonials:", error.message);
        return;
      }

      // Map through each testimonial and handle avatar
      const withAvatars = await Promise.all(
        (testimonyData || []).map(async (t) => {
          if (t.avatar_path) {
            try {
              const { data: fileData, error: downloadError } = await supabase.storage
                .from("avatars")
                .download(t.avatar_path);

              if (!downloadError && fileData) {
                const blobUrl = URL.createObjectURL(fileData);
                blobUrls.push(blobUrl); // track for cleanup
                return { ...t, avatar_url: blobUrl };
              }
            } catch (err) {
              console.error("Error downloading avatar:", err);
            }
          }

          // Fallback avatar if download fails or avatar_path missing
          const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            t.name || "User"
          )}&background=random&color=fff&size=128`;

          return { ...t, avatar_url: avatarFallback };
        })
      );

      setTestimonialList(withAvatars);
    };

    fetchTestimonials();

    // Cleanup: revoke all blob URLs on component unmount
    return () => {
      blobUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

return (
    <section className="testimonial-section" id="Testimonials">
      <h2>Testimonials</h2>
      <div className="line"></div>

      {testimonialList.length > 0 ? (
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonialList.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="testimonial-card">
                <div className="profile">
                  <img
                    src={testimonial.avatar_url}
                    alt={`${testimonial.name} profile`}
                  />
                </div>
                <div className="text">
                  <h3>{testimonial.name}</h3>
                  <p className="testimony">“{testimonial.testimony}”</p>
                  <p className="position">
                    {testimonial.position || "Student"}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>No testimonials yet.</p>
      )}
    </section>
  );
}
