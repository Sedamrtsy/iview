// components/Header.jsx
import * as React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import iview from "../assets/iview.png";

export default function Header({ adminName = "Admin" }) {
  return (
    <div className="header">
      <img src={iview} alt="logo" className="iviewlogo" />     
      <div className="header-right">
        <Link to="/" className="logout-link">
          <svg
            className="logout-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
