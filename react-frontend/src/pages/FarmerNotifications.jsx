import { Link } from "react-router-dom";
import NotificationCenter from "../components/NotificationCenter";
import { useNotifications } from "../hooks/useNotifications";

function FarmerNotifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications("farmer");

  return (
    <div className="farmer-page min-h-screen bg-[#F7FAF7] flex flex-col">
      <nav className="sticky top-0 z-20 border-b border-green-100 bg-white/90 px-5 py-3 shadow-sm backdrop-blur-xl sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <img src="/agstya-logo.png" alt="AGSTYA Logo" className="h-[70px] w-auto max-w-full object-contain shrink-0" />
          <Link
            to="/farmer/dashboard"
            className="inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold text-green-700 transition hover:bg-green-50"
          >
            ← Farmer Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        <header className="mb-6">
          <span className="inline-flex items-center rounded-full bg-lime-100 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-green-800 mb-3">
            🔔 Farmer Updates
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Notifications</h1>
          <p className="text-gray-500 mt-2">
            You have <span className="font-semibold text-green-700">{unreadCount}</span>{" "}
            unread notification{unreadCount !== 1 ? "s" : ""}.
          </p>
        </header>

        <NotificationCenter
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
      </main>

      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-100 bg-white">
        AGSTYA – Kisano Ki Unnati • Empowering Farmers & Buyers 🌱
      </footer>
    </div>
  );
}

export default FarmerNotifications;
