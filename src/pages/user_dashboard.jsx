import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/Supabase';
import { useAuth } from '../context/AuthContext';
import DashboardForms from "../components/dashboard/userDashboardforms";
import Avater from "../hooks/profilepic"
import "../style/dashboard.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt,  faArrowCircleLeft, faUserGraduate, faGear, faComment, faBellConcierge, faQuoteLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Nav from "../components/dashboard/dashboard-nav";
import Profils from "../components/dashboard/profile";
import Chats from "../components/dashboard/chats";
import Notifications from "../components/dashboard/Notifications";
import Status from "../components/dashboard/status";
import Testimonial from "../components/dashboard/dashboardTestimonial";
import Settings from "../components/dashboard/settings";
import DashboardOverview from '../components/dashboard/Dashoard-overview';
import Footer from '../components/dashboard/dashboardfooter';
import Loading from "../hooks/loading";

const UserDashboard = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [toShow, setToshow] = useState("Overview");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return setProfileLoading(false);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      setProfile(data || null);
      setProfileLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (loading || profileLoading) return <Loading/>;

  return (
    <>
      <div className="dashboard_body">
        <div className="Dashboard-nav">
         <Nav toShow={toShow} setToshow={setToshow} />
        </div>
          <div className="aside">
             <div className="logo">
                 <div className="icon"><FontAwesomeIcon icon={faUserGraduate} style={{transform: 'rotate(-45deg)', fontSize:'1.5em', color:'#c4ffe4b2',}}/></div>
                 <span title='Scholarship agency'>Dream Scholarships</span>
              </div>
            <div className="button">
                 <button onClick={() => setToshow("Overview")}><FontAwesomeIcon icon={faUserAlt}/> Overview</button>
                 <button onClick={() => setToshow("profile")}><FontAwesomeIcon icon={faUserAlt}/> Profile</button>
                 <button onClick={() => setToshow("chats")}> <FontAwesomeIcon icon={faComment}/> Chats</button>
                 <button onClick={() => setToshow("notifications")}> <FontAwesomeIcon icon={faBellConcierge}/> Notifications</button>
                 <button onClick={() => setToshow("testimonial")}><FontAwesomeIcon icon={faQuoteLeft}/> Testimonial</button>
                 <button onClick={() => setToshow("status")}><FontAwesomeIcon icon={faInfoCircle}/> Status</button>
            </div>
            <div className="preferences">
              <Link to='/'><button><FontAwesomeIcon icon={faArrowCircleLeft}/> Home</button></Link>  
              <button onClick={() => setToshow("setting")}><FontAwesomeIcon icon={faGear}/> Settings</button>
              <DashboardForms/>
            </div>
          </div>
          <div className="main">
            {toShow === "profile" && (<Profils/>)} 
            {toShow === "chats" && (<Chats/>)}
            {toShow === "notifications" && (<Notifications/>)}
            {toShow === "testimonial" && (<Testimonial/>)}
            {toShow === "status" && (<Status/>)}
            {toShow === "setting" && (<Settings/>)}
            {toShow ===  "Overview" && (<DashboardOverview/>)}
          </div>
      </div>
    </>
  );
};

export default UserDashboard;
