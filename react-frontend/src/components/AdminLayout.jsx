import { Link, useLocation, useNavigate } from "react-router-dom";

const adminLinks = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Farmers", to: "/admin/farmers" },
  { label: "Buyers", to: "/admin/buyers" },
  { label: "Crop Listings", to: "/admin/crops" },
  { label: "Procurement", to: "/admin/procurement" },
];

const royalPointer = {
  cursor: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M5 3v22l6-6 4 9 5-2-4-9h9L5 3z' fill='%23124b35' stroke='%23f3cc70' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E\") 5 3, pointer",
};

function AdminLayout({ title, subtitle, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/admin/dashboard";

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_#1d4b36_0%,_#103426_48%,_#0b281e_100%)]">
      <header className="bg-gradient-to-r from-[#123c2c] via-[#174b36] to-[#123c2c] border-b border-amber-300/25 shadow-lg shadow-green-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <Link to="/admin/dashboard" className="shrink-0">
            <span className="block text-2xl font-bold text-white tracking-[0.14em]">AGSTYA</span>
            <span className="block text-xs text-emerald-100/65">Kisano Ki Unnati · Platform Administration</span>
          </Link>
          <button
            type="button"
            onClick={() => navigate("/admin/login")}
            className="rounded-lg border border-amber-200/25 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:border-amber-200/50 hover:bg-white/5"
            style={royalPointer}
          >
            Logout
          </button>
        </div>
      </header>

      <nav aria-label="Admin navigation" className="bg-[#174331] border-b border-amber-200/15 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex gap-2 overflow-x-auto">
          {adminLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              aria-current={location.pathname === link.to ? "page" : undefined}
              style={royalPointer}
              className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-semibold transition ${
                location.pathname === link.to
                  ? "bg-emerald-300/15 text-emerald-100 ring-1 ring-inset ring-emerald-200/20"
                  : "text-emerald-50/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 ${isDashboard ? "lg:py-9" : ""}`}>
        {title && (
          <header className="mb-7">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200/80">AGSTYA · Platform Administration</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#fff9e8] tracking-tight">{title}</h1>
              {subtitle && <p className="mt-2 text-emerald-100/65">{subtitle}</p>}
            </header>
        )}
        {children}
      </main>

      <footer className="text-center py-5 text-sm text-emerald-50/55 border-t border-amber-200/15 bg-[#123c2c]">
        AGSTYA – Kisano Ki Unnati • Platform Administration
      </footer>
    </div>
  );
}

export default AdminLayout;
