import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
  allowedRoles: string[];
  children: ReactNode;
};

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const storedUser = localStorage.getItem("user");
  const storedRole = localStorage.getItem("role");

  if (!storedUser || !storedRole) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(storedRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}