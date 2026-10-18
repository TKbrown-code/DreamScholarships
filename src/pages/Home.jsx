import Header from "../components/landing/Header";
import About_china from "../components/landing/About_china"
import Scholarships from "../components/landing/Scholarships"
import About from "../components/landing/About"
import Slide from "../components/landing/slides"
import Testimonial from "../components/landing/testimonial";
import Frequentlyaskquestions from "../components/landing/FRQ.jsx"
import Footer from "../components/landing/footer"
import Nav from "../components/landing/nav"
import Mobile from "../components/landing/mobileNav"
import { FaWhatsapp, } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

const Home = () => {

     const [isVisible, setIsVisible] = useState(false);

  // Show button when scrolled down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

    return (
        <>  <div className="home">
            <Mobile />
            <Nav />
            <Header />
            <Scholarships />
            <Slide />
            <About />
            <About_china />
            <Testimonial />
            <Frequentlyaskquestions />
            <Footer />
            </div>
             <a href={`https://wa.me/+8615241647328?text=${encodeURIComponent("Greetings, please can i know more about dream scholarships? (from website)")}`} className="whatsapp">
            <FaWhatsapp/>
            </a>

            {isVisible && (
        <button onClick={scrollToTop} className="back-to-top">
                <FontAwesomeIcon icon={faArrowCircleUp} />
            </button>
      )}

        </>
    );
};

export default Home;
