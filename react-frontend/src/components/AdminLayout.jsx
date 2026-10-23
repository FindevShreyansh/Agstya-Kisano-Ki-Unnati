import { Link, useLocation, useNavigate } from "react-router-dom";

const adminLinks = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Farmers", to: "/admin/farmers" },
  { label: "Buyers", to: "/admin/buyers" },
  { label: "Crop Listings", to: "/admin/crops" },
  { label: "Procurement", to: "/admin/procurement" },
];

function AdminLayout({ title, subtitle, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/admin/dashboard";

  return (
    <div className="admin-shell min-h-screen flex flex-col">
      <header className="admin-topbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <Link to="/admin/dashboard" className="shrink-0">
            <img src="/agstya-logo.png" alt="AGSTYA Logo" className="h-[70px] w-auto max-w-full object-contain shrink-0" />
          </Link>
          <button
            type="button"
            onClick={() => navigate("/admin/login")}
            className="admin-logout"
          >
            Logout
          </button>
        </div>
      </header>

      <nav aria-label="Admin navigation" className="admin-nav">
        <div className="admin-nav-inner">
          {adminLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              aria-current={location.pathname === link.to ? "page" : undefined}
              className={`admin-nav-link ${
                location.pathname === link.to
                  ? "is-current"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className={`admin-main max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 ${isDashboard ? "lg:py-9" : ""}`}>
        {title && (
          <header className="mb-7">
              <p className="admin-eyebrow">AGSTYA · PLATFORM ADMINISTRATION</p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
              {subtitle && <p className="admin-subtitle">{subtitle}</p>}
            </header>
        )}
        {children}
      </main>

      <footer className="admin-footer">
        AGSTYA – Kisano Ki Unnati • Platform Administration
      </footer>
    </div>
  );
}

export default AdminLayout;
