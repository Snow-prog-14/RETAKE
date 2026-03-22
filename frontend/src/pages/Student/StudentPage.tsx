import { useNavigate, useLocation } from "react-router-dom";
import "./StudentPage.css";

export default function StudentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const currentPath = location.pathname;

  const getPageTitle = () => {
    switch (currentPath) {
      case "/student/profile":
        return "Account Profile";
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

  const profile = {
    fullName: "ALEJANDRA MARAASIN",
    username: "alejandra.maraasin",
    email: "alejandramaraasin6@gmail.com",
    status: "Online",
    role: "Student",
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
  };

  const renderContent = () => {
    switch (currentPath) {
      case "/student/profile":
        return (
          <>
            <section className="profile-hero card">
              <div className="avatar-wrap">
                <div className="avatar-ring">
                  <div className="avatar">{getInitials(profile.fullName)}</div>
                </div>
                <span className="status-badge online">{profile.status}</span>
              </div>

              <div className="hero-info">
                <div className="hero-row">
                  <span className="label">Student / User Name</span>
                  <span className="role-badge">{profile.role}</span>
                </div>

                <h2>{profile.fullName}</h2>
                <p className="preferred-name">@{profile.username}</p>
                <p className="email-text">{profile.email}</p>
              </div>
            </section>

            <section className="stats-grid">
              {profile.stats.map((stat) => (
                <div className="stat-card card" key={stat.label}>
                  <span className="stat-label">{stat.label}</span>
                  <strong className="stat-value">{stat.value}</strong>
                </div>
              ))}
            </section>

            <section className="card">
              <div className="section-header">
                <h3 className="section-title">Collaborations</h3>
              </div>

              <div className="connections-row">
                {profile.collaborations.map((item) => (
                  <div className="connection-item" key={item.name}>
                    <div className="connection-avatar">
                      {getInitials(item.name)}
                    </div>
                    <div>
                      <p className="connection-name">{item.name}</p>
                      <span className="connection-role">{item.subject}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
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
          <div className="student-support-card">
            <h2>Settings</h2>

            <div className="student-settings-list">
              <div className="student-settings-item">
                <div>
                  <p className="settings-label">Access and Security</p>
                  <span className="settings-value">
                    Manage your email and password
                  </span>
                </div>
                <button type="button" className="student-submit-btn">
                  Open
                </button>
              </div>

              <div className="student-settings-item">
                <div>
                  <p className="settings-label">Theme</p>
                  <span className="settings-value">
                    Use the floating toggle to switch light and dark mode
                  </span>
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
              className={currentPath === "/student/profile" ? "active" : ""}
              onClick={() => navigate("/student/profile")}
            >
              Account Profile
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
