import { Link } from "react-router-dom";
import { useState } from "react";

function BuyerList() {

const [selectedCrop, setSelectedCrop] = useState("");

/*Stores the buyer selected by the farmer*/
const [selectedBuyer, setSelectedBuyer] = useState(null);

// Stores the farmer's interest requests
const [interestSentTo, setInterestSentTo] = useState(null);

// Buyer data: each buyer has a crop they are looking for
const buyers = [
  {
    name: "Bangalore Rice Traders",
    icon: "🏢",
    description: "Looking for quality rice",
    crop: "Rice",
    quantity: "5000 kg",
    location: "Bangalore",
    quality: "Grade A",
  },
  {
    name: "Fresh Foods Pvt Ltd",
    icon: "🏭",
    description: "Looking for wheat suppliers",
    crop: "Wheat",
    quantity: "3000 kg",
    location: "Bangalore",
    quality: "Grade A/B",
  },

  // Buyer for Maize
{
  name: "Bangalore Grain Industries",
  icon: "🏭",
  description: "Looking for quality maize",
  crop: "Maize",
  quantity: "4000 kg",
  location: "Bangalore",
  quality: "Grade A",
},

// Buyer for Potato
{
  name: "Fresh Potato Foods",
  icon: "🥔",
  description: "Looking for fresh potatoes",
  crop: "Potato",
  quantity: "2500 kg",
  location: "Bangalore",
  quality: "Grade A",
},

// Buyer for Soybean
{
  name: "Green Protein Foods",
  icon: "🏢",
  description: "Looking for soybean suppliers",
  crop: "Soybean",
  quantity: "3500 kg",
  location: "Bangalore",
  quality: "Grade A",
},
];

// Filter buyers according to farmer's selected crop
const filteredBuyers = selectedCrop
  ? buyers.filter((buyer) => buyer.crop === selectedCrop)
  : buyers;

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

        <div className="mt-6">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Select Crop
  </label>

  <select
    value={selectedCrop}
    onChange={(e) => setSelectedCrop(e.target.value)}
    className="w-full md:w-80 border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
  >
    <option value="">All Crops</option>
    <option value="Rice">Rice</option>
    <option value="Wheat">Wheat</option>
    <option value="Maize">Maize</option>
    <option value="Potato">Potato</option>
    <option value="Soybean">Soybean</option>
  </select>
</div>

      {/*Display buyers based on the selected crop*/}

<div className="mt-8 grid md:grid-cols-2 gap-6">
  {filteredBuyers.map((buyer) => (
    <div
      key={buyer.name}
      className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm"
    >
      {/* Buyer icon */}
      <div className="text-3xl mb-4">{buyer.icon}</div>

      {/* Buyer name */}
      <h3 className="text-xl font-bold text-gray-800">
        {buyer.name}
      </h3>

      {/* What the buyer is looking for */}
      <p className="text-gray-500 mt-2">
        {buyer.description}
      </p>

      {/* Buyer requirements */}
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p>🌾 Crop: {buyer.crop}</p>
        <p>📦 Required: {buyer.quantity}</p>
        <p>📍 Location: {buyer.location}</p>
        <p>⭐ Quality: {buyer.quality}</p>
      </div>

      {/* Select this buyer to view its full requirement */}
         <button
           onClick={() => setSelectedBuyer(buyer)}
           className="mt-5 bg-green-700 text-white px-5 py-2 rounded-xl font-semibold"
         >
           View Requirement
         </button>
    </div>
  ))}
</div>



      </div>

      {/* Selected buyer's full requirement */}
{selectedBuyer && (
  <div className="mt-8 bg-white rounded-2xl p-6 border border-green-200 shadow-sm">
    <h2 className="text-2xl font-bold text-gray-800">
      Buyer Requirement 📋
    </h2>

    <div className="mt-5 grid md:grid-cols-2 gap-4 text-gray-700">
      <p><strong>Buyer:</strong> {selectedBuyer.name}</p>
      <p><strong>Crop:</strong> {selectedBuyer.crop}</p>
      <p><strong>Quantity:</strong> {selectedBuyer.quantity}</p>
      <p><strong>Location:</strong> {selectedBuyer.location}</p>
      <p><strong>Quality:</strong> {selectedBuyer.quality}</p>
    </div>

    {/* Farmer sends interest to the selected buyer */}
<button
  onClick={() =>{
    
    setInterestSentTo(selectedBuyer.name);
  }}
  className="mt-6 mr-4 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold"
>
  Send Interest 🤝
</button>

{/* Confirmation after farmer sends interest */}
{interestSentTo === selectedBuyer.name && (
  <p className="mt-4 text-green-700 font-semibold">
    ✅ Interest sent successfully to {selectedBuyer.name}
  </p>
)}

    <button
      onClick={() => setSelectedBuyer(null)}
      className="mt-6 text-green-700 font-semibold"
    >
      Close
    </button>
  </div>
)}

    </div>
  );
}

export default BuyerList;