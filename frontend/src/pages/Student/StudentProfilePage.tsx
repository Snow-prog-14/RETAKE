import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardShell from "../../components/DashboardShell";
import "../../components/DashboardShell.css";
import "./StudentManagement.css";

type ApiStudent = {
  userId: number;
  userEmail: string;
  userUsername: string;
  userLastName: string;
  userFirstName: string;
  userTier: number;
  userStatus: number;
};

export default function StudentProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { studentId } = useParams();

  const role = Number(localStorage.getItem("role"));
  const isAppAdmin = role === 0;
  const isAdmin = role === 1;

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
            user.userTier === 2 && String(user.userId) === String(studentId),
        ) || null;

      if (!foundStudent) {
        setError("Student not found.");
        setStudent(null);
        return;
      }

      setStudent(foundStudent);
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
  }, [isAppAdmin, isAdmin, navigate, studentId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  const initials = useMemo(() => {
    if (!student) return "ST";

    return `${student.userFirstName ?? ""} ${student.userLastName ?? ""}`
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [student]);

  const backPath = isAppAdmin ? "/appadmin/students" : "/admin/students";

  return (
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
      ) : error || !student ? (
        <section className="dashboard-panel">
          <p className="student-empty-state">{error || "Student not found."}</p>
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
                <h2>
                  {`${student.userFirstName} ${student.userLastName}`.trim()}
                </h2>
                <p>@{student.userUsername}</p>
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
              <h2>Account Information</h2>
              <div className="student-profile-info-list">
                <div className="student-profile-info-row">
                  <span className="student-info-label">Full Name</span>
                  <strong>
                    {`${student.userFirstName} ${student.userLastName}`.trim()}
                  </strong>
                </div>

                <div className="student-profile-info-row">
                  <span className="student-info-label">Email</span>
                  <strong>{student.userEmail}</strong>
                </div>

                <div className="student-profile-info-row">
                  <span className="student-info-label">Username</span>
                  <strong>@{student.userUsername}</strong>
                </div>

                <div className="student-profile-info-row">
                  <span className="student-info-label">Role</span>
                  <strong>Student</strong>
                </div>

                <div className="student-profile-info-row">
                  <span className="student-info-label">Status</span>
                  <strong>
                    {student.userStatus === 0 ? "Active" : "Inactive"}
                  </strong>
                </div>

                <div className="student-profile-info-row">
                  <span className="student-info-label">User ID</span>
                  <strong>{student.userId}</strong>
                </div>
              </div>
            </div>

            <div className="dashboard-panel student-profile-card">
              <h2>Quick Summary</h2>
              <ul className="student-summary-list">
                <li>This account belongs to a tier 2 student user.</li>
                <li>Visible only to AppAdmin and Admin dashboards.</li>
                <li>
                  Good place to add course, section, year, and enrollment later.
                </li>
              </ul>
            </div>
          </section>
        </>
      )}
    </DashboardShell>
  );
}
