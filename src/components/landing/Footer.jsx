import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/Supabase"; // Supabase client
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../style/footer.css";

export default function Footer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subemail, setSubemail] = useState("")
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false); // modal visibility
  const [sub, setSub] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true,  offset: 50 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .insert([{ name: name, email: email, message: message }]);

      if (error) {
        console.error(error);
        setStatus("❌ Failed to send message.");
      } else {
        setStatus(""); // clear status
        setName("");
        setEmail("");
        setMessage("");
        setShowModal(true); // show thank-you modal
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Something went wrong while sending your message.");
    }
  };

  const userSubcrib = async () => {
  // simple regex to validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!subemail || !emailRegex.test(subemail)) {
    console.log("Invalid email address!");
    setSub("Please enter a valid email address");
    return;
  }

  const { data, error } = await supabase
    .from("subscribers")
    .insert([{ email: subemail }]);

  if (error) {
    console.log("Subscription failed!", error.message);
    setStatus("Subscription failed. Please try again.");
    return;
  } else {
    setSubemail("");
    setShowModal(true);
    setSub("")
  }
};


  const closeModal = () => {setShowModal(false)};

  return (
    <footer className="footer landing-footer" style={{overflowX:'hidden'}}>
      <div className="footer-sectionone">
        <div className="section1" data-aos="fade-right">
          <h2>Dream Scholarship</h2>
          <p>
            Empowering students All Across Africa to achieve their academic
            dreams through Professional support and mentorship.
          </p>
          <p>
            Our mission is to provide scholarships that enable talented students
            from all backgrounds to pursue higher education and realize their
            full potential.
          </p>
          <p>
            We believe that education is a powerful tool for change, and we are
            committed to making it accessible to all.
          </p>
          <p>Join us in our mission to transform lives through education.</p>
          <Link to="/apply">
            <button>
              Join <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </Link>
        </div>

        <div className="section2" data-aos="fade-left">
          <div className="send-message">
            <h2>Send us a message</h2>
            <p>Have questions or need assistance? We're here to help!</p>
            <form className="message-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <button type="submit">Send Message</button>
              <p>{status}</p>
            </form>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Thank you!</h2>
            <p>Your message has been sent successfully.</p>
            <p>We appreciate you contacting Dream Scholarship.</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      <p className="subscription-status" role="status">{sub}</p>

      <div className="footer-content" data-aos="fade-up" data-aos-delay="200">
        <div className="links">
          <p>
            Contact us:{" "}
            <a href="mailto:DreamScholarship@gmail.com">
              DreamScholarship@gmail.com
            </a>
          </p>
          <p>
            Follow us on{" "}
            <a
              href="https://www.facebook.com/share/19s1y7mhVG/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>{" "}
            and{" "}
            <a
              href="https://www.instagram.com/dreamscholarships?igsh=MXU5NGZzbXlucnc3Yw=="
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </p>
        </div>

        <div className="footer-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-service">Terms of Service</a>
        </div>

        <div className="footerend">
          <p>&copy; {new Date().getFullYear()} Dream Scholarships. All rights reserved.</p>
          <p>Created EX-TECH</p>
        </div>
      </div>

    </footer>
  );
}
