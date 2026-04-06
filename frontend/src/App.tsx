import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import ChangePasswordPage from "./pages/ChangePassword/ChangePasswordPage";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import AppAdminPage from "./pages/AppAdmin/AppAdminPage";
import AdminPage from "./pages/Admin/AdminPage";
import StudentPage from "./pages/Student/StudentPage";
import StudentListPage from "./pages/Student/StudentListPage";
import StudentProfilePage from "./pages/Student/StudentProfilePage";
import UserPage from "./pages/User/UserPage";
import TierPage from "./pages/Tier/TierPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import ThemeToggle from "./components/ThemeToggle";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const location = useLocation();

  const showFloatingThemeToggle =
    location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {showFloatingThemeToggle && <ThemeToggle />}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/appadmin"
          element={
            <ProtectedRoute allowedRoles={["AppAdmin"]}>
              <AppAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appadmin/profile"
          element={
            <ProtectedRoute allowedRoles={["AppAdmin"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appadmin/users"
          element={
            <ProtectedRoute allowedRoles={["AppAdmin"]}>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appadmin/students"
          element={
            <ProtectedRoute allowedRoles={["AppAdmin"]}>
              <StudentListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appadmin/students/:studentId"
          element={
            <ProtectedRoute allowedRoles={["AppAdmin"]}>
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appadmin/reports"
          element={
            <ProtectedRoute allowedRoles={["AppAdmin"]}>
              <AppAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appadmin/settings"
          element={
            <ProtectedRoute allowedRoles={["AppAdmin"]}>
              <AppAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appadmin/tiers"
          element={
            <ProtectedRoute allowedRoles={["AppAdmin"]}>
              <TierPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <StudentListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students/:studentId"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/schedule"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/tasks"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/connections"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/support"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/settings"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentPage />
            </ProtectedRoute>
          }
        />

        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
