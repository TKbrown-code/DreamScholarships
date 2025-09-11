import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronCircleDown, faPlay, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <div className='nav'>
      <div className="navbar">
        <div className="logo">
          <div className="icon"><FontAwesomeIcon icon={faUserGraduate} style={{transform: 'rotate(-45deg)', fontSize:'0.8em', color:'rgba(160, 233, 205, 0.93)'}}/></div>
          <span title='Scholarship agency'>Dream Scholarships</span>
        </div>
      
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><a href="#Scholarships">Scholarships</a></li>
        <li><a href="#About-us">About us</a></li>
        <li><a href="#Testimonials">Testimonials</a></li>
        <li><a href="#FAQ">FAQ</a></li>
        <li>
          <div className="more">
            <a>More <FontAwesomeIcon icon={faChevronCircleDown}/></a>
            <div className="more-content">
              <Link to="/dictionary">Dictionary</Link>
              <Link to="/resource">Student Resource</Link>
            </div>
          </div>
        </li>
      </ul>
    </div>
    </div>
  );
}

export default Nav