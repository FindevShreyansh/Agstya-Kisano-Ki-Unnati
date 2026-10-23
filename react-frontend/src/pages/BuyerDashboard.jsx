import { Link, useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import { clearSession } from "../api";

function BuyerDashboard() {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications("buyer");
  const user = JSON.parse(localStorage.getItem("agstya_user") || "{}");
  const buyerName = typeof user.name === "string" ? user.name : "Buyer";

  const logout = () => {
    clearSession();
    navigate("/buyer/login");
  };

  const buyerActions = [
    {
      title: "Post Crop Requirement",
      description: "Share the crop, quantity and quality you’re looking to source.",
      icon: "📋",
      link: "/buyer/post-requirement",
      action: "Post a Requirement",
    },
    {
      title: "Find Farmer Crops",
      description: "Browse available produce with farmer, quality and price details.",
      icon: "🌾",
      link: "/buyer/crops",
      action: "Browse Crops",
    },
    {
      title: "Procurement Requests",
      description: "Review offers and follow the status of procurement requests.",
      icon: "📦",
      link: "/buyer/procurement",
      action: "View Requests",
    },
    {
      title: "Business Profile",
      description: "Keep your business and sourcing details in one place.",
      icon: "🏢",
      link: "/buyer/profile",
      action: "Manage Profile",
    },
    {
      title: "Notifications",
      description: "See updates about farmer interest, crop matches and requests.",
      icon: "🔔",
      link: "/buyer/notifications",
      action: `View Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`,
      highlight: true,
    },
  ];

  return (
    <div className="farmer-page min-h-screen bg-[#F7FAF7]">
      <nav className="sticky top-0 z-20 border-b border-green-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <img src="/agstya-logo.png" alt="AGSTYA Logo" className="h-[70px] w-auto max-w-full object-contain shrink-0" />
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
            <Link to="/buyer/notifications" className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-bold text-green-700 transition hover:bg-green-50 hover:text-green-900">
              🔔 Notifications
              {unreadCount > 0 && <span className="ml-2 rounded-full bg-green-700 px-2 py-0.5 text-xs text-white">{unreadCount}</span>}
            </Link>
            <span className="text-sm font-medium text-gray-700">Hello, {buyerName} 🏢</span>
            <button type="button" onClick={logout} className="min-h-11 rounded-xl px-4 text-sm font-bold text-red-700 transition hover:bg-red-50">Logout</button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="relative mb-8 mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 px-6 py-8 text-white shadow-xl shadow-green-900/15 sm:px-9 sm:py-10 lg:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full border-[34px] border-white/10" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-[-5rem] right-1/3 h-48 w-48 rounded-full bg-lime-300/15 blur-2xl" />
          <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-green-50 ring-1 ring-inset ring-white/20">
                <span className="h-2 w-2 rounded-full bg-lime-300" /> Buyer workspace
              </span>
              <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">Welcome back, {buyerName.split(" ")[0] || "Buyer"}</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-green-50/90 sm:text-base">
                Find produce, share what you need, and keep your procurement work moving from one place.
              </p>
            </div>
            <Link to="/buyer/post-requirement" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-amber-300 px-5 py-3 text-sm font-extrabold text-green-950 shadow-lg shadow-green-950/15 transition hover:-translate-y-0.5 hover:bg-amber-200">
              <span aria-hidden="true">＋</span> Post a requirement
            </Link>
          </div>
        </section>

        <section aria-label="Buyer overview" className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Unread notifications", value: unreadCount, icon: "🔔", tint: "bg-amber-100", color: "text-amber-700" },
            { label: "Buyer services", value: buyerActions.length, icon: "🧭", tint: "bg-green-100", color: "text-green-700" },
            { label: "Crop marketplace", value: "Browse", icon: "🌾", tint: "bg-lime-100", color: "text-lime-700" },
            { label: "Procurement", value: "Track", icon: "📦", tint: "bg-sky-100", color: "text-sky-700" },
          ].map((card, index) => (
            <div key={card.label} className="group rounded-2xl border border-white bg-white p-5 shadow-[0_8px_24px_rgba(24,70,42,0.07)] ring-1 ring-green-900/[0.04] transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between gap-3">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl transition group-hover:scale-105 ${card.tint}`}>{card.icon}</span>
                <span className="text-xs font-bold text-gray-400">0{index + 1}</span>
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">{card.label}</p>
              <p className={`mt-1 text-2xl font-extrabold tracking-tight ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </section>

        <section aria-labelledby="buyer-actions-heading" className="pb-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">Buyer toolkit</span>
              <h2 id="buyer-actions-heading" className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">What would you like to do?</h2>
            </div>
            <p className="text-sm font-medium text-gray-500">Choose a service to continue</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {buyerActions.map((item) => (
              <article key={item.title} className={`group relative flex flex-col items-start overflow-hidden rounded-3xl border p-6 shadow-[0_8px_24px_rgba(24,70,42,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-7 ${item.highlight ? "border-amber-200 bg-gradient-to-br from-amber-50 to-white" : "border-green-100 bg-white hover:border-green-200"}`}>
                <span className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-inner ring-1 transition duration-300 group-hover:rotate-3 group-hover:scale-105 ${item.highlight ? "bg-amber-100 ring-amber-200" : "bg-gradient-to-br from-green-100 to-lime-100 ring-green-200/60"}`}>{item.icon}</span>
                <h3 className="text-lg font-extrabold tracking-tight text-gray-900">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">{item.description}</p>
                <Link to={item.link} className={`mt-6 inline-flex min-h-12 items-center rounded-xl px-5 py-3 text-sm font-extrabold shadow-md transition hover:shadow-lg focus-visible:outline focus-visible:outline-4 ${item.highlight ? "bg-amber-400 text-green-950 hover:bg-amber-300 focus-visible:outline-amber-200" : "bg-green-700 text-white shadow-green-900/10 hover:bg-green-800 focus-visible:outline-green-200"}`}>
                  {item.action}<span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default BuyerDashboard;
