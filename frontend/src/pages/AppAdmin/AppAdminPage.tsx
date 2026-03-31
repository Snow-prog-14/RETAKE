import { useNavigate } from "react-router-dom";
import "./AppAdminPage.css";

export default function AppAdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="appadmin-page">
      <aside className="appadmin-sidebar">
        <div>
          <h2>AppAdmin</h2>
          <p>Administrator Panel</p>
          <nav className="appadmin-nav">
            <button className="active" onClick={() => navigate("/appadmin")}>
              Dashboard
            </button>
            <button onClick={() => navigate("/appadmin/users")}>Users</button>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button>Reports</button>
            <button>Settings</button>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="appadmin-main">
        <h1>AppAdmin Dashboard</h1>
        <p>
          Manage users, monitor activity, and pretend everything is under
          control.
        </p>

        <div className="appadmin-cards">
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
        </div>

        <div className="appadmin-activity">
          <h2>Recent Activity</h2>
          <ul>
            <li>Admin logged in</li>
            <li>User records checked</li>
            <li>System status reviewed</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
