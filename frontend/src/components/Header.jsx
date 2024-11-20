// components/Header.jsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import iview from "../assets/iview.png";

export default function Header({ adminName = "Admin" }) {
  const navigate = useNavigate();

  // Logout fonksiyonu
  const handleLogout = async (e) => {
    e.preventDefault(); // Link yönlendirmesini durduruyoruz

    try {
      const response = await fetch("https://iview.onrender.com/api/logout", {
        method: "POST",
        credentials: "include", // Cookie gönderimi için gerekli
      });

      if (response.ok) {
        // Başarılı çıkış, giriş sayfasına yönlendir
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <div className="header">
      <img src={iview} alt="logo" className="iviewlogo" />
      <div className="header-right">
        <button onClick={handleLogout} className="logout-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
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
        </button>
      </div>
    </div>
  );
}
