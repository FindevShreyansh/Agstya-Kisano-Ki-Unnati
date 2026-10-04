import { Link } from "react-router-dom";
import { useState } from "react";

function SoilAnalysis() {

    const [soilData, setSoilData] = useState({
     nitrogen: "",
     phosphorus: "",
      potassium: "",
      ph: "",
      });

      const [result, setResult] = useState(null);

       const handleChange = (e) => {
      setSoilData({
        ...soilData,
        [e.target.name]: e.target.value,
         });
      };

      const analyzeSoil = () => {
  const { nitrogen, phosphorus, potassium, ph } = soilData;

  if (!nitrogen || !phosphorus || !potassium || !ph) {
    alert("Please enter all soil values.");
    return;
  }

  const pHValue = Number(ph);

  if (pHValue >= 6 && pHValue <= 7.5) {
   setResult({
     condition: "Healthy",
      crops: "Rice, Wheat and Maize",
      suggestion: "Your soil pH is suitable for these crops.",
    });
  } else if (pHValue < 6) {
    setResult({
    condition: "Acidic",
    crops: "Potato and Tea",
     suggestion: "Your soil has a low pH. Consider suitable crops for acidic soil.",
    });
  } else {
    setResult({
      condition: "Alkaline",
      crops: "Barley and Cotton",
      suggestion: "Your soil is alkaline. Consider crops like Barley and Cotton.",
    });
  }
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
            Soil Analysis 🌱
          </h2>

          <p className="text-gray-500 mt-2">
            Enter your soil details to understand its condition and
            find suitable crops.
          </p>
        </div>

        {/* Soil Form */}
        <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-8">

          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Enter Soil Details
          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nitrogen (N)
              </label>

              <input
                type="number"
                name = "nitrogen"
                value={soilData.nitrogen}
                onChange={handleChange}
                placeholder="Enter nitrogen value"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phosphorus (P)
              </label>

              <input
                type="number"
                name = "phosphorus"
                value={soilData.phosphorus}
                onChange={handleChange}
                placeholder="Enter phosphorus value"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Potassium (K)
              </label>

              <input
                type="number"
                name="potassium"
                value={soilData.potassium}
                onChange={handleChange}
                placeholder="Enter potassium value"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soil pH
              </label>

              <input
                type="number"
                name="ph"
                value={soilData.ph}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g. 6.5"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

          </div>

          <button
            onClick={analyzeSoil}
            className="mt-8 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Analyze My Soil →
          </button>

        {result && (
  <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-6">

    <h3 className="font-bold text-green-800 text-xl">
      Soil Analysis Result 🌱
    </h3>

    <div className="mt-5 space-y-4">

      <div>
        <p className="text-sm text-gray-500">
          Soil Condition
        </p>

        <p className="font-semibold text-gray-800">
          {result.condition}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500">
          Recommended Crops
        </p>

        <p className="font-semibold text-green-700">
          {result.crops}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500">
          Suggestion
        </p>

        <p className="text-gray-700">
          {result.suggestion}
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

export default SoilAnalysis;