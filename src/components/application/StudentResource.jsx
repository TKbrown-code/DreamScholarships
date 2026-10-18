// src/components/StudentResource.jsx
import React, { useEffect } from "react";
import "../../style/dictionary.css";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronCircleDown, faPlay, faUserGraduate } from '@fortawesome/free-solid-svg-icons';

export default function StudentResource() {
  useEffect(() => {
    // If you had any JS in student_resource.js, you can import it here
    // For example: import("../jspages/student_resource.js");
  }, []);

  return (
    <div>
      {/* Navbar */}
      <div className='nav'>
            <div className="navbar">
              <div className="logo">
                <div className="icon"><FontAwesomeIcon icon={faUserGraduate} style={{transform: 'rotate(-45deg)', fontSize:'0.8em', color:'rgba(160, 233, 205, 0.93)'}}/></div>
                <span title='Scholarship agency'>Dream Scholarship</span>
              </div>
        <ul>
          <Link style={{color:'white', textDecoration:'none'}} to='/'>HOME</Link>
          <Link style={{color:'white', textDecoration:'none'}} to="/dictionary">DICTIONARY</Link>
        </ul>
      </div>
    </div>

      {/* Header */}
      <div className="header1">
        <div className="header-content">
          <div className="decor"></div>
          <h1>STUDENT RESOURCE</h1>
          <p>Feel free to go through this to see the necessary documents and procedures.</p>
          <p>Contact us if you have any difficulty!</p>
        </div>
      </div>

      {/* Sections */}
      <section>
        <div className="documents-header">
          <h2>DOCUMENTS</h2>
          <div className="line"></div>
        </div>

        <div className="parent-authorise">
          <h3>Parental Authorization</h3>
          <p>This is a document for individuals below the age of 21. The procedure is as follows.</p>
          <ul>
            <li><strong>Where to do this document:</strong> Can be done at the central police in one of the 10 regions.</li>
            <li><strong>Need:</strong> All individuals under the age of 21 are required to make this document in order to obtain a passport.</li>
            <li><strong>People you need for this document:</strong> Either the mother or father of this individual is needed for this document. (A relative can be used if they share the same name as the individual).</li>
            <li><strong>Documents you need:</strong> Certified photocopy of both parent and individual's ID cards, certified photocopy of individual's birth certificate.</li>
          </ul>
        </div>
      </section>

      <section>
        <div className="criminal-record">
          <h3>Criminal Record</h3>
          <p>This is a document to prove that the individual is void of any form of criminality. The procedure is as follows.</p>
          <ul>
            <li><strong>Where to get this document:</strong> It can be obtained from the council of the Division where the individual was born. (Can also be done in Yaounde or by the administrator in charge).</li>
            <li><strong>Why you need this document:</strong> To prove that the individual is void of any form of criminality.</li>
            <li><strong>Documents you need:</strong> Individual's ID card is enough for this process.</li>
          </ul>
        </div>
      </section>

      <section>
        <div className="passport">
          <h3>Passport</h3>
          <p>This is a document that proves the nationality of an individual at an international level.</p>
          <ul>
            <li><strong>Where to get this document:</strong> It can be obtained from the immigration office in the various centers of each region.</li>
            <li><strong>Need:</strong> It's needed to apply for scholarship and for visa processing.</li>
            <li><strong>Procedure:</strong> Online registration is done in order to book an appointment and be provided with the registration form (110,000frs).</li>
            <li><strong>Documents you need:</strong> Certified copy of birth certificate, ID card, nationality, parental authorization for those under 21, and certified copy of parent ID card and birth certificate.</li>
          </ul>
          <p><strong>Note:</strong> For quick processing, do it in Yaounde.</p>
        </div>
      </section>

      <section>
        <div className="family-document">
          <h3>Family Relation</h3>
          <p>It is the privileged social relationship that unites the members of the same family. It is not just an abstract concept, but the foundation of many rights and obligations in our society!</p>
          <ul>
            <li><strong>Where to do this document:</strong> Can be done at the gendarmerie.</li>
            <li><strong>People involved:</strong> Parent and child, witness.</li>
            <li><strong>Documents needed:</strong> Certified copy of both the parent and child's ID cards and birth certificate including that of the witness.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
