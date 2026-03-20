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

export default function UserPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | UserRole>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
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
    navigate("/");
  };

  const handleEdit = (user: User) => {
    alert(`Edit user: ${user.name}`);
  };

  const handleChangePassword = (user: User) => {
    alert(`Change password for: ${user.name}`);
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
    </div>
  );
}
