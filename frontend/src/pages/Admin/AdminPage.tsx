import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import ProfileViewCard from "../../components/Profile/ProfileViewCard";
import EditProfileModal from "../../components/Profile/EditProfileModal";
import {
  changeMyPassword,
  deactivateMyAccount,
  updateMyProfile,
} from "../../components/Profile/profileService";
import "../../components/DashboardShell.css";
export default function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "Profile", path: "/admin/profile" },
    { label: "Students", path: "/admin/students" },
    { label: "Courses", path: "/admin/courses" },
    { label: "Reports", path: "/admin/reports" },
    { label: "Settings", path: "/admin/settings" },
  ];

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(
    document.body.classList.contains("dark") ? "dark" : "light",
  );
  const [showChangePasswordFields, setShowChangePasswordFields] =
    useState(false);
  const [settingsPasswordMessage, setSettingsPasswordMessage] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  const [settingsPassword, setSettingsPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showSettingsPasswords, setShowSettingsPasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const [profile, setProfile] = useState({
    fullName: "MARIA SANTOS",
    username: "maria.santos",
    email: "maria.santos@rtu.edu.ph",
    status: "Active",
    role: "Admin",
    photo: "",
    stats: [
      { label: "Total Students", value: 320 },
      { label: "Active Classes", value: 14 },
      { label: "Pending Reports", value: 9 },
    ],
    collaborations: [
      { name: "Registrar Team", subject: "Records Management" },
      { name: "Faculty Admins", subject: "Academic Coordination" },
      { name: "Support Desk", subject: "Issue Monitoring" },
    ],
  });

  const handleThemeChange = (theme: "light" | "dark") => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setCurrentTheme(theme);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  const getPageTitle = () => {
    switch (currentPath) {
      case "/admin/profile":
        return "Profile";
      case "/admin/students":
        return "Students";
      case "/admin/courses":
        return "Courses";
      case "/admin/reports":
        return "Reports";
      case "/admin/settings":
        return "Settings";
      default:
        return "Admin Dashboard";
    }
  };

  const getPageSubtitle = () => {
    switch (currentPath) {
      case "/admin/profile":
        return "Manage your admin identity and account details.";
      case "/admin/students":
        return "Manage student records and enrollment data.";
      case "/admin/courses":
        return "Monitor course offerings and assignments.";
      case "/admin/reports":
        return "Review academic reports and system activity.";
      case "/admin/settings":
        return "Manage your preferences and account settings.";
      default:
        return "Manage academic records and monitor activity.";
    }
  };

  const handleSaveProfile = async (data: {
    username: string;
    photo: string;
  }) => {
    try {
      setProfileMessage("");
      await updateMyProfile();
      setProfile((prev) => ({
        ...prev,
        username: data.username,
        photo: data.photo,
      }));
      setProfileMessage("Profile updated successfully.");
      setIsEditingProfile(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Username update is not available yet.";
      setProfileMessage(message);
    }
  };

  const handleChangePassword = async () => {
    if (
      !settingsPassword.currentPassword ||
      !settingsPassword.newPassword ||
      !settingsPassword.confirmPassword
    ) {
      setSettingsPasswordMessage("Please complete all password fields.");
      return;
    }

    if (settingsPassword.newPassword.length < 8) {
      setSettingsPasswordMessage("New password must be at least 8 characters.");
      return;
    }

    if (settingsPassword.newPassword !== settingsPassword.confirmPassword) {
      setSettingsPasswordMessage("Passwords do not match.");
      return;
    }

    try {
      await changeMyPassword({
        currentPassword: settingsPassword.currentPassword,
        newPassword: settingsPassword.newPassword,
      });

      setSettingsPasswordMessage("Password updated successfully.");
      setSettingsPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowChangePasswordFields(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update password.";
      setSettingsPasswordMessage(message);
    }
  };

  const handleDeactivate = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your account?",
    );
    if (!confirmed) return;

    try {
      await deactivateMyAccount();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      navigate("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to deactivate account.";
      alert(message);
    }
  };

  const renderSettings = () => (
    <div className="dashboard-page-block">
      <div className="dashboard-settings-card">
        <h2>Access and Security</h2>
        <p className="dashboard-settings-description">
          Manage account access, password, preferences, and protection settings.
        </p>

        <div className="dashboard-settings-section">
          <h3>Themes</h3>
          <p>Customize how the system looks.</p>

          <div className="dashboard-settings-theme-box">
            <div>
              <p className="settings-label">Theme Mode</p>
              <span className="settings-value">
                Choose how the interface appears on your screen.
              </span>
            </div>

            <div className="dashboard-theme-toggle-group">
              <button
                type="button"
                className={
                  currentTheme === "light"
                    ? "dashboard-theme-option active"
                    : "dashboard-theme-option"
                }
                onClick={() => handleThemeChange("light")}
              >
                Light
              </button>

              <button
                type="button"
                className={
                  currentTheme === "dark"
                    ? "dashboard-theme-option active"
                    : "dashboard-theme-option"
                }
                onClick={() => handleThemeChange("dark")}
              >
                Dark
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-settings-section">
          <h3>Security Settings</h3>
          <p>Review your account protection and sign-in details.</p>

          <div className="dashboard-settings-item static-open">
            <div>
              <p className="settings-label">Account Access</p>
              <span className="settings-value">
                Your account is currently active and available for login.
              </span>
            </div>
          </div>

          <div className="dashboard-settings-subsection">
            <div className="dashboard-settings-subsection-header">
              <div>
                <h4>Change Password</h4>
                <p>Update your password to keep your account secure.</p>
              </div>

              <button
                type="button"
                className="dashboard-settings-toggle-btn"
                onClick={() => {
                  setSettingsPasswordMessage("");
                  setShowChangePasswordFields((prev) => !prev);
                }}
              >
                {showChangePasswordFields ? "Hide" : "Change Password"}
              </button>
            </div>

            {showChangePasswordFields && (
              <div className="dashboard-settings-password-box dashboard-nested-security-box">
                <label>
                  Current Password
                  <div className="dashboard-settings-password-field">
                    <input
                      type={showSettingsPasswords.current ? "text" : "password"}
                      value={settingsPassword.currentPassword}
                      onChange={(e) =>
                        setSettingsPassword((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowSettingsPasswords((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                    >
                      {showSettingsPasswords.current ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>

                <label>
                  New Password
                  <div className="dashboard-settings-password-field">
                    <input
                      type={showSettingsPasswords.next ? "text" : "password"}
                      value={settingsPassword.newPassword}
                      onChange={(e) =>
                        setSettingsPassword((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowSettingsPasswords((prev) => ({
                          ...prev,
                          next: !prev.next,
                        }))
                      }
                    >
                      {showSettingsPasswords.next ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>

                <label>
                  Confirm Password
                  <div className="dashboard-settings-password-field">
                    <input
                      type={showSettingsPasswords.confirm ? "text" : "password"}
                      value={settingsPassword.confirmPassword}
                      onChange={(e) =>
                        setSettingsPassword((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowSettingsPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                    >
                      {showSettingsPasswords.confirm ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>

                <div className="dashboard-settings-password-actions">
                  <button
                    type="button"
                    className="dashboard-primary-btn"
                    onClick={handleChangePassword}
                  >
                    Update Password
                  </button>

                  <button
                    type="button"
                    className="dashboard-settings-cancel-btn"
                    onClick={() => {
                      setShowChangePasswordFields(false);
                      setSettingsPassword({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setSettingsPasswordMessage("");
                    }}
                  >
                    Cancel
                  </button>
                </div>

                {settingsPasswordMessage ? (
                  <p className="dashboard-settings-message">
                    {settingsPasswordMessage}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-settings-section danger-section">
          <h3>Account Management</h3>
          <p>Manage your account status.</p>

          <div className="dashboard-settings-item static-open">
            <div>
              <p className="settings-label">Deactivate Account</p>
              <span className="settings-value">
                Temporarily disable your account access. You may need super
                admin help to regain access.
              </span>
            </div>

            <button
              type="button"
              className="dashboard-danger-btn"
              onClick={handleDeactivate}
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPath) {
      case "/admin/profile":
        return (
          <>
            <div className="dashboard-page-block">
              <ProfileViewCard
                fullName={profile.fullName}
                username={profile.username}
                email={profile.email}
                status={profile.status}
                role={profile.role}
                photo={profile.photo}
                stats={profile.stats}
                collaborations={profile.collaborations}
                onEdit={() => setIsEditingProfile(true)}
              />
            </div>

            {profileMessage ? (
              <p className="dashboard-settings-message">{profileMessage}</p>
            ) : null}
            <EditProfileModal
              isOpen={isEditingProfile}
              username={profile.username}
              photo={profile.photo}
              onClose={() => setIsEditingProfile(false)}
              onSave={handleSaveProfile}
            />
          </>
        );

      case "/admin/students":
        return (
          <div className="dashboard-panel">
            <h2>Students</h2>
            <ul>
              <li>320 students enrolled</li>
              <li>24 students with pending requirements</li>
              <li>12 students recently updated records</li>
            </ul>
          </div>
        );

      case "/admin/courses":
        return (
          <div className="dashboard-panel">
            <h2>Courses</h2>
            <ul>
              <li>14 active classes this term</li>
              <li>3 courses pending faculty assignment</li>
              <li>2 courses need schedule adjustment</li>
            </ul>
          </div>
        );

      case "/admin/reports":
        return (
          <div className="dashboard-panel">
            <h2>Reports</h2>
            <ul>
              <li>9 pending academic reports</li>
              <li>4 attendance reports submitted today</li>
              <li>2 incident reports awaiting review</li>
            </ul>
          </div>
        );

      case "/admin/settings":
        return renderSettings();

      default:
        return (
          <div className="dashboard-stat-grid">
            <div className="dashboard-stat-card">
              <h3>Total Students</h3>
              <p>320</p>
            </div>
            <div className="dashboard-stat-card">
              <h3>Active Classes</h3>
              <p>14</p>
            </div>
            <div className="dashboard-stat-card">
              <h3>Pending Reports</h3>
              <p>9</p>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardShell
      roleTitle="Admin"
      roleSubtitle="Management Panel"
      currentPath={currentPath}
      pageTitle={getPageTitle()}
      pageSubtitle={getPageSubtitle()}
      navItems={navItems}
      onNavigate={navigate}
      onLogout={handleLogout}
      mainClassName="admin-main"
    >
      {renderContent()}
    </DashboardShell>
  );
}
