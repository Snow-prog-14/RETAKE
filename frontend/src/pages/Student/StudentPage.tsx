import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfileViewCard from "../../components/ProfileViewCard";
import EditProfileCard from "../../components/EditProfileCard";
import {
  changeMyPassword,
  deactivateMyAccount,
  updateMyProfile,
} from "../../components/profileService";
import "./StudentPage.css";

export default function StudentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isEditingProfile, setIsEditingProfile] = useState(false);

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const [profileMessage, setProfileMessage] = useState("");

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
  const renderContent = () => {
    switch (currentPath) {
      case "/student/profile":
        return (
          <>
            <div className="student-profile-layout">
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
              <p className="student-settings-message">{profileMessage}</p>
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
                  <EditProfileCard
                    username={profile.username}
                    photo={profile.photo}
                    onCancel={() => setIsEditingProfile(false)}
                    onSave={handleSaveProfile}
                  />
                </div>
              </div>
            )}
          </>
        );

      case "/student/schedule":
        return (
          <div className="student-calendar">
            <div className="calendar-header">
              <button>&lt;</button>
              <h2>September 2026</h2>
              <button>&gt;</button>
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
        );

      case "/student/tasks":
        return (
          <>
            <div className="student-cards">
              <div className="student-card">
                <h3>Pending Tasks</h3>
                <p>4</p>
              </div>

              <div className="student-card">
                <h3>Completed Tasks</h3>
                <p>12</p>
              </div>

              <div className="student-card">
                <h3>Collaborations</h3>
                <p>3</p>
              </div>
            </div>

            <div className="student-activity">
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
          <div className="student-activity">
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
          <div className="student-support-card">
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
              <button type="button" className="student-submit-btn">
                Submit Ticket
              </button>
            </form>
          </div>
        );

      case "/student/settings":
        return (
          <div className="student-settings-page">
            <div className="student-settings-card">
              <h2>Access and Security</h2>
              <p className="student-settings-description">
                Manage account access, password, preferences, and protection
                settings.
              </p>

              <div className="student-settings-section">
                <h3>Themes</h3>
                <p>Customize how the system looks.</p>
                <div className="student-settings-item static-open">
                  <div>
                    <p className="settings-label">Theme Mode</p>
                    <span className="settings-value">
                      Use the floating theme toggle to switch light and dark
                      mode.
                    </span>
                  </div>
                </div>
              </div>

              <div className="student-settings-section">
                <h3>Security Settings</h3>
                <p>Review your account protection and sign-in details.</p>
                <div className="student-settings-item static-open">
                  <div>
                    <p className="settings-label">Account Access</p>
                    <span className="settings-value">
                      Your account is currently active and available for login.
                    </span>
                  </div>
                </div>
              </div>

              <div className="student-settings-section">
                <h3>Change Password</h3>
                <p>Update your password to keep your account secure.</p>

                <div className="student-settings-password-box">
                  <label>
                    Current Password
                    <div className="student-settings-password-field">
                      <input
                        type={
                          showSettingsPasswords.current ? "text" : "password"
                        }
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
                    <div className="student-settings-password-field">
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
                    <div className="student-settings-password-field">
                      <input
                        type={
                          showSettingsPasswords.confirm ? "text" : "password"
                        }
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

                  <button
                    type="button"
                    className="student-submit-btn"
                    onClick={handleChangePassword}
                  >
                    Update Password
                  </button>

                  {settingsPasswordMessage ? (
                    <p className="student-settings-message">
                      {settingsPasswordMessage}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="student-settings-section">
                <h3>Account Management</h3>
                <p>Manage your account details and profile status.</p>
                <div className="student-settings-item static-open">
                  <div>
                    <p className="settings-label">Username</p>
                    <span className="settings-value">
                      Your username can be updated from Edit Profile.
                    </span>
                  </div>
                </div>
              </div>

              <div className="student-settings-section danger-section">
                <h3>Deactivate Account</h3>
                <p>Temporarily disable your account access.</p>
                <div className="student-settings-item static-open">
                  <div>
                    <p className="settings-label">Account Deactivation</p>
                    <span className="settings-value">
                      Once deactivated, you will need admin help to regain
                      access.
                    </span>
                  </div>

                  <button
                    type="button"
                    className="student-danger-btn"
                    onClick={handleDeactivate}
                  >
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <div className="student-cards">
              <div className="student-card">
                <h3>Pending Tasks</h3>
                <p>4</p>
              </div>

              <div className="student-card">
                <h3>Completed Tasks</h3>
                <p>12</p>
              </div>

              <div className="student-card">
                <h3>Collaborations</h3>
                <p>3</p>
              </div>
            </div>

            <div className="student-activity">
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
    <div className="student-page">
      <aside className="student-sidebar">
        <div>
          <h2>Student</h2>
          <p>Student Panel</p>
          <nav className="student-nav">
            <button
              className={currentPath === "/student" ? "active" : ""}
              onClick={() => navigate("/student")}
            >
              Dashboard
            </button>

            <button
              className={currentPath === "/student/profile" ? "active" : ""}
              onClick={() => navigate("/student/profile")}
            >
              Profile
            </button>

            <button
              className={currentPath === "/student/schedule" ? "active" : ""}
              onClick={() => navigate("/student/schedule")}
            >
              Study Schedule
            </button>

            <button
              className={currentPath === "/student/tasks" ? "active" : ""}
              onClick={() => navigate("/student/tasks")}
            >
              Manage Tasks
            </button>

            <button
              className={currentPath === "/student/connections" ? "active" : ""}
              onClick={() => navigate("/student/connections")}
            >
              Connections
            </button>

            <button
              className={currentPath === "/student/support" ? "active" : ""}
              onClick={() => navigate("/student/support")}
            >
              Support
            </button>

            <button
              className={currentPath === "/student/settings" ? "active" : ""}
              onClick={() => navigate("/student/settings")}
            >
              Settings
            </button>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="student-main">
        <h1>{getPageTitle()}</h1>
        <p>{getPageSubtitle()}</p>
        {renderContent()}
      </main>
    </div>
  );
}
