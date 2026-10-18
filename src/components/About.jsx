import { useState } from 'react';
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import { faPlay, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { FaVolumeUp } from "react-icons/fa";
import image2 from '../assets/studentpic1.jpg';
import image1 from '../assets/studentpic2.jpg';
import image3 from '../assets/studentpic3.jpg';
import image4 from '../assets/bbc.jpg';
import image5 from '../assets/china-photo.jpg'; 
import '@fontsource/inter';       
import '@fontsource/inter/700.css'; 
import { Link } from "react-router"
import AOS from "aos";
import "aos/dist/aos.css";
import {supabase} from "../lib/Supabase"

function Presentation() {
    const [videoSource, setVideoSource] = useState("video");
    const [play, setPlay] = useState(true); 
    const [volume, setVolume] = useState(0);
    
    const video = "/videos/0808.mp4";
    const video1 = "/videos/0808fr.mp4";

   
    const handleOpen = () => {
    setVideoSource(prev => prev === "video" ? "videoFr" : "video");
    };

    const handlePlayPause = () => setPlay(!play);
    const handleMute = () => setVolume(volume === 1 ? 0 : 1);

    const videoRef = React.useRef(null);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true,  offset: 50 });
    }, []);

   React.useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = volume === 0;
    videoRef.current.volume = volume;

    // Force video to reload the new source
    videoRef.current.load();

    if (play) {
        const p = videoRef.current.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
        videoRef.current.pause();
    }
}, [play, volume, videoSource]);


    return (
        <>
        <section className="presentation" data-aos="fade-up" style={{overflowX:'hidden'}}>
            <div className="video" data-aos="zoom-in">
                <div className="video-container">
                    <video
                        ref={videoRef}
                        loop                     
                        style={{ width: "100%" }}
                        autoPlay
                        muted={volume === 0}
                        playsInline
                    >
                        <source 
                            src={videoSource === "video" ? video : video1} 
                            type="video/mp4" 
                        />

                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
            <div className="presentation-footer" data-aos="fade-up">
                <button onClick={handleOpen} title='click to switch video language'>
                    {videoSource === "video" ? "Click here to watch video in French" : "Click here to watch video in English"}
                </button>
                <div className="controls">
                    <button
                        style={{ background: 'none', border: 'none', width: '50px' }}
                        onClick={handlePlayPause}
                        title={play ? "Pause" : "Play"}
                    >
                        <FontAwesomeIcon icon={faPlay} style={{ color: 'white' }} />
                    </button>
                    <button
                        style={{ background: 'none', border: 'none', width: '50px' }}
                        onClick={handleMute}
                        title={volume === 1 ? "Mute" : "Unmute"}
                    >
                      {volume ===1 ? (<FaVolumeUp style={{ color: 'white' }} />) : (<FontAwesomeIcon icon={faVolumeMute} style={{ color: 'white' }} />)}
                    </button>
                </div>
            </div>
        </section>
        <div className="presentation-footer-mobile" data-aos="fade-up" style={{overflowX:'hidden'}}>
                <button onClick={handleOpen}>
                    {videoSource === "video" ? "Click here to watch video in French" : "Click here to watch video in English"}
                </button>
                <div className="controls">
                    <button
                        style={{ background: 'black', border: 'none', width: '50px' }}
                        onClick={handlePlayPause}
                        title={play ? "Pause" : "Play"}
                    >
                        <FontAwesomeIcon icon={faPlay} style={{ color: 'red' }} />
                    </button>
                    <button
                        style={{ background: 'black', border: 'none', width: '50px' }}
                        onClick={handleMute}
                        title={volume === 1 ? "Mute" : "Unmute"}
                    >
                      {volume ===1 ? (<FaVolumeUp style={{ color: 'red',background: 'black' }} />) : (<FontAwesomeIcon icon={faVolumeMute} style={{ color: 'red',background: 'black' }} />)}
                    </button>
                </div>
            </div>
        </>
    );
}

function Vision() {
    useEffect(() => { AOS.init({ duration: 1000, once: true }); }, []);

    const paragraphs = [
        "We believe that education is the key to success and we are dedicated to helping students unlock their full potential. We are committed to providing the best possible service to our clients and we strive to exceed their expectations. We believe in integrity, transparency, and professionalism in all our dealings with our clients.",
        "We are passionate about helping students achieve their dreams and we are proud to be a part of the Dream Scholarship community. We believe that every student deserves the opportunity to study abroad and we are committed to making that happen. We are constantly striving to improve our services and we welcome feedback from our clients to help us achieve that goal."
    ];

    return (
        <>
        <section className="vision" data-aos="fade-right" style={{overflowX:'hidden'}}>
            <div className="vision-header" data-aos="fade-down">
                <h1>Our Vision</h1>
                <p>To be the leading agency in providing students with the best opportunities to study abroad and achieve their academic goals.</p>
                <div className="line"></div>
            </div>
            <div className="vision-container">
                <div className="vision-image" data-aos="zoom-in" data-aos-delay="200">
                    <img src={image3} alt="Our Vision" />
                </div>
                <div className="vision-text">
                    {paragraphs.map((p, idx) => (
                        <p key={idx} data-aos="fade-left" data-aos-delay={300 + idx * 150}>{p}</p>
                    ))}
                </div>
            </div>
        </section>

        <section data-aos="fade-up" style={{overflowX:'hidden'}}>
            <div className="flag">
                <img src={image5} alt="" />
                <div className="flag-overlay" data-aos="zoom-in" data-aos-delay="200">
                    <h1>We make Studying Abroad a Reality.</h1>
                    <p>Join us as an agent in our mission to empower students to achieve their academic goals and make their dreams of studying abroad a reality.</p>
                    <Link to="/apply">Join <FontAwesomeIcon icon={faPlay}/></Link>
                </div>
            </div>
        </section>
        </>
    );
}

function Mission() {
    useEffect(() => { AOS.init({ duration: 1000, once: true }); }, []);

    const paragraphs = [
        "We help students navigate the scholarship application process and provide them with the resources they need to succeed. Our team is dedicated to providing personalized support to each student, ensuring they have the best chance of securing a scholarship. We also offer guidance on studying abroad, including information on universities, courses, and living arrangements.",
        "Our mission is to empower students to achieve their academic goals and make their dreams of studying abroad a reality. We are committed to providing the highest level of service and support to our clients, helping them every step of the way."
    ];

    return (
        <>
        <section className="mission" data-aos="fade-left" style={{overflowX:'hidden'}}>
            <div className="mission-header" data-aos="fade-down">
                <h1>Our Mission</h1>
                <p>To provide students with the best opportunities to study abroad and achieve their academic goals.</p>
                <div className="line"></div>
            </div>
            <div className="mission-container">
                <div className="mission-text">
                    {paragraphs.map((p, idx) => (
                        <p key={idx} data-aos="fade-right" data-aos-delay={200 + idx * 150}>{p}</p>
                    ))}
                </div>
                <div className="mission-image" data-aos="zoom-in" data-aos-delay="400">
                    <img src={image2} alt="Our Mission" />
                </div>
            </div>
        </section>
        </>
    );
}


 function Team() {
  const [team, setTeam] = useState([]);
  const [avatars, setAvatars] = useState({}); // Map of admin_id => avatar URL

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchTeam = async () => {
      try {
        // Fetch admins from Supabase
        const { data: admins, error } = await supabase
          .from("admins")
          .select("*")
          .order("position", { ascending: true });

        if (error) {
          console.log("Failed getting team: " + error.message);
          return;
        }

        setTeam(admins || []);

        // Download avatars from Supabase storage
        const avatarMap = {};
        await Promise.all(
          (admins || []).map(async (admin) => {
            if (admin.avatar_path) {
              const { data, error } = await supabase.storage
                .from("admin-avatar")
                .download(admin.avatar_path);
              if (!error && data) {
                const url = URL.createObjectURL(data);
                avatarMap[admin.id] = url;
              } else {
                avatarMap[admin.id] = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  admin.admin_name || "Admin"
                )}&background=random&color=fff&size=128`;
              }
            } else {
              avatarMap[admin.id] = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                admin.admin_name || "Admin"
              )}&background=random&color=fff&size=128`;
            }
          })
        );
        setAvatars(avatarMap);
      } catch (err) {
        console.error("Unexpected error fetching team:", err);
      }
    };

    fetchTeam();

    // Cleanup blob URLs on unmount
    return () => {
      Object.values(avatars).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const teamFooter = {
    marginTop: "40px",
    textAlign: "center",
    padding: "20px",
    lineHeight: "1.6",
    color: "#181717",
    fontSize: "16px",
  };

  return (
    <section className="team" style={{overflowX:'hidden'}}>
      <div className="team-header" data-aos="fade-down">
        <h1>Meet Our Team</h1>
        <p>
          We are a team of dedicated professionals committed to helping students 
          achieve their dreams through scholarships and educational opportunities.
        </p>
        <div className="line"></div>
      </div>

      <div className="team-container" style={{overflowX:'hidden'}}>
        {team.map((member) => (
          <div 
            key={member.id} 
            className="team-member" 
            data-aos="zoom-in" 
            data-aos-delay={String(member.id ? member.id * 150 : 0)}
          >
            <div className="team-img">
              <img src={avatars[member.id]} alt={member.admin_name} />
              <div className="overlay" data-aos="fade-up">
                <a href="#"><FaLinkedin /></a>
                <a href="#"><FaTwitter /></a>
                <a href={`mailto:${member.admin_email}`}><FaEnvelope /></a>
              </div>
            </div>
            <h3>{member.admin_name}</h3>
            <p>{member.position}</p>
          </div>
        ))}
      </div>
      <div className="team-footer" style={teamFooter}>
        <p>
          Our team is passionate about helping students achieve their dreams and we are proud to be a part of the Dream Scholarship community. We believe that every student deserves the opportunity to study abroad and we are committed to making that happen. We are constantly striving to improve our services and we welcome feedback from our clients to help us achieve that goal.
        </p>
        <span>
          <a href="/team">Click here to see all our Team Members</a>
        </span>
      </div>
    </section>
  );

}

function About() {
    const images = [image1, image2, image3, image4];
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
        const interval = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);
    
    const paragraphs = [
        "We are an agency founded by a group of students located in the Northeast of China. Our mission is to provide students with the best opportunities to study abroad and achieve their academic goals. We understand the challenges students face when applying for scholarships and studying abroad, and we are here to help.",
        "Our team is made up of experienced professionals who have a deep understanding of the scholarship application process and the requirements for studying abroad. We are passionate about helping students achieve their dreams and we are committed to providing the best possible service to our clients. We believe that education is the key to success and we are dedicated to helping students unlock their full potential. We are proud to be a part of the Dream Scholarship community and we look forward to helping you achieve your academic goals. Thank you for considering us as your partner in your academic journey."
    ];

    return (
        <>
            <section>
                <div className="about-header" data-aos="fade-down" style={{overflowX:'hidden'}}>
                    <h1>About Us</h1>
                    <p>We are a team of dedicated professionals committed to helping students achieve their dreams through scholarships and educational opportunities.</p>
                    <div className="line"></div>
                </div>
                <div className="about-container">
                    <div className="about-text">
                        {Array.isArray(paragraphs) && paragraphs.map((p, idx) => (
                        <p
                            key={idx}
                            data-aos="fade-right"
                            data-aos-delay={String(200 + idx * 150)}
                        >
                        {p}
                        </p>
                    ))}

                    </div>
                    <div className="imageslides" data-aos="zoom-in" data-aos-delay="400">
                        <div className="image-container">
                            <img src={images[currentImage]} alt="About Us" />
                        </div>
                    </div>
                </div>
            </section>
            <Presentation />
            <Vision />
            <Mission />
            <Team />
        </>
    );
}
export default About;
