import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardShell from "../../components/DashboardShell";
import "../../components/DashboardShell.css";
import "./TierPage.css";

type TierStatus = "Active" | "Archived";

type TierItem = {
  id: number;
  name: string;
  level: number;
  description: string;
  status: TierStatus;
  permissions: string[];
};

type TierForm = {
  id: number | null;
  name: string;
  level: string;
  description: string;
  status: TierStatus;
  permissions: string[];
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

function getInitialTiers(): TierItem[] {
  return [
    {
      id: 1,
      name: "AppAdmin",
      level: 0,
      description: "Highest system-level access for platform management.",
      status: "Active",
      permissions: [
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
      ],
    },
    {
      id: 2,
      name: "Admin",
      level: 1,
      description: "Administrative access for managing students and records.",
      status: "Active",
      permissions: [
        "student.list.view",
        "student.profile.view",
        "student.info.edit",
        "student.status.update",
        "admin.list.view",
        "admin.info.edit",
        "admin.status.update",
      ],
    },
    {
      id: 3,
      name: "Student",
      level: 2,
      description: "Default student-level access for personal account actions.",
      status: "Active",
      permissions: [
        "profile.view_own",
        "profile.edit_own",
        "profile.photo.update_own",
        "username.update_own",
        "password.update_own",
        "profile.deactivate_own",
      ],
    },
  ];
}

const emptyTierForm: TierForm = {
  id: null,
  name: "",
  level: "",
  description: "",
  status: "Active",
  permissions: [],
};

export default function TierPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const resolvedRole = getResolvedRole();
  const isTier0 = resolvedRole === 0;

  const navItems = [
    { label: "Dashboard", path: "/appadmin" },
    { label: "Users", path: "/appadmin/users" },
    { label: "Students", path: "/appadmin/students" },
    { label: "Tier Management", path: "/appadmin/tiers" },
    { label: "Profile", path: "/appadmin/profile" },
    { label: "Reports", path: "/appadmin/reports" },
    { label: "Settings", path: "/appadmin/settings" },
  ];

  const [tiers, setTiers] = useState<TierItem[]>(getInitialTiers());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TierStatus>("All");

  const [showTierModal, setShowTierModal] = useState(false);
  const [tierForm, setTierForm] = useState<TierForm>(emptyTierForm);
  const [formError, setFormError] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const allPermissions = useMemo(() => getAllPermissions(), []);

  if (!isTier0) {
    navigate("/");
    return null;
  }

  const filteredTiers = tiers.filter((tier) => {
    const keyword = searchTerm.toLowerCase();

    const matchesSearch =
      tier.name.toLowerCase().includes(keyword) ||
      tier.description.toLowerCase().includes(keyword) ||
      String(tier.level).includes(keyword);

    const matchesStatus =
      statusFilter === "All" || tier.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalTiers = tiers.length;
  const activeTiers = tiers.filter((tier) => tier.status === "Active").length;
  const archivedTiers = tiers.filter(
    (tier) => tier.status === "Archived",
  ).length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleOpenAddModal = () => {
    setTierForm(emptyTierForm);
    setFormError("");
    setFormMessage("");
    setShowTierModal(true);
  };

  const handleOpenEditModal = (tier: TierItem) => {
    setTierForm({
      id: tier.id,
      name: tier.name,
      level: String(tier.level),
      description: tier.description,
      status: tier.status,
      permissions: [...tier.permissions],
    });
    setFormError("");
    setFormMessage("");
    setShowTierModal(true);
  };

  const handleCloseTierModal = () => {
    setShowTierModal(false);
    setTierForm(emptyTierForm);
    setFormError("");
    setFormMessage("");
  };

  const togglePermission = (permissionCode: string) => {
    setTierForm((prev) => {
      const exists = prev.permissions.includes(permissionCode);

      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((item) => item !== permissionCode)
          : [...prev.permissions, permissionCode],
      };
    });
  };

  const handleSaveTier = () => {
    const trimmedName = tierForm.name.trim();
    const trimmedLevel = tierForm.level.trim();
    const trimmedDescription = tierForm.description.trim();

    if (!trimmedName || !trimmedLevel || !trimmedDescription) {
      setFormError("Please complete all tier fields.");
      return;
    }

    const parsedLevel = Number(trimmedLevel);

    if (Number.isNaN(parsedLevel)) {
      setFormError("Tier level must be a valid number.");
      return;
    }

    const duplicateLevel = tiers.some(
      (tier) => tier.level === parsedLevel && tier.id !== tierForm.id,
    );

    if (duplicateLevel) {
      setFormError("That tier level already exists.");
      return;
    }

    const duplicateName = tiers.some(
      (tier) =>
        tier.name.toLowerCase() === trimmedName.toLowerCase() &&
        tier.id !== tierForm.id,
    );

    if (duplicateName) {
      setFormError("That tier name already exists.");
      return;
    }

    if (tierForm.permissions.length === 0) {
      setFormError("Assign at least one permission.");
      return;
    }

    if (tierForm.id === null) {
      const newTier: TierItem = {
        id: Date.now(),
        name: trimmedName,
        level: parsedLevel,
        description: trimmedDescription,
        status: tierForm.status,
        permissions: [...tierForm.permissions],
      };

      setTiers((prev) => [...prev, newTier].sort((a, b) => a.level - b.level));
      setFormMessage("Tier added successfully.");
    } else {
      setTiers((prev) =>
        prev
          .map((tier) =>
            tier.id === tierForm.id
              ? {
                  ...tier,
                  name: trimmedName,
                  level: parsedLevel,
                  description: trimmedDescription,
                  status: tierForm.status,
                  permissions: [...tierForm.permissions],
                }
              : tier,
          )
          .sort((a, b) => a.level - b.level),
      );
      setFormMessage("Tier updated successfully.");
    }

    setTimeout(() => {
      handleCloseTierModal();
    }, 700);
  };

  const handleArchiveTier = (tierId: number) => {
    const confirmed = window.confirm(
      "Archive this tier? It will remain visible but marked as archived.",
    );

    if (!confirmed) return;

    setTiers((prev) =>
      prev.map((tier) =>
        tier.id === tierId ? { ...tier, status: "Archived" } : tier,
      ),
    );
  };

  return (
    <>
      <DashboardShell
        roleTitle="AppAdmin"
        roleSubtitle="Administrator Panel"
        currentPath={currentPath}
        pageTitle="Tier Management"
        pageSubtitle="View, add, edit, and archive system tiers."
        navItems={navItems}
        onNavigate={navigate}
        onLogout={handleLogout}
        mainClassName="tier-management-main"
      >
        <section className="dashboard-stat-grid tier-stat-grid">
          <div className="dashboard-stat-card">
            <h3>Total Tiers</h3>
            <p>{totalTiers}</p>
          </div>

          <div className="dashboard-stat-card">
            <h3>Active Tiers</h3>
            <p>{activeTiers}</p>
          </div>

          <div className="dashboard-stat-card">
            <h3>Archived Tiers</h3>
            <p>{archivedTiers}</p>
          </div>
        </section>

        <section className="dashboard-panel tier-management-panel">
          <div className="tier-panel-top">
            <div>
              <h2>Tier Management</h2>
              <p className="tier-panel-subtext">
                Frontend-only tier controls for tier 0 access.
              </p>
            </div>

            <div className="tier-toolbar">
              <input
                type="text"
                placeholder="Search by name, level, or description..."
                className="tier-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                className="tier-filter"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "All" | TierStatus)
                }
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>

              <button
                type="button"
                className="dashboard-primary-btn"
                onClick={handleOpenAddModal}
              >
                + Add Tier
              </button>
            </div>
          </div>

          <div className="tier-table-wrapper">
            <table className="tier-table">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTiers.length > 0 ? (
                  filteredTiers.map((tier) => (
                    <tr key={tier.id}>
                      <td>
                        <div className="tier-name-cell">
                          <span className="tier-name-text">{tier.name}</span>
                          <span className="tier-description-text">
                            {tier.description}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="tier-level-badge">
                          Tier {tier.level}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`tier-status-badge ${
                            tier.status === "Active"
                              ? "tier-status-active"
                              : "tier-status-archived"
                          }`}
                        >
                          {tier.status}
                        </span>
                      </td>

                      <td>
                        <div className="tier-pill-list">
                          {tier.permissions.slice(0, 3).map((permission) => (
                            <span
                              key={permission}
                              className="tier-permission-pill active"
                            >
                              {permission}
                            </span>
                          ))}

                          {tier.permissions.length > 3 && (
                            <span className="tier-permission-pill tier-pill-more">
                              +{tier.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="tier-actions">
                          <button
                            type="button"
                            className="tier-action-btn tier-edit-btn"
                            onClick={() => handleOpenEditModal(tier)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="tier-action-btn tier-archive-btn"
                            onClick={() => handleArchiveTier(tier.id)}
                            disabled={tier.status === "Archived"}
                          >
                            {tier.status === "Archived"
                              ? "Archived"
                              : "Archive"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="tier-empty-state">
                      No tiers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </DashboardShell>

      {showTierModal && (
        <div className="tier-modal-overlay" onClick={handleCloseTierModal}>
          <div className="tier-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tier-modal-header">
              <div>
                <h2>{tierForm.id === null ? "Add Tier" : "Edit Tier"}</h2>
                <p>
                  Configure tier details and assign permissions. Tier 0 only,
                  naturally.
                </p>
              </div>

              <button
                type="button"
                className="tier-modal-close-btn"
                onClick={handleCloseTierModal}
              >
                ×
              </button>
            </div>

            <div className="tier-modal-form">
              <div className="tier-form-grid">
                <div className="tier-form-group">
                  <label htmlFor="tierName">Tier Name</label>
                  <input
                    id="tierName"
                    type="text"
                    value={tierForm.name}
                    onChange={(e) =>
                      setTierForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="tier-form-group">
                  <label htmlFor="tierLevel">Tier Level</label>
                  <input
                    id="tierLevel"
                    type="text"
                    value={tierForm.level}
                    onChange={(e) =>
                      setTierForm((prev) => ({
                        ...prev,
                        level: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="tier-form-group tier-form-group-full">
                  <label htmlFor="tierDescription">Description</label>
                  <textarea
                    id="tierDescription"
                    rows={3}
                    value={tierForm.description}
                    onChange={(e) =>
                      setTierForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="tier-form-group">
                  <label htmlFor="tierStatus">Status</label>
                  <select
                    id="tierStatus"
                    value={tierForm.status}
                    onChange={(e) =>
                      setTierForm((prev) => ({
                        ...prev,
                        status: e.target.value as TierStatus,
                      }))
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="tier-permission-section">
                <div className="tier-permission-header">
                  <h3>Tier Permissions</h3>
                  <p>Click a pill to add or remove a permission.</p>
                </div>

                <div className="tier-pill-list tier-modal-pill-list">
                  {allPermissions.map((permission) => {
                    const isActive = tierForm.permissions.includes(permission);

                    return (
                      <button
                        key={permission}
                        type="button"
                        className={`tier-permission-pill ${
                          isActive ? "active" : ""
                        }`}
                        onClick={() => togglePermission(permission)}
                      >
                        {permission}
                      </button>
                    );
                  })}
                </div>
              </div>

              {formError && (
                <p className="tier-form-message tier-form-message-error">
                  {formError}
                </p>
              )}

              {formMessage && (
                <p className="tier-form-message tier-form-message-success">
                  {formMessage}
                </p>
              )}

              <div className="tier-modal-actions">
                <button
                  type="button"
                  className="dashboard-settings-cancel-btn"
                  onClick={handleCloseTierModal}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="dashboard-primary-btn"
                  onClick={handleSaveTier}
                >
                  {tierForm.id === null ? "Add Tier" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
