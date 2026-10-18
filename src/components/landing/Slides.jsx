import React, { useState, useEffect } from 'react';
import image2 from '../../assets/pexels-pixabay-289737.jpg';
import image4 from '../../assets/pexels-pixabay-256455.jpg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faPlay } from "@fortawesome/free-solid-svg-icons";
import '../../style/slide.css';
import { FaFacebook, FaFacebookF, FaInstagram, FaPhone, FaWhatsapp } from 'react-icons/fa';

function Slide() {
    const phrases = [
    "Experience Education with Class.",
    "Your Future Starts Here.",
    "Empowering Dreams.",
    "Start your journey with us today.",
    "And experience class."
  ];

  const IN_MS = 800;      
  const STAY_MS = 3000;   
  const OUT_MS = 800;     

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("in"); 

  useEffect(() => {
    
    const outTimer = setTimeout(() => setPhase("out"), STAY_MS);
    
    const nextTimer = setTimeout(() => {
      setIndex((i) => (i + 1) % phrases.length);
      setPhase("in");
    }, STAY_MS + OUT_MS);

    return () => {
      clearTimeout(outTimer);
      clearTimeout(nextTimer);
    };
  }, [index]);

  return (
    <>
    <section className="about-contact-section" style={{ overflowX: 'hidden' }} id='About-us'>
      <div className="slidecontainer">
        
        <div className="slide-overlay">
          <span
            key={`${index}-${phase}`}
            className={phase === "in" ? "slide-in" : "slide-out"}
          >
            {phrases[index]}
          </span>
          <div className="slide-contact">
            <div className="info">
              <div className="circle"></div>
              <span>i</span>
              <p>Contact us for more information.</p>
            </div>
            <div className="contact-links">
              <a href="https://youtube.com/@dreamscholarship-g5v?si=HXCee4IHVN3wxZIG" target="_blank" rel="noopener noreferrer" style={{  padding:'10px', borderRadius:'10px'}}>
              <FontAwesomeIcon icon={faPlay} className="icon" style={{color:'red'}}/> Youtube
            </a>
            <a href="https://www.facebook.com/share/19s1y7mhVG/" target="_blank" rel="noopener noreferrer" >
                <FaFacebook style={{color:'blue', borderRadius:'10px', fontSize:'1.5em'}}/> facebook
              </a>
              <a href="https://www.instagram.com/dreamscholarships?igsh=MXU5NGZzbXlucnc3Yw==" target="_blank" rel="noopener noreferrer" >
                <FaInstagram style={{color:'purple', fontSize:'1.5em'}}/> Instagram
              </a>
            <a href="#" target='_black' >
              <FaWhatsapp style={{color:"green", fontSize:'1.5em'}}/> WhatsApp
            </a>
            </div>
            <div className="logo">
              Dream Scholarship
              <div className="image">
                  <img src="/logo1.jpeg" alt="Dream Scholarships logo" />
              </div>
            </div>
          </div>
        </div>
      </div> 
    </section>
    </>
  );
}

export default Slide;
