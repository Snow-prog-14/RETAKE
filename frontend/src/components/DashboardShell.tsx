import "./DashboardShell.css";

type NavItem = {
  label: string;
  path: string;
};

type DashboardShellProps = {
  roleTitle: string;
  roleSubtitle: string;
  currentPath: string;
  pageTitle: string;
  pageSubtitle: string;
  navItems: NavItem[];
  onNavigate: (path: string) => void;
  onLogout: () => void;
  mainClassName?: string;
  children: React.ReactNode;
};

export default function DashboardShell({
  roleTitle,
  roleSubtitle,
  currentPath,
  pageTitle,
  pageSubtitle,
  navItems,
  onNavigate,
  onLogout,
  mainClassName = "",
  children,
}: DashboardShellProps) {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div>
          <h2>{roleTitle}</h2>
          <p>{roleSubtitle}</p>

          <nav className="dashboard-nav">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={currentPath === item.path ? "active" : ""}
                onClick={() => onNavigate(item.path)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <button
          className="dashboard-logout-btn"
          onClick={onLogout}
          type="button"
        >
          Logout
        </button>
      </aside>

      <main className={`dashboard-main ${mainClassName}`.trim()}>
        <h1>{pageTitle}</h1>
        <p>{pageSubtitle}</p>
        {children}
      </main>
    </div>
  );
}
