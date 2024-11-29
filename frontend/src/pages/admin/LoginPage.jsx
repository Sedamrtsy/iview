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
      console.log('Attempting login with email:', email);
      const response = await axios.post(
        "https://iview.onrender.com/api/login",
        { email, password },
        { withCredentials: true }
      );
      console.log("Login response:", response);
      // Giriş başarılı
      setTimeout(() => {
        // Clear form state
        set({ email: '', password: '', error: '', isLoading: false });
      }, 100); // Adjust timeout if needed
    } catch (error) {
      set({
        error: error.response?.data?.msg || "Login failedd",
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
