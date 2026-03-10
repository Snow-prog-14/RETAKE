import { useEffect, useState } from "react";
import { getTheme, setTheme, type ThemeMode } from "../background";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<ThemeMode>("light");

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  const toggle = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next); // saves + updates background + body class
    setThemeState(next); // updates button label instantly
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn btn-outline-secondary rounded-3 d-flex align-items-center gap-2"
      style={{ padding: "8px 12px" }}
      aria-label="Toggle theme"
    >
      <span style={{ fontSize: 16 }}>{theme === "dark" ? "🌙" : "☀️"}</span>
      <span className="fw-semibold">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
