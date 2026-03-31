import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserPage.css";

type ApiUser = {
  success: boolean;
  message: string;
  userId: number;
  userEmail: string;
  userUsername: string;
  userLastName: string;
  userFirstName: string;
  userTier: number;
  userStatus: number;
};

type UserRole = "AppAdmin" | "Admin";
type UserStatus = "Active" | "Inactive";

type User = {
  id: number;
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

export default function UserPage() {
  const navigate = useNavigate();

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

      const mappedUsers: User[] = data
        .filter((user) => user.userTier === 0 || user.userTier === 1)
        .map((user) => ({
          id: user.userId,
          name: `${user.userFirstName} ${user.userLastName}`.trim(),
          email: user.userEmail,
          username: user.userUsername,
          role: user.userTier === 0 ? "AppAdmin" : "Admin",
          status: user.userStatus === 0 ? "Active" : "Inactive",
        }));

      setUsers(mappedUsers);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleEdit = (user: User) => {
    alert(`Edit user: ${user.name}`);
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

  return (
    <div className="user-page">
      <aside className="user-sidebar">
        <div>
          <h2 className="user-logo">AppAdmin</h2>
          <p className="user-role">Administrator Panel</p>
        </div>

        <nav className="user-nav">
          <button
            className="user-nav-item"
            onClick={() => navigate("/appadmin")}
          >
            Dashboard
          </button>

          <button className="user-nav-item active">Users</button>

          <button className="user-nav-item">Reports</button>
          <button className="user-nav-item">Settings</button>
        </nav>

        <button className="user-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="user-main">
        <header className="user-header">
          <div>
            <h1>User Dashboard</h1>
            <p>
              Manage AppAdmins and Admins from your database, like civilized
              people.
            </p>
          </div>
        </header>

        <section className="user-cards">
          <div className="user-card">
            <h3>Total Users</h3>
            <p>{totalUsers}</p>
          </div>

          <div className="user-card">
            <h3>AppAdmins</h3>
            <p>{totalAppAdmins}</p>
          </div>

          <div className="user-card">
            <h3>Admins</h3>
            <p>{totalAdmins}</p>
          </div>

          <div className="user-card">
            <h3>Active Users</h3>
            <p>{activeUsers}</p>
          </div>
        </section>

        <section className="user-panel">
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
                className="add-admin-btn"
                onClick={handleOpenAddAdminModal}
              >
                + Add Admin
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="empty-state">{error}</p>
          ) : (
            <div className="user-table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
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
                          <span
                            className={`role-badge ${
                              user.role === "AppAdmin"
                                ? "role-badge-appadmin"
                                : "role-badge-admin"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              user.status === "Active"
                                ? "status-active"
                                : "status-inactive"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <div className="user-actions">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => handleEdit(user)}
                            >
                              Edit
                            </button>
                            <button
                              className="action-btn password-btn"
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
                      <td colSpan={4} className="empty-state">
                        No admin users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {showAddAdminModal && (
        <div className="modal-overlay" onClick={handleCloseAddAdminModal}>
          <div className="add-admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="add-admin-modal-header">
              <div>
                <h2>Add New Admin</h2>
                <p>
                  Create a new tier 1 admin account with a temporary password.
                </p>
              </div>
              <button
                className="modal-close-btn"
                onClick={handleCloseAddAdminModal}
                disabled={addAdminLoading}
              >
                ×
              </button>
            </div>

            <form className="add-admin-form" onSubmit={handleAddAdminSubmit}>
              <div className="add-admin-grid">
                <div className="form-group">
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

                <div className="form-group">
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

                <div className="form-group">
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

                <div className="form-group">
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

                <div className="form-group form-group-full">
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
                <p className="form-message form-message-error">
                  {addAdminError}
                </p>
              )}

              {addAdminMessage && (
                <p className="form-message form-message-success">
                  {addAdminMessage}
                </p>
              )}

              <div className="add-admin-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseAddAdminModal}
                  disabled={addAdminLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-admin-btn"
                  disabled={addAdminLoading}
                >
                  {addAdminLoading ? "Creating..." : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
