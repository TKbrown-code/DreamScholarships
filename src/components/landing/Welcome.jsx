import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faFunnelDollar, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Section_one() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const cards = [
    { icon: faFunnelDollar, title: 'Fully Funded Scholarships', description: 'Explore a wide range of fully funded scholarships that cover tuition, living expenses, and more.' },
    { icon: faUserGraduate, title: 'Partially Funded Scholarships', description: 'Discover partially funded scholarships that help reduce your financial burden while studying in China.' },
    { icon: faLock, title: 'Secure Your Future', description: 'Gain access to top universities in China and secure your future with a world-class education.' },
    { icon: faEnvelope, title: '24/7 Support', description: 'Get round-the-clock support from our team to guide you through the scholarship application process.' }
  ];

  const cardElements = cards.map((card, index) => (
    <div className="card" key={index} data-aos="fade-up" data-aos-delay={index * 150}>
      <div className="card-icon">
        <FontAwesomeIcon icon={card.icon} style={{ fontSize: '2em', color: 'rgba(78, 245, 181, 1)' }} /> 
      </div>
      <h3>{card.title}</h3>
      <p>{card.description}</p>
    </div>
  ));

  return (
   <>
   <section id='welcome-section' style={{overflowX:'hidden'}}>
    <div className="welcome-section">
      <div className="welcome-cards">
        {cardElements}
      </div>
      <div className="welcome" data-aos="fade-left" data-aos-delay="600">
        <h2>Your Gateway from Africa to a World-Class Education in China</h2>
        <p>We don’t just find scholarships — we open doors. At Dream Scholarship, we empower African students to achieve their dreams through fully and partially funded opportunities in China’s top universities. Let’s make your global journey a reality.</p>
      </div>
    </div>
   </section>
   </>
  );
}
