import { useNavigate } from "react-router-dom";
import "./AppAdminPage.css";

export default function AppAdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="appadmin-page">
      <aside className="appadmin-sidebar">
        <div>
          <h2 className="appadmin-logo">AppAdmin</h2>
          <p className="appadmin-role">Administrator Panel</p>
        </div>

        <nav className="appadmin-nav">
          <button className="appadmin-nav-item active">Dashboard</button>
          <button
            className="appadmin-nav-item"
            onClick={() => navigate("/appadmin/users")}
          >
            Users
          </button>{" "}
          <button className="appadmin-nav-item">Reports</button>
          <button className="appadmin-nav-item">Settings</button>
        </nav>

        <button className="appadmin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="appadmin-main">
        <header className="appadmin-header">
          <div>
            <h1>AppAdmin Dashboard</h1>
            <p>
              Manage users, monitor activity, and pretend everything is under
              control.
            </p>
          </div>
        </header>

        <section className="appadmin-cards">
          <div className="appadmin-card">
            <h3>Total Users</h3>
            <p>120</p>
          </div>

          <div className="appadmin-card">
            <h3>Active Sessions</h3>
            <p>18</p>
          </div>

          <div className="appadmin-card">
            <h3>Reports Today</h3>
            <p>6</p>
          </div>
        </section>

        <section className="appadmin-panel">
          <h2>Recent Activity</h2>
          <ul>
            <li>Admin logged in</li>
            <li>User records checked</li>
            <li>System status reviewed</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
