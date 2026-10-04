import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest, clearSession } from "../api";
function FarmerDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen bg-[#F7FAF7]">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-green-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-800">
              AGSTYA
            </h1>
            <p className="text-xs text-gray-500">
              Kisano Ki Unnati
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {dashboard?.farmer?.name || user.name || "Farmer"} 👨‍🌾
            </span>

            <button onClick={logout} className="text-sm text-red-600 font-medium">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Farmer Dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            Manage your farm, plan your crops and find better opportunities.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
            <p className="text-sm text-gray-500">Land Area</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              {farm?.areaAcres ?? "—"} Acres
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
            <p className="text-sm text-gray-500">Current Crop</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              {farm?.mainCrop || "—"} 🌾
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
            <p className="text-sm text-gray-500">Active Buyers</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              {dashboard?.purchaseRequestsReceived?.length ?? "—"}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
            <p className="text-sm text-gray-500">Potential Profit</p>
            <h3 className="text-2xl font-bold text-green-700 mt-2">
              —
            </h3>
          </div>

        </div>

        {error && <p className="mb-6 text-sm text-red-600" role="alert">{error}</p>}

        {/* Main Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
            <div className="text-3xl mb-4">🌱</div>

            <h3 className="text-lg font-bold text-gray-800">
              Soil Analysis
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Check your soil condition and understand which crops are suitable.
            </p>

            <Link
            to="/farmer/soil-analysis"
             className="mt-5 inline-block text-green-700 font-semibold text-sm"
              >
                Analyze Soil →
              </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
            <div className="text-3xl mb-4">🌾</div>

            <h3 className="text-lg font-bold text-gray-800">
              Crop Planning
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Compare crops based on cost, production and expected profit.
            </p>

            <Link
               to="/farmer/crop-planning"
               className="mt-5 inline-block text-green-700 font-semibold text-sm"
          >
               Plan Crop →
           </Link>

          </div>

          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
            <div className="text-3xl mb-4">🏢</div>

            <h3 className="text-lg font-bold text-gray-800">
              Find Buyers
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Discover buyers looking for your crops and requirements.
            </p>

            <Link
                   to="/farmer/buyers"
                 className="mt-5 inline-block text-green-700 font-semibold text-sm"
               >
                  View Buyers →
             </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
            <div className="text-3xl mb-4">💰</div>

            <h3 className="text-lg font-bold text-gray-800">
              My Opportunities
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              View matched opportunities, procurement offers and orders.
            </p>

            <button className="mt-5 text-green-700 font-semibold text-sm">
              View Opportunities →
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}

export default FarmerDashboard;