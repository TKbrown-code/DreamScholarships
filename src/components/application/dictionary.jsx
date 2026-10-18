import React, { useEffect, useState } from "react";
import "../../style/dictionary.css";
import "aos/dist/aos.css";
import AOS from "aos";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronCircleDown, faPlay, faUserGraduate, faSearch, faBook } from '@fortawesome/free-solid-svg-icons';
import { FaWhatsapp } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function ScholarshipDictionary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      once: true,
      mirror: false,
    });
  }, []);

  // Dictionary terms
  const dictionaryTerms = [
    {
      term: "Scholarship",
      description:
        "A scholarship is a financial aid award given to a student to further their education, typically based on academic merit, financial need, or other criteria.",
      types: [
        "Merit-based Scholarships: Awarded based on academic achievement.",
        "Specialized Scholarships: For students with specific talents or backgrounds.",
        "Fully Funded Scholarships: Everything covered including tuition, Accommodation and stipends.",
        "Partially Funded Scholarships: Either Accommodation or tuition is covered but depends on the situation.",
      ],
    },
    {
      term: "Documents",
      description: "Common terms used for document processing:",
      types: [
        "JW202: A document provided by the school to show proof of admission and payment of fees including funding status. Needed for visa application.",
        "Admission Letter: Provided by the school if applicant has been accepted into a particular university.",
        "Criminal Record: Provided by the police in your country of residence, needed to apply for any form of scholarship.",
        "Parental Authorization: Provided by authorities for children below 21.",
        "Passport: Shows proof of citizenship; needed for scholarship and visa application.",
      ],
    },
    {
      term: "Others",
      description: "Other terms used on the webpage:",
      types: [
        "Open: School is still open to receive students.",
        "Close: School is no longer open to receive students.",
        "Deadline: Date at which the school will close its door for students.",
        "Funding: Refers to finances including who is responsible during your study period.",
        "Bank Statement: Proof of finance from either the sponsor or family account, needed for visa and school applications.",
      ],
    },
  ];


  // Filter dictionary terms
  const filteredTerms = dictionaryTerms.filter((d) =>
    d.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dictionary">
      {/* Navbar */}
      <nav>
        <div className="logo" data-aos="fade-right">
          <i className="fas fa-graduation-cap"></i>
          <span>DREAM SCHOLARSHIP</span>
        </div>
        <div data-aos="fade-left" className="home">
        <Link style={{color:'white', listStyle:'none'}} to="/">HOME</Link>
        </div>
      </nav>

      {/* Header */}
      <div className="header" data-aos="fade-down" data-aos-delay="200">
        <div className="header-content" data-aos="fade-right" data-aos-delay="200">
          <h1>Scholarship Dictionary</h1>
          <p>Welcome to the Scholarship Dictionary! Here, you can find definitions and explanations of various scholarship-related terms.</p>
        </div>
        <div className="search-container" data-aos="fade-left" data-aos-delay="200">
          <input
            type="search"
            placeholder="Search for a term..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button style={{width:'20%', border:"none", background:'lightgreen'}} type="button">
            <FontAwesomeIcon icon={faSearch}/>
          </button>
        </div>
        <FontAwesomeIcon icon={faBook}/>
      </div>

      {/* Dictionary Section */}
      <main>
        <section id="dictionary" data-aos="fade-down" data-aos-delay="200">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((item, idx) => (
              <div key={idx} className="term">
                <h3 data-aos="fade-right" data-aos-delay="200">{item.term}</h3>
                <p data-aos="fade-left" data-aos-delay="200">{item.description}</p>
                {item.types && (
                  <ul data-aos="fade-right" data-aos-delay="200">
                    {item.types.map((type, i) => (
                      <li key={i}>{type}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p>No matching term found.</p>
          )}
        </section>

        {/* WhatsApp Button */}
        <a href="https://wa.me/+8615241647328" className="whatsapp">
          <FaWhatsapp/>
        </a>

      </main>
    </div>
  );
}
