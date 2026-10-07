import { Link } from "react-router-dom";
import NotificationCenter from "../components/NotificationCenter";
import { useNotifications } from "../hooks/useNotifications";

function BuyerNotifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications("buyer");

  return (
    <div className="min-h-screen bg-[#F7FAF7] flex flex-col">
      <nav className="bg-white border-b border-green-100 px-5 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-green-800">AGSTYA</h1>
            <p className="text-xs text-gray-500">Kisano Ki Unnati • Buyer Portal</p>
          </div>
          <Link
            to="/buyer/dashboard"
            className="text-sm text-green-700 hover:text-green-800 font-medium"
          >
            ← Buyer Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        <header className="mb-6">
          <span className="inline-block bg-green-100 text-green-800 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3">
            🔔 Buyer Updates
          </span>
          <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>
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

export default BuyerNotifications;
