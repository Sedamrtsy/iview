import * as React from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
import Cookies from "js-cookie";
import axios from "axios";

// Zustand Store
const useAuthStore = create((set) => ({
  user: null,
  error: null,
  isLoading: false,
  token: Cookies.get("jwtToken") || null,
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        "https://iview.onrender.com/api/login",
        { email, password },
        { withCredentials: true }
      );

      // Giriş başarılı
      const { token, user } = response.data;
      Cookies.set("jwtToken", token);
      console.log("token: ",token)
      set({ user, token, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.msg || "Login failed",
        isLoading: false,
      });
    }
  },
}));

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { error, login, isLoading } = useAuthStore();
  const nav = useNavigate();

  const handleLogin = async () => {
    await login(email, password);
    if (!error) {
      nav("/adminhomepage");
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
        <button className="button" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
