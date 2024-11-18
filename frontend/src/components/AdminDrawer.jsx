import * as React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function AdminDrawer() {
  const nav = useNavigate();

  const logOut = () => {
    sessionStorage.removeItem("token");
    nav("/");
  };
  const goHome = () => {
    nav("/adminhomepage");
  };
  const goPackages = () => {
    nav("/packagelist");
  };

  return (
    <>
      <div className="adminDrawer">
        <h2 style={{textAlign:"center"}}>Admin Panel</h2>
        <button onClick={goHome} className="listButton">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="intlist"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
            />
          </svg>
          Interview List
        </button>
        <br />
        <button onClick={goPackages} className="listButton">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="questionpack"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
            />
          </svg>
          Question Packages
        </button>
        <button onClick={logOut} className="admindrawerlogout">
          LOG OUT
        </button>
      </div>
    </>
  );
}
