import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import AuthLayout from "../../components/AuthLayout";
import "../../components/AuthShared.css";
import "./LoginPage.css";

const API_BASE = "http://localhost:5023";

export default function LoginPage() {
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });

      const text = await response.text();
      console.log("RAW LOGIN RESPONSE:", text);

      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        setLoginMessage(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.userTier === 0) {
        localStorage.setItem("role", "AppAdmin");
      } else if (data.userTier === 1) {
        localStorage.setItem("role", "Admin");
      } else if (data.userTier === 2) {
        localStorage.setItem("role", "Student");
      } else {
        setLoginMessage("Unknown user tier.");
        return;
      }

      if (data.mustChangePass === 1) {
        navigate("/change-password");
        return;
      }

      setLoginMessage(
        `Login successful. Welcome, ${data.userFirstName || "User"}!`,
      );

      if (data.userTier === 0) {
        navigate("/appadmin");
      } else if (data.userTier === 1) {
        navigate("/admin");
      } else if (data.userTier === 2) {
        navigate("/student");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setLoginMessage("Cannot connect to backend.");
    }
  };

  return (
    <AuthLayout
      mode="login"
      title="Welcome Back"
      subtitle="Log in to continue managing your account and your academic flow."
      visualTitle="Focus. Track. Finish."
      visualText="Your study system should work for you, not bully you with chaos."
      lightVisualImage="/images/lightmode.png"
      darkVisualImage="/images/darkmode.jpg"
    >
      <form className="login-form" onSubmit={handleLoginSubmit}>
        <div className="pill-input">
          <span className="input-icon">📧</span>
          <input
            type="text"
            placeholder="Email or Username"
            value={loginIdentifier}
            onChange={(e) => setLoginIdentifier(e.target.value)}
            required
          />
        </div>

        <div className="pill-input password-input">
          <span className="input-icon">🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
          </button>
        </div>

        <button className="login-btn" type="submit">
          LOGIN
        </button>

        {loginMessage && <p className="auth-message">{loginMessage}</p>}

        <div className="form-footer-actions">
          <Link to="/forgot-password" className="text-link">
            Forgot Password?
          </Link>

          <Link to="/register" className="switch-mode-btn secondary">
            Create Account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
