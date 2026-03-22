import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import "../../components/AuthShared.css";
import "./RegisterPage.css";

const API_BASE = "http://localhost:5023";

export default function RegisterPage() {
  const [registerUserEmail, setRegisterUserEmail] = useState("");
  const [registerUserUsername, setRegisterUserUsername] = useState("");
  const [registerUserLastName, setRegisterUserLastName] = useState("");
  const [registerUserFirstName, setRegisterUserFirstName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/Auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: registerUserEmail.trim(),
          userUsername: registerUserUsername,
          userLastName: registerUserLastName,
          userFirstName: registerUserFirstName,
          password: registerPassword,
          mustChangePass: 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegisterMessage("Account created successfully.");
      } else {
        setRegisterMessage(data.message || "Registration failed.");
      }
    } catch {
      setRegisterMessage("Cannot connect to backend.");
    }
  };

  return (
    <AuthLayout
      mode="register"
      title="Create Account"
      subtitle="Set up a new account and control whether the user must change their password on first login."
      visualTitle="New account setup."
      visualText="Create users properly so you don’t spend next week cleaning up avoidable auth nonsense."
      lightVisualImage="/images/lightmode.png"
      darkVisualImage="/images/darkmode.jpg"
    >
      <form className="login-form" onSubmit={handleRegisterSubmit}>
        <div className="name-row">
          <div className="pill-input">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="First Name"
              value={registerUserFirstName}
              onChange={(e) => setRegisterUserFirstName(e.target.value)}
            />
          </div>

          <div className="pill-input">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="Last Name"
              value={registerUserLastName}
              onChange={(e) => setRegisterUserLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="pill-input">
          <span className="input-icon">🪪</span>
          <input
            type="text"
            placeholder="Username"
            value={registerUserUsername}
            onChange={(e) => setRegisterUserUsername(e.target.value)}
          />
        </div>

        <div className="pill-input">
          <span className="input-icon">📧</span>
          <input
            type="email"
            placeholder="Email"
            value={registerUserEmail}
            onChange={(e) => setRegisterUserEmail(e.target.value)}
          />
        </div>

        <div className="pill-input">
          <span className="input-icon">🔐</span>
          <input
            type="password"
            placeholder="Temporary Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" type="submit">
          CONTINUE
        </button>

        {registerMessage && <p className="auth-message">{registerMessage}</p>}

        <div className="form-footer-actions">
          <Link to="/" className="text-link">
            Back to Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
