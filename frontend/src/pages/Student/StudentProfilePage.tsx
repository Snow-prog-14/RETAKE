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

type UserPermissionEntry = {
  referenceId?: string;
  permissionId?: string;
  userId?: string;

  ReferenceId?: string;
  PermissionId?: string;
  UserId?: string;
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
  const [assignedPermissions, setAssignedPermissions] = useState<string[]>([]);
  const [permissionEntries, setPermissionEntries] = useState<
    UserPermissionEntry[]
  >([]);
  const [permissionSaving, setPermissionSaving] = useState(false);
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

  const fetchUserPermissions = async (targetUserId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (resolvedRole === null) {
        throw new Error("No stored user tier found.");
      }

      const response = await fetch(
        `http://localhost:5023/api/UserPermission/${targetUserId}?userTier=${resolvedRole}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user permissions. Status: ${response.status}`,
        );
      }

      const data: UserPermissionEntry[] = await response.json();

      setPermissionEntries(data);
      setAssignedPermissions(
        data
          .map((entry) => entry.permissionId ?? entry.PermissionId ?? "")
          .filter(Boolean),
      );
    } catch (err) {
      console.error("Fetch user permissions error:", err);
      setPermissionEntries([]);
      setAssignedPermissions([]);
    }
  };

  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (resolvedRole === null) {
        throw new Error("No stored user tier found.");
      }

      const response = await fetch(
        `http://localhost:5023/api/User?userTier=${resolvedRole}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

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

      setStudent(foundStudent);
      setEditableStudent(normalizedStudent);
      setEditForm(normalizedStudent);

      await fetchUserPermissions(
        String(foundStudent.userId ?? foundStudent.UserId ?? ""),
      );
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

  const togglePermission = async (permissionCode: string) => {
    if (!canManagePermissions || resolvedRole === null || !editableStudent) {
      return;
    }

    try {
      setPermissionSaving(true);

      const token = localStorage.getItem("token");
      const existingEntry = permissionEntries.find(
        (entry) => (entry.permissionId ?? entry.PermissionId) === permissionCode,
      );

      if (existingEntry) {
        const referenceId =
          existingEntry.referenceId ?? existingEntry.ReferenceId ?? "";

        const response = await fetch(
          `http://localhost:5023/api/UserPermission/revoke/${referenceId}?userTier=${resolvedRole}`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
          alert(data.message || "Failed to revoke permission.");
          return;
        }
      } else {
        const response = await fetch(
          `http://localhost:5023/api/UserPermission/grant?userTier=${resolvedRole}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              targetUserId: editableStudent.userId,
              permissionId: permissionCode,
            }),
          },
        );

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
          alert(data.message || "Failed to grant permission.");
          return;
        }
      }

      await fetchUserPermissions(editableStudent.userId);
    } catch (error) {
      console.error("Toggle permission error:", error);
      alert("Failed to update permission.");
    } finally {
      setPermissionSaving(false);
    }
  };

  const handleOpenEditInfoModal = () => {
    if (!editableStudent) return;
    setEditForm(editableStudent);
    setShowEditInfoModal(true);
  };

  const handleSaveAccountInfo = async () => {
    const trimmedFullName = editForm.fullName.trim();
    const trimmedEmail = editForm.email.trim();
    const trimmedUsername = editForm.username.trim();

    if (!trimmedFullName || !trimmedEmail || !trimmedUsername) {
      alert("Please complete all editable account fields.");
      return;
    }

    const nameParts = trimmedFullName.split(" ").filter(Boolean);
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") || "";

    if (!firstName || !lastName) {
      alert("Please enter both first name and last name.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (resolvedRole === null) {
        alert("No stored user tier found.");
        return;
      }

      const response = await fetch(
        `http://localhost:5023/api/User/edit/${editForm.userId}?userTier=${resolvedRole}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            userFirstName: firstName,
            userLastName: lastName,
            userEmail: trimmedEmail,
            userUsername: trimmedUsername,
            userTier:
              editForm.role === "AppAdmin"
                ? 0
                : editForm.role === "Admin"
                  ? 1
                  : 2,
            userStatus: editForm.status === "Active" ? 0 : 1,
          }),
        },
      );

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        alert(data.message || "Failed to update student account.");
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
      alert(data.message || "Student account updated successfully.");
    } catch (error) {
      console.error("Save student account info error:", error);
      alert("Failed to update student account.");
    }
  };

  const handleDeactivateStudent = async () => {
    if (!editableStudent) return;

    const confirmed = window.confirm("Deactivate this student account?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      if (resolvedRole === null) {
        alert("No stored user tier found.");
        return;
      }

      const response = await fetch(
        `http://localhost:5023/api/User/deactivate/${editableStudent.userId}?userTier=${resolvedRole}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        alert(data.message || "Failed to deactivate student.");
        return;
      }

      const updatedStudent = {
        ...editableStudent,
        status: "Inactive" as const,
      };

      setEditableStudent(updatedStudent);
      setEditForm(updatedStudent);
      alert(data.message || "Student deactivated successfully.");
    } catch (error) {
      console.error("Deactivate student error:", error);
      alert("Failed to deactivate student.");
    }
  };

  const handleReactivateStudent = async () => {
    if (!editableStudent) return;

    const confirmed = window.confirm("Reactivate this student account?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      if (resolvedRole === null) {
        alert("No stored user tier found.");
        return;
      }

      const response = await fetch(
        `http://localhost:5023/api/User/reactivate/${editableStudent.userId}?userTier=${resolvedRole}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        alert(data.message || "Failed to reactivate student.");
        return;
      }

      const updatedStudent = {
        ...editableStudent,
        status: "Active" as const,
      };

      setEditableStudent(updatedStudent);
      setEditForm(updatedStudent);
      alert(data.message || "Student reactivated successfully.");
    } catch (error) {
      console.error("Reactivate student error:", error);
      alert("Failed to reactivate student.");
    }
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

                <div
                  className="student-modal-actions"
                  style={{ marginTop: "1rem" }}
                >
                  {editableStudent.status === "Active" ? (
                    <button
                      type="button"
                      className="dashboard-settings-cancel-btn"
                      onClick={handleDeactivateStudent}
                    >
                      Deactivate Account
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="dashboard-primary-btn"
                      onClick={handleReactivateStudent}
                    >
                      Reactivate Account
                    </button>
                  )}
                </div>
              </div>

              <div className="dashboard-panel student-profile-card">
                <div className="student-permission-header">
                  <div>
                    <h2>Permissions</h2>
                    <p className="student-panel-subtext">
                      {canManagePermissions
                        ? "Click Edit to add or remove permissions for this student only."
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
                  are currently assigned to this student only.
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
                    disabled={permissionSaving}
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
                disabled={permissionSaving}
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