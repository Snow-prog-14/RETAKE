import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardShell from "../../components/DashboardShell";
import "../../components/DashboardShell.css";
import "./StudentManagement.css";

type ApiStudent = {
  userId?: number | string;
  userEmail?: string;
  userUsername?: string;
  userLastName?: string;
  userFirstName?: string;
  userTier?: number;
  userStatus?: number;

  UserId?: number | string;
  UserEmail?: string;
  UserUsername?: string;
  UserLastName?: string;
  UserFirstName?: string;
  UserTier?: number;
  UserStatus?: number;
};

type StoredUser = {
  userTier?: number;
  UserTier?: number;
};

type EditableStudent = {
  fullName: string;
  email: string;
  username: string;
  role: string;
  status: "Active" | "Inactive";
  userId: string;
};

function getResolvedRole(): number | null {
  const rawRole = localStorage.getItem("role");

  if (rawRole === "0" || rawRole === "1" || rawRole === "2") {
    return Number(rawRole);
  }

  if (rawRole === "AppAdmin") return 0;
  if (rawRole === "Admin") return 1;
  if (rawRole === "Student") return 2;

  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return null;

    const parsedUser: StoredUser = JSON.parse(rawUser);
    const tier = parsedUser.userTier ?? parsedUser.UserTier;

    return typeof tier === "number" ? tier : null;
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    return null;
  }
}

function getAllPermissions(): string[] {
  return [
    "profile.view_own",
    "profile.edit_own",
    "profile.photo.update_own",
    "username.update_own",
    "password.update_own",
    "profile.deactivate_own",
    "student.list.view",
    "student.profile.view",
    "student.info.edit",
    "student.status.update",
    "admin.audit.view",
    "admin.list.view",
    "admin.info.edit",
    "admin.status.update",
    "admin.create",
    "admin.create_tier",
    "admin.edit_tier",
    "profile.view_permission",
    "profile.edit_permissions",
    "profile.delete_permission",
    "prototype.allow_user",
  ];
}

function getDefaultAssignedPermissions(role: number | null): string[] {
  if (role === 0) {
    return [
      "student.list.view",
      "student.profile.view",
      "student.info.edit",
      "student.status.update",
      "profile.view_permission",
      "profile.edit_permissions",
      "profile.delete_permission",
    ];
  }

  if (role === 1) {
    return [
      "student.list.view",
      "student.profile.view",
      "student.info.edit",
      "student.status.update",
    ];
  }

  return [];
}

export default function StudentProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { studentId } = useParams();

  const resolvedRole = getResolvedRole();
  const isAppAdmin = resolvedRole === 0;
  const isAdmin = resolvedRole === 1;

  const navItems = isAppAdmin
    ? [
        { label: "Dashboard", path: "/appadmin" },
        { label: "Users", path: "/appadmin/users" },
        { label: "Students", path: "/appadmin/students" },
        { label: "Profile", path: "/appadmin/profile" },
        { label: "Reports", path: "/appadmin/reports" },
        { label: "Settings", path: "/appadmin/settings" },
      ]
    : [
        { label: "Dashboard", path: "/admin" },
        { label: "Profile", path: "/admin/profile" },
        { label: "Students", path: "/admin/students" },
        { label: "Courses", path: "/admin/courses" },
        { label: "Reports", path: "/admin/reports" },
        { label: "Settings", path: "/admin/settings" },
      ];

  const [student, setStudent] = useState<ApiStudent | null>(null);
  const [editableStudent, setEditableStudent] =
    useState<EditableStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showEditInfoModal, setShowEditInfoModal] = useState(false);
  const [assignedPermissions, setAssignedPermissions] = useState<string[]>(
    getDefaultAssignedPermissions(resolvedRole),
  );
  const [editForm, setEditForm] = useState<EditableStudent>({
    fullName: "",
    email: "",
    username: "",
    role: "Student",
    status: "Active",
    userId: "",
  });

  const canManagePermissions = isAppAdmin;
  const canViewPermissions = isAppAdmin || isAdmin;

  const allPermissions = useMemo(() => getAllPermissions(), []);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5023/api/User", {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch student. Status: ${response.status}`);
      }

      const data: ApiStudent[] = await response.json();

      const foundStudent =
        data.find(
          (user) =>
            (user.userTier ?? user.UserTier) === 2 &&
            String(user.userId ?? user.UserId) === String(studentId),
        ) || null;

      if (!foundStudent) {
        setError("Student not found.");
        setStudent(null);
        setEditableStudent(null);
        return;
      }

      setStudent(foundStudent);

      const fullName = `${
        foundStudent.userFirstName ?? foundStudent.UserFirstName ?? ""
      } ${foundStudent.userLastName ?? foundStudent.UserLastName ?? ""}`.trim();

      const normalizedStudent: EditableStudent = {
        fullName: fullName || "No Name",
        email: foundStudent.userEmail ?? foundStudent.UserEmail ?? "",
        username: foundStudent.userUsername ?? foundStudent.UserUsername ?? "",
        role: "Student",
        status:
          (foundStudent.userStatus ?? foundStudent.UserStatus) === 0
            ? "Active"
            : "Inactive",
        userId: String(foundStudent.userId ?? foundStudent.UserId ?? "N/A"),
      };

      setEditableStudent(normalizedStudent);
      setEditForm(normalizedStudent);
    } catch (err) {
      console.error("Fetch student profile error:", err);
      setError("Failed to load student profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAppAdmin && !isAdmin) {
      navigate("/");
      return;
    }

    fetchStudent();
  }, [isAppAdmin, isAdmin, navigate, studentId, resolvedRole]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  const togglePermission = (permissionCode: string) => {
    if (!canManagePermissions) return;

    setAssignedPermissions((prev) => {
      const exists = prev.includes(permissionCode);

      if (exists) {
        return prev.filter((item) => item !== permissionCode);
      }

      return [...prev, permissionCode];
    });
  };

  const handleOpenEditInfoModal = () => {
    if (!editableStudent) return;
    setEditForm(editableStudent);
    setShowEditInfoModal(true);
  };

  const handleSaveAccountInfo = () => {
    const trimmedFullName = editForm.fullName.trim();
    const trimmedEmail = editForm.email.trim();
    const trimmedUsername = editForm.username.trim();

    if (!trimmedFullName || !trimmedEmail || !trimmedUsername) {
      alert("Please complete all editable account fields.");
      return;
    }

    const updatedStudent: EditableStudent = {
      ...editForm,
      fullName: trimmedFullName,
      email: trimmedEmail,
      username: trimmedUsername,
    };

    setEditableStudent(updatedStudent);
    setEditForm(updatedStudent);
    setShowEditInfoModal(false);
  };

  const initials = useMemo(() => {
    const fullName = editableStudent?.fullName ?? "";
    if (!fullName) return "ST";

    return fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [editableStudent]);

  const backPath = isAppAdmin ? "/appadmin/students" : "/admin/students";

  return (
    <>
      <DashboardShell
        roleTitle={isAppAdmin ? "AppAdmin" : "Admin"}
        roleSubtitle={isAppAdmin ? "Administrator Panel" : "Management Panel"}
        currentPath={currentPath}
        pageTitle="Student Profile"
        pageSubtitle="View detailed student account information."
        navItems={navItems}
        onNavigate={navigate}
        onLogout={handleLogout}
        mainClassName="student-management-main"
      >
        {loading ? (
          <section className="dashboard-panel">
            <p className="student-empty-state">Loading student profile...</p>
          </section>
        ) : error || !student || !editableStudent ? (
          <section className="dashboard-panel">
            <p className="student-empty-state">
              {error || "Student not found."}
            </p>
            <div className="student-profile-actions">
              <button
                type="button"
                className="student-action-btn student-view-btn"
                onClick={() => navigate(backPath)}
              >
                Back to Student List
              </button>
            </div>
          </section>
        ) : (
          <>
            <section className="dashboard-panel student-profile-panel">
              <div className="student-profile-top">
                <div className="student-profile-avatar">{initials}</div>

                <div className="student-profile-heading">
                  <h2>{editableStudent.fullName || "No Name"}</h2>
                  <p>@{editableStudent.username || "no-username"}</p>
                </div>

                <div className="student-profile-actions">
                  <button
                    type="button"
                    className="student-action-btn student-view-btn"
                    onClick={() => navigate(backPath)}
                  >
                    Back to Student List
                  </button>
                </div>
              </div>
            </section>

            <section className="student-profile-grid">
              <div className="dashboard-panel student-profile-card">
                <div className="student-info-header">
                  <h2>Account Information</h2>
                  <button
                    type="button"
                    className="student-permission-edit-btn"
                    onClick={handleOpenEditInfoModal}
                  >
                    Edit
                  </button>
                </div>

                <div className="student-profile-info-list">
                  <div className="student-profile-info-row">
                    <span className="student-info-label">Full Name</span>
                    <strong>{editableStudent.fullName || "No Name"}</strong>
                  </div>

                  <div className="student-profile-info-row">
                    <span className="student-info-label">Email</span>
                    <strong>{editableStudent.email || "No Email"}</strong>
                  </div>

                  <div className="student-profile-info-row">
                    <span className="student-info-label">Username</span>
                    <strong>
                      @{editableStudent.username || "no-username"}
                    </strong>
                  </div>

                  <div className="student-profile-info-row">
                    <span className="student-info-label">Role</span>
                    <strong>{editableStudent.role}</strong>
                  </div>

                  <div className="student-profile-info-row">
                    <span className="student-info-label">Status</span>
                    <strong>{editableStudent.status}</strong>
                  </div>

                  <div className="student-profile-info-row">
                    <span className="student-info-label">User ID</span>
                    <strong>{editableStudent.userId}</strong>
                  </div>
                </div>
              </div>

              <div className="dashboard-panel student-profile-card">
                <div className="student-permission-header">
                  <div>
                    <h2>Permissions</h2>
                    <p className="student-panel-subtext">
                      {canManagePermissions
                        ? "Click Edit to add or remove permissions."
                        : "View-only permission access."}
                    </p>
                  </div>

                  {canManagePermissions && (
                    <button
                      type="button"
                      className="student-permission-edit-btn"
                      onClick={() => setShowPermissionModal(true)}
                    >
                      Edit
                    </button>
                  )}
                </div>

                {canViewPermissions ? (
                  assignedPermissions.length > 0 ? (
                    <div className="student-pill-list">
                      {assignedPermissions.map((permission) => (
                        <span
                          className="student-permission-pill active"
                          key={permission}
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="student-empty-state">
                      No permissions assigned.
                    </p>
                  )
                ) : (
                  <p className="student-empty-state">
                    No student permissions available for this role.
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </DashboardShell>

      {showPermissionModal && canManagePermissions && (
        <div
          className="student-modal-overlay"
          onClick={() => setShowPermissionModal(false)}
        >
          <div className="student-modal" onClick={(e) => e.stopPropagation()}>
            <div className="student-modal-header">
              <div>
                <h2>Edit Permissions</h2>
                <p>
                  Click a pill to add or remove a permission. Highlighted pills
                  are currently assigned.
                </p>
              </div>

              <button
                type="button"
                className="student-modal-close-btn"
                onClick={() => setShowPermissionModal(false)}
              >
                ×
              </button>
            </div>

            <div className="student-pill-list modal-pill-list">
              {allPermissions.map((permission) => {
                const isActive = assignedPermissions.includes(permission);

                return (
                  <button
                    key={permission}
                    type="button"
                    className={`student-permission-pill ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() => togglePermission(permission)}
                  >
                    {permission}
                  </button>
                );
              })}
            </div>

            <div className="student-modal-actions">
              <button
                type="button"
                className="dashboard-primary-btn"
                onClick={() => setShowPermissionModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditInfoModal && editableStudent && (
        <div
          className="student-modal-overlay"
          onClick={() => setShowEditInfoModal(false)}
        >
          <div className="student-modal" onClick={(e) => e.stopPropagation()}>
            <div className="student-modal-header">
              <div>
                <h2>Edit Account Information</h2>
                <p>
                  Update the student's account information. User ID is
                  read-only.
                </p>
              </div>

              <button
                type="button"
                className="student-modal-close-btn"
                onClick={() => setShowEditInfoModal(false)}
              >
                ×
              </button>
            </div>

            <div className="student-modal-form">
              <div className="student-form-group">
                <label htmlFor="studentFullName">Full Name</label>
                <input
                  id="studentFullName"
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="student-form-group">
                <label htmlFor="studentEmail">Email</label>
                <input
                  id="studentEmail"
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="student-form-group">
                <label htmlFor="studentUsername">Username</label>
                <input
                  id="studentUsername"
                  type="text"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="student-form-group">
                <label htmlFor="studentRole">Role</label>
                <select
                  id="studentRole"
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                >
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                  <option value="AppAdmin">AppAdmin</option>
                </select>
              </div>

              <div className="student-form-group">
                <label htmlFor="studentStatus">Status</label>
                <select
                  id="studentStatus"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      status: e.target.value as "Active" | "Inactive",
                    }))
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="student-form-group">
                <label htmlFor="studentUserId">User ID</label>
                <input
                  id="studentUserId"
                  type="text"
                  value={editForm.userId}
                  disabled
                  className="student-readonly-input"
                />
              </div>

              <div className="student-modal-actions">
                <button
                  type="button"
                  className="dashboard-settings-cancel-btn"
                  onClick={() => setShowEditInfoModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="dashboard-primary-btn"
                  onClick={handleSaveAccountInfo}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
