import { useNavigate } from "react-router-dom";
import "./StudentPage.css";

export default function StudentPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="student-page">
      <aside className="student-sidebar">
        <h2>Student</h2>
        <p>Learning Dashboard</p>

        <nav className="student-nav">
          <button className="active">Dashboard</button>
          <button className="appadmin-nav-item active">View Profile</button>

          <button>Subjects</button>
          <button>Tasks</button>
          <button>Profile</button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="student-main">
        <h1>Student Dashboard</h1>
        <p>Track progress, tasks, and study activity.</p>

        <div className="student-cards">
          <div className="student-card">
            <h3>Subjects</h3>
            <p>6</p>
          </div>
          <div className="student-card">
            <h3>Pending Tasks</h3>
            <p>4</p>
          </div>
          <div className="student-card">
            <h3>Completed</h3>
            <p>11</p>
          </div>
        </div>
      </main>
    </div>
  );
}
