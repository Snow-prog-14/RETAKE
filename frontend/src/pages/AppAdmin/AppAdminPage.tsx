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
export default function AppAdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "Dashboard", path: "/appadmin" },
    { label: "Users", path: "/appadmin/users" },
    { label: "Profile", path: "/appadmin/profile" },
    { label: "Reports", path: "/appadmin/reports" },
    { label: "Settings", path: "/appadmin/settings" },
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
    fullName: "SUPER ADMIN",
    username: "appadmin.master",
    email: "appadmin@rtu.edu.ph",
    status: "Active",
    role: "AppAdmin",
    photo: "",
    stats: [
      { label: "Total Users", value: 120 },
      { label: "Active Sessions", value: 18 },
      { label: "Reports Today", value: 6 },
    ],
    collaborations: [
      { name: "System Control", subject: "Platform Oversight" },
      { name: "Admin Management", subject: "User Supervision" },
      { name: "Reports Review", subject: "System Monitoring" },
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
      case "/appadmin/profile":
        return "Profile";
      case "/appadmin/users":
        return "Users";
      case "/appadmin/reports":
        return "Reports";
      case "/appadmin/settings":
        return "Settings";
      default:
        return "AppAdmin Dashboard";
    }
  };

  const getPageSubtitle = () => {
    switch (currentPath) {
      case "/appadmin/profile":
        return "Manage your super admin identity and account details.";
      case "/appadmin/users":
        return "Manage admin users and permissions.";
      case "/appadmin/reports":
        return "Monitor reports and platform activity.";
      case "/appadmin/settings":
        return "Manage your preferences and account settings.";
      default:
        return "Manage users, monitor activity, and system status.";
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
                Your account is currently active and has elevated access.
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
                Temporarily disable your account access. Another super admin may
                be needed to restore it.
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
      case "/appadmin/profile":
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

            {isEditingProfile && (
              <div
                className="profile-modal-overlay"
                onClick={() => setIsEditingProfile(false)}
              >
                <div
                  className="profile-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <EditProfileModal
                    isOpen={isEditingProfile}
                    username={profile.username}
                    photo={profile.photo}
                    onClose={() => setIsEditingProfile(false)}
                    onSave={handleSaveProfile}
                  />
                </div>
              </div>
            )}
          </>
        );

      case "/appadmin/users":
        return (
          <div className="dashboard-panel">
            <h2>Users</h2>
            <ul>
              <li>View and manage admin accounts</li>
              <li>Monitor user roles and access level</li>
              <li>Review active and inactive status</li>
            </ul>
          </div>
        );

      case "/appadmin/reports":
        return (
          <div className="dashboard-panel">
            <h2>Reports</h2>
            <ul>
              <li>6 reports submitted today</li>
              <li>System monitoring logs updated</li>
              <li>Admin activity reviewed</li>
            </ul>
          </div>
        );

      case "/appadmin/settings":
        return renderSettings();

      default:
        return (
          <>
            <div className="dashboard-stat-grid">
              <div className="dashboard-stat-card">
                <h3>Total Users</h3>
                <p>120</p>
              </div>
              <div className="dashboard-stat-card">
                <h3>Active Sessions</h3>
                <p>18</p>
              </div>
              <div className="dashboard-stat-card">
                <h3>Reports Today</h3>
                <p>6</p>
              </div>
            </div>

            <div className="dashboard-panel">
              <h2>Recent Activity</h2>
              <ul>
                <li>Admin logged in</li>
                <li>User records checked</li>
                <li>System status reviewed</li>
              </ul>
            </div>
          </>
        );
    }
  };

  return (
    <DashboardShell
      roleTitle="AppAdmin"
      roleSubtitle="Administrator Panel"
      currentPath={currentPath}
      pageTitle={getPageTitle()}
      pageSubtitle={getPageSubtitle()}
      navItems={navItems}
      onNavigate={navigate}
      onLogout={handleLogout}
      mainClassName="appadmin-main"
    >
      {renderContent()}
    </DashboardShell>
  );
}
