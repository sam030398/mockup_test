import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { REGION_NAME_BY_ID } from "../mock/regions";

const navItems = [
  { to: "/dashboard/map", label: "Map" },
  { to: "/dashboard/data-entry", label: "Data Entry" },
];

export function AppShell() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";
  const assignedRegionLabel = isSuperAdmin
    ? "All Selangor Councils"
    : user?.assignedRegionIds.map((regionId) => REGION_NAME_BY_ID[regionId] ?? regionId).join(", ");

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Selangor GHG Emissions Dashboard</h1>
          <div className="auth-meta">
            <p className="muted">Signed in as {user?.name}</p>
            <span className={isSuperAdmin ? "role-badge is-superadmin" : "role-badge is-dataowner"}>
              SuperAdmin: {isSuperAdmin ? "Yes" : "No"}
            </span>
            <span className="region-chip">Assigned Region: {assignedRegionLabel}</span>
          </div>
        </div>
        <button type="button" onClick={logout} className="button secondary">
          Logout
        </button>
      </header>

      <nav className="nav">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={location.pathname.startsWith(item.to) ? "nav-link active" : "nav-link"}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
