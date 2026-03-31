import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

type UserRole = "AppAdmin" | "Admin" | "Student";

type ProfileData = {
  fullName: string;
  username: string;
  role: UserRole;
  email: string;
  status: "Online" | "Offline";
  subtitle: string;
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
      subtitle: "Manage your academic identity and collaborations.",
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
      subtitle: "Manage your admin account and team connections.",
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
      subtitle: "Manage your super admin account and system-level access.",
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

  const sidebarTitle =
    profile.role === "AppAdmin"
      ? "Super Admin"
      : profile.role === "Admin"
        ? "Admin Panel"
        : "Study Kiosk";

  const navItems =
    profile.role === "Student"
      ? [
          { label: "Account Profile", path: "/profile", active: true },
          { label: "Study Schedule", path: "/student/schedule" },
          { label: "Manage Tasks", path: "/student/tasks" },
          { label: "Connections", path: "/student/connections" },
          { label: "Support", path: "/student/support" },
          { label: "Settings", path: "/student/settings" },
        ]
      : profile.role === "Admin"
        ? [
            { label: "Dashboard", path: "/admin" },
            { label: "Account Profile", path: "/profile", active: true },
            { label: "Settings", path: "/admin/settings" },
          ]
        : [
            { label: "Dashboard", path: "/appadmin" },
            { label: "Users", path: "/appadmin/users" },
            { label: "Account Profile", path: "/profile", active: true },
            { label: "Settings", path: "/appadmin/settings" },
          ];

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
          <h2 className="profile-sidebar-title">{sidebarTitle}</h2>

          <nav className="profile-nav">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`nav-item ${item.active ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            ))}
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
            <p>{profile.subtitle}</p>
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
              <span className="label">User Role / Username</span>
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
