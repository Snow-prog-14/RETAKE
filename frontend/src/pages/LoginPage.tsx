import { useState } from "react";
import "./LoginPage.css";
import ThemeToggle from "../components/ThemeToggle";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);

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
            {/* LOGIN PANEL */}
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

                <form className="login-form">
                  <div className="pill-input">
                    <span className="input-icon">👤</span>
                    <input type="text" placeholder="Username or Email" />
                  </div>

                  <div className="pill-input">
                    <span className="input-icon">🔒</span>
                    <input type="password" placeholder="Password" />
                  </div>

                  <button type="submit" className="login-btn">
                    LOGIN
                  </button>
                </form>

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

            {/* REGISTER PANEL */}
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

                <form className="login-form">
                  <div className="pill-input">
                    <span className="input-icon">👤</span>
                    <input type="text" placeholder="Full Name" />
                  </div>

                  <div className="pill-input">
                    <span className="input-icon">📧</span>
                    <input type="email" placeholder="Email Address" />
                  </div>

                  <div className="pill-input">
                    <span className="input-icon">🔒</span>
                    <input type="password" placeholder="Create Password" />
                  </div>

                  <button type="submit" className="login-btn">
                    CONTINUE
                  </button>
                </form>

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
