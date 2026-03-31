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

        <Route path="/appadmin" element={<AppAdminPage />} />
        <Route path="/appadmin/profile" element={<AppAdminPage />} />
        <Route path="/appadmin/users" element={<UserPage />} />
        <Route path="/appadmin/students" element={<StudentListPage />} />
        <Route
          path="/appadmin/students/:studentId"
          element={<StudentProfilePage />}
        />
        <Route path="/appadmin/reports" element={<AppAdminPage />} />
        <Route path="/appadmin/settings" element={<AppAdminPage />} />

        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/profile" element={<AdminPage />} />
        <Route path="/admin/students" element={<StudentListPage />} />
        <Route
          path="/admin/students/:studentId"
          element={<StudentProfilePage />}
        />
        <Route path="/admin/courses" element={<AdminPage />} />
        <Route path="/admin/reports" element={<AdminPage />} />
        <Route path="/admin/settings" element={<AdminPage />} />

        <Route path="/student" element={<StudentPage />} />
        <Route path="/student/profile" element={<StudentPage />} />
        <Route path="/student/schedule" element={<StudentPage />} />
        <Route path="/student/tasks" element={<StudentPage />} />
        <Route path="/student/connections" element={<StudentPage />} />
        <Route path="/student/support" element={<StudentPage />} />
        <Route path="/student/settings" element={<StudentPage />} />

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/appadmin/tiers" element={<TierPage />} />
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
