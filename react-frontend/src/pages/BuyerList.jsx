import { Link } from "react-router-dom";

function BuyerList() {
  return (
    <div className="min-h-screen bg-green-50">

      <div className="bg-white border-b border-green-100 px-8 py-5">
        <Link
          to="/farmer/dashboard"
          className="text-green-700 font-semibold"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Find Buyers 🏢
        </h1>

        <p className="text-gray-500 mt-2">
          Discover buyers looking for crops from farmers.
        </p>

       <div className="mt-8 grid md:grid-cols-2 gap-6">

  <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
    <div className="text-3xl mb-4">🏢</div>

    <h3 className="text-xl font-bold text-gray-800">
      Bangalore Rice Traders
    </h3>

    <p className="text-gray-500 mt-2">
      Looking for quality rice
    </p>

    <div className="mt-4 space-y-2 text-sm text-gray-600">
      <p>📦 Required: 5000 kg</p>
      <p>📍 Location: Bangalore</p>
      <p>⭐ Quality: Grade A</p>
    </div>

    <button
  onClick={() => alert("Requirement: 5000 kg Grade A Rice in Bangalore")}
  className="mt-5 bg-green-700 text-white px-5 py-2 rounded-xl font-semibold"
>
  View Requirement
</button>
  </div>

  <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
    <div className="text-3xl mb-4">🏭</div>

    <h3 className="text-xl font-bold text-gray-800">
      Fresh Foods Pvt Ltd
    </h3>

    <p className="text-gray-500 mt-2">
      Looking for wheat suppliers
    </p>

    <div className="mt-4 space-y-2 text-sm text-gray-600">
      <p>📦 Required: 3000 kg</p>
      <p>📍 Location: Bangalore</p>
      <p>⭐ Quality: Grade A/B</p>
    </div>

   <button
  onClick={() => alert("Requirement: 3000 kg Grade A/B Wheat in Bangalore")}
  className="mt-5 bg-green-700 text-white px-5 py-2 rounded-xl font-semibold"
>
  View Requirement
</button>
  </div>

</div>
      </div>

    </div>
  );
}

export default BuyerList;