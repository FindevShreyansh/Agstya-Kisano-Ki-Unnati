import { useState } from "react";
import { Link } from "react-router-dom";

// Local sample requests let buyers review farmer interest without a backend.
const initialRequests = [
  {
    id: "FPR-1001",
    farmerName: "Ramesh Kumar",
    crop: "Rice",
    quantity: 3000,
    expectedPrice: 42,
    quality: "Grade A",
    location: "Mandya, Karnataka",
    requestDate: "2026-10-02",
    status: "Pending",
    feedback: "",
  },
  {
    id: "FPR-1002",
    farmerName: "Anita Devi",
    crop: "Rice",
    quantity: 5000,
    expectedPrice: 38,
    quality: "Grade B",
    location: "Raichur, Karnataka",
    requestDate: "2026-10-04",
    status: "Accepted",
    feedback: "",
  },
  {
    id: "FPR-1003",
    farmerName: "Suresh Patil",
    crop: "Wheat",
    quantity: 2000,
    expectedPrice: 30,
    quality: "Grade A",
    location: "Dharwad, Karnataka",
    requestDate: "2026-10-05",
    status: "Rejected",
    feedback: "",
  },
  {
    id: "FPR-1004",
    farmerName: "Manoj Reddy",
    crop: "Maize",
    quantity: 4000,
    expectedPrice: 22,
    quality: "Grade A",
    location: "Davangere, Karnataka",
    requestDate: "2026-10-06",
    status: "Pending",
    feedback: "",
  },
];

function BuyerProcurement() {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  // Derive dashboard totals from each request's own status.
  const summary = {
    total: requests.length,
    pending: requests.filter((request) => request.status === "Pending").length,
    accepted: requests.filter((request) => request.status === "Accepted").length,
    rejected: requests.filter((request) => request.status === "Rejected").length,
  };

  // Update only the targeted request so status and feedback remain independent.
  const updateRequestStatus = (requestId, status) => {
    const farmerName = requests.find((request) => request.id === requestId)?.farmerName;
    const feedback =
      status === "Accepted"
        ? `Request from ${farmerName} accepted.`
        : `Request from ${farmerName} rejected.`;

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId ? { ...request, status, feedback } : request
      )
    );
  };

  const statusClasses = {
    Pending: "bg-amber-100 text-amber-800",
    Accepted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  const statCards = [
    { label: "Total Requests", value: summary.total, style: "border-green-100 text-gray-800" },
    { label: "Pending", value: summary.pending, style: "border-amber-100 text-amber-700" },
    { label: "Accepted", value: summary.accepted, style: "border-green-100 text-green-700" },
    { label: "Rejected", value: summary.rejected, style: "border-red-100 text-red-700" },
  ];

  const selectedRequest = requests.find(
    (request) => request.id === selectedRequestId
  );

  return (
    <div className="min-h-screen bg-[#F7FAF7] flex flex-col">
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
            className="text-sm text-green-700 hover:text-green-800 font-medium"
          >
            ← Back to Buyer Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 w-full flex-1">
        <header className="mb-8">
          <span className="inline-block bg-green-100 text-green-800 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3">
            📦 Farmer Requests
          </span>
          <h2 className="text-3xl font-bold text-gray-800">
            Procurement Requests
          </h2>
          <p className="text-gray-500 mt-2">
            Review crop offers and interest received from farmers.
          </p>
        </header>

        {/* Summary counts always reflect the current request statuses. */}
        <section
          aria-label="Request summary"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`bg-white rounded-2xl p-5 border shadow-sm ${card.style.split(" ")[0]}`}
            >
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className={`text-2xl font-bold mt-1 ${card.style.split(" ")[1]}`}>
                {card.value}
              </p>
            </div>
          ))}
        </section>

        <section aria-label="Farmer procurement requests" className="space-y-5">
          {requests.map((request) => (
            <article
              key={request.id}
              className="bg-white rounded-2xl p-5 md:p-6 border border-green-100 shadow-sm"
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    👨‍🌾 {request.farmerName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Request {request.id} · Submitted {request.requestDate}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${statusClasses[request.status]}`}
                >
                  {request.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5 text-sm">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500">Crop</p>
                  <p className="font-semibold text-gray-800 mt-1">{request.crop}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500">Quantity</p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {request.quantity.toLocaleString()} kg
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500">Expected Price</p>
                  <p className="font-semibold text-green-700 mt-1">
                    ₹{request.expectedPrice}/kg
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500">Quality</p>
                  <p className="font-semibold text-gray-800 mt-1">{request.quality}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl col-span-2">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-semibold text-gray-800 mt-1">{request.location}</p>
                </div>
              </div>

              {request.feedback && (
                <p
                  role="status"
                  className={`mt-4 text-sm font-semibold ${
                    request.status === "Accepted" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {request.feedback}
                </p>
              )}

              <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedRequestId((currentId) =>
                      currentId === request.id ? null : request.id
                    )
                  }
                  className="px-4 py-2 rounded-xl border border-green-200 text-green-700 hover:bg-green-50 text-sm font-semibold transition"
                >
                  {selectedRequestId === request.id ? "Hide Details" : "View Details"}
                </button>
                <button
                  type="button"
                  onClick={() => updateRequestStatus(request.id, "Accepted")}
                  disabled={request.status !== "Pending"}
                  className="px-4 py-2 rounded-xl bg-green-700 hover:bg-green-800 disabled:bg-green-300 disabled:cursor-not-allowed text-white text-sm font-semibold transition"
                >
                  Accept Request
                </button>
                <button
                  type="button"
                  onClick={() => updateRequestStatus(request.id, "Rejected")}
                  disabled={request.status !== "Pending"}
                  className="px-4 py-2 rounded-xl bg-white border border-red-200 text-red-700 hover:bg-red-50 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed text-sm font-semibold transition"
                >
                  Reject Request
                </button>
              </div>

              {selectedRequest?.id === request.id && (
                <div className="mt-4 rounded-xl bg-green-50 border border-green-100 p-4 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Request Date:</span>{" "}
                    {request.requestDate}
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold">Current Status:</span>{" "}
                    {request.status}
                  </p>
                </div>
              )}
            </article>
          ))}
        </section>
      </main>

      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-100 bg-white">
        AGSTYA – Kisano Ki Unnati • Empowering Farmers & Buyers 🌱
      </footer>
    </div>
  );
}

export default BuyerProcurement;
