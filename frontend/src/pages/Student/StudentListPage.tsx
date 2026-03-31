import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardShell from "../../components/DashboardShell";
import "../../components/DashboardShell.css";
import "./StudentManagement.css";

type ApiStudent = {
  success?: boolean;
  message?: string;
  userId: number;
  userEmail: string;
  userUsername: string;
  userLastName: string;
  userFirstName: string;
  userTier: number;
  userStatus: number;
};

type Student = {
  id: number;
  name: string;
  email: string;
  username: string;
  status: "Active" | "Inactive";
};

export default function StudentListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

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

  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
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
        throw new Error(`Failed to fetch students. Status: ${response.status}`);
      }

      const data: ApiStudent[] = await response.json();

      const mappedStudents: Student[] = data
        .filter((user) => user.userTier === 2)
        .map((user) => ({
          id: user.userId,
          name: `${user.userFirstName} ${user.userLastName}`.trim(),
          email: user.userEmail,
          username: user.userUsername,
          status: user.userStatus === 0 ? "Active" : "Inactive",
        }));

      setStudents(mappedStudents);
    } catch (err) {
      console.error("Fetch students error:", err);
      setError("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAppAdmin && !isAdmin) {
      navigate("/");
      return;
    }

    fetchStudents();
  }, [isAppAdmin, isAdmin, navigate]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const keyword = searchTerm.toLowerCase();

      const matchesSearch =
        student.name.toLowerCase().includes(keyword) ||
        student.email.toLowerCase().includes(keyword) ||
        student.username.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" || student.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, searchTerm, statusFilter]);

  const totalStudents = students.length;
  const activeStudents = students.filter(
    (student) => student.status === "Active",
  ).length;
  const inactiveStudents = students.filter(
    (student) => student.status === "Inactive",
  ).length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleViewProfile = (studentId: number) => {
    if (isAppAdmin) {
      navigate(`/appadmin/students/${studentId}`);
      return;
    }

    navigate(`/admin/students/${studentId}`);
  };

  return (
    <DashboardShell
      roleTitle={isAppAdmin ? "AppAdmin" : "Admin"}
      roleSubtitle={isAppAdmin ? "Administrator Panel" : "Management Panel"}
      currentPath={currentPath}
      pageTitle="Student List"
      pageSubtitle="View student records and open individual student profiles."
      navItems={navItems}
      onNavigate={navigate}
      onLogout={handleLogout}
      mainClassName="student-management-main"
    >
      <section className="dashboard-stat-grid student-stat-grid">
        <div className="dashboard-stat-card">
          <h3>Total Students</h3>
          <p>{totalStudents}</p>
        </div>

        <div className="dashboard-stat-card">
          <h3>Active</h3>
          <p>{activeStudents}</p>
        </div>

        <div className="dashboard-stat-card">
          <h3>Inactive</h3>
          <p>{inactiveStudents}</p>
        </div>
      </section>

      <section className="dashboard-panel student-management-panel">
        <div className="student-panel-top">
          <div>
            <h2>Students</h2>
            <p className="student-panel-subtext">
              Tier 0 and tier 1 can view student accounts here.
            </p>
          </div>

          <div className="student-toolbar">
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              className="student-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="student-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "All" | "Active" | "Inactive")
              }
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="student-empty-state">Loading students...</p>
        ) : error ? (
          <p className="student-empty-state">{error}</p>
        ) : (
          <div className="student-table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-name-cell">
                          <span className="student-name-text">
                            {student.name}
                          </span>
                          <span className="student-email-text">
                            {student.email}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="student-username-text">
                          @{student.username}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`student-status-badge ${
                            student.status === "Active"
                              ? "student-status-active"
                              : "student-status-inactive"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="student-action-btn student-view-btn"
                          onClick={() => handleViewProfile(student.id)}
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="student-empty-state">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
