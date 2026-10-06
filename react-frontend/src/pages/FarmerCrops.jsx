import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * FarmerCrops.jsx — Phase 2 (Buyer Side)
 *
 * This page lets a buyer browse crop listings posted by farmers.
 * It mirrors the farmer-side BuyerList.jsx pattern but in reverse:
 *   - Farmers list crops → Buyers browse them here.
 *   - Buyer can filter by crop, view details, and send a procurement request.
 *
 * All data is mock / React state. Ready for future Spring Boot API integration.
 */

function FarmerCrops() {
  // ── State ─────────────────────────────────────────────────────────

  // Currently selected crop in the filter dropdown ("" = show all)
  const [selectedCrop, setSelectedCrop] = useState("");

  // The listing the buyer clicked "View Crop" on (null = none selected)
  const [selectedListing, setSelectedListing] = useState(null);

  // Tracks which listing IDs the buyer has already sent a request to.
  // Using a Set avoids a single global boolean — only the specific
  // listing shows the success message.
  const [requestsSentTo, setRequestsSentTo] = useState(new Set());

  // ── Mock farmer crop listings ─────────────────────────────────────
  // Each object represents a crop that a farmer has listed on the platform.
  // In the future this will come from GET /api/market/listings.

  const farmerListings = [
    {
      id: "LC-001",
      farmerName: "Ramesh Kumar",
      crop: "Rice",
      quantity: 3000,
      price: 42,
      quality: "Grade A",
      harvestDate: "2026-10-15",
      location: "Mandya, Karnataka",
      variety: "Sona Masoori",
    },
    {
      id: "LC-002",
      farmerName: "Suresh Patil",
      crop: "Wheat",
      quantity: 2000,
      price: 30,
      quality: "Grade A",
      harvestDate: "2026-11-01",
      location: "Dharwad, Karnataka",
      variety: "HD-2967",
    },
    {
      id: "LC-003",
      farmerName: "Anita Devi",
      crop: "Rice",
      quantity: 5000,
      price: 38,
      quality: "Grade B",
      harvestDate: "2026-10-20",
      location: "Raichur, Karnataka",
      variety: "BPT-5204",
    },
    {
      id: "LC-004",
      farmerName: "Manoj Reddy",
      crop: "Maize",
      quantity: 4000,
      price: 22,
      quality: "Grade A",
      harvestDate: "2026-10-25",
      location: "Davangere, Karnataka",
      variety: "DHM-117",
    },
    {
      id: "LC-005",
      farmerName: "Lakshmi Bai",
      crop: "Potato",
      quantity: 1500,
      price: 18,
      quality: "Grade A",
      harvestDate: "2026-11-10",
      location: "Hassan, Karnataka",
      variety: "Kufri Jyoti",
    },
    {
      id: "LC-006",
      farmerName: "Venkatesh Gowda",
      crop: "Soybean",
      quantity: 2500,
      price: 55,
      quality: "Grade A",
      harvestDate: "2026-10-30",
      location: "Belgaum, Karnataka",
      variety: "JS-335",
    },
    {
      id: "LC-007",
      farmerName: "Priya Sharma",
      crop: "Wheat",
      quantity: 3500,
      price: 28,
      quality: "Grade B",
      harvestDate: "2026-11-05",
      location: "Bijapur, Karnataka",
      variety: "Lok-1",
    },
    {
      id: "LC-008",
      farmerName: "Raju Naik",
      crop: "Maize",
      quantity: 2200,
      price: 20,
      quality: "Grade B",
      harvestDate: "2026-11-15",
      location: "Shimoga, Karnataka",
      variety: "NK-6240",
    },
  ];

  // ── Derived: filtered listings ────────────────────────────────────
  // If a crop is selected in the dropdown, show only matching listings.
  // Otherwise show all listings.
  const filteredListings = selectedCrop
    ? farmerListings.filter((listing) => listing.crop === selectedCrop)
    : farmerListings;

  // Mock match tiers use the listing's existing quality grade: Grade A is a
  // good match, while Grade B is a partial match. Crop filtering is unchanged.
  const goodMatches = filteredListings.filter(
    (listing) => listing.quality === "Grade A"
  ).length;
  const partialMatches = filteredListings.filter(
    (listing) => listing.quality === "Grade B"
  ).length;

  // ── Handlers ──────────────────────────────────────────────────────

  /**
   * Sends a procurement request for the given listing.
   * Adds the listing id to the requestsSentTo Set so only THAT card
   * shows the success message (not every card).
   */
  const handleSendRequest = (listingId) => {
    setRequestsSentTo((prev) => new Set(prev).add(listingId));
  };

  // Helper: emoji for each crop
  const getCropEmoji = (crop) => {
    const map = {
      Rice: "🌾",
      Wheat: "🍞",
      Maize: "🌽",
      Potato: "🥔",
      Soybean: "🫘",
    };
    return map[crop] || "🌱";
  };

  // Helper: color badge for quality grade
  const getQualityColor = (quality) => {
    if (quality === "Grade A") return "bg-green-100 text-green-800";
    if (quality === "Grade B") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-600";
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7FAF7] flex flex-col">
      {/* ── Top Navbar ─────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-green-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-800">AGSTYA</h1>
            <p className="text-xs text-gray-500">
              Kisano Ki Unnati • Buyer Portal
            </p>
          </div>

          <Link
            to="/buyer/dashboard"
            className="text-sm text-green-700 hover:text-green-800 font-medium flex items-center gap-1"
          >
            ← Back to Buyer Dashboard
          </Link>
        </div>
      </nav>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-10 w-full flex-1">
        {/* Page Header */}
        <div className="mb-8">
          <span className="inline-block bg-green-100 text-green-800 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3">
            🌾 Farmer Marketplace
          </span>
          <h2 className="text-3xl font-bold text-gray-800">
            Find Farmer Crops
          </h2>
          <p className="text-gray-500 mt-2">
            Browse available crop listings from verified farmers. Filter by crop
            type and send procurement requests directly.
          </p>
        </div>

        {/* Match totals reflect the currently selected crop filter. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Matches</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {filteredListings.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
            <p className="text-sm text-gray-500">Good Matches</p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {goodMatches}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
            <p className="text-sm text-gray-500">Partial Matches</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">
              {partialMatches}
            </p>
          </div>
        </div>

        {/* ── Crop Filter Dropdown ────────────────────────────────── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Crop
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => {
                setSelectedCrop(e.target.value);
                // Close the detail panel when filter changes
                setSelectedListing(null);
              }}
              className="w-full sm:w-72 border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Crops</option>
              <option value="Rice">Rice 🌾</option>
              <option value="Wheat">Wheat 🍞</option>
              <option value="Maize">Maize 🌽</option>
              <option value="Potato">Potato 🥔</option>
              <option value="Soybean">Soybean 🫘</option>
            </select>
          </div>

          {/* Result count */}
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredListings.length}
            </span>{" "}
            listing{filteredListings.length !== 1 && "s"}
            {selectedCrop && (
              <>
                {" "}
                for{" "}
                <span className="font-semibold text-green-700">
                  {selectedCrop}
                </span>
              </>
            )}
          </p>
        </div>

        {/* ── Listings Grid ──────────────────────────────────────── */}
        {filteredListings.length === 0 ? (
          /* Empty state when filter has no results */
          <div className="text-center py-20 bg-white rounded-2xl border border-green-100 shadow-sm">
            <span className="text-5xl">🔍</span>
            <h3 className="text-xl font-bold text-gray-700 mt-4">
              No listings found
            </h3>
            <p className="text-gray-500 mt-2">
              Try selecting a different crop or view all listings.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className={`bg-white rounded-2xl p-6 border shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                  selectedListing?.id === listing.id
                    ? "border-green-500 ring-2 ring-green-200"
                    : "border-green-100"
                }`}
              >
                {/* Crop emoji + farmer name row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-green-50 rounded-xl">
                      {getCropEmoji(listing.crop)}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {listing.crop}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {listing.variety}
                      </p>
                    </div>
                  </div>

                  {/* Quality badge */}
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getQualityColor(
                      listing.quality
                    )}`}
                  >
                    {listing.quality}
                  </span>
                </div>

                {/* Farmer info */}
                <p className="text-sm text-gray-600 mb-4 flex items-center gap-1.5">
                  <span className="text-base">👨‍🌾</span>
                  <span className="font-medium">{listing.farmerName}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{listing.location}</span>
                </p>

                {/* Key stats */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-500">Available</p>
                    <p className="text-sm font-bold text-gray-800">
                      {listing.quantity.toLocaleString()} kg
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-500">Expected Price</p>
                    <p className="text-sm font-bold text-green-700">
                      ₹{listing.price}/kg
                    </p>
                  </div>
                </div>

                {/* Harvest date */}
                <p className="text-xs text-gray-500 mb-4">
                  📅 Harvest: {listing.harvestDate}
                </p>

                {/* Request-sent success for THIS listing only */}
                {requestsSentTo.has(listing.id) && (
                  <p className="text-sm text-green-700 font-semibold mb-2 flex items-center gap-1">
                    ✅ Procurement request sent successfully to {listing.farmerName}.
                  </p>
                )}

                {/* A request status appears only on listings with a sent request. */}
                {requestsSentTo.has(listing.id) && (
                  <p className="text-xs text-green-700 mb-3">
                    Request Status: <span className="font-semibold">Request Sent</span>
                  </p>
                )}

                {/* Each card can open its details or send its own request. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedListing(listing)}
                    className="w-full border border-green-700 text-green-700 hover:bg-green-50 py-2.5 rounded-xl font-semibold text-sm transition"
                  >
                    View Farmer Crop
                  </button>
                  <button
                    onClick={() => handleSendRequest(listing.id)}
                    disabled={requestsSentTo.has(listing.id)}
                    className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-300 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold text-sm transition"
                  >
                    {requestsSentTo.has(listing.id)
                      ? "Request Sent"
                      : "Send Procurement Request"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Selected Crop Detail Panel ─────────────────────────── */}
        {selectedListing && (
          <div className="mt-10 bg-white rounded-3xl p-6 md:p-8 border-2 border-green-500 shadow-md">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-4xl p-3 bg-green-50 rounded-2xl border border-green-100">
                  {getCropEmoji(selectedListing.crop)}
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {selectedListing.crop} — Crop Details
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Listing ID: {selectedListing.id} •{" "}
                    {selectedListing.variety}
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setSelectedListing(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Detail grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Farmer</p>
                <p className="text-base font-bold text-gray-800 mt-1">
                  👨‍🌾 {selectedListing.farmerName}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">
                  Available Quantity
                </p>
                <p className="text-base font-bold text-gray-800 mt-1">
                  {selectedListing.quantity.toLocaleString()} kg
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">
                  Expected Price
                </p>
                <p className="text-base font-bold text-green-700 mt-1">
                  ₹{selectedListing.price}/kg
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">
                  Total Value
                </p>
                <p className="text-base font-bold text-gray-800 mt-1">
                  ₹
                  {(
                    selectedListing.quantity * selectedListing.price
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Additional info rows */}
            <div className="space-y-3 text-sm text-gray-600 bg-[#FBFDFB] p-5 rounded-2xl border border-green-50">
              <p className="flex items-start gap-2">
                <strong className="text-gray-700 min-w-36">
                  ⭐ Quality Grade:
                </strong>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getQualityColor(
                    selectedListing.quality
                  )}`}
                >
                  {selectedListing.quality}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <strong className="text-gray-700 min-w-36">
                  📅 Harvest Date:
                </strong>
                <span>{selectedListing.harvestDate}</span>
              </p>
              <p className="flex items-start gap-2">
                <strong className="text-gray-700 min-w-36">
                  📍 Location:
                </strong>
                <span>{selectedListing.location}</span>
              </p>
              <p className="flex items-start gap-2">
                <strong className="text-gray-700 min-w-36">
                  🌿 Variety:
                </strong>
                <span>{selectedListing.variety}</span>
              </p>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {/* Only show "Send Request" if not already sent for this listing */}
              {requestsSentTo.has(selectedListing.id) ? (
                <div className="text-green-700 text-sm">
                  <p className="font-semibold">
                    ✅ Procurement request sent successfully to {selectedListing.farmerName}.
                  </p>
                  <p className="mt-1">
                    Request Status: <span className="font-semibold">Request Sent</span>
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => handleSendRequest(selectedListing.id)}
                  className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow transition"
                >
                  Send Procurement Request 📤
                </button>
              )}

              <button
                onClick={() => setSelectedListing(null)}
                className="text-green-700 font-semibold px-5 py-3 rounded-xl border border-green-200 hover:bg-green-50 transition text-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-100 bg-white">
        AGSTYA – Kisano Ki Unnati • Empowering Farmers & Buyers 🌱
      </footer>
    </div>
  );
}

export default FarmerCrops;
