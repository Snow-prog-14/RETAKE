import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import ChangePasswordPage from "./pages/ChangePassword/ChangePasswordPage";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import AppAdminPage from "./pages/AppAdmin/AppAdminPage";
import AdminPage from "./pages/Admin/AdminPage";
import StudentPage from "./pages/Student/StudentPage";
import UserPage from "./pages/User/UserPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <Router>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/appadmin" element={<AppAdminPage />} />
        <Route path="/appadmin/users" element={<UserPage />} />

        <Route path="/admin" element={<AdminPage />} />

        <Route path="/student" element={<StudentPage />} />
        <Route path="/student/profile" element={<StudentPage />} />
        <Route path="/student/schedule" element={<StudentPage />} />
        <Route path="/student/tasks" element={<StudentPage />} />
        <Route path="/student/connections" element={<StudentPage />} />
        <Route path="/student/support" element={<StudentPage />} />
        <Route path="/student/settings" element={<StudentPage />} />

        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
