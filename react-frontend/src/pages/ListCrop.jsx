import { useState } from "react";
import { Link } from "react-router-dom";

function ListCrop() {
  // Stores the crop details entered by the farmer
  const [cropData, setCropData] = useState({
    crop: "",
    quantity: "",
    price: "",
    quality: "",
    harvestDate: "",
  });

  // Stores the submitted crop after listing
  const [listedCrop, setListedCrop] = useState(null);

  // Handles changes in all input fields
  const handleChange = (e) => {
    setCropData({
      ...cropData,
      [e.target.name]: e.target.value,
    });
  };

  // Lists the crop
  const handleListCrop = () => {
    const { crop, quantity, price, quality, harvestDate } = cropData;

    // Check whether all fields are filled
    if (!crop || !quantity || !price || !quality || !harvestDate) {
      alert("Please fill all crop details.");
      return;
    }

    // Save the crop details
    setListedCrop({
      crop,
      quantity,
      price,
      quality,
      harvestDate,
    });
  };

  return (
    <div className="farmer-page min-h-screen bg-green-50">

      {/* Top navigation */}
      <div className="sticky top-0 z-20 border-b border-green-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6">
        <Link
          to="/farmer/dashboard"
          className="inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold text-green-700 transition hover:bg-green-50"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <main className="mx-auto w-full max-w-4xl px-4 sm:px-6">

        {/* Page heading */}
        <header className="rounded-[1.8rem] bg-gradient-to-r from-green-700 via-emerald-600 to-lime-500 p-6 text-white shadow-lg shadow-green-900/10 sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.15em] ring-1 ring-inset ring-white/20">🌱 Marketplace</span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">List your crop</h1>
          <p className="mt-2 text-sm leading-6 text-white/90 sm:text-base">Add your available produce so buyers can discover it.</p>
        </header>

        {/* Crop form */}
        <div className="mt-6 rounded-3xl border border-green-100 bg-white p-5 shadow-[0_12px_35px_rgba(24,70,42,0.08)] sm:p-8">

          {/* Crop */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Crop
            </label>

            <select
              name="crop"
              value={cropData.crop}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Crop</option>
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Maize">Maize</option>
              <option value="Potato">Potato</option>
              <option value="Soybean">Soybean</option>
            </select>
          </div>

          {/* Quantity and price */}
          <div className="grid md:grid-cols-2 gap-5 mt-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Available Quantity (kg)
              </label>

              <input
                type="number"
                name="quantity"
                value={cropData.quantity}
                onChange={handleChange}
                placeholder="Example: 1000"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expected Price (₹/kg)
              </label>

              <input
                type="number"
                name="price"
                value={cropData.price}
                onChange={handleChange}
                placeholder="Example: 2500"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

          </div>

          {/* Quality and harvest date */}
          <div className="grid md:grid-cols-2 gap-5 mt-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quality Grade
              </label>

              <select
                name="quality"
                value={cropData.quality}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Quality</option>
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
                <option value="Grade C">Grade C</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Harvest Date
              </label>

              <input
                type="date"
                name="harvestDate"
                value={cropData.harvestDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

          </div>

          {/* Submit button */}
          <button
            onClick={handleListCrop}
            className="mt-7 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            List My Crop 🌱
          </button>
        </div>

        {/* Listed crop result */}
        {listedCrop && (
          <div className="mt-8 bg-white rounded-2xl p-6 border border-green-200 shadow-sm">

            <h2 className="text-2xl font-bold text-green-800">
              Crop Listed Successfully ✅
            </h2>

            <div className="mt-5 grid md:grid-cols-2 gap-4 text-gray-700">
              <p>
                <strong>Crop:</strong> {listedCrop.crop}
              </p>

              <p>
                <strong>Quantity:</strong> {listedCrop.quantity} kg
              </p>

              <p>
                <strong>Expected Price:</strong> ₹{listedCrop.price}/kg
              </p>

              <p>
                <strong>Quality:</strong> {listedCrop.quality}
              </p>

              <p>
                <strong>Harvest Date:</strong> {listedCrop.harvestDate}
              </p>
            </div>

            <p className="mt-5 text-green-700 font-semibold">
              This preview is saved on this screen only; it has not been published to the shared marketplace.
            </p>

          </div>
        )}

      </main>
    </div>
  );
}

export default ListCrop;
