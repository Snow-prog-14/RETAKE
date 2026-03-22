import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import AuthLayout from "../../components/AuthLayout";
import "../../components/AuthShared.css";
import "./ChangePasswordPage.css";

type StoredUser = {
  userId: string;
  userEmail?: string;
  userFirstName?: string;
  userLastName?: string;
  userTier?: number;
  mustChangePass?: number;
};

const API_BASE = "http://localhost:5023";

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const storedUser = useMemo<StoredUser | null>(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!storedUser?.userId) {
      navigate("/");
    }
  }, [storedUser, navigate]);

  const routeByTier = (tier?: number) => {
    if (tier === 0) return "/appadmin";
    if (tier === 1) return "/admin";
    return "/student";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!storedUser?.userId) {
      setIsError(true);
      setMessage("No logged in user found.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
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
      setMessage("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setIsError(true);
      setMessage("New password must be different from current password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${API_BASE}/api/Auth/change-password/${storedUser.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        setIsError(true);
        setMessage(data.message || "Failed to change password.");
        return;
      }

      const updatedUser = {
        ...storedUser,
        mustChangePass: data.mustChangePass ?? 0,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsError(false);
      setMessage(data.message || "Password changed successfully.");

      setTimeout(() => {
        navigate(routeByTier(updatedUser.userTier));
      }, 900);
    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error);
      setIsError(true);
      setMessage("Cannot connect to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      mode="register"
      title="Change Password"
      subtitle="Your account needs a new password before you can continue."
      visualTitle="Secure your account."
      visualText="Set a strong password to unlock your dashboard and keep your account protected."
      lightVisualImage="/images/lightmode.png"
      darkVisualImage="/images/darkmode.jpg"
    >
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="pill-input password-input">
          <span className="input-icon">🔒</span>
          <input
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowCurrentPassword((prev) => !prev)}
            aria-label={
              showCurrentPassword
                ? "Hide current password"
                : "Show current password"
            }
          >
            <i
              className={`bi ${showCurrentPassword ? "bi-eye-slash" : "bi-eye"}`}
            ></i>
          </button>
        </div>

        <div className="pill-input password-input">
          <span className="input-icon">✨</span>
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowNewPassword((prev) => !prev)}
            aria-label={
              showNewPassword ? "Hide new password" : "Show new password"
            }
          >
            <i
              className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}
            ></i>
          </button>
        </div>

        <div className="pill-input password-input">
          <span className="input-icon">✅</span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
          >
            <i
              className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
            ></i>
          </button>
        </div>

        <button className="login-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "UPDATING..." : "UPDATE PASSWORD"}
        </button>

        {message && (
          <p className={`auth-message ${isError ? "error" : "success"}`}>
            {message}
          </p>
        )}
      </form>
    </AuthLayout>
  );
}
