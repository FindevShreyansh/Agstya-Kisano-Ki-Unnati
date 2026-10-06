import { Link } from "react-router-dom";

function Procurement() {
  // Sample procurement request data
  const requests = [
    {
      buyer: "Bangalore Rice Traders",
      crop: "Rice",
      quantity: "5000 kg",
      location: "Bangalore",
      status: "Interest Sent",
    },
  ];

  return (
    <div className="min-h-screen bg-green-50">

      {/* Top navigation */}
      <div className="bg-white border-b border-green-100 px-8 py-5">
        <Link
          to="/farmer/dashboard"
          className="text-green-700 font-semibold"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Page heading */}
        <h1 className="text-3xl font-bold text-gray-800">
          Procurement Requests 📦
        </h1>

        <p className="text-gray-500 mt-2">
          Track your crop requests and buyer interactions.
        </p>

        {/* Requests */}
        <div className="mt-8 space-y-5">

          {requests.map((request, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm"
            >
              {/* Buyer information */}
              <h2 className="text-xl font-bold text-gray-800">
                {request.buyer}
              </h2>

              <div className="mt-4 grid md:grid-cols-2 gap-3 text-gray-600">
                <p>🌾 Crop: {request.crop}</p>
                <p>📦 Quantity: {request.quantity}</p>
                <p>📍 Location: {request.location}</p>
               {/* Current procurement status */}
               <div>
                <p className="text-gray-600">📌 Status</p>

                 <p className="mt-1 text-green-700 font-semibold">
                 {request.status}
                 </p>
                </div>

                    {/* Procurement status tracker */}
<div className="mt-6">

  <p className="text-sm font-semibold text-gray-700 mb-3">
    Procurement Progress
  </p>

  <div className="flex flex-wrap gap-3">

    <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
      ✓ Interest Sent
    </span>

    <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-500 text-sm">
      2. Accepted
    </span>

    <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-500 text-sm">
      3. Pickup Scheduled
    </span>

    <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-500 text-sm">
      4. In Transit
    </span>

    <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-500 text-sm">
      5. Delivered
    </span>

  </div>
</div>
      </div>

              

              {/* Future action */}
              <button className="mt-5 bg-green-700 text-white px-5 py-2 rounded-xl font-semibold">
                View Request
              </button>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default Procurement;