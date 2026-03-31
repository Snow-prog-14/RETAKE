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
import "./StudentPage.css";
import "../../components/DashboardShell.css";

export default function StudentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "Dashboard", path: "/student" },
    { label: "Profile", path: "/student/profile" },
    { label: "Study Schedule", path: "/student/schedule" },
    { label: "Manage Tasks", path: "/student/tasks" },
    { label: "Connections", path: "/student/connections" },
    { label: "Support", path: "/student/support" },
    { label: "Settings", path: "/student/settings" },
  ];

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(
    document.body.classList.contains("dark") ? "dark" : "light",
  );

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

  const [settingsPasswordMessage, setSettingsPasswordMessage] = useState("");
  const [showChangePasswordFields, setShowChangePasswordFields] =
    useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const [profile, setProfile] = useState({
    fullName: "ALEJANDRA MARAASIN",
    username: "alejandra.maraasin",
    email: "alejandramaraasin6@gmail.com",
    status: "Online",
    role: "Student",
    photo: "",
    stats: [
      { label: "Pending Tasks", value: 4 },
      { label: "Tasks Completed", value: 12 },
      { label: "Collaborations", value: 3 },
    ],
    collaborations: [
      { name: "Capstone Group A", subject: "Human Computer Interaction" },
      { name: "Network Team 2", subject: "Computer Networks" },
      { name: "UI Research Circle", subject: "Information Management" },
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
    navigate("/");
  };

  const getPageTitle = () => {
    switch (currentPath) {
      case "/student/profile":
        return "Profile";
      case "/student/schedule":
        return "Study Schedule";
      case "/student/tasks":
        return "Manage Tasks";
      case "/student/connections":
        return "Connections";
      case "/student/support":
        return "Support";
      case "/student/settings":
        return "Settings";
      default:
        return "Student Dashboard";
    }
  };

  const getPageSubtitle = () => {
    switch (currentPath) {
      case "/student/profile":
        return "Manage your academic identity and collaborations.";
      case "/student/schedule":
        return "Check your class and study calendar.";
      case "/student/tasks":
        return "Manage your pending and completed tasks.";
      case "/student/connections":
        return "View your collaborations and group connections.";
      case "/student/support":
        return "Submit a support ticket for admin assistance.";
      case "/student/settings":
        return "Manage your preferences and account settings.";
      default:
        return "Welcome to your student workspace.";
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
                Temporarily disable your account access. You may need admin help
                to regain access.
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
      case "/student/profile":
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

      case "/student/schedule":
        return (
          <div className="dashboard-panel">
            <h2>September 2026</h2>
            <div className="student-calendar">
              <div className="calendar-header">
                <button type="button">&lt;</button>
                <h3>Monthly View</h3>
                <button type="button">&gt;</button>
              </div>

              <div className="calendar-weekdays">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              <div className="calendar-grid">
                {Array.from({ length: 35 }, (_, index) => (
                  <div
                    key={index}
                    className={`calendar-cell ${index === 17 ? "today" : ""}`}
                  >
                    {index < 3 ? "" : index - 2}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "/student/tasks":
        return (
          <>
            <div className="dashboard-stat-grid">
              <div className="dashboard-stat-card">
                <h3>Pending Tasks</h3>
                <p>4</p>
              </div>
              <div className="dashboard-stat-card">
                <h3>Completed Tasks</h3>
                <p>12</p>
              </div>
              <div className="dashboard-stat-card">
                <h3>Collaborations</h3>
                <p>3</p>
              </div>
            </div>

            <div className="dashboard-panel">
              <h2>Task Overview</h2>
              <ul>
                <li>2 assignments due this week</li>
                <li>1 quiz pending submission</li>
                <li>1 group deliverable waiting for update</li>
              </ul>
            </div>
          </>
        );

      case "/student/connections":
        return (
          <div className="dashboard-panel">
            <h2>Collaborations</h2>
            <ul>
              <li>
                <strong>Capstone Group A</strong> - Human Computer Interaction
              </li>
              <li>
                <strong>Network Team 2</strong> - Computer Networks
              </li>
              <li>
                <strong>UI Research Circle</strong> - Information Management
              </li>
            </ul>
          </div>
        );

      case "/student/support":
        return (
          <div className="dashboard-panel">
            <h2>Submit a Ticket</h2>

            <form className="student-support-form">
              <input type="text" placeholder="Subject" />
              <select defaultValue="">
                <option value="" disabled>
                  Select concern type
                </option>
                <option>Account Issue</option>
                <option>Task Concern</option>
                <option>Schedule Concern</option>
                <option>Other</option>
              </select>
              <textarea
                rows={6}
                placeholder="Describe your concern here..."
              ></textarea>
              <button type="button" className="dashboard-primary-btn">
                Submit Ticket
              </button>
            </form>
          </div>
        );

      case "/student/settings":
        return renderSettings();

      default:
        return (
          <>
            <div className="dashboard-stat-grid">
              <div className="dashboard-stat-card">
                <h3>Pending Tasks</h3>
                <p>4</p>
              </div>
              <div className="dashboard-stat-card">
                <h3>Completed Tasks</h3>
                <p>12</p>
              </div>
              <div className="dashboard-stat-card">
                <h3>Collaborations</h3>
                <p>3</p>
              </div>
            </div>

            <div className="dashboard-panel">
              <h2>Overview</h2>
              <ul>
                <li>Open your Account Profile to view your student info</li>
                <li>Use Study Schedule to view your calendar</li>
                <li>Use Support to submit a ticket for admins</li>
              </ul>
            </div>
          </>
        );
    }
  };

  return (
    <DashboardShell
      roleTitle="Student"
      roleSubtitle="Student Panel"
      currentPath={currentPath}
      pageTitle={getPageTitle()}
      pageSubtitle={getPageSubtitle()}
      navItems={navItems}
      onNavigate={navigate}
      onLogout={handleLogout}
      mainClassName="student-main"
    >
      {renderContent()}
    </DashboardShell>
  );
}
