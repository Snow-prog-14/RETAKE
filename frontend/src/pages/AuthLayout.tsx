import ThemeToggle from "../components/ThemeToggle";
import "./LoginPage.css";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  mode: "login" | "register";
  title: string;
  subtitle: string;
  visualTitle: string;
  visualText: string;
  children: ReactNode;
};

export default function AuthLayout({
  mode,
  title,
  subtitle,
  visualTitle,
  visualText,
  children,
}: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div
        className={`auth-card ${mode === "register" ? "register-mode" : ""}`}
      >
        <div className="visual-panel">
          <div className="image-panel">
            <div className="image-overlay">
              <p className="right-tag">STUDY BUDDY</p>
              <h2>{visualTitle}</h2>
              <p>{visualText}</p>
            </div>
          </div>
        </div>

        <div className="forms-stage">
          <div className="forms-shell single-mode">
            <section className="auth-panel active-panel">
              <div className="top-bar">
                <ThemeToggle />
              </div>

              <div className="form-content">
                <p className="brand-label">STUDY BUDDY</p>
                <h1>{title}</h1>
                <p className="subtitle">{subtitle}</p>

                {children}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
