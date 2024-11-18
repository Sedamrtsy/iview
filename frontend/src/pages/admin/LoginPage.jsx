// pages/admin/LoginPage.jsx
import * as React from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [error, setError] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const nav = useNavigate();

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("https://iview.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error("Hatalı giriş");
      const data = await response.json();
      sessionStorage.setItem("token", data.token);
      if (response.ok) nav("/adminhomepage");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="loginBody">
      <div className="loginPage">
        <h2 className="login-title">Login</h2>
        {error && <h3>{error}</h3>}
        <h5 className="loginlabel">Email Address</h5>
        <input
          className="textField"
          key="email"
          label="Email"
          onChange={handleEmail}
          value={email}
          placeholder="   Enter email"
        />
        <br />
        <h5 className="loginlabel">Password</h5>
        <input
          className="textField"
          key="password"
          label="Password"
          onChange={handlePassword}
          value={password}
          type="password"
          onKeyDown={handleEnter}
          placeholder="   Enter Password"
        />
        <br />
        <button className="button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
