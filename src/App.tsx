import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AppAdminDashboard from "./pages/AppAdminDashboard";
import { initBackground } from "./background";

type UserRole = "staff" | "admin" | "appadmin";

export default function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const [role, setRole] = useState<UserRole | null>(
    localStorage.getItem("role") as UserRole | null,
  );

  useEffect(() => {
    initBackground();
  }, []);

  const handleLoggedIn = (newToken: string, userRole: UserRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", userRole);

    setToken(newToken);
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setToken(null);
    setRole(null);
  };

  if (!token || !role) {
    return <LoginPage onLoggedIn={handleLoggedIn} />;
  }

  if (role === "staff") {
    return <StaffDashboard onLogout={handleLogout} />;
  }

  if (role === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (role === "appadmin") {
    return <AppAdminDashboard onLogout={handleLogout} />;
  }

  return <LoginPage onLoggedIn={handleLoggedIn} />;
}
