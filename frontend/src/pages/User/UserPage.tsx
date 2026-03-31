import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardShell from "../../components/DashboardShell";
import "../../components/DashboardShell.css";
import "./UserPage.css";

type ApiUser = {
  success?: boolean;
  message?: string;
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

type UserRole = "AppAdmin" | "Admin";
type UserStatus = "Active" | "Inactive";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
};

type AddAdminForm = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  temporaryPassword: string;
};

type EditUserForm = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
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

    const parsedUser = JSON.parse(rawUser);
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

function getDefaultAssignedPermissions(role: UserRole): string[] {
  if (role === "AppAdmin") {
    return [
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

  return [
    "student.list.view",
    "student.profile.view",
    "student.info.edit",
    "student.status.update",
    "admin.list.view",
    "admin.info.edit",
    "admin.status.update",
  ];
}

export default function UserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const resolvedRole = getResolvedRole();
  const isTier0 = resolvedRole === 0;

  const navItems = [
    { label: "Dashboard", path: "/appadmin" },
    { label: "Users", path: "/appadmin/users" },
    { label: "Students", path: "/appadmin/students" },
    { label: "Profile", path: "/appadmin/profile" },
    { label: "Reports", path: "/appadmin/reports" },
    { label: "Settings", path: "/appadmin/settings" },
  ];

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | UserRole>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [addAdminForm, setAddAdminForm] = useState<AddAdminForm>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    temporaryPassword: "",
  });
  const [addAdminLoading, setAddAdminLoading] = useState(false);
  const [addAdminMessage, setAddAdminMessage] = useState("");
  const [addAdminError, setAddAdminError] = useState("");

  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserForm, setEditUserForm] = useState<EditUserForm>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    role: "Admin",
    status: "Active",
  });
  const [editUserMessage, setEditUserMessage] = useState("");
  const [editUserError, setEditUserError] = useState("");

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedPermissionUser, setSelectedPermissionUser] =
    useState<User | null>(null);
  const [assignedPermissionsByUser, setAssignedPermissionsByUser] = useState<
    Record<number, string[]>
  >({});

  const allPermissions = useMemo(() => getAllPermissions(), []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5023/api/User?userTier=0",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch users. Status: ${response.status}`);
      }

      const data: ApiUser[] = await response.json();
      console.log("User API data:", data);

      const mappedUsers: User[] = data
        .filter(
          (user) =>
            (user.userTier ?? user.UserTier) === 0 ||
            (user.userTier ?? user.UserTier) === 1,
        )
        .map((user): User => {
          const firstName = user.userFirstName ?? user.UserFirstName ?? "";
          const lastName = user.userLastName ?? user.UserLastName ?? "";
          const tier = user.userTier ?? user.UserTier ?? 1;
          const statusCode = user.userStatus ?? user.UserStatus ?? 0;

          return {
            id: Number(user.userId ?? user.UserId ?? 0),
            firstName,
            lastName,
            name: `${firstName} ${lastName}`.trim(),
            email: user.userEmail ?? user.UserEmail ?? "",
            username: user.userUsername ?? user.UserUsername ?? "",
            role: tier === 0 ? "AppAdmin" : "Admin",
            status: statusCode === 0 ? "Active" : "Inactive",
          };
        })
        .filter((user) => user.id !== 0);

      setUsers(mappedUsers);

      setAssignedPermissionsByUser((prev) => {
        const next = { ...prev };

        mappedUsers.forEach((user) => {
          if (!next[user.id]) {
            next[user.id] = getDefaultAssignedPermissions(user.role);
          }
        });

        return next;
      });
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isTier0) {
      navigate("/");
      return;
    }

    fetchUsers();
  }, [isTier0, navigate]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = searchTerm.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.username.toLowerCase().includes(keyword);

      const matchesRole = roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const totalUsers = users.length;
  const totalAppAdmins = users.filter(
    (user) => user.role === "AppAdmin",
  ).length;
  const totalAdmins = users.filter((user) => user.role === "Admin").length;
  const activeUsers = users.filter((user) => user.status === "Active").length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleOpenEditModal = (user: User) => {
    setEditUserMessage("");
    setEditUserError("");
    setEditUserForm({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status,
    });
    setShowEditUserModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditUserModal(false);
    setEditUserMessage("");
    setEditUserError("");
  };

  const handleSaveEditedUser = () => {
    const firstName = editUserForm.firstName.trim();
    const lastName = editUserForm.lastName.trim();
    const email = editUserForm.email.trim();
    const username = editUserForm.username.trim();

    if (!firstName || !lastName || !email || !username) {
      setEditUserError("Please complete all fields.");
      return;
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.id === editUserForm.id
          ? {
              ...user,
              firstName,
              lastName,
              name: `${firstName} ${lastName}`.trim(),
              email,
              username,
              role: editUserForm.role,
              status: editUserForm.status,
            }
          : user,
      ),
    );

    setAssignedPermissionsByUser((prev) => {
      const existingPermissions = prev[editUserForm.id] ?? [];
      const defaultPermissionsForRole = getDefaultAssignedPermissions(
        editUserForm.role,
      );

      return {
        ...prev,
        [editUserForm.id]:
          existingPermissions.length > 0
            ? existingPermissions
            : defaultPermissionsForRole,
      };
    });

    setEditUserError("");
    setEditUserMessage("User information updated successfully.");

    setTimeout(() => {
      setShowEditUserModal(false);
      setEditUserMessage("");
    }, 900);
  };

  const handleChangePassword = (user: User) => {
    alert(`Change password for: ${user.name}`);
  };

  const handleOpenAddAdminModal = () => {
    setAddAdminForm({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      temporaryPassword: "",
    });
    setAddAdminMessage("");
    setAddAdminError("");
    setShowAddAdminModal(true);
  };

  const handleCloseAddAdminModal = () => {
    if (addAdminLoading) return;
    setShowAddAdminModal(false);
  };

  const handleAddAdminInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setAddAdminForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAdminSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setAddAdminLoading(true);
      setAddAdminMessage("");
      setAddAdminError("");

      const response = await fetch("http://localhost:5023/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          userEmail: addAdminForm.email.trim(),
          userUsername: addAdminForm.username.trim(),
          userLastName: addAdminForm.lastName.trim(),
          userFirstName: addAdminForm.firstName.trim(),
          mustChangePass: 1,
          userTier: 1,
          password: addAdminForm.temporaryPassword,
        }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        setAddAdminError(data.message || "Failed to create admin.");
        return;
      }

      setAddAdminMessage(data.message || "Admin created successfully.");

      await fetchUsers();

      setAddAdminForm({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        temporaryPassword: "",
      });

      setTimeout(() => {
        setShowAddAdminModal(false);
        setAddAdminMessage("");
      }, 1000);
    } catch (err) {
      console.error("Add admin error:", err);
      setAddAdminError("Failed to create admin.");
    } finally {
      setAddAdminLoading(false);
    }
  };

  const handleOpenPermissionModal = (user: User) => {
    setSelectedPermissionUser(user);

    setAssignedPermissionsByUser((prev) => {
      if (prev[user.id]) return prev;

      return {
        ...prev,
        [user.id]: getDefaultAssignedPermissions(user.role),
      };
    });

    setShowPermissionModal(true);
  };

  const handleClosePermissionModal = () => {
    setShowPermissionModal(false);
    setSelectedPermissionUser(null);
  };

  const togglePermission = (permissionCode: string) => {
    if (!selectedPermissionUser || !isTier0) return;

    setAssignedPermissionsByUser((prev) => {
      const currentPermissions = prev[selectedPermissionUser.id] ?? [];
      const exists = currentPermissions.includes(permissionCode);

      return {
        ...prev,
        [selectedPermissionUser.id]: exists
          ? currentPermissions.filter((item) => item !== permissionCode)
          : [...currentPermissions, permissionCode],
      };
    });
  };

  const selectedUserPermissions = selectedPermissionUser
    ? (assignedPermissionsByUser[selectedPermissionUser.id] ?? [])
    : [];

  return (
    <>
      <DashboardShell
        roleTitle="AppAdmin"
        roleSubtitle="Administrator Panel"
        currentPath={currentPath}
        pageTitle="User Dashboard"
        pageSubtitle="Manage AppAdmins and Admins from your database."
        navItems={navItems}
        onNavigate={navigate}
        onLogout={handleLogout}
        mainClassName="user-dashboard-main"
      >
        <section className="dashboard-stat-grid user-stat-grid">
          <div className="dashboard-stat-card">
            <h3>Total Users</h3>
            <p>{totalUsers}</p>
          </div>

          <div className="dashboard-stat-card">
            <h3>AppAdmins</h3>
            <p>{totalAppAdmins}</p>
          </div>

          <div className="dashboard-stat-card">
            <h3>Admins</h3>
            <p>{totalAdmins}</p>
          </div>

          <div className="dashboard-stat-card">
            <h3>Active Users</h3>
            <p>{activeUsers}</p>
          </div>
        </section>

        <section className="dashboard-panel user-management-panel">
          <div className="user-panel-top">
            <div>
              <h2>User Management</h2>
              <p className="user-panel-subtext">
                View and manage tier 0 and tier 1 accounts.
              </p>
            </div>

            <div className="user-toolbar">
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                className="user-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                className="user-filter"
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as "All" | UserRole)
                }
              >
                <option value="All">All Roles</option>
                <option value="AppAdmin">AppAdmin</option>
                <option value="Admin">Admin</option>
              </select>

              <button
                type="button"
                className="dashboard-primary-btn"
                onClick={handleOpenAddAdminModal}
              >
                + Add Admin
              </button>
            </div>
          </div>

          {loading ? (
            <p className="user-empty-state">Loading users...</p>
          ) : error ? (
            <p className="user-empty-state">{error}</p>
          ) : (
            <div className="user-table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-name-cell">
                            <span className="user-name-text">{user.name}</span>
                            <span className="user-email-text">
                              {user.email}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="user-username-text">
                            @{user.username}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`user-role-badge ${
                              user.role === "AppAdmin"
                                ? "user-role-badge-appadmin"
                                : "user-role-badge-admin"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`user-status-badge ${
                              user.status === "Active"
                                ? "user-status-active"
                                : "user-status-inactive"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td>
                          <div className="user-actions">
                            <button
                              type="button"
                              className="user-action-btn user-edit-btn"
                              onClick={() => handleOpenEditModal(user)}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="user-action-btn user-permission-btn"
                              onClick={() => handleOpenPermissionModal(user)}
                            >
                              Permissions
                            </button>

                            <button
                              type="button"
                              className="user-action-btn user-password-btn"
                              onClick={() => handleChangePassword(user)}
                            >
                              Change Password
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="user-empty-state">
                        No admin users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </DashboardShell>

      {showAddAdminModal && (
        <div className="user-modal-overlay" onClick={handleCloseAddAdminModal}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <div>
                <h2>Add New Admin</h2>
                <p>
                  Create a new tier 1 admin account with a temporary password.
                </p>
              </div>

              <button
                type="button"
                className="user-modal-close-btn"
                onClick={handleCloseAddAdminModal}
                disabled={addAdminLoading}
              >
                ×
              </button>
            </div>

            <form
              className="user-add-admin-form"
              onSubmit={handleAddAdminSubmit}
            >
              <div className="user-add-admin-grid">
                <div className="user-form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={addAdminForm.firstName}
                    onChange={handleAddAdminInputChange}
                    required
                  />
                </div>

                <div className="user-form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={addAdminForm.lastName}
                    onChange={handleAddAdminInputChange}
                    required
                  />
                </div>

                <div className="user-form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={addAdminForm.username}
                    onChange={handleAddAdminInputChange}
                    required
                  />
                </div>

                <div className="user-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={addAdminForm.email}
                    onChange={handleAddAdminInputChange}
                    required
                  />
                </div>

                <div className="user-form-group user-form-group-full">
                  <label htmlFor="temporaryPassword">Temporary Password</label>
                  <input
                    id="temporaryPassword"
                    name="temporaryPassword"
                    type="text"
                    value={addAdminForm.temporaryPassword}
                    onChange={handleAddAdminInputChange}
                    required
                  />
                </div>
              </div>

              {addAdminError && (
                <p className="user-form-message user-form-message-error">
                  {addAdminError}
                </p>
              )}

              {addAdminMessage && (
                <p className="user-form-message user-form-message-success">
                  {addAdminMessage}
                </p>
              )}

              <div className="user-add-admin-actions">
                <button
                  type="button"
                  className="dashboard-settings-cancel-btn"
                  onClick={handleCloseAddAdminModal}
                  disabled={addAdminLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="dashboard-primary-btn"
                  disabled={addAdminLoading}
                >
                  {addAdminLoading ? "Creating..." : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditUserModal && (
        <div className="user-modal-overlay" onClick={handleCloseEditModal}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <div>
                <h2>Edit User</h2>
                <p>
                  Tier 0 can edit admin information and promote admins to
                  AppAdmin.
                </p>
              </div>

              <button
                type="button"
                className="user-modal-close-btn"
                onClick={handleCloseEditModal}
              >
                ×
              </button>
            </div>

            <div className="user-add-admin-form">
              <div className="user-add-admin-grid">
                <div className="user-form-group">
                  <label htmlFor="editFirstName">First Name</label>
                  <input
                    id="editFirstName"
                    type="text"
                    value={editUserForm.firstName}
                    onChange={(e) =>
                      setEditUserForm((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="user-form-group">
                  <label htmlFor="editLastName">Last Name</label>
                  <input
                    id="editLastName"
                    type="text"
                    value={editUserForm.lastName}
                    onChange={(e) =>
                      setEditUserForm((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="user-form-group">
                  <label htmlFor="editUsername">Username</label>
                  <input
                    id="editUsername"
                    type="text"
                    value={editUserForm.username}
                    onChange={(e) =>
                      setEditUserForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="user-form-group">
                  <label htmlFor="editEmail">Email</label>
                  <input
                    id="editEmail"
                    type="email"
                    value={editUserForm.email}
                    onChange={(e) =>
                      setEditUserForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="user-form-group">
                  <label htmlFor="editRole">Role</label>
                  <select
                    id="editRole"
                    value={editUserForm.role}
                    onChange={(e) =>
                      setEditUserForm((prev) => ({
                        ...prev,
                        role: e.target.value as UserRole,
                      }))
                    }
                  >
                    <option value="Admin">Admin</option>
                    <option value="AppAdmin">AppAdmin</option>
                  </select>
                </div>

                <div className="user-form-group">
                  <label htmlFor="editStatus">Status</label>
                  <select
                    id="editStatus"
                    value={editUserForm.status}
                    onChange={(e) =>
                      setEditUserForm((prev) => ({
                        ...prev,
                        status: e.target.value as UserStatus,
                      }))
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {editUserError && (
                <p className="user-form-message user-form-message-error">
                  {editUserError}
                </p>
              )}

              {editUserMessage && (
                <p className="user-form-message user-form-message-success">
                  {editUserMessage}
                </p>
              )}

              <div className="user-add-admin-actions">
                <button
                  type="button"
                  className="dashboard-settings-cancel-btn"
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="dashboard-primary-btn"
                  onClick={handleSaveEditedUser}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPermissionModal && selectedPermissionUser && (
        <div
          className="user-modal-overlay"
          onClick={handleClosePermissionModal}
        >
          <div
            className="user-modal user-permission-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="user-modal-header">
              <div>
                <h2>Edit Permissions</h2>
                <p>
                  Click a pill to add or remove a permission. Highlighted pills
                  are currently assigned.
                </p>
                <p className="user-permission-user-meta">
                  {selectedPermissionUser.name} ({selectedPermissionUser.role})
                </p>
              </div>

              <button
                type="button"
                className="user-modal-close-btn"
                onClick={handleClosePermissionModal}
              >
                ×
              </button>
            </div>

            <div className="user-pill-list user-modal-pill-list">
              {allPermissions.map((permission) => {
                const isActive = selectedUserPermissions.includes(permission);

                return (
                  <button
                    key={permission}
                    type="button"
                    className={`user-permission-pill ${isActive ? "active" : ""}`}
                    onClick={() => togglePermission(permission)}
                  >
                    {permission}
                  </button>
                );
              })}
            </div>

            <div className="user-modal-actions">
              <button
                type="button"
                className="dashboard-primary-btn"
                onClick={handleClosePermissionModal}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
