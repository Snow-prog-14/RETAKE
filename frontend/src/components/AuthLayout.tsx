import ThemeToggle from "./ThemeToggle";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

type AuthLayoutProps = {
  mode: "login" | "register";
  title: string;
  subtitle: string;
  visualTitle: string;
  visualText: string;
  lightVisualImage: string;
  darkVisualImage: string;
  children: ReactNode;
};

export default function AuthLayout({
  mode,
  title,
  subtitle,
  visualTitle,
  visualText,
  lightVisualImage,
  darkVisualImage,
  children,
}: AuthLayoutProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const applyTheme = () => {
      const isDark = document.body.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    applyTheme();

    const observer = new MutationObserver(() => {
      applyTheme();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const currentVisualImage =
    theme === "dark" ? darkVisualImage : lightVisualImage;

  return (
    <div className="auth-page">
      <div
        className={`auth-card ${mode === "register" ? "register-mode" : ""}`}
      >
        <div className="visual-panel">
          <div
            className="image-panel"
            style={{ backgroundImage: `url("${currentVisualImage}")` }}
          >
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
