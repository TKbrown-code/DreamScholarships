import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faPaperPlane, faUserAlt, faSignOutAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import ErrorBoundary from '../context/ErrorBoundary';
import { supabase } from '../lib/Supabase';
import { useProfileAvatar } from "../hooks/avaterpic";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const userId = user?.id;
  const { avatarUrl, loading } = useProfileAvatar(userId);
  const navigate = useNavigate();
  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 1000, once: true,  offset: 50 });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!userId || !isMounted) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, second_name, user_email")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) {
          console.error("Profile fetch error:", error.message);
          setUserProfile(null);
        } else {
          setUserProfile(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const firstName = userProfile?.first_name || "Dream Scholars";
  const lastName = userProfile?.second_name || "Scholar!😊";
  const fullName = `${firstName} ${lastName}`.trim();
  const encodedName = encodeURIComponent(fullName);
  const avatar = avatarUrl || `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=128`;
  const email = userProfile?.user_email || user?.email || "example@email.com";

  return (
    <ErrorBoundary>
      <header style={{overflowX:'hidden'}}>
        <div className="overlay">
          <div className="content">
            <div className="header-content" data-aos="fade-down">
              <h1 data-aos="fade-right">From Africa to China — Your Global Education Journey Starts Here</h1>
              <p data-aos="fade-right" data-aos-delay="100">
                <strong>Dream Scholarship</strong> is a profit-making scholarship agency dedicated to helping African students secure scholarships in China.
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 1)', fontSize: '1.5em', fontWeight:'800' }} data-aos="fade-right" data-aos-delay="200">
                “Take the leap — discover your scholarship today!”
              </p>
              <div className="header-buttons" data-aos="fade-up" data-aos-delay="300">
                <button onClick={() => navigate("/applyform")} className='applybtn'>
                  Apply <FontAwesomeIcon icon={faPaperPlane} style={{ marginLeft:'5px' }} />
                </button>
                <a href="https://wa.me/673918431" target="_blank" rel="noopener noreferrer">
                  Contact <FontAwesomeIcon icon={faMessage}/>
                </a>
              </div>
            </div>

            <div className="register-form" data-aos="fade-up" data-aos-delay="400">
              <div className="user">
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="user-avatar"
                  style={{ width: "80px", height: "80px", borderRadius: "50%", border:'rgba(98, 117, 240, 1) solid 2px' }}
                  data-aos="zoom-in"
                />

                <div className="user-info" data-aos="fade-left" data-aos-delay="100">
                  <span>
                    Welcome {firstName} !😊
                  </span>
                  <span style={{ color: "rgba(3, 8, 39, 1)", fontSize: "1.2em" }}>
                    {email}
                  </span>
                </div>

                {user ? (
                  <div className="user-dropdown" data-aos="fade-left" data-aos-delay="200">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                      <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                    {dropdownOpen && (
                      <div className="dropdown-menu" >
                        <Link to="/dashboard" style={{ textDecoration: "none", color: "#333" }}>
                          <FontAwesomeIcon icon={faUserAlt} /> Dashboard
                        </Link>
                        <button onClick={signOut}>
                          <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/form" data-aos="fade-left" data-aos-delay="300">
                    <button><FontAwesomeIcon icon={faUserAlt}/> Sign Up</button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </ErrorBoundary>
  );
}
