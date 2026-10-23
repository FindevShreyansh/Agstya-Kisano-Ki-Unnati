import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest, clearSession } from "../api";
import { useNotifications } from "../hooks/useNotifications";

function FarmerDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { unreadCount } = useNotifications("farmer");

  useEffect(() => {
    apiRequest("/dashboard/farmer")
      .then(setDashboard)
      .catch((requestError) => {
        setError(requestError.message);
        if (requestError.status === 401) navigate("/farmer/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const logout = () => {
    clearSession();
    navigate("/farmer/login");
  };

  const user = JSON.parse(localStorage.getItem("agstya_user") || "{}");
  const farm = dashboard?.farms?.[0];

  const overviewCards = [
    { label: "Registered land", value: farm ? `${farm.areaAcres} acres` : "—", icon: "🌱", color: "text-green-700", tint: "bg-green-100" },
    { label: "Soil test requests", value: dashboard?.soilRequests?.length ?? "—", icon: "🧪", color: "text-sky-700", tint: "bg-sky-100" },
    { label: "Crop listings", value: dashboard?.listings?.length ?? "—", icon: "🌾", color: "text-amber-700", tint: "bg-amber-100" },
    { label: "Buyer requests", value: dashboard?.purchaseRequestsReceived?.length ?? "—", icon: "🤝", color: "text-violet-700", tint: "bg-violet-100" },
  ];

  // Keep every existing farmer action and its destination together for clarity.
  const farmerActions = [
    {
      title: "Soil Analysis",
      description: "Check your soil and see which crops may grow well.",
      icon: "🌱",
      link: "/farmer/soil-analysis",
      action: "Check Soil",
    },
    {
      title: "Book Soil Analysis Expert",
      description: "Arrange a field visit with our team for professional soil analysis.",
      icon: "🧪",
      link: "/farmer/book-expert",
      action: "Book a Visit",
    },
    {
      title: "Crop Planning",
      description: "Compare crops and plan what to grow next.",
      icon: "🌾",
      link: "/farmer/crop-planning",
      action: "Plan Crop",
    },
    {
      title: "Find Buyers",
      description: "See buyers looking for crops like yours.",
      icon: "🏢",
      link: "/farmer/buyers",
      action: "Find Buyers",
    },
    {
      title: "My Opportunities",
      description: "Check buyer requests and follow your crop orders.",
      icon: "📦",
      link: "/farmer/procurement",
      action: "View Requests",
    },
    {
      title: "List My Crop",
      description: "Add your available crop so buyers can find it.",
      icon: "🌿",
      link: "/farmer/list-crop",
      action: "List Crop",
    },
  ];

  return (
    <div className="farmer-page min-h-screen bg-[#F7FAF7]">
      {/* Simple header keeps notifications, account greeting, and logout easy to find. */}
      <nav className="sticky top-0 z-20 border-b border-green-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <img src="/agstya-logo.png" alt="AGSTYA Logo" className="h-[70px] w-auto max-w-full object-contain shrink-0" />

          <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-5">
            <Link
              to="/farmer/notifications"
              className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-bold text-green-700 transition hover:bg-green-50 hover:text-green-900"
            >
              🔔 Notifications
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-green-700 px-2 py-0.5 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
            <span className="text-sm text-gray-700">
              Hello, {dashboard?.farmer?.name || user.name || "Farmer"} 👨‍🌾
            </span>
            <button
              type="button"
              onClick={logout}
              className="min-h-11 rounded-xl px-4 text-sm font-bold text-red-700 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 px-6 py-8 text-white shadow-xl shadow-green-900/15 sm:px-9 sm:py-10 lg:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full border-[34px] border-white/10" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-[-5rem] right-1/3 h-48 w-48 rounded-full bg-lime-300/15 blur-2xl" />
          <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-green-50 ring-1 ring-inset ring-white/20">
                <span className="h-2 w-2 rounded-full bg-lime-300" /> Your farm at a glance
              </span>
              <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Welcome back, {dashboard?.farmer?.name?.split(" ")[0] || user.name?.split(" ")[0] || "Farmer"}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-green-50/90 sm:text-base">
                Your next season starts with a good plan. Check your soil, explore crops, and connect with buyers from one place.
              </p>
            </div>
            <Link to="/farmer/list-crop" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-amber-300 px-5 py-3 text-sm font-extrabold text-green-950 shadow-lg shadow-green-950/15 transition hover:-translate-y-0.5 hover:bg-amber-200">
              <span aria-hidden="true">＋</span> List your produce
            </Link>
          </div>
        </section>

        <section aria-label="Farm overview" className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card, index) => (
            <div
              key={card.label}
              className="group rounded-2xl border border-white bg-white p-5 shadow-[0_8px_24px_rgba(24,70,42,0.07)] ring-1 ring-green-900/[0.04] transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl transition group-hover:scale-105 ${card.tint}`}>
                  {card.icon}
                </span>
                <span className="text-xs font-bold text-gray-400">0{index + 1}</span>
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">{card.label}</p>
              <p className={`mt-1 text-2xl font-extrabold tracking-tight ${card.color}`}>{loading ? "…" : card.value}</p>
            </div>
          ))}
        </section>

        {loading && (
          <p className="mb-6 rounded-xl border border-green-100 bg-white px-4 py-3 text-sm text-gray-600" role="status">
            Loading your farm information…
          </p>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-2 font-semibold underline">
              Try again
            </button>
          </div>
        )}

        <section aria-labelledby="farmer-actions-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">Farmer toolkit</span>
              <h2 id="farmer-actions-heading" className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                What would you like to do?
              </h2>
            </div>
            <p className="text-sm font-medium text-gray-500">Choose a service to continue</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {farmerActions.map((item) => (
              <article
                key={item.title}
                className="group relative flex flex-col items-start overflow-hidden rounded-3xl border border-green-100 bg-white p-6 shadow-[0_8px_24px_rgba(24,70,42,0.06)] transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl sm:p-7"
              >
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-lime-100 text-2xl shadow-inner ring-1 ring-green-200/60 transition duration-300 group-hover:rotate-3 group-hover:scale-105">
                  {item.icon}
                </span>
                <h3 className="text-lg font-extrabold tracking-tight text-gray-900">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
                  {item.description}
                </p>
                <Link
                  to={item.link}
                  className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-green-700 px-5 py-3 text-sm font-extrabold text-white shadow-md shadow-green-900/10 transition hover:bg-green-800 hover:shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-green-200"
                >
                  {item.action}<span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </article>
            ))}

            {/* Keep the existing notifications entry alongside farmer tools. */}
            <article className="group flex flex-col items-start rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-[0_8px_24px_rgba(24,70,42,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-7">
              <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl ring-1 ring-amber-200 transition group-hover:rotate-3 group-hover:scale-105">
                🔔
              </span>
              <h3 className="text-lg font-extrabold tracking-tight text-gray-900">Notifications</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
                Read updates about buyers and your crop requests.
              </p>
              <Link
                to="/farmer/notifications"
                className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-green-950 shadow-md transition hover:bg-amber-300"
              >
                View Notifications ({unreadCount} unread) →
              </Link>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default FarmerDashboard;
