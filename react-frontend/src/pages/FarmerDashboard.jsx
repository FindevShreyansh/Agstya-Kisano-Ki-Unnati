import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest, clearSession } from "../api";
import { useNotifications } from "../hooks/useNotifications";

function FarmerDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const { unreadCount } = useNotifications("farmer");

  useEffect(() => {
    apiRequest("/dashboard/farmer")
      .then(setDashboard)
      .catch((requestError) => {
        setError(requestError.message);
        if (requestError.status === 401) navigate("/farmer/login");
      });
  }, [navigate]);

  const logout = () => {
    clearSession();
    navigate("/farmer/login");
  };

  const user = JSON.parse(localStorage.getItem("agstya_user") || "{}");
  const farm = dashboard?.farms?.[0];

  const overviewCards = [
    { label: "Land Area", value: `${farm?.areaAcres ?? "—"} Acres`, icon: "🌱", color: "text-green-700" },
    { label: "Current Crop", value: farm?.mainCrop || "—", icon: "🌾", color: "text-amber-700" },
    { label: "Active Buyers", value: dashboard?.purchaseRequestsReceived?.length ?? "—", icon: "🏢", color: "text-blue-700" },
    { label: "Potential Profit", value: "—", icon: "💰", color: "text-green-700" },
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
    <div className="min-h-screen bg-[#F7FAF7]">
      {/* Simple header keeps notifications, account greeting, and logout easy to find. */}
      <nav className="bg-white border-b border-green-100 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-green-800">🌾 AGSTYA</h1>
            <p className="text-sm text-gray-600">Kisano Ki Unnati</p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-5">
            <Link
              to="/farmer/notifications"
              className="min-h-10 inline-flex items-center text-sm font-semibold text-green-700 hover:text-green-900 transition"
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
              className="min-h-10 px-3 text-sm font-semibold text-red-700 hover:bg-red-50 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-9">
        {/* A short welcome helps farmers quickly understand what they can do here. */}
        <section className="mb-7">
          <div className="flex items-start gap-3">
            <span className="hidden sm:flex w-12 h-12 rounded-2xl bg-green-100 items-center justify-center text-2xl">
              🌾
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Welcome to AGSTYA
              </h2>
              <p className="text-gray-600 mt-2">
                Manage your crops, understand your soil, plan better and connect with buyers.
              </p>
            </div>
          </div>
        </section>

        {/* Keep the existing dashboard information in a simpler, readable card row. */}
        <section aria-label="Farm overview" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {overviewCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                  {card.icon}
                </span>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
              </div>
              <p className={`text-2xl font-bold mt-4 ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </section>

        {error && (
          <p className="mb-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3" role="alert">
            {error}
          </p>
        )}

        <section aria-labelledby="farmer-actions-heading">
          <div className="mb-4">
            <h2 id="farmer-actions-heading" className="text-xl font-bold text-gray-800">
              What would you like to do?
            </h2>
            <p className="text-sm text-gray-600 mt-1">Choose an action to get started.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {farmerActions.map((item) => (
              <article
                key={item.title}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-green-100 shadow-sm flex flex-col items-start transition duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl mb-4">
                  {item.icon}
                </span>
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                <p className="text-sm leading-6 text-gray-600 mt-2 flex-1">
                  {item.description}
                </p>
                <Link
                  to={item.link}
                  className="mt-5 min-h-11 inline-flex items-center rounded-xl bg-green-700 hover:bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition"
                >
                  {item.action} →
                </Link>
              </article>
            ))}

            {/* Keep the existing notifications entry alongside farmer tools. */}
            <article className="bg-white rounded-2xl p-5 sm:p-6 border border-green-100 shadow-sm flex flex-col items-start transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <span className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl mb-4">
                🔔
              </span>
              <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
              <p className="text-sm leading-6 text-gray-600 mt-2 flex-1">
                Read updates about buyers and your crop requests.
              </p>
              <Link
                to="/farmer/notifications"
                className="mt-5 min-h-11 inline-flex items-center rounded-xl bg-green-700 hover:bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition"
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
