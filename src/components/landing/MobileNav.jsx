import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, 
  faList, 
  faPlay, 
  faUserGraduate, 
  faChevronCircleDown, 
  faSignOutAlt, 
  faUserAlt, 
  faPaperPlane, 
  faUsers, 
  faHomeAlt,
  faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
  import { Quote, Star } from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../style/nav.css';

export default function Mobile_nav() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [more, setMore] = useState(false);

  return (
    <div className="mobile-nav">
      <div className="navbar">
        <div className="hero-logo-container">
          <div className="logo-components">
            <div className="logo-image">
              <img src="/logo1.jpeg" alt="Dream Scholarships Logo" />
            </div>
            <div className="logo-text">
              <img src="/logo-text.jpeg" alt="Dream Scholarships" />
            </div>
          </div>
        </div>

        <div className="mobile-menu">
          <button className="mobile-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Open menu">
            <FontAwesomeIcon icon={faList} />
          </button>

          {isOpen && (
            <div className="nav-content">
              <div className="mobile-toggle-header">
                <span>Menu</span>
                <button onClick={() => setIsOpen(false)} aria-label="Close menu">
                  <FontAwesomeIcon icon={faClose} />
                </button>
              </div>

              <ul>
                <li><Link to="/" onClick={() => setIsOpen(false)}><FontAwesomeIcon icon={faHomeAlt} className="nav-icon" /> Home</Link></li>
                <li><a href="#Scholarships" onClick={() => setIsOpen(false)}><FontAwesomeIcon icon={faUserGraduate} className="nav-icon" /> Scholarships</a></li>
                <li><a href="#About-us" onClick={() => setIsOpen(false)}><FontAwesomeIcon icon={faUsers} className="nav-icon" /> About Us</a></li>
                <li><a href="#Testimonials" onClick={() => setIsOpen(false)}><Quote className="nav-icon" /> Testimonials</a></li>
                <li><a href="#FAQ" onClick={() => setIsOpen(false)}><FontAwesomeIcon icon={faQuestionCircle} className="nav-icon" /> FAQ</a></li><li>
                  <div className="more">
                    <button className="more-btn-mobile" aria-expanded={more} onClick={() => setMore(!more)}>
                      More <FontAwesomeIcon icon={faChevronCircleDown} className="dropdown-icon" />
                    </button>
                    {more && (
                      <div className="more-content-mobile">
                        <Link to="/dictionary" onClick={() => { setMore(false); setIsOpen(false); }}>
                          <FontAwesomeIcon icon={faUserGraduate} className="nav-icon" /> Dictionary
                        </Link>
                        <Link to="/resource" onClick={() => { setMore(false); setIsOpen(false); }}>
                          <FontAwesomeIcon icon={faPlay} className="nav-icon" /> Student Resource
                        </Link>
                      </div>
                    )}
                  </div>
                </li>
                <li className="divider"></li>
                {user?.id ? (
                  <>
                    <li>
                      <Link to="/dashboard" onClick={() => setIsOpen(false)} className="auth-link">
                        <FontAwesomeIcon icon={faUserAlt} className="nav-icon" /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <button onClick={() => { signOut(); setIsOpen(false); }} className="auth-btn">
                        <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" /> Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/applyform" onClick={() => setIsOpen(false)} className="auth-link-btn">
                      <FontAwesomeIcon icon={faPaperPlane} className="nav-icon" /> Apply Now
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
