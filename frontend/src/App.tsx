import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import AppAdminPage from "./pages/AppAdmin/AppAdminPage";
import AdminPage from "./pages/Admin/AdminPage";
import StudentPage from "./pages/Student/StudentPage";
import UserPage from "./pages/User/UserPage";
import ProfilePage from "./pages/Profile/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/appadmin" element={<AppAdminPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/appadmin/users" element={<UserPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
