import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronCircleDown, faPlay, faUserGraduate, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../../style/nav.css';

function Nav() {
  return (
    <div className='nav'>
      <div className="navbar">
        <div className="hero-logo-container">
          <div className="logo-components">
            <div className="logo-image">
              <img className='' src="/logo1.jpeg" alt="Dream Scholarships Logo" />
            </div>
            <div className="logo-text">
              <img className='' src="/logo-text.jpeg" alt="Dream Scholarships" />
            </div>
          </div>
        </div>

        <ul>
          <li><Link to="/">Home</Link></li>
          <li><a href="#Scholarships">Scholarships</a></li>
          <li><a href="#About-us">About Us</a></li>
          <li><a href="#Testimonials">Testimonials</a></li>
          <li><a href="#FAQ">FAQ</a></li>
          <li>
            <div className="more">
              <a>More <FontAwesomeIcon icon={faChevronCircleDown}/></a>
              <div className="more-content">
                <Link to="/dictionary">
                  <FontAwesomeIcon icon={faUserGraduate} className="menu-icon"/> Dictionary
                </Link>
                <Link to="/resource">
                  <FontAwesomeIcon icon={faPlay} className="menu-icon"/> Student Resource
                </Link>
              </div>
            </div>
          </li>
        </ul>
        <div className="hero-apply-btn-container">
          <Link to="/applyform" className='hero-apply-btn'>
            Apply <FontAwesomeIcon icon={faPaperPlane}/>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Nav