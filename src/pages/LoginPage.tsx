import { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import { apiPost } from "../lib/api"; // adjust path if needed

type UserRole = "staff" | "admin" | "appadmin";

type LoginPageProps = {
  onLoggedIn: (token: string, role: UserRole) => void;
};

type LoginResponse = {
  token: string;
  user: {
    email: string;
    role: UserRole;
  };
};

export default function LoginPage({ onLoggedIn }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");

      const result = await apiPost<LoginResponse>("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.user.role);

      onLoggedIn(result.token, result.user.role);
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
              <p className="text-muted mb-0">Sign in to access the system.</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
