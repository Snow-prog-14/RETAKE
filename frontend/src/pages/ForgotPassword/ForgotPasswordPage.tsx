import { useState } from "react";
import { Link } from "react-router-dom";
import type { FormEvent } from "react";
import AuthLayout from "../../components/AuthLayout";
import "../../components/AuthShared.css";
import "./ForgotPasswordPage.css";

const API_BASE = "http://localhost:5023";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);

  const [userEmail, setUserEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestReset = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!userEmail.trim()) {
      setIsError(true);
      setMessage("Please enter your email.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Replace this endpoint if your backend uses another route
      const response = await fetch(`${API_BASE}/api/Auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        setIsError(true);
        setMessage(data.message || "Failed to request password reset.");
        return;
      }

      setIsError(false);
      setMessage(
        data.message ||
          "Reset request sent. Check your email or use the reset token provided by your backend.",
      );
      setStep(2);
    } catch (error) {
      console.error("FORGOT PASSWORD ERROR:", error);
      setIsError(true);
      setMessage("Cannot connect to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!resetToken.trim() || !newPassword || !confirmPassword) {
      setIsError(true);
      setMessage("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      setIsError(true);
      setMessage("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Replace this endpoint if your backend uses another route
      const response = await fetch(`${API_BASE}/api/Auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail,
          resetToken,
          newPassword,
        }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        setIsError(true);
        setMessage(data.message || "Failed to reset password.");
        return;
      }

      setIsError(false);
      setMessage(
        data.message || "Password reset successful. You can now log in.",
      );
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);
      setIsError(true);
      setMessage("Cannot connect to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      mode="login"
      title="Forgot Password"
      subtitle="Recover access to your account with your email and reset token."
      visualTitle="Get back in."
      visualText="Request a password reset, then set a new password and return to your dashboard."
      lightVisualImage="/images/lightmode.png"
      darkVisualImage="/images/darkmode.jpg"
    >
      {step === 1 ? (
        <form className="login-form" onSubmit={handleRequestReset}>
          <div className="pill-input">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>

          <button className="login-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "SENDING..." : "REQUEST RESET"}
          </button>

          {message && (
            <p className={`auth-message ${isError ? "error" : "success"}`}>
              {message}
            </p>
          )}

          <div className="form-footer-actions">
            <Link to="/" className="text-link">
              Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <form className="login-form" onSubmit={handleResetPassword}>
          <div className="pill-input">
            <span className="input-icon">🧷</span>
            <input
              type="text"
              placeholder="Reset token / OTP"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              required
            />
          </div>

          <div className="pill-input">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="pill-input">
            <span className="input-icon">✅</span>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "RESETTING..." : "RESET PASSWORD"}
          </button>

          {message && (
            <p className={`auth-message ${isError ? "error" : "success"}`}>
              {message}
            </p>
          )}

          <div className="form-footer-actions">
            <button
              type="button"
              className="switch-mode-btn secondary"
              onClick={() => setStep(1)}
            >
              Back
            </button>

            <Link to="/" className="text-link">
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
