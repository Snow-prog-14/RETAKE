import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

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
      const response = await fetch("http://localhost:5023/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: registerUserEmail,
          userUsername: registerUserUsername,
          userLastName: registerUserLastName,
          userFirstName: registerUserFirstName,
          password: registerPassword,
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
      subtitle="Build your study space and begin a smarter learning routine."
      visualTitle="Start Strong"
      visualText="Create your account and begin a more focused and motivating study experience."
    >
      <form className="login-form" onSubmit={handleRegisterSubmit}>
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

        <div className="pill-input">
          <span className="input-icon">👤</span>
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
            placeholder="Email Address"
            value={registerUserEmail}
            onChange={(e) => setRegisterUserEmail(e.target.value)}
          />
        </div>

        <div className="pill-input">
          <span className="input-icon">🔒</span>
          <input
            type="password"
            placeholder="Create Password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="login-btn">
          CONTINUE
        </button>
      </form>

      {registerMessage && <p className="auth-message">{registerMessage}</p>}

      <div className="form-footer-actions">
        <Link to="/" className="switch-mode-btn secondary">
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}
