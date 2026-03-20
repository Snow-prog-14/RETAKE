import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

export default function LoginPage() {
  const [loginUserEmail, setLoginUserEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
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
        setLoginMessage(`Login successful. Welcome, ${data.userFirstName}!`);
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
      subtitle="Continue your study journey and stay on track with your goals."
      visualTitle="Learn Better Every Day"
      visualText="Build habits, stay motivated, and make every session count."
    >
      <form className="login-form" onSubmit={handleLoginSubmit}>
        <div className="pill-input">
          <span className="input-icon">👤</span>
          <input
            type="text"
            placeholder="Username or Email"
            value={loginUserEmail}
            onChange={(e) => setLoginUserEmail(e.target.value)}
          />
        </div>

        <div className="pill-input">
          <span className="input-icon">🔒</span>
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
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
