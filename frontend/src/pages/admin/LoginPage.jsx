import * as React from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [error, setError] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const nav = useNavigate();

  const handleLogin = async () => {
    setError(null); // Önceki hataları temizle
    try {
      const response = await fetch("https://iview.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Cookie tabanlı oturum için gerekli
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Login failed");
      }

      // Giriş başarılı, token'ı sakla ve kullanıcıyı yönlendir
      const data = await response.json();
      console.log(data.token)
      sessionStorage.setItem("token", data.token);
      nav("/adminhomepage");
    } catch (error) {
      setError(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="loginBody">
      <div className="loginPage">
        <h2 className="login-title">Login</h2>
        {error && <h3 className="error-message">{error}</h3>}
        <h5 className="loginlabel">Email Address</h5>
        <input
          className="textField"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <br />
        <h5 className="loginlabel">Password</h5>
        <input
          className="textField"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <br />
        <button className="button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
