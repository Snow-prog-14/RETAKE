import { useNavigate } from "react-router-dom";
import "./AdminPage.css";

export default function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <p>Management Panel</p>

        <nav className="admin-nav">
          <button className="active">Dashboard</button>
          <button onClick={() => navigate("/profile")}>Profile</button>

          <button>Students</button>
          <button>Courses</button>
          <button>Reports</button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <h1>Admin Dashboard</h1>
        <p>Manage academic records and monitor activity.</p>

        <div className="admin-cards">
          <div className="admin-card">
            <h3>Total Students</h3>
            <p>320</p>
          </div>
          <div className="admin-card">
            <h3>Active Classes</h3>
            <p>14</p>
          </div>
          <div className="admin-card">
            <h3>Pending Reports</h3>
            <p>9</p>
          </div>
        </div>
      </main>
    </div>
  );
}
