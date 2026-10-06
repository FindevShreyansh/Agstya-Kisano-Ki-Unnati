import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * BuyerProcurement.jsx — Phase 3
 * 
 * This page allows buyers to track their procurement requests sent to farmers.
 * It features a visual status tracker, status filtering, and detailed view.
 * Uses mock React state for now.
 */

function BuyerProcurement() {
  // Define procurement stages in order
  const stages = [
    "Request Sent",
    "Farmer Accepted",
    "Pickup Scheduled",
    "In Transit",
    "Delivered"
  ];

  // 1. Mock Data: Realistic sample procurement requests
  const mockRequests = [
    {
      id: "PRQ-1001",
      buyerName: "Bangalore Rice Traders (You)",
      farmerName: "Ramesh Kumar",
      crop: "Rice",
      quantity: "3000 kg",
      price: "₹42/kg",
      location: "Mandya, Karnataka",
      requestDate: "2026-10-02",
      status: "In Transit",
      deliveryAddress: "APMC Yard, Yeshwanthpur, Bangalore",
      notes: "Driver contacted. Expected arrival by evening."
    },
    {
      id: "PRQ-1002",
      buyerName: "Bangalore Rice Traders (You)",
      farmerName: "Suresh Patil",
      crop: "Wheat",
      quantity: "2000 kg",
      price: "₹30/kg",
      location: "Dharwad, Karnataka",
      requestDate: "2026-10-05",
      status: "Request Sent",
      deliveryAddress: "APMC Yard, Yeshwanthpur, Bangalore",
      notes: "Awaiting farmer confirmation."
    },
    {
      id: "PRQ-1003",
      buyerName: "Bangalore Rice Traders (You)",
      farmerName: "Lakshmi Bai",
      crop: "Potato",
      quantity: "1500 kg",
      price: "₹18/kg",
      location: "Hassan, Karnataka",
      requestDate: "2026-09-28",
      status: "Delivered",
      deliveryAddress: "Cold Storage Unit 4, Bangalore",
      notes: "Quality verified upon delivery. Payment cleared."
    },
    {
      id: "PRQ-1004",
      buyerName: "Bangalore Rice Traders (You)",
      farmerName: "Manoj Reddy",
      crop: "Maize",
      quantity: "4000 kg",
      price: "₹22/kg",
      location: "Davangere, Karnataka",
      requestDate: "2026-10-04",
      status: "Farmer Accepted",
      deliveryAddress: "Feed Mill, Tumkur",
      notes: "Farmer accepted the price. Need to schedule logistics."
    }
  ];

  // 2. React State for Filtering and Selected Request
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Filter logic
  const filteredRequests = mockRequests.filter(req => {
    if (filterStatus === "All") return true;
    return req.status === filterStatus;
  });

  // Helper function to render the visual progress tracker
  const renderProgressTracker = (currentStatus) => {
    const currentIndex = stages.indexOf(currentStatus);
    
    return (
      <div className="mt-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Procurement Progress
        </p>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {stages.map((stage, index) => {
            // Determine styles based on stage position relative to current status
            let badgeStyle = "bg-gray-100 text-gray-400"; // Default (Upcoming)
            let icon = `${index + 1}.`;

            if (index < currentIndex) {
              // Completed stages
              badgeStyle = "bg-green-100 text-green-700";
              icon = "✓";
            } else if (index === currentIndex) {
              // Current active stage
              badgeStyle = "bg-green-600 text-white shadow-md ring-2 ring-green-200";
              icon = "📍";
            }

            return (
              <span 
                key={stage} 
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${badgeStyle}`}
              >
                {icon} {stage}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7FAF7] flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-green-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-800">AGSTYA</h1>
            <p className="text-xs text-gray-500">Kisano Ki Unnati • Buyer Portal</p>
          </div>

          <Link
            to="/buyer/dashboard"
            className="text-sm text-green-700 hover:text-green-800 font-medium flex items-center gap-1"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 w-full flex-1">
        {/* Page Header */}
        <div className="mb-8">
          <span className="inline-block bg-green-100 text-green-800 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3">
            📦 Logistics & Tracking
          </span>
          <h2 className="text-3xl font-bold text-gray-800">
            Procurement Requests
          </h2>
          <p className="text-gray-500 mt-2">
            Track the status of your crop orders from farmers, manage logistics, and view delivery updates.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-green-100 shadow-sm">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              Filter Status:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-64 border border-gray-300 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value="All">All Requests</option>
              {stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
            Showing <strong className="text-gray-800">{filteredRequests.length}</strong> request(s)
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-green-100 shadow-sm">
              <span className="text-5xl">📭</span>
              <h3 className="text-xl font-bold text-gray-700 mt-4">No matching requests</h3>
              <p className="text-gray-500 mt-2">Try selecting a different status filter.</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-3xl p-6 md:p-8 border border-green-100 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header: IDs and Date */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-5 pb-5 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-2xl">👨‍🌾</span> {request.farmerName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Request ID: <span className="font-medium">{request.id}</span> • Date: {request.requestDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      request.status === "Delivered" ? "bg-green-100 text-green-800" :
                      request.status === "In Transit" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-sm text-gray-700">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-gray-500 text-xs mb-1">Crop</p>
                    <p className="font-semibold text-base">{request.crop}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-gray-500 text-xs mb-1">Quantity</p>
                    <p className="font-semibold text-base">{request.quantity}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-gray-500 text-xs mb-1">Agreed Price</p>
                    <p className="font-semibold text-base text-green-700">{request.price}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-gray-500 text-xs mb-1">Location</p>
                    <p className="font-semibold text-base truncate" title={request.location}>{request.location}</p>
                  </div>
                </div>

                {/* Visual Tracker */}
                {renderProgressTracker(request.status)}

                {/* Actions */}
                <div className="mt-8 pt-5 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="bg-green-50 text-green-700 hover:bg-green-700 hover:text-white px-6 py-2.5 rounded-xl font-semibold transition-colors duration-200"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Detailed Modal/Overlay View */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="bg-green-700 text-white px-6 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Procurement Details</h2>
                <p className="text-green-100 text-sm opacity-90">{selectedRequest.id}</p>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="text-white hover:text-green-200 bg-green-800 hover:bg-green-900 rounded-full w-8 h-8 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[70vh]">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Summary</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div>
                    <span className="block text-gray-500 text-xs">Buyer</span>
                    <strong className="text-gray-800">{selectedRequest.buyerName}</strong>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs">Farmer</span>
                    <strong className="text-gray-800">{selectedRequest.farmerName}</strong>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs">Item</span>
                    <strong className="text-gray-800">{selectedRequest.quantity} of {selectedRequest.crop}</strong>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs">Agreed Price</span>
                    <strong className="text-green-700">{selectedRequest.price}</strong>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs">Request Date</span>
                    <strong className="text-gray-800">{selectedRequest.requestDate}</strong>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs">Current Status</span>
                    <strong className="text-gray-800">{selectedRequest.status}</strong>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Logistics</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                  <p>
                    <span className="font-semibold text-gray-700">Pickup Location:</span> <br/>
                    {selectedRequest.location}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Delivery Address:</span> <br/>
                    {selectedRequest.deliveryAddress}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Latest Notes</h3>
                <p className="text-sm text-gray-600 bg-yellow-50 p-4 rounded-xl border border-yellow-100 italic">
                  "{selectedRequest.notes}"
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
              <button 
                onClick={() => setSelectedRequest(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-5 py-2 rounded-xl transition"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-100 bg-white mt-auto">
        AGSTYA – Kisano Ki Unnati • Empowering Farmers & Buyers 🌱
      </footer>
    </div>
  );
}

export default BuyerProcurement;
