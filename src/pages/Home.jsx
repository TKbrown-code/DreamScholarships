import Header from "../components/Header";
import Welcome from "../components/welcome"
import About_china from "../components/about_china"
import Scholarships from "../components/scholarships"
import About from "../components/About"
import Slide from "../components/slides"
import Testimonial from "../components/testimonial";
import Frequentlyaskquestions from "../components/frq"
import Footer from "../components/footer"
import Nav from "../components/nav"
import Mobile from "../components/mobileNav"
import { FaWhatsapp, } from "react-icons/fa";
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
            <Welcome />
            <About_china />
            <Scholarships />
            <Slide />
            <About />
            <Testimonial />
            <Frequentlyaskquestions />
            <Footer />
            </div>
             <a href="https://wa.me/+8615241647328" className="whatsapp">
            <FaWhatsapp/>
            </a>

            {isVisible && (
        <button onClick={scrollToTop} className="back-to-top">
                ↑
            </button>
      )}

        </>
    );
};

export default Home;
