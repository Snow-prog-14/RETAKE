import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import AuthLayout from "../../components/AuthLayout";
import "../../components/AuthShared.css";
import "./LoginPage.css";

export default function LoginPage() {
  const [loginUserEmail, setLoginUserEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const navigate = useNavigate();

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginMessage("");

    try {
      const response = await fetch("http://localhost:5023/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: loginUserEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token || "sample-token");
        setLoginMessage(
          `Login successful. Welcome, ${data.userFirstName || "Admin"}!`,
        );

        setTimeout(() => {
          navigate("/appadmin");
        }, 800);
      } else {
        setLoginMessage(data.message || "Login failed.");
      }
    } catch {
      setLoginMessage("Cannot connect to backend.");
    }
  };

  return (
    <AuthLayout
      mode="login"
      title="Welcome Back"
      subtitle="Login to access your admin dashboard and manage the system."
      visualTitle="Stay In Control"
      visualText="Sign in to monitor users, manage activity, and keep everything running smoothly."
      lightVisualImage="/images/lightmode.png"
      darkVisualImage="/images/darkmode.jpg"
    >
      <form className="login-form" onSubmit={handleLoginSubmit}>
        <div className="pill-input">
          <span className="input-icon">👤</span>
          <input
            type="text"
            placeholder="Username or Email"
            value={loginUserEmail}
            onChange={(e) => setLoginUserEmail(e.target.value)}
            required
          />
        </div>

        <div className="pill-input">
          <span className="input-icon">🔒</span>
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-btn">
          LOGIN
        </button>
      </form>

      {loginMessage && <p className="auth-message">{loginMessage}</p>}

      <div className="form-footer-actions">
        <a href="#" className="text-link">
          Forgot Password?
        </a>

        <Link to="/register" className="switch-mode-btn">
          Create Account
        </Link>
      </div>
    </AuthLayout>
  );
}
