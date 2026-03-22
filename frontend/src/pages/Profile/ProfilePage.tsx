import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

type UserRole = "AppAdmin" | "Admin" | "Student";

type ProfileData = {
  fullName: string;
  username: string;
  role: UserRole;
  email: string;
  status: "Online" | "Offline";
  stats: {
    label: string;
    value: string | number;
  }[];
  connections: {
    name: string;
    role: string;
  }[];
};

export default function ProfilePage() {
  const navigate = useNavigate();

  const storedRole =
    (localStorage.getItem("role") as UserRole | null) || "Student";
  const mockRole: UserRole = storedRole;

  const profileDataByRole: Record<UserRole, ProfileData> = {
    Student: {
      fullName: "ALEJANDRA MARAASIN",
      username: "alejandra.maraasin",
      role: "Student",
      email: "alejandramaraasin6@gmail.com",
      status: "Online",
      stats: [
        { label: "Pending Tasks", value: 4 },
        { label: "Tasks Completed", value: 12 },
        { label: "Collaborations", value: 3 },
      ],
      connections: [
        { name: "Capstone Group A", role: "Human Computer Interaction" },
        { name: "Network Team 2", role: "Computer Networks" },
        { name: "UI Research Circle", role: "Information Management" },
      ],
    },

    Admin: {
      fullName: "JONATHAN REYES",
      username: "jon.reyes",
      role: "Admin",
      email: "jonathan.reyes@retake.edu",
      status: "Online",
      stats: [
        { label: "Users Managed", value: 28 },
        { label: "Reports Reviewed", value: 16 },
        { label: "Active Sessions", value: 5 },
      ],
      connections: [
        { name: "Maria T.", role: "Staff" },
        { name: "Kevin D.", role: "Coordinator" },
        { name: "Louise P.", role: "Support" },
      ],
    },

    AppAdmin: {
      fullName: "PENELOPE SANTOS",
      username: "penelope.santos",
      role: "AppAdmin",
      email: "penelope.santos@retake.edu",
      status: "Online",
      stats: [
        { label: "Total Admins", value: 8 },
        { label: "Active Users", value: 214 },
        { label: "Access Requests", value: 7 },
      ],
      connections: [
        { name: "Admin Rose", role: "Admin" },
        { name: "Admin Carlo", role: "Admin" },
        { name: "Admin Mae", role: "Admin" },
      ],
    },
  };

  const profile = profileDataByRole[mockRole];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getConnectionsTitle = () => {
    if (profile.role === "Student") return "Collaborations";
    if (profile.role === "Admin") return "Team Connections";
    return "Admin Connections";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <div>
          <h2 className="profile-sidebar-title">Study Kiosk</h2>

          <nav className="profile-nav">
            <button className="nav-item active">Account Profile</button>
            {profile.role === "Student" && (
              <>
                <button
                  className="nav-item"
                  onClick={() => navigate("/student/schedule")}
                >
                  Study Schedule
                </button>
                <button
                  className="nav-item"
                  onClick={() => navigate("/student/tasks")}
                >
                  Manage Tasks
                </button>
                <button
                  className="nav-item"
                  onClick={() => navigate("/student/connections")}
                >
                  Connections
                </button>
                <button
                  className="nav-item"
                  onClick={() => navigate("/student/support")}
                >
                  Support
                </button>
              </>
            )}
            <button
              className="nav-item"
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

      <main className="profile-main">
        <div className="profile-header">
          <div>
            <h1>ACCOUNT PROFILE</h1>
            <p>Manage your academic identity and collaborations.</p>
          </div>
          <button className="edit-btn">Edit Profile</button>
        </div>

        <section className="profile-hero card">
          <div className="avatar-wrap">
            <div className="avatar-ring">
              <div className="avatar">{getInitials(profile.fullName)}</div>
            </div>
            <span className={`status-badge ${profile.status.toLowerCase()}`}>
              {profile.status}
            </span>
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
            <h3 className="section-title">{getConnectionsTitle()}</h3>
          </div>

          <div className="connections-row">
            {profile.connections.map((person) => (
              <div className="connection-item" key={person.name}>
                <div className="connection-avatar">
                  {getInitials(person.name)}
                </div>
                <div>
                  <p className="connection-name">{person.name}</p>
                  <span className="connection-role">{person.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
