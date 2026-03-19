import { useState } from "react";
import "./LoginPage.css";
import ThemeToggle from "../components/ThemeToggle";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);

  const [loginUserEmail, setLoginUserEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const [registerUserEmail, setRegisterUserEmail] = useState("");
  const [registerUserUsername, setRegisterUserUsername] = useState("");
  const [registerUserLastName, setRegisterUserLastName] = useState("");
  const [registerUserFirstName, setRegisterUserFirstName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage("");

    try {
      const response = await fetch("http://localhost:5023/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userEmail: loginUserEmail,
          password: loginPassword
        })
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterMessage("");

    try {
      const response = await fetch("http://localhost:5023/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userEmail: registerUserEmail,
          userUsername: registerUserUsername,
          userLastName: registerUserLastName,
          userFirstName: registerUserFirstName,
          password: registerPassword
        })
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
    <div className="auth-page">
      <div className={`auth-card ${isRegister ? "register-mode" : ""}`}>
        <div className="visual-panel">
          <div className="image-panel">
            <div className="image-overlay">
              <p className="right-tag">STUDY BUDDY</p>
              <h2>{isRegister ? "Start Strong" : "Learn Better Every Day"}</h2>
              <p>
                {isRegister
                  ? "Create your account and begin a more focused and motivating study experience."
                  : "Build habits, stay motivated, and make every session count."}
              </p>
            </div>
          </div>
        </div>

        <div className="forms-stage">
          <div className="forms-shell">
            <section className="auth-panel login-panel">
              <div className="top-bar">
                <ThemeToggle />
              </div>

              <div className="form-content">
                <p className="brand-label">STUDY BUDDY</p>
                <h1>Welcome Back</h1>
                <p className="subtitle">
                  Continue your study journey and stay on track with your goals.
                </p>

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

                {loginMessage && (
                  <p style={{ marginTop: "12px", color: "white" }}>
                    {loginMessage}
                  </p>
                )}

                <div className="form-footer-actions">
                  <a href="#" className="text-link">
                    Forgot Password?
                  </a>

                  <button
                    type="button"
                    className="switch-mode-btn"
                    onClick={() => setIsRegister(true)}
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </section>

            <section className="auth-panel register-panel">
              <div className="top-bar">
                <ThemeToggle />
              </div>

              <div className="form-content">
                <p className="brand-label">STUDY BUDDY</p>
                <h1>Create Account</h1>
                <p className="subtitle">
                  Build your study space and begin a smarter learning routine.
                </p>

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

                {registerMessage && (
                  <p style={{ marginTop: "12px", color: "white" }}>
                    {registerMessage}
                  </p>
                )}

                <div className="form-footer-actions">
                  <button
                    type="button"
                    className="switch-mode-btn secondary"
                    onClick={() => setIsRegister(false)}
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}