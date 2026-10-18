import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserAlt,
  faComment,
  faBellConcierge,
  faQuoteLeft,
  faInfoCircle,
  faMessage,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../context/AuthContext";
import { useProfileAvatar } from "../../hooks/avaterpic";
import '../../style/dashboardmain.css'
import svg1 from "../../assets/undraw_love-it_8pc0.svg"
import svg2 from "../../assets/undraw_profile-data_xkr9.svg"
import Footer from"./dashboardfooter.jsx"

export default function DashboardOverview({ setToshow }) {
  const { profile } = useProfile();
  const { user } = useAuth();
  const userId = user?.id || null;
  const { avatarUrl } = useProfileAvatar(userId);

  const firstName = profile?.first_name || "Dream Scholar";
  const lastName = profile?.second_name || "😊";
  const fullName = `${firstName} ${lastName}`.trim();
  const email =
    profile?.user_email || profile?.email || "example@email.com";
  const avatar = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff&size=128`;

  
  return (
    <>
    <div className="Overview">
        <div className="Overviewheader">
          <div className="welcome">
          <div className="welcometext">
              <h1>Welcome {firstName}!🎉</h1>
              <div>
                <p>It's nice to have you here!</p>
              <p>Feel free to go through your profile😊</p>
              </div>    
          </div>
           <div className="overviewprofile">
              <div className="pic">
                <img src={avatar} alt="" />
              </div>
              <div className="overviewinfo">
                <div className="info1">
                 <h2>{fullName}</h2>
                 <span >{email}</span>
                 <span>Not Registered</span>
                 <span style={{color:'white', display:'flex', alignItems:'center', gap:'10px'}}>Active <div className="dot"></div></span> 
                </div>
                <div className="svg">
                  <img src={svg2} alt="" />
                </div>
              </div>
           </div>
          </div>
          <div className="welcomedeco">
            <img src={svg1} alt="" />
          </div>
        </div>
        <div className="overviewmain">
          <div className="card">
              <div className="cardsheader">
                <h3><FontAwesomeIcon icon={faComment}/> Chats</h3>
                <span></span>
              </div>
              <div className="action">
                you have no recent Chats
              </div>
               <div className="card-footer">
              <button onClick={() => setToshow("chats")}>view more</button>
              </div>
          </div>


          <div className="card">
              <div className="cardsheader">
                <h3><FontAwesomeIcon icon={faBell}/> Notifications</h3>
                <span></span>
              </div>
              <div className="action">
                you have no recent Notifications
              </div>
               <div className="card-footer">
              <button onClick={() => setToshow("notifications")}>view more</button>
              </div>
          </div>

          <div className="card">
              <div className="cardsheader">
                <h3><FontAwesomeIcon icon={faQuoteLeft}/> Testimonial</h3>
                <span></span>
              </div>
              <div className="action">
                you have no recent Testimonial
              </div>
               <div className="card-footer">
              <button onClick={() => setToshow("testimonial")}>view more</button>
              </div>
          </div>


          <div className="card">
              <div className="cardsheader">
                <h3><FontAwesomeIcon icon={faInfoCircle}/> Status</h3>
                <span></span>
              </div>
              <div className="action">
                No active Status
              </div>
              <div className="card-footer">
              <button onClick={() => setToshow("status")}>view more</button>
              </div>
          </div>
        </div>
        <div className="recentactions">
          <div className="recentheader">
            Recent Actions
          </div>
          <div className="recentaction-body">
            No recent actions..
          </div>
          <div>Dream Scholarships</div>
        </div>
    </div>
    <div className="footer">
        <Footer/>
      </div>
    </>
  );
}
