import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import "../../components/Profile/ProfileShared.css";

const API_BASE = "http://localhost:5023";
const cloudName = "dhuzkhdh1";
const uploadPreset = "IntershipAttachment";
const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

type UserRole = "AppAdmin" | "Admin" | "Student";

type StoredUser = {
  userId?: string | number;
  userEmail?: string;
  userUsername?: string;
  userLastName?: string;
  userFirstName?: string;
  userTier?: number;
  userStatus?: number;
  mustChangePass?: number;
  userPhoto?: string;

  UserId?: string | number;
  UserEmail?: string;
  UserUsername?: string;
  UserLastName?: string;
  UserFirstName?: string;
  UserTier?: number;
  UserStatus?: number;
  MustChangePass?: number;
  UserPhoto?: string;
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
  photo: string;
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPhoto, setEditPhoto] = useState("");
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);

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

  const resolvedUserId = storedUser?.userId ?? storedUser?.UserId ?? "N/A";
  const resolvedEmail = storedUser?.userEmail ?? storedUser?.UserEmail ?? "";
  const resolvedUsername =
    storedUser?.userUsername ?? storedUser?.UserUsername ?? "";
  const resolvedLastName =
    storedUser?.userLastName ?? storedUser?.UserLastName ?? "";
  const resolvedFirstName =
    storedUser?.userFirstName ?? storedUser?.UserFirstName ?? "";
  const resolvedTier = storedUser?.userTier ?? storedUser?.UserTier;
  const resolvedStatus = storedUser?.userStatus ?? storedUser?.UserStatus;
  const resolvedPhoto = storedUser?.userPhoto ?? storedUser?.UserPhoto ?? "";

  const roleFromTier: UserRole =
    resolvedTier === 0
      ? "AppAdmin"
      : resolvedTier === 1
        ? "Admin"
        : resolvedTier === 2
          ? "Student"
          : storedRole;

  const fullName =
    `${resolvedFirstName} ${resolvedLastName}`.trim() || "Unknown User";
  const username = resolvedUsername || "no-username";
  const email = resolvedEmail || "no-email";
  const status = resolvedStatus === 1 ? "Offline" : "Online";

  const subtitle =
    roleFromTier === "AppAdmin"
      ? "Manage your super admin account and system-level access."
      : roleFromTier === "Admin"
        ? "Manage your admin account and team connections."
        : "Manage your academic identity and collaborations.";

  const stats =
    roleFromTier === "AppAdmin"
      ? [
          { label: "User ID", value: resolvedUserId },
          { label: "Account Type", value: "Super Admin" },
          { label: "Status Code", value: resolvedStatus ?? "N/A" },
        ]
      : roleFromTier === "Admin"
        ? [
            { label: "User ID", value: resolvedUserId },
            { label: "Account Type", value: "Admin" },
            { label: "Status Code", value: resolvedStatus ?? "N/A" },
          ]
        : [
            { label: "User ID", value: resolvedUserId },
            { label: "Account Type", value: "Student" },
            { label: "Status Code", value: resolvedStatus ?? "N/A" },
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
    photo: resolvedPhoto,
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
          { label: "Dashboard", path: "/student" },
          { label: "Profile", path: "/student/profile" },
          { label: "Study Schedule", path: "/student/schedule" },
          { label: "Manage Tasks", path: "/student/tasks" },
          { label: "Connections", path: "/student/connections" },
          { label: "Support", path: "/student/support" },
          { label: "Settings", path: "/student/settings" },
        ]
      : profile.role === "Admin"
        ? [
            { label: "Dashboard", path: "/admin" },
            { label: "Profile", path: "/profile", active: true },
            { label: "Settings", path: "/admin/settings" },
          ]
        : [
            { label: "Dashboard", path: "/appadmin" },
            { label: "Users", path: "/appadmin/users" },
            { label: "Profile", path: "/profile", active: true },
            { label: "Settings", path: "/appadmin/settings" },
          ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleOpenEdit = () => {
    setEditFirstName(resolvedFirstName);
    setEditLastName(resolvedLastName);
    setEditEmail(resolvedEmail);
    setEditUsername(resolvedUsername);
    setEditPhoto(resolvedPhoto);
    setSelectedPhotoFile(null);
    setMessage("");
    setIsError(false);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    if (isSaving) return;
    setIsEditing(false);
    setMessage("");
    setIsError(false);
    setSelectedPhotoFile(null);
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setSelectedPhotoFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setIsError(true);
      setMessage("Please select a valid image file.");
      setSelectedPhotoFile(null);
      return;
    }

    setIsError(false);
    setMessage("");
    setSelectedPhotoFile(file);

    const previewUrl = URL.createObjectURL(file);
    setEditPhoto(previewUrl);
  };

  const uploadPhotoToCloudinary = async (): Promise<string> => {
    if (!selectedPhotoFile) {
      return resolvedPhoto;
    }

    const formData = new FormData();
    formData.append("file", selectedPhotoFile);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.secure_url) {
      throw new Error(data.error?.message || "Failed to upload image.");
    }

    return data.secure_url as string;
  };

  const handleSaveProfile = async () => {
    const firstName = editFirstName.trim();
    const lastName = editLastName.trim();
    const emailValue = editEmail.trim();
    const usernameValue = editUsername.trim();

    if (!firstName || !lastName || !emailValue || !usernameValue) {
      setIsError(true);
      setMessage("Please complete all fields.");
      return;
    }

    if (!resolvedUserId || resolvedUserId === "N/A") {
      setIsError(true);
      setMessage("No valid user found.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");
      setIsError(false);

      const requests: Promise<Response>[] = [];

      if (
        firstName !== resolvedFirstName ||
        lastName !== resolvedLastName ||
        emailValue !== resolvedEmail ||
        usernameValue !== resolvedUsername
      ) {
        requests.push(
          fetch(`${API_BASE}/api/Auth/update-profile/${resolvedUserId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              userFirstName: firstName,
              userLastName: lastName,
              userEmail: emailValue,
              userUsername: usernameValue,
            }),
          }),
        );
      }

      let finalPhotoUrl = resolvedPhoto;

      if (selectedPhotoFile) {
        finalPhotoUrl = await uploadPhotoToCloudinary();

        requests.push(
          fetch(`${API_BASE}/api/Auth/update-photo/${resolvedUserId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              userPhoto: finalPhotoUrl,
            }),
          }),
        );
      }

      const responses = await Promise.all(requests);

      for (const response of responses) {
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
          setIsError(true);
          setMessage(data.message || "Failed to update profile.");
          return;
        }
      }

      const updatedUser = {
        ...storedUser,
        userId: resolvedUserId,
        userEmail: emailValue,
        userUsername: usernameValue,
        userLastName: lastName,
        userFirstName: firstName,
        userTier: resolvedTier,
        mustChangePass: storedUser?.mustChangePass ?? storedUser?.MustChangePass,
        userStatus: resolvedStatus,
        userPhoto: finalPhotoUrl,

        UserId: resolvedUserId,
        UserEmail: emailValue,
        UserUsername: usernameValue,
        UserLastName: lastName,
        UserFirstName: firstName,
        UserTier: resolvedTier,
        UserStatus: resolvedStatus,
        MustChangePass: storedUser?.mustChangePass ?? storedUser?.MustChangePass,
        UserPhoto: finalPhotoUrl,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsError(false);
      setMessage("Profile updated successfully.");
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);
      setIsError(true);
      setMessage(
        error instanceof Error ? error.message : "Cannot connect to backend.",
      );
    } finally {
      setIsSaving(false);
    }
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
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.label}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="profile-main">
        <div className="profile-header">
          <div>
            <h1>PROFILE</h1>
            <p>{profile.subtitle}</p>
          </div>
          <button className="edit-btn" onClick={handleOpenEdit}>
            Edit Profile
          </button>
        </div>

        {message && !isEditing && (
          <div className="card" style={{ marginBottom: "1rem" }}>
            <p style={{ color: isError ? "red" : "green" }}>{message}</p>
          </div>
        )}

        <section className="profile-hero card">
          <div className="avatar-wrap">
            <div className="avatar-ring">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt="Profile"
                  className="avatar"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="avatar">{getInitials(profile.fullName)}</div>
              )}
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

      {isEditing && (
        <div className="profile-modal-overlay" onClick={handleCloseEdit}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-edit-card">
              <div className="profile-edit-header">
                <div>
                  <h3>Edit Profile</h3>
                  <p>Update your account information and profile photo.</p>
                </div>
              </div>

              <div className="profile-edit-preview-wrap">
                {editPhoto ? (
                  <img
                    src={editPhoto}
                    alt="Profile preview"
                    className="profile-preview-image"
                  />
                ) : (
                  <div className="profile-preview-empty">
                    {getInitials(`${editFirstName} ${editLastName}`.trim() || profile.fullName)}
                  </div>
                )}
              </div>

              <div className="profile-form-group">
                <label htmlFor="editProfilePhoto">Profile Photo</label>
                <input
                  id="editProfilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                />
                <p className="profile-helper-text">
                  Select an image file to upload to Cloudinary.
                </p>
              </div>

              <div className="profile-form-group">
                <label htmlFor="editFirstName">First Name</label>
                <input
                  id="editFirstName"
                  type="text"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  placeholder="First Name"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="editLastName">Last Name</label>
                <input
                  id="editLastName"
                  type="text"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="editEmail">Email</label>
                <input
                  id="editEmail"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Email"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="editUsername">Username</label>
                <input
                  id="editUsername"
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="Username"
                />
              </div>

              {message ? (
                <p
                  className="profile-message"
                  style={{ color: isError ? "red" : "var(--brand)" }}
                >
                  {message}
                </p>
              ) : null}

              <div className="profile-edit-actions">
                <button
                  type="button"
                  className="profile-primary-btn"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="profile-secondary-btn"
                  onClick={handleCloseEdit}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}