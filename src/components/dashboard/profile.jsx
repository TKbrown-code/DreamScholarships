import React from "react";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../context/AuthContext";
import { useProfileAvatar } from "../../hooks/avaterpic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faGlobe,
  faMapMarkerAlt,
  faUser,
  faGraduationCap,
  faQuoteLeft,
  faCheckCircle,
  faEdit,
  faLock,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../../style/dashboardmain.css";
import Footer from "./dashboardfooter"

export default function Profile() {
  const { profile } = useProfile();
  const { user } = useAuth();
  const userId = user?.id || null;
  const { avatarUrl } = useProfileAvatar(userId);

  const firstName = profile?.first_name || "Dream";
  const lastName = profile?.second_name || "Scholar";
  const fullName = `${firstName} ${lastName}`.trim();
  const email = profile?.user_email || profile?.email || "example@email.com";
  const phone = profile?.phone_number || "Not Provided";
  const country = profile?.country || "Not Set";
  const city = profile?.city || "Not Set";
  const bio = profile?.bio || "Go to settings to add a bio.";
  const scholarship = profile?.scholarship || "International Scholarship Program";
  const status = profile?.status || "Active Candidate";
  const testimonial = profile?.testimonial || "This program has truly changed my life.";
  const created_at = profile?.created_at || "dd/mm/yy"
  const avatar = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff&size=128`;

  return (
    <>
    <div className="profile-container">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar">
          <img src={avatar} alt={`${fullName} dream scholarships`} />
        </div>
        <div className="profile-info">
          <h2>{profile?.full_name}</h2>
          <p className="profile-status">
            <FontAwesomeIcon icon={faCheckCircle} /> {status}
          </p>
          <p className="profile-scholarship">
            <FontAwesomeIcon icon={faGraduationCap} /> {scholarship}
          </p>
        </div>
      </div>

      {/* Details Section */}
      <div className="profile-details">
        <div className="detail-item">
          <FontAwesomeIcon icon={faEnvelope} /> <span>{email}</span>
        </div>
        <div className="detail-item">
          <FontAwesomeIcon icon={faPhone} /> <span>+{phone}</span>
        </div>
        <div className="detail-item">
          <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
          <span>
            {city}, {country}
          </span>
        </div>
        <div className="detail-item">
          <FontAwesomeIcon icon={faGlobe} /> <span>{created_at}</span>
        </div>
      </div>

      {/* Bio & Testimonial */}
      <div className="profile-bio">
        <h3>
          <FontAwesomeIcon icon={faUser} /> About
        </h3>
        <p>{bio}</p>
      </div>

      <div className="profile-testimonial">
        <h3>
          <FontAwesomeIcon icon={faQuoteLeft} /> Testimonial
        </h3>
        <p>"{testimonial}"</p>
      </div>

      {/* Actions */}
      <div className="profile-actions">
        <button className="btn btn-blue">
          <FontAwesomeIcon icon={faEdit} /> Edit Profile
        </button>
        <button className="btn btn-orange">
          <FontAwesomeIcon icon={faLock} /> Change Password
        </button>
        <button className="btn btn-red">
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </div>
    </div>
    <div className="footer">
        <Footer/>
    </div>
  </>
  );
}
