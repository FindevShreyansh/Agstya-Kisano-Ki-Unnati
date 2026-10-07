import { useState } from "react";
import { Link } from "react-router-dom";

const procurementStages = [
  "Interest Sent",
  "Accepted",
  "Pickup Scheduled",
  "In Transit",
  "Delivered",
];

// Local sample data covers each stage so the progress tracker can be previewed.
const requests = [
  {
    id: "FPR-2001",
    buyerName: "Bangalore Rice Traders",
    crop: "Rice",
    quantity: 5000,
    expectedPrice: 42,
    location: "Bangalore, Karnataka",
    requestDate: "2026-10-02",
    status: "Interest Sent",
    nextStep: "Waiting for buyer response.",
  },
  {
    id: "FPR-2002",
    buyerName: "Fresh Foods Pvt Ltd",
    crop: "Wheat",
    quantity: 3000,
    expectedPrice: 30,
    location: "Dharwad, Karnataka",
    requestDate: "2026-10-03",
    status: "Accepted",
    nextStep: "Pickup will be scheduled by the buyer.",
  },
  {
    id: "FPR-2003",
    buyerName: "Bangalore Grain Industries",
    crop: "Maize",
    quantity: 4000,
    expectedPrice: 22,
    location: "Davangere, Karnataka",
    requestDate: "2026-10-04",
    status: "Pickup Scheduled",
    nextStep: "Prepare your crop for the scheduled pickup.",
  },
  {
    id: "FPR-2004",
    buyerName: "Fresh Potato Foods",
    crop: "Potato",
    quantity: 2500,
    expectedPrice: 18,
    location: "Hassan, Karnataka",
    requestDate: "2026-10-05",
    status: "In Transit",
    nextStep: "Your crop is being transported to the buyer.",
  },
  {
    id: "FPR-2005",
    buyerName: "Green Protein Foods",
    crop: "Soybean",
    quantity: 3500,
    expectedPrice: 55,
    location: "Belgaum, Karnataka",
    requestDate: "2026-10-06",
    status: "Delivered",
    nextStep: "Procurement completed successfully.",
  },
];

const statusStyles = {
  "Interest Sent": {
    badge: "bg-yellow-100 text-yellow-800",
    currentStep: "bg-yellow-500 text-white ring-yellow-100",
  },
  Accepted: {
    badge: "bg-green-100 text-green-800",
    currentStep: "bg-green-600 text-white ring-green-100",
  },
  "Pickup Scheduled": {
    badge: "bg-blue-100 text-blue-800",
    currentStep: "bg-blue-600 text-white ring-blue-100",
  },
  "In Transit": {
    badge: "bg-purple-100 text-purple-800",
    currentStep: "bg-purple-600 text-white ring-purple-100",
  },
  Delivered: {
    badge: "bg-green-100 text-green-800",
    currentStep: "bg-green-600 text-white ring-green-100",
  },
};

function Procurement() {
  // Expanded IDs are tracked independently so opening one request leaves others unchanged.
  const [expandedRequestIds, setExpandedRequestIds] = useState(new Set());

  const toggleRequestDetails = (requestId) => {
    setExpandedRequestIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(requestId)) {
        nextIds.delete(requestId);
      } else {
        nextIds.add(requestId);
      }
      return nextIds;
    });
  };

  return (
    <div className="min-h-screen bg-[#F7FAF7] flex flex-col">
      <nav className="bg-white border-b border-green-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-800">AGSTYA</h1>
            <p className="text-xs text-gray-500">Kisano Ki Unnati • Farmer Portal</p>
          </div>
          <Link
            to="/farmer/dashboard"
            className="text-sm text-green-700 hover:text-green-800 font-medium"
          >
            ← Back to Farmer Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 w-full flex-1">
        <header className="mb-8">
          <span className="inline-block bg-green-100 text-green-800 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3">
            🌾 Farmer Opportunities
          </span>
          <h2 className="text-3xl font-bold text-gray-800">
            Procurement Tracking 📦
          </h2>
          <p className="text-gray-500 mt-2">
            Follow your requests from buyer response through final delivery.
          </p>
        </header>

        <section aria-label="Procurement requests" className="space-y-6">
          {requests.map((request) => {
            const currentStageIndex = procurementStages.indexOf(request.status);
            const isExpanded = expandedRequestIds.has(request.id);
            const statusStyle = statusStyles[request.status];

            return (
              <article
                key={request.id}
                className="bg-white rounded-2xl p-5 md:p-7 border border-green-100 shadow-sm"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      🏢 {request.buyerName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Request {request.id} · Submitted {request.requestDate}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle.badge}`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Crop</p>
                    <p className="font-semibold text-gray-800 mt-1">{request.crop}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="font-semibold text-gray-800 mt-1">
                      {request.quantity.toLocaleString()} kg
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Expected Price</p>
                    <p className="font-semibold text-green-700 mt-1">
                      ₹{request.expectedPrice}/kg
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 col-span-2 md:col-span-1">
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-semibold text-gray-800 mt-1">{request.location}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Request Date</p>
                    <p className="font-semibold text-gray-800 mt-1">{request.requestDate}</p>
                  </div>
                </div>

                {/* Completed stages, the active stage, and upcoming steps use distinct markers. */}
                <section className="mt-6" aria-label={`Progress for ${request.id}`}>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    Procurement Progress
                  </h4>
                  <ol className="ml-2">
                    {procurementStages.map((stage, index) => {
                      const isComplete = index < currentStageIndex;
                      const isCurrent = index === currentStageIndex;
                      const markerStyle = isCurrent
                        ? statusStyle.currentStep
                        : isComplete
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-500";

                      return (
                        <li key={stage} className="flex min-h-12">
                          <div className="flex flex-col items-center mr-3">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                isCurrent ? `ring-4 ${markerStyle}` : markerStyle
                              }`}
                              aria-current={isCurrent ? "step" : undefined}
                            >
                              {isComplete ? "✓" : index + 1}
                            </span>
                            {index < procurementStages.length - 1 && (
                              <span
                                className={`w-0.5 flex-1 min-h-4 ${
                                  isComplete ? "bg-green-300" : "bg-gray-200"
                                }`}
                              />
                            )}
                          </div>
                          <span
                            className={`pt-1 text-sm ${
                              isCurrent
                                ? "font-bold text-gray-900"
                                : isComplete
                                  ? "font-medium text-green-800"
                                  : "text-gray-500"
                            }`}
                          >
                            {stage}
                            {isCurrent && (
                              <span className="ml-2 text-xs font-semibold text-gray-500">
                                Current status
                              </span>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </section>

                <section className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4">
                  <h4 className="text-sm font-bold text-green-900">Next Step</h4>
                  <p className="text-sm text-green-800 mt-1">{request.nextStep}</p>
                </section>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => toggleRequestDetails(request.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`request-details-${request.id}`}
                    className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition"
                  >
                    {isExpanded ? "Hide Request Details" : "View Request Details"}
                  </button>
                </div>

                {isExpanded && (
                  <div
                    id={`request-details-${request.id}`}
                    className="mt-4 rounded-xl border border-green-100 bg-[#FBFDFB] p-4"
                  >
                    <h4 className="font-bold text-gray-800 mb-3">
                      Complete Request Details
                    </h4>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-gray-500">Buyer Name</dt>
                        <dd className="font-semibold text-gray-800">{request.buyerName}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Crop</dt>
                        <dd className="font-semibold text-gray-800">{request.crop}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Quantity</dt>
                        <dd className="font-semibold text-gray-800">
                          {request.quantity.toLocaleString()} kg
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Expected Price</dt>
                        <dd className="font-semibold text-gray-800">
                          ₹{request.expectedPrice}/kg
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Location</dt>
                        <dd className="font-semibold text-gray-800">{request.location}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Request Date</dt>
                        <dd className="font-semibold text-gray-800">{request.requestDate}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Current Status</dt>
                        <dd className="font-semibold text-gray-800">{request.status}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </main>

      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-100 bg-white">
        AGSTYA – Kisano Ki Unnati • Empowering Farmers & Buyers 🌱
      </footer>
    </div>
  );
}

export default Procurement;
