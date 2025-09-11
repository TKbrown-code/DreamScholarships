import React from "react";
import { FaUserGraduate } from "react-icons/fa";
import "../style/loading.css"
export default function LoaderPage() {
  return (
    <div className="loader-page">
      <div className="loader-container">
        <div className="spinner"></div>
        <FaUserGraduate className="loader-icon" />
      </div>
    </div>
  );
}
