import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPlay, faUserGraduate, faChevronCircleDown, faSignOutAlt, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function Mobile_nav() {
   const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const  [more, setMore] = useState(false)
  

  return (
    <div className="mobile-nav">
      <div className="navbar">
        <div className="logo">
          <div className="icon">
            <FontAwesomeIcon 
              icon={faUserGraduate} 
              style={{ transform: 'rotate(-45deg)', fontSize:'0.8em', color:'rgba(160, 233, 205, 0.93)' }} 
            />
          </div>
          <span title='Scholarship agency'>Dream Scholarship</span>
        </div>

        <div className="mobile-menu">
          {/* Hamburger button */}
          <button className="mobile-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Open menu">
            <FontAwesomeIcon icon={faList} />
          </button>

          {/* Menu panel */}
          {isOpen && (
            <div className="nav-content">
              <div className="mobile-toggle-header">
                <span>Menu</span>
                <button onClick={() => setIsOpen(false)} aria-label="Close menu" style={{background:'none', border: 'solid 0.5px rgba(128, 128, 128, 0.85)', padding:'5px', borderRadius:'2px'}}>
                  X
                </button>
              </div>

              <ul>
                <li><Link to="/">Home</Link></li>
                <li><a href="#">Scholarships</a></li>
                <li><a href="#">About us</a></li>
                <li><a href="#">Contact</a></li>
                <li>
                      <div className="more">
                          <button style={{padding:'5px'}} onClick={()  => setMore(!more)}>More <FontAwesomeIcon icon={faChevronCircleDown}/></button>
                        {more && (
                        <div className="more-content-mobile">
                            <Link style={{color:'white'}} to="/dictionary">Dictionary</Link>
                            <Link style={{color:'white'}} to="/resource">Student Resource</Link>
                          </div>
                          )}
                        </div>
                  </li>
                  {user?.id ? (
                    <>
                    <Link to="/dashboard" style={{ textDecoration: "none", color: "#333" }}>
                      <FontAwesomeIcon icon={faUserAlt} /> Dashboard
                      </Link>
                    <button onClick={signOut} style={{padding:'5px', background:"lightgreen", color:'white'}}>
                      <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
                    </button>
                    </>
                  ) : (
                    <Link style={{padding:'5px', background:"lightgreen", color:'white'}} to="/form" data-aos="fade-left" data-aos-delay="300">
                        <button style={{padding:'5px', background:"lightgreen", border:'none', color:'white'}}><FontAwesomeIcon icon={faUserAlt}/> Sign Up</button>
                    </Link>
                  )}
                   
              </ul>

              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
