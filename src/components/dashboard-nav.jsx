import Avater from "../hooks/profilepic"
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useProfile } from '../hooks/useProfile';
import {faBell, faList, faUserAlt, faArrowCircleLeft, faG, faGear, faComment, faBellSlash, faBellConcierge, faQuoteLeft, faInfoCircle, faExclamationTriangle, faThLarge, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import DashboardForms from "./userDashboardforms";
import { useState, useEffect, useRef } from "react";
import {useProfileAvatar} from "../hooks/avaterpic"

export default function Dashboardnav({ setToshow }) {
  const [openMobile, setOpenmobile] = useState(false);
  const { profile } = useProfile();
  const {user} = useAuth();
  const userId = user?.id || null;
  const { avatarUrl, loading } = useProfileAvatar(userId);
  const {close, setclose}  = useState(false);
  const sidebarRef = useRef(null);
  const [time, setTime] = useState(new Date());

  const firstName = profile?.first_name || "Dream Scholars";
  const lastName = profile?.second_name || "Scholar!😊";
  const fullName = `${firstName} ${lastName}`.trim();
  const encodedName = encodeURIComponent(fullName);
  const avatar = avatarUrl  || `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=128`;
  const email = profile?.user_email || profile?.email || "example@email.com";
    
  const mobile = () => {
    setOpenmobile(!openMobile);
  }

 useEffect(() => {
  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setOpenmobile(false); // close sidebar
    }
  };

  // Prevent scrolling when sidebar is open
  if (openMobile) {
    document.body.style.overflow = "hidden"; // disable scroll
  } else {
    document.body.style.overflow = "auto"; // enable scroll
  }

  return () => {
    document.body.style.overflow = "auto"; // ensure scroll restored
    window.removeEventListener("click", handleClickOutside);
  };
 }, [openMobile]);


  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM:SS
  const formattedTime = time.toLocaleTimeString();

    return (
        <>
        <div className="logo">
            <div className="icon" 
            style={{
              transform: "rotate(0deg)",
              width: '30%',
              background: 'rgba(255, 255, 255, 0.92)',
              display: 'flex',
              gap: "10px",
              padding: "0px",
              color: "#03022ce1",
              boxShadow: "#03022ce2 4px 6px 0px"
            }}><FontAwesomeIcon icon={faChartLine} /> <span title='Scholarship agency'>DASHBOARD</span></div>
        </div>

        <div className="user-section">
            <div className="user-sec-btn">
               <div className="clock">
                  {formattedTime}
              </div>
            </div>

            <div className="user-sec-profile">
                <div className="user-details">
                   <span>{fullName}</span>
                    <span style={{color:'orange'}}>{email}</span>
                </div>
                
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="user-avatar"
                  style={{ width: "35px", height: "35px", borderRadius: "50%" }}
                />
            </div>
        </div>

        <div className="dashboard-mobile">
            <button onClick={mobile} style={{color:"#070220ff", border:"#070220ff solid 2px"}} className="aside-btn"><FontAwesomeIcon icon={faList}/></button>
           {openMobile === true && (  
            <div ref={sidebarRef} className={`aside-mobile ${openMobile ? "slide-in" : "slide-out"}`}>
                <div>
                 <div className="closebtn"
                  style={{
                  width: '100%',
                  display:"flex",
                  justifyContent:"space-between",
                  padding:'5px',
                  fontSize:"0.7rem",
                  alignItems:'center',
                  margin:"0",
                  borderBottom:'1px solid #5f5f5f6b',
                  color:'#ffffffff',
              }}
              >
              <span>DASHBOARD</span>
              <button
                  onClick={mobile}
              style={{
                background:"none",
                border:"none"
              }}
              >❌</button></div>
                <div className="aside-head">
                     <img
                  src={avatar}
                  alt="User Avatar"
                  className="user-avatar"
                />
                <span>{fullName}</span>
                <span style={{color:'orange'}}>{email}</span>
                </div>
             <div className="button">
                <button onClick={() => {setToshow("Overview"); setOpenmobile(false)}}><FontAwesomeIcon icon={faUserAlt}/> Overview</button>
                <button onClick={() => {setToshow("profile"); setOpenmobile(false)}}><FontAwesomeIcon icon={faUserAlt}/> Profile</button>
                <button onClick={() => {setToshow("chats"); setOpenmobile(false)}}> <FontAwesomeIcon icon={faComment}/> Chats</button>
                <button onClick={() => {setToshow("notifications"); setOpenmobile(false)}}> <FontAwesomeIcon icon={faBellConcierge}/> Notifications</button>
                <button onClick={() => {setToshow("testimonial"); setOpenmobile(false)}}><FontAwesomeIcon icon={faQuoteLeft}/> Testimonial</button>
                <button onClick={() => {setToshow("status"); setOpenmobile(false)}}><FontAwesomeIcon icon={faInfoCircle}/> Status</button>
            </div>
            </div>
            <div className="preferences">
              <Link to='/'><button><FontAwesomeIcon icon={faArrowCircleLeft}/> Home</button></Link>  
                <button onClick={() => { setToshow("setting"); setOpenmobile(false) }}><FontAwesomeIcon icon={faGear}/> Settings</button>
              <DashboardForms/>
            </div>
    </div>
    )}
        </div>
        
        </>
    )
}