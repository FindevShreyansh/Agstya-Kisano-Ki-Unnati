import { useState } from "react";
import { Link } from "react-router-dom";

function PostRequirement() {
  // State for form input fields
  const [formData, setFormData] = useState({
    crop: "",
    quantity: "",
    minQuality: "",
    maxPrice: "",
    deliveryLocation: "",
    requiredByDate: "",
    additionalRequirements: "",
  });

  // State to hold validation error messages
  const [errors, setErrors] = useState({});

  // State for the recently submitted requirement to display the summary card
  const [submittedRequirement, setSubmittedRequirement] = useState(null);

  // State for sample / posted requirements list (mock database in React state)
  const [postedRequirements, setPostedRequirements] = useState([
    {
      id: "REQ-001",
      crop: "Rice",
      quantity: 5000,
      minQuality: "Grade A",
      maxPrice: 45,
      deliveryLocation: "Bangalore APMC Market Yard",
      requiredByDate: "2026-10-30",
      additionalRequirements: "Moisture content must be below 12%. Jute bag packaging required.",
      postedDate: "2026-10-05",
      status: "Active",
    },
    {
      id: "REQ-002",
      crop: "Wheat",
      quantity: 3000,
      minQuality: "Grade A/B",
      maxPrice: 32,
      deliveryLocation: "Yeshwanthpur Warehouse, Bangalore",
      requiredByDate: "2026-11-05",
      additionalRequirements: "Clean grain without husk, direct farm pickup possible.",
      postedDate: "2026-10-04",
      status: "Active",
    },
  ]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Form validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.crop.trim()) {
      newErrors.crop = "Please select a crop.";
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      newErrors.quantity = "Please enter a valid required quantity greater than 0.";
    }

    if (!formData.minQuality.trim()) {
      newErrors.minQuality = "Please select a minimum quality grade.";
    }

    if (!formData.maxPrice || Number(formData.maxPrice) <= 0) {
      newErrors.maxPrice = "Please enter a valid buying price per kg.";
    }

    if (!formData.deliveryLocation.trim()) {
      newErrors.deliveryLocation = "Please specify the required delivery location.";
    }

    if (!formData.requiredByDate) {
      newErrors.requiredByDate = "Please choose a required-by date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create a new requirement object
    const newRequirement = {
      id: `REQ-00${postedRequirements.length + 1}`,
      crop: formData.crop,
      quantity: Number(formData.quantity),
      minQuality: formData.minQuality,
      maxPrice: Number(formData.maxPrice),
      deliveryLocation: formData.deliveryLocation,
      requiredByDate: formData.requiredByDate,
      additionalRequirements: formData.additionalRequirements.trim() || "No additional requirements specified.",
      postedDate: new Date().toISOString().split("T")[0],
      status: "Active",
    };

    // Save into state
    setSubmittedRequirement(newRequirement);
    setPostedRequirements([newRequirement, ...postedRequirements]);

    // Reset the form fields
    setFormData({
      crop: "",
      quantity: "",
      minQuality: "",
      maxPrice: "",
      deliveryLocation: "",
      requiredByDate: "",
      additionalRequirements: "",
    });

    setErrors({});
  };

  // Crop emoji mapping helper
  const getCropEmoji = (crop) => {
    switch (crop) {
      case "Rice":
        return "🌾";
      case "Wheat":
        return "🍞";
      case "Maize":
        return "🌽";
      case "Potato":
        return "🥔";
      case "Soybean":
        return "🫘";
      default:
        return "🌱";
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF7] flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-green-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-800">AGSTYA</h1>
            <p className="text-xs text-gray-500">Kisano Ki Unnati • Buyer Portal</p>
          </div>

          <Link
            to="/buyer/dashboard"
            className="text-sm text-green-700 hover:text-green-800 font-medium flex items-center gap-1"
          >
            ← Back to Buyer Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 w-full flex-1">
        {/* Header Title */}
        <div className="mb-8">
          <span className="inline-block bg-green-100 text-green-800 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3">
            🏢 Buyer Procurement
          </span>
          <h2 className="text-3xl font-bold text-gray-800">
            Post Crop Requirement 📋
          </h2>
          <p className="text-gray-500 mt-2">
            Publish your purchasing demand so verified farmers with matching crops can connect with you directly.
          </p>
        </div>

        {/* Success Confirmation Banner */}
        {submittedRequirement && (
          <div className="mb-8 p-5 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-4 shadow-sm animate-fade-in">
            <span className="text-3xl">✅</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-800">
                Crop Requirement Posted Successfully!
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Your requirement for <strong>{submittedRequirement.quantity.toLocaleString()} kg</strong> of{" "}
                <strong>{submittedRequirement.crop}</strong> has been listed on AGSTYA. Matching farmer listings will be surfaced.
              </p>
              <div className="mt-3 flex gap-3">
                <a
                  href="#summary-card"
                  className="text-xs font-semibold bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-800 transition"
                >
                  View Summary Card ↓
                </a>
                <button
                  onClick={() => setSubmittedRequirement(null)}
                  className="text-xs font-semibold text-green-800 underline hover:text-green-900"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Requirement Form Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-green-100 shadow-sm mb-10">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📝</span> Requirement Details
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Crop & Quantity */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Crop */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Crop Required <span className="text-red-500">*</span>
                </label>
                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  className={`w-full border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 ${
                    errors.crop
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                >
                  <option value="">Select Crop</option>
                  <option value="Rice">Rice (🌾)</option>
                  <option value="Wheat">Wheat (🍞)</option>
                  <option value="Maize">Maize (🌽)</option>
                  <option value="Potato">Potato (🥔)</option>
                  <option value="Soybean">Soybean (🫘)</option>
                </select>
                {errors.crop && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.crop}</p>
                )}
              </div>

              {/* Required Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Required Quantity (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g. 5000"
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${
                    errors.quantity
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                />
                {errors.quantity && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.quantity}</p>
                )}
              </div>
            </div>

            {/* Quality Grade & Expected Price */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Minimum Quality Grade */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum Quality Grade <span className="text-red-500">*</span>
                </label>
                <select
                  name="minQuality"
                  value={formData.minQuality}
                  onChange={handleChange}
                  className={`w-full border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 ${
                    errors.minQuality
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                >
                  <option value="">Select Minimum Grade</option>
                  <option value="Grade A">Grade A (Premium Quality)</option>
                  <option value="Grade A/B">Grade A/B (Standard Commercial)</option>
                  <option value="Grade B">Grade B (Fair Average Quality)</option>
                  <option value="Grade C">Grade C (Industrial / Processing)</option>
                </select>
                {errors.minQuality && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.minQuality}</p>
                )}
              </div>

              {/* Maximum Buying Price per kg */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max / Expected Buying Price (₹/kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleChange}
                  min="1"
                  step="0.5"
                  placeholder="e.g. 45"
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${
                    errors.maxPrice
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                />
                {errors.maxPrice && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.maxPrice}</p>
                )}
              </div>
            </div>

            {/* Delivery Location & Required By Date */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Delivery Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Required Delivery Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="deliveryLocation"
                  value={formData.deliveryLocation}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore APMC Yard, Karnataka"
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${
                    errors.deliveryLocation
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                />
                {errors.deliveryLocation && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">
                    {errors.deliveryLocation}
                  </p>
                )}
              </div>

              {/* Required By Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Required By Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="requiredByDate"
                  value={formData.requiredByDate}
                  onChange={handleChange}
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${
                    errors.requiredByDate
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                />
                {errors.requiredByDate && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">
                    {errors.requiredByDate}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Requirements */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Requirements / Quality Notes
              </label>
              <textarea
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleChange}
                rows="3"
                placeholder="e.g. Moisture content below 12%, specific variety preference, packaging in 50kg bags, organic certification preferred..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3.5 rounded-xl shadow-sm hover:shadow transition duration-200"
              >
                Submit Requirement 📤
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({
                    crop: "",
                    quantity: "",
                    minQuality: "",
                    maxPrice: "",
                    deliveryLocation: "",
                    requiredByDate: "",
                    additionalRequirements: "",
                  });
                  setErrors({});
                }}
                className="w-full sm:w-auto text-gray-500 hover:text-gray-700 px-6 py-3.5 rounded-xl border border-gray-200 font-medium transition"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Clean Summary Card for the Recently Submitted Requirement */}
        {submittedRequirement && (
          <div
            id="summary-card"
            className="mb-10 bg-white rounded-3xl p-6 md:p-8 border-2 border-green-600 shadow-md transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-3 bg-green-50 rounded-2xl border border-green-100">
                  {getCropEmoji(submittedRequirement.crop)}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {submittedRequirement.crop} Requirement
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {submittedRequirement.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Requirement ID: {submittedRequirement.id} • Posted on {submittedRequirement.postedDate}
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                Awaiting Farmer Matches
              </span>
            </div>

            {/* Summary Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Required Quantity</p>
                <p className="text-lg font-bold text-gray-800 mt-1">
                  {submittedRequirement.quantity.toLocaleString()} kg
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Max Buying Price</p>
                <p className="text-lg font-bold text-green-700 mt-1">
                  ₹{submittedRequirement.maxPrice}/kg
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Estimated Budget</p>
                <p className="text-lg font-bold text-gray-800 mt-1">
                  ₹{(submittedRequirement.quantity * submittedRequirement.maxPrice).toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Min Quality Grade</p>
                <p className="text-lg font-bold text-amber-700 mt-1">
                  {submittedRequirement.minQuality}
                </p>
              </div>
            </div>

            {/* Location, Date & Notes */}
            <div className="space-y-3 text-sm text-gray-600 bg-[#FBFDFB] p-5 rounded-2xl border border-green-50">
              <p className="flex items-start gap-2">
                <strong className="text-gray-700 min-w-36">📍 Delivery Location:</strong>
                <span>{submittedRequirement.deliveryLocation}</span>
              </p>
              <p className="flex items-start gap-2">
                <strong className="text-gray-700 min-w-36">📅 Required By:</strong>
                <span>{submittedRequirement.requiredByDate}</span>
              </p>
              <p className="flex items-start gap-2">
                <strong className="text-gray-700 min-w-36">📝 Additional Notes:</strong>
                <span>{submittedRequirement.additionalRequirements}</span>
              </p>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/buyer/dashboard"
                className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition"
              >
                Go to Dashboard →
              </Link>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="border border-green-700 text-green-700 hover:bg-green-50 font-semibold px-5 py-2.5 rounded-xl text-sm transition"
              >
                + Post Another Requirement
              </button>
            </div>
          </div>
        )}

        {/* List of Posted Requirements (Mock database view) */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              Your Active Requirements ({postedRequirements.length})
            </h3>
            <span className="text-xs text-gray-500">Live mock state</span>
          </div>

          <div className="space-y-4">
            {postedRequirements.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm hover:border-green-300 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCropEmoji(req.crop)}</span>
                    <div>
                      <h4 className="font-bold text-gray-800 text-base">
                        {req.crop} • {req.quantity.toLocaleString()} kg
                      </h4>
                      <p className="text-xs text-gray-500">
                        Target Price: <span className="font-semibold text-green-700">₹{req.maxPrice}/kg</span> • Grade: {req.minQuality}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {req.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">Needed by {req.requiredByDate}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
                  <p>📍 {req.deliveryLocation}</p>
                  <p className="italic text-gray-400 truncate max-w-md">"{req.additionalRequirements}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-100 bg-white">
        AGSTYA – Kisano Ki Unnati • Empowering Farmers & Buyers 🌱
      </footer>
    </div>
  );
}

export default PostRequirement;
