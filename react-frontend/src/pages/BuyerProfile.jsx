import { useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "agstya_buyer_profile";

const emptyProfile = {
  businessName: "",
  businessType: "",
  contactPerson: "",
  phone: "",
  email: "",
  location: "",
  gstNumber: "",
  deliveryHub: "",
  mainCrops: "",
  monthlyRequirement: "",
  preferredQuality: "",
};

function loadSavedProfile() {
  // Load the saved profile when this page initializes so it survives a refresh.
  try {
    const storedProfile = localStorage.getItem(STORAGE_KEY);
    if (!storedProfile) return null;

    const parsedProfile = JSON.parse(storedProfile);
    if (!parsedProfile || typeof parsedProfile !== "object" || Array.isArray(parsedProfile)) {
      throw new Error("Saved buyer profile must be a JSON object.");
    }

    return { ...emptyProfile, ...parsedProfile };
  } catch (error) {
    console.error("Unable to load the saved buyer profile from localStorage.", error);
    return null;
  }
}

/**
 * BuyerProfile.jsx — Phase 4
 * 
 * Allows a buyer to manage their business profile details.
 * Features form validation, browser localStorage persistence,
 * and a clean summary card upon successful saving.
 */

function BuyerProfile() {
  const [initialProfile] = useState(loadSavedProfile);

  // State for the form inputs
  const [formData, setFormData] = useState(() => initialProfile || emptyProfile);
  
  // State to toggle between View (summary card) and Edit (form) modes
  const [isEditing, setIsEditing] = useState(!initialProfile);
  
  // State for validation errors
  const [errors, setErrors] = useState({});
  
  // State for showing the success message after saving
  const [showSuccess, setShowSuccess] = useState(false);

  // State to hold the final saved profile data
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [storageError, setStorageError] = useState("");

  // Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error for this field as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) newErrors.businessName = "Business Name is required.";
    if (!formData.contactPerson.trim()) newErrors.contactPerson = "Contact Person is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required.";
    if (!formData.email.trim()) newErrors.email = "Email Address is required.";
    if (!formData.location.trim()) newErrors.location = "Business Location is required.";
    if (!formData.mainCrops.trim()) newErrors.mainCrops = "Main Crops Purchased is required.";

    setErrors(newErrors);
    
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSave = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // localStorage keeps this frontend-only profile available after a browser refresh.
      const profileToSave = { ...formData };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profileToSave));
      } catch (error) {
        console.error("Unable to save the buyer profile to localStorage.", error);
        setStorageError("Your profile could not be saved in this browser. Please try again.");
        return;
      }

      setStorageError("");
      setSavedProfile(profileToSave);
      setIsEditing(false);
      setShowSuccess(true);
      
      // Auto-hide the success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 w-full flex-1">
        {/* Page Header */}
        <div className="mb-8">
          <span className="inline-block bg-green-100 text-green-800 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3">
            🏢 Business Profile
          </span>
          <h2 className="text-3xl font-bold text-gray-800">
            Manage Profile
          </h2>
          <p className="text-gray-500 mt-2">
            Keep your business details up to date to build trust with farmers and streamline procurements.
          </p>
        </div>

        {/* Success Message Banner */}
        {showSuccess && !isEditing && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 shadow-sm animate-fade-in">
            <span className="text-2xl">✅</span>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-green-800">
                Profile Saved Successfully!
              </h3>
              <p className="text-xs text-green-700 mt-0.5">
                Your business information is saved in this browser.
              </p>
            </div>
            <button 
              onClick={() => setShowSuccess(false)}
              className="text-green-800 font-bold hover:text-green-900"
            >
              ✕
            </button>
          </div>
        )}

        {storageError && (
          <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
            {storageError}
          </div>
        )}

        {/* Conditional Rendering: Edit Form vs View Summary Card */}
        {isEditing ? (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-green-100 shadow-sm mb-10 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
              <span>✍️</span> Edit Business Information
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Row 1: Business Name & Type */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Fresh Foods Pvt Ltd"
                    className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ${
                      errors.businessName ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"
                    }`}
                  />
                  {errors.businessName && <p className="text-xs text-red-500 mt-1.5">{errors.businessName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Type
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  >
                    <option value="">Select business type</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Food Processor">Food Processor</option>
                    <option value="Exporter">Exporter</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Contact Person & Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh"
                    className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ${
                      errors.contactPerson ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"
                    }`}
                  />
                  {errors.contactPerson && <p className="text-xs text-red-500 mt-1.5">{errors.contactPerson}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ${
                      errors.phone ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"
                    }`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1.5">{errors.phone}</p>}
                </div>
              </div>

              {/* Row 3: Email & Location */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. contact@business.com"
                    className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ${
                      errors.email ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Location (HQ/Yard) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Bangalore"
                    className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ${
                      errors.location ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"
                    }`}
                  />
                  {errors.location && <p className="text-xs text-red-500 mt-1.5">{errors.location}</p>}
                </div>
              </div>

              {/* GST and preferred delivery hub */}
              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GST Number (Optional)
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="Enter GST number if available"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Delivery Hub / Pickup Location
                  </label>
                  <input
                    type="text"
                    name="deliveryHub"
                    value={formData.deliveryHub}
                    onChange={handleChange}
                    placeholder="e.g. APMC Yard, Bangalore"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Row 4: Crops, Requirement & Quality */}
              <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Main Crops <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="mainCrops"
                    value={formData.mainCrops}
                    onChange={handleChange}
                    placeholder="e.g. Rice, Wheat"
                    className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ${
                      errors.mainCrops ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"
                    }`}
                  />
                  {errors.mainCrops && <p className="text-xs text-red-500 mt-1.5">{errors.mainCrops}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Req. (kg)
                  </label>
                  <input
                    type="number"
                    name="monthlyRequirement"
                    value={formData.monthlyRequirement}
                    onChange={handleChange}
                    placeholder="e.g. 5000"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pref. Quality Grade
                  </label>
                  <select
                    name="preferredQuality"
                    value={formData.preferredQuality}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  >
                    <option value="">Select quality grade</option>
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Grade C">Grade C</option>
                    <option value="Grade A/B">Grade A/B</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3.5 rounded-xl shadow-sm transition"
                >
                  Save Profile 💾
                </button>

                {savedProfile && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-full sm:w-auto text-gray-500 hover:text-gray-700 font-medium px-6 py-3.5 rounded-xl border border-gray-200 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          /* View Mode: Profile Summary Card */
          <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-green-600 shadow-md animate-fade-in relative overflow-hidden">
            {/* Decorative BG element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-0"></div>
            
            <div className="relative z-10 flex flex-wrap justify-between items-start gap-4 mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-sm">
                  {savedProfile.businessName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{savedProfile.businessName}</h3>
                  <p className="text-sm text-gray-500 font-medium">{savedProfile.businessType} • Verified Buyer</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-green-50 text-green-700 hover:bg-green-700 hover:text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Edit Profile ✎
              </button>
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Contact Info */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Information</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-lg w-5 text-center">👤</span>
                    <div>
                      <p className="text-xs text-gray-500">Contact Person</p>
                      <p className="text-sm font-semibold text-gray-800">{savedProfile.contactPerson}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-lg w-5 text-center">📞</span>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-semibold text-gray-800">{savedProfile.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-lg w-5 text-center">✉️</span>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-semibold text-gray-800">{savedProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-lg w-5 text-center">📍</span>
                    <div>
                      <p className="text-xs text-gray-500">Business Location</p>
                      <p className="text-sm font-semibold text-gray-800">{savedProfile.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-lg w-5 text-center">🧾</span>
                    <div>
                      <p className="text-xs text-gray-500">GST Number</p>
                      <p className="text-sm font-semibold text-gray-800">{savedProfile.gstNumber || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Procurement Info */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Procurement Details</h4>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Main Crops Purchased</p>
                    <p className="text-sm font-bold text-green-700">{savedProfile.mainCrops}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Preferred Delivery Hub / Pickup Location</p>
                    <p className="text-sm font-bold text-gray-800">{savedProfile.deliveryHub || "Not provided"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Monthly Req.</p>
                      <p className="text-sm font-bold text-gray-800">
                        {savedProfile.monthlyRequirement ? `${Number(savedProfile.monthlyRequirement).toLocaleString()} kg` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Pref. Quality</p>
                      <p className="text-sm font-bold text-gray-800">{savedProfile.preferredQuality}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-100 bg-white mt-auto">
        AGSTYA – Kisano Ki Unnati • Empowering Farmers & Buyers 🌱
      </footer>
    </div>
  );
}

export default BuyerProfile;
