import * as React from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
import axios from "axios";

// Zustand Store
const useAuthStore = create((set) => ({
  user: null,
  error: null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        "https://iview.onrender.com/api/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("Login successful:", response.data);
      set({ user: response.data.user, isLoading: false });
      return true; // Giriş başarılı
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      set({
        error: error.response?.data?.msg || "Login failed",
        isLoading: false,
      });
      return false; // Giriş başarısız
    }
  },
}));

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { error, login, isLoading } = useAuthStore();
  const nav = useNavigate();

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      nav("/adminhomepage"); // Giriş başarılıysa yönlendir
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
