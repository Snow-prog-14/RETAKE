import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

type UserRole = "AppAdmin" | "Admin" | "Student";

type StoredUser = {
  UserId?: string;
  UserEmail?: string;
  UserUsername?: string;
  UserLastName?: string;
  UserFirstName?: string;
  UserTier?: number;
  UserStatus?: number;
  MustChangePass?: number;
  Success?: boolean;
  Message?: string;
};

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

  let storedUser: StoredUser | null = null;

  try {
    const storedUserRaw = localStorage.getItem("user");
    storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    storedUser = null;
  }

  const storedRole =
    (localStorage.getItem("role") as UserRole | null) || "Student";

  const roleFromTier: UserRole =
    storedUser?.UserTier === 0
      ? "AppAdmin"
      : storedUser?.UserTier === 1
        ? "Admin"
        : storedUser?.UserTier === 2
          ? "Student"
          : storedRole;

  const fullName =
    `${storedUser?.UserFirstName || ""} ${storedUser?.UserLastName || ""}`.trim() ||
    "Unknown User";

  const username = storedUser?.UserUsername || "no-username";
  const email = storedUser?.UserEmail || "no-email";
  const status = storedUser?.UserStatus === 1 ? "Offline" : "Online";

  const subtitle =
    roleFromTier === "AppAdmin"
      ? "Manage your super admin account and system-level access."
      : roleFromTier === "Admin"
        ? "Manage your admin account and team connections."
        : "Manage your academic identity and collaborations.";

  const stats =
    roleFromTier === "AppAdmin"
      ? [
          { label: "User ID", value: storedUser?.UserId || "N/A" },
          { label: "Account Type", value: "Super Admin" },
          { label: "Status Code", value: storedUser?.UserStatus ?? "N/A" },
        ]
      : roleFromTier === "Admin"
        ? [
            { label: "User ID", value: storedUser?.UserId || "N/A" },
            { label: "Account Type", value: "Admin" },
            { label: "Status Code", value: storedUser?.UserStatus ?? "N/A" },
          ]
        : [
            { label: "User ID", value: storedUser?.UserId || "N/A" },
            { label: "Account Type", value: "Student" },
            { label: "Status Code", value: storedUser?.UserStatus ?? "N/A" },
          ];

  const connections =
    roleFromTier === "AppAdmin"
      ? [{ name: "System Access", role: "Full Control" }]
      : roleFromTier === "Admin"
        ? [{ name: "Admin Access", role: "Management Control" }]
        : [{ name: "Student Access", role: "Academic Access" }];

  const profile: ProfileData = {
    fullName,
    username,
    role: roleFromTier,
    email,
    status,
    subtitle,
    stats,
    connections,
  };

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
    localStorage.removeItem("role");
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
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
            <h3 className="section-title">Access</h3>
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
