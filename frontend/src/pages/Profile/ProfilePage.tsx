import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

type UserRole = "AppAdmin" | "Admin" | "Student";

type ProfileData = {
  fullName: string;
  preferredName: string;
  role: UserRole;
  email: string;
  status: "Online" | "Offline";
  stats: {
    label: string;
    value: string | number;
  }[];
  highlights: string[];
  connections: {
    name: string;
    role: string;
  }[];
  security: {
    hasPassword: boolean;
    hasFingerprint: boolean;
    hasCardTap: boolean;
  };
};

export default function ProfilePage() {
  const navigate = useNavigate();

  // Temporary mock role
  // Later, replace this with role from token, localStorage, or backend response
  const mockRole: UserRole = "Student";

  const profileDataByRole: Record<UserRole, ProfileData> = {
    Student: {
      fullName: "ALEJANDRA MARAASIN",
      preferredName: "Alejandra",
      role: "Student",
      email: "alejandramaraasin6@gmail.com",
      status: "Online",
      stats: [
        { label: "Hours Studied", value: "45 Hrs" },
        { label: "Tasks Completed", value: 12 },
        { label: "Modules Completed", value: 3 },
        { label: "Study Partners", value: 4 },
      ],
      highlights: [
        "Quiz A+",
        "Lab Notes",
        "Group Sync",
        "Module 4",
        "Final Review",
      ],
      connections: [
        { name: "Matt L.", role: "Study Partner" },
        { name: "Sarah J.", role: "Study Partner" },
        { name: "Ben K.", role: "Study Partner" },
      ],
      security: {
        hasPassword: true,
        hasFingerprint: false,
        hasCardTap: true,
      },
    },

    Admin: {
      fullName: "JONATHAN REYES",
      preferredName: "Jon",
      role: "Admin",
      email: "jonathan.reyes@retake.edu",
      status: "Online",
      stats: [
        { label: "Users Managed", value: 28 },
        { label: "Reports Reviewed", value: 16 },
        { label: "Active Sessions", value: 5 },
        { label: "Tasks Resolved", value: 11 },
      ],
      highlights: [
        "User Audit",
        "Approvals",
        "Reports",
        "Security Check",
        "Session Logs",
      ],
      connections: [
        { name: "Maria T.", role: "Staff" },
        { name: "Kevin D.", role: "Coordinator" },
        { name: "Louise P.", role: "Support" },
      ],
      security: {
        hasPassword: true,
        hasFingerprint: true,
        hasCardTap: true,
      },
    },

    AppAdmin: {
      fullName: "PENELOPE SANTOS",
      preferredName: "Penelope",
      role: "AppAdmin",
      email: "penelope.santos@retake.edu",
      status: "Online",
      stats: [
        { label: "Total Admins", value: 8 },
        { label: "Active Users", value: 214 },
        { label: "System Actions", value: 39 },
        { label: "Access Requests", value: 7 },
      ],
      highlights: [
        "Role Update",
        "Password Reset",
        "New Admin",
        "Security Log",
        "System Check",
      ],
      connections: [
        { name: "Admin Rose", role: "Admin" },
        { name: "Admin Carlo", role: "Admin" },
        { name: "Admin Mae", role: "Admin" },
      ],
      security: {
        hasPassword: true,
        hasFingerprint: true,
        hasCardTap: true,
      },
    },
  };

  const profile = profileDataByRole[mockRole];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getConnectionsTitle = () => {
    if (profile.role === "Student") return "Study Partners";
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
            <button className="nav-item">Study Schedule</button>
            <button className="nav-item">Academic Materials</button>
            <button className="nav-item">Progress Dashboard</button>
            <button className="nav-item">Connections</button>
            <button className="nav-item">Support</button>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="profile-main">
        <div className="profile-header">
          <div>
            <h1>STUDY KIOSK PROFILE</h1>
            <p>Manage your academic identity, progress, and connections.</p>
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
            <p className="preferred-name">
              Preferred Name: {profile.preferredName}
            </p>
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
          <h3 className="section-title">Highlights</h3>
          <div className="highlights-row">
            {profile.highlights.map((item) => (
              <div className="highlight-item" key={item}>
                <div className="highlight-circle">{item.charAt(0)}</div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="section-header">
            <h3 className="section-title">{getConnectionsTitle()}</h3>
            <button className="message-btn">Message</button>
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

        <section className="card">
          <h3 className="section-title">Kiosk Access & Security</h3>

          <div className="security-grid">
            <div className="security-item">
              <div>
                <p className="security-label">Email</p>
                <span className="security-value">{profile.email}</span>
              </div>
              <button className="security-btn">Update Email</button>
            </div>

            <div className="security-item">
              <div>
                <p className="security-label">Password</p>
                <span className="security-value">
                  {profile.security.hasPassword
                    ? "Password is set"
                    : "No password set"}
                </span>
              </div>
              <button className="security-btn">
                {profile.security.hasPassword
                  ? "Change Password"
                  : "Add Password"}
              </button>
            </div>

            <div className="security-item">
              <div>
                <p className="security-label">Fingerprint</p>
                <span className="security-value">
                  {profile.security.hasFingerprint
                    ? "Registered"
                    : "Not registered"}
                </span>
              </div>
              <button className="security-btn">
                {profile.security.hasFingerprint
                  ? "Manage Fingerprint"
                  : "Add Fingerprint"}
              </button>
            </div>

            <div className="security-item">
              <div>
                <p className="security-label">Card Tap / RFID</p>
                <span className="security-value">
                  {profile.security.hasCardTap ? "Linked" : "Not linked"}
                </span>
              </div>
              <button className="security-btn">Manage Card Tap</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
