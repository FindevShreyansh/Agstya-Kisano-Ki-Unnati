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

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Page heading */}
        <h1 className="text-3xl font-bold text-gray-800">
          List My Crop 🌾
        </h1>

        <p className="text-gray-500 mt-2">
          Add your available crop so that buyers can find your produce.
        </p>

        {/* Crop form */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-green-100 shadow-sm">

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
              Buyers can now view your crop availability.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default ListCrop;