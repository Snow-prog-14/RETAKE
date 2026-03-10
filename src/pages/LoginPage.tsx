import { useState } from "react";
import { apiPost } from "../api/client";
import ThemeToggle from "../components/ThemeToggle";

type Props = {
  onLoggedIn: (token: string) => void;
  goToRegister: () => void;
};

export default function LoginPage({ onLoggedIn, goToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");

      const result = await apiPost<{ token: string; user: { email: string } }>(
        "/api/auth/login",
        { email, password },
      );

      localStorage.setItem("token", result.token);
      onLoggedIn(result.token);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="w-100" style={{ maxWidth: 460 }}>
        <div className="d-flex justify-content-end mb-3">
          <ThemeToggle />
        </div>

        <div className="auth-card card border-0">
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-2">Welcome Back</h2>
              <p className="text-muted mb-0">
                Sign in to continue to the enrollment system.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger rounded-3 py-2">{error}</div>
            )}

            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="d-grid">
              <button
                className="btn btn-primary-soft btn-lg"
                onClick={handleSubmit}
              >
                Login
              </button>
            </div>

            <div className="text-center mt-4">
              <span className="text-muted">Don’t have an account?</span>{" "}
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0 fw-semibold"
                onClick={goToRegister}
              >
                Register here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
