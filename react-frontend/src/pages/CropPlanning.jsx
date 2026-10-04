import { Link } from "react-router-dom";
import { useState } from "react";

function CropPlanning() {

    const [cropData, setCropData] = useState({
  crop: "",
  land: "",
  cost: "",
  production: "",
  price: "",
});

const [profitResult, setProfitResult] = useState(null);

 const handleChange = (e) => {
    setCropData({
      ...cropData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateProfit = () => {
  const { crop, land, cost, production, price } = cropData;

  if (!crop){
    alert("Please enter all crop details.");
    return;
  } else if(!land){
    alert("Error: Land not entered");
    return;
  } else if(!cost){
    alert("Error: Enter Cost");
    return;
  } else if(!production){
    alert("Error: Enter production");
    return;
  } else if(!price ){
    alert("Error: Enter price");
  }

  const revenue = Number(production) * Number(price);
  const profit = revenue - Number(cost);

  setProfitResult({
    crop,
    revenue,
    profit,
  });
};

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

          <Link
            to="/farmer/dashboard"
            className="text-sm text-green-700 font-semibold"
          >
            ← Dashboard
          </Link>

        </div>
      </nav>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Crop Planning 🌾
          </h2>

          <p className="text-gray-500 mt-2">
            Plan your crop and estimate your potential earnings.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-8">

          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Enter Crop Details
          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Crop */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Crop
              </label>

              <select
                name="crop"
                value={cropData.crop}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>Select crop</option>
                <option>Rice</option>
                <option>Wheat</option>
                <option>Maize</option>
                <option>Cotton</option>
                <option>Sugarcane</option>
              </select>
            </div>

            {/* Land */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Land Area
              </label>

              <div className="flex">
                <input
                  type="number"
                  name="land"
                  value={cropData.land}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className="w-full px-4 py-3 rounded-l-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                />

                <span className="bg-gray-100 border border-l-0 border-gray-200 px-4 flex items-center rounded-r-xl text-sm text-gray-600">
                  Acres
                </span>
              </div>
            </div>

            {/* Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Cost
              </label>

              <input
                type="number"
                 name="cost"
                value={cropData.cost}
                onChange={handleChange}
                placeholder="₹ Enter estimated cost"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Production */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Production
              </label>

              <div className="flex">
                <input
                  type="number"
                   name="production"
                    value={cropData.production}
                    onChange={handleChange}
                  placeholder="e.g. 20"
                  className="w-full px-4 py-3 rounded-l-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                />

                <span className="bg-gray-100 border border-l-0 border-gray-200 px-4 flex items-center rounded-r-xl text-sm text-gray-600">
                  Quintal
                </span>
              </div>
            </div>

            {/* Selling Price */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Selling Price
              </label>

              <input
                type="number"
                 name="price"
                 value={cropData.price}
                  onChange={handleChange}
                placeholder="₹ Price per quintal"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

          </div>

          <button
            onClick={calculateProfit}
            className="mt-8 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Calculate Potential Profit →
          </button>

          {profitResult && (
  <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-6">
    <h3 className="font-bold text-green-800 text-xl">
      Crop Planning Result 🌱
    </h3>

    <div className="mt-5 space-y-4">
      <div>
        <p className="text-sm text-gray-500">Selected Crop</p>
        <p className="font-semibold text-gray-800">
          {profitResult.crop}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Expected Revenue</p>
        <p className="font-semibold text-green-700">
          ₹{profitResult.revenue}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Potential Profit</p>
        <p className="font-bold text-green-800 text-2xl">
          ₹{profitResult.profit}
        </p>
      </div>
    </div>
  </div>
)}

        </div>

      </main>
    </div>
  );
}

export default CropPlanning;