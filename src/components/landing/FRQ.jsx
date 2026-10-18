import { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../style/faq.css";

export default function Frequentlyaskquestions() {
    const faqs = [
        {
            q: "Who is eligible to apply for these scholarships?",
            a: "Our scholarships are open to students from all countries and Specific eligibility criteria vary by scholarship program, but applying applicants must at least be a high school graduate"
        },
        {
            q: "What does the scholarship cover?",
            a: "Most of our scholarships cover full tuition fees for the duration of your degree program. Many also include additional benefits such as accommodation allowances, living stipends, health insurance, and funding for research or conference attendance. The exact benefits depend on the specific scholarship you receive."
        },
        {
            q: "Can I apply for more than one scholarship?",
            a: "Yes, you may apply for multiple scholarships if you meet the eligibility criteria for each. However, you can only receive one scholarship from our program. Our committee will automatically consider you for all scholarships you qualify for based on your single application."
        },
        {
            q: "What are the selection criteria?",
            a: "Selection is based on a combination of academic achievement, Country/Region and quality of application materials. For some programs, field of study and career goals may also be considered. The weight given to each factor varies by scholarship."
        },
        {
            q: "When will I be notified about the decision?",
            a: "All applicants will be notified immidiately their appliccation have been approved. If you are selected for an interview, you will be informed by the Customer Service (A0dmin). Please ensure the contact information in your application is accurate and check your email regularly."
        }
    ];

    // one boolean per FAQ; false = closed
    const [open, setOpen] = useState(() => faqs.map(() => false));

    const toggle = (index) => {
        setOpen(prev => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    };

    useEffect(() => {
        AOS.init({ duration: 1000, once: true,  offset: 50 }); // Initialize AOS
    }, []);

    return (
        <section className="faq-section" style={{overflowX:'hidden'}}>
            <div className="faq-container" id='FAQ'>
                <div className="h" data-aos="fade-down">
                    <h1>Frequently Asked Questions</h1>
                    <p className="small">Here are some of the most common questions we receive about our scholarship programs. If you have a question that isn't answered here, please feel free to contact us directly.</p>
                    <div className='line' data-aos="fade-right"></div>
                </div>
                {faqs.map((item, idx) => (
                    <div className={`frq-card ${open[idx] ? "open" : ""}`} key={idx} >
                        <div className="faq-header" data-aos="fade-up" >
                            <button
                                onClick={() => toggle(idx)}
                                aria-expanded={open[idx]}
                                aria-controls={`faq-${idx}`}
                                className="faq-toggle-btn"
                            >
                                <h3>{item.q}</h3>
                                <span aria-hidden="true">
                                    {open[idx] ? <FaChevronUp /> : <FaChevronDown />}
                                </span>
                            </button>
                        </div>
                        <div
                            id={`faq-${idx}`}
                            className="faq-content"
                            style={{ maxHeight: open[idx] ? "200px" : "0" }}
                        >
                            <p>{item.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
