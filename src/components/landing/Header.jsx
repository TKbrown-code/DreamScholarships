import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faArrowRight, faPaperPlane, faUserAlt, faSignOutAlt, faChevronDown, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ErrorBoundary from '../../context/ErrorBoundary';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Headset } from "lucide-react";
import '../../style/hero.css';

export default function Header() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true,  offset: 50 });
  }, []);

  return (
    <ErrorBoundary>
      <header className="hero-header" style={{overflowX:'hidden'}}>
        <div className="overlay">
          <div className="content">
            <div className="header-content" data-aos="fade-down">
              <h1 data-aos="fade-right">
                <span className='header-cto'>Your Dream of</span> Studying in China <span className='header-cto'>is Just a Click Away!</span>
              </h1>
              <p data-aos="fade-right" data-aos-delay="100">
                Discover scholarships opportunities in china and get expert guidance through university selection. applications, and registration.
              </p>
              <div className="header-buttons" data-aos="fade-up" data-aos-delay="300">
                <button
                  type="button"
                  onClick={() => document.getElementById("Scholarships")?.scrollIntoView({ behavior: "smooth" })}
                  className='explore-btn'
                >
                  Explore Scholarships <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft:'5px' }} />
                </button>
                <a className='advisor-btn' href={`https://wa.me/+8615241647328?text=${encodeURIComponent("Greetings, please can i know more about dream scholarships? (from website)")}`} target="_blank" rel="noopener noreferrer">
                 <Headset /> Talk to an advisor
                </a>
              </div>
              <div className="hero-welcome">
                <div className="hero-welcards">
                  <h2>University Application Guidance</h2>
                  <p>Get step-by-step support from start to finish</p>
                </div>
                <div className="hero-welcards">
                  <h2>Scholarhips Opportunities</h2>
                  <p>Find the right programs for your goals.</p>
                </div>
                <div className="hero-welcards">
                  <h2>Personalized Student Support</h2>
                  <p>We're with you every step of the way</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>
    </ErrorBoundary>
  );
}
