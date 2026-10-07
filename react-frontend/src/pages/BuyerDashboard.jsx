import { Link } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";

function BuyerDashboard() {
  const { unreadCount } = useNotifications("buyer");

  return (
    <div className="min-h-screen bg-[#F7FAF7]">
      {/* Navbar */}
      <nav className="bg-white border-b border-green-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-green-800">AGSTYA</h1>
            <p className="text-xs text-gray-500">Kisano Ki Unnati • Buyer Portal</p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
            <Link
              to="/buyer/notifications"
              className="text-sm text-green-700 font-medium hover:underline"
            >
              🔔 Notifications
              {unreadCount > 0 && (
                <span className="ml-1 rounded-full bg-green-700 px-2 py-0.5 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
            <span className="text-sm text-gray-600">
              Welcome, Buyer 🏢
            </span>

            <Link
              to="/roles"
              className="text-sm text-red-600 font-medium hover:underline"
            >
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Buyer Dashboard
          </h2>
          <p className="text-gray-500 mt-2">
            Source agricultural produce directly from verified farmers, post crop requirements, and track procurements.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
            <p className="text-sm text-gray-500">Active Requirements</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              3 Active
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
            <p className="text-sm text-gray-500">Farmer Matches</p>
            <h3 className="text-2xl font-bold text-green-700 mt-2">
              14 Available
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
            <p className="text-sm text-gray-500">Active Orders</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              2 in Transit
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
            <p className="text-sm text-gray-500">Procured This Month</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              18,500 kg
            </h3>
          </div>
        </div>

        {/* Planned Buyer Modules */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Module 1: Post Crop Requirement (Phase 1) */}
          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-lg font-bold text-gray-800">
                Post Crop Requirement
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Specify your crop, target quantity, quality grade, and expected price to discover matching farmers.
              </p>
            </div>

            <Link
              to="/buyer/post-requirement"
              className="mt-5 inline-block text-green-700 font-semibold text-sm hover:underline"
            >
              Post Requirement →
            </Link>
          </div>

          {/* Module 2: Find Farmer Crops (Phase 2) */}
          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="text-3xl mb-4">🌾</div>
              <h3 className="text-lg font-bold text-gray-800">
                Find Farmer Crops
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Browse verified crop listings directly from farmers with grade and expected price details.
              </p>
            </div>

            <Link
              to="/buyer/crops"
              className="mt-5 inline-block text-green-700 font-semibold text-sm hover:underline"
            >
              Find Farmer Crops →
            </Link>
          </div>

          {/* Module 3: Procurement Requests (Phase 3) */}
          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="text-3xl mb-4">📦</div>
              <h3 className="text-lg font-bold text-gray-800">
                Procurement Requests
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Track real-time status of your purchase orders from agreement to pickup and final delivery.
              </p>
            </div>

            <Link
              to="/buyer/procurement"
              className="mt-5 inline-block text-green-700 font-semibold text-sm hover:underline"
            >
              Procurement Requests →
            </Link>
          </div>

          {/* Module 4: Business Profile (Phase 4) */}
          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="text-3xl mb-4">🏢</div>
              <h3 className="text-lg font-bold text-gray-800">
                Business Profile
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Manage your enterprise information, GST details, primary delivery hubs, and procurement focus.
              </p>
            </div>

            <Link
              to="/buyer/profile"
              className="mt-5 inline-block text-green-700 font-semibold text-sm hover:underline"
            >
              Business Profile →
            </Link>
          </div>

          {/* Module 5: Notifications */}
          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="text-3xl mb-4">🔔</div>
              <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
              <p className="text-sm text-gray-500 mt-2">
                Review new farmer interest, crop matches, and procurement requests.
              </p>
            </div>
            <Link
              to="/buyer/notifications"
              className="mt-5 inline-block text-green-700 font-semibold text-sm hover:underline"
            >
              View Notifications ({unreadCount} unread) →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BuyerDashboard;
