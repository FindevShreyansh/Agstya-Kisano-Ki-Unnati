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
      const [error, setError] = useState("");

       const handleChange = (e) => {
      setSoilData({
        ...soilData,
        [e.target.name]: e.target.value,
         });
      };

      const analyzeSoil = () => {
  const { nitrogen, phosphorus, potassium, ph } = soilData;

  if (!nitrogen || !phosphorus || !potassium || !ph) {
    setError("Enter all four values to continue.");
    return;
  }

  if ([nitrogen, phosphorus, potassium].some((value) => Number(value) < 0) || Number(ph) < 0 || Number(ph) > 14) {
    setError("Use non-negative nutrient values and a pH between 0 and 14.");
    return;
  }

  setError("");
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

    <div className="farmer-page min-h-screen bg-[#F7FAF7]">

      {/* Navbar */}
      <nav className="sticky top-0 z-20 border-b border-green-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">

          <img src="/agstya-logo.png" alt="AGSTYA Logo" className="h-[70px] w-auto max-w-full object-contain shrink-0" />

          <Link
            to="/farmer/dashboard"
            className="inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold text-green-700 transition hover:bg-green-50"
          >
            ← Dashboard
          </Link>

        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="mb-8 rounded-[1.8rem] bg-gradient-to-r from-green-700 to-emerald-500 p-6 text-white shadow-lg shadow-green-900/10 sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] ring-1 ring-inset ring-white/20">🌱 Soil health</span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Understand your soil</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-green-50/90 sm:text-base">Enter values from your soil report for a quick pH-based crop suitability preview.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={(event) => { event.preventDefault(); analyzeSoil(); }} className="rounded-3xl border border-green-100 bg-white p-5 shadow-[0_12px_35px_rgba(24,70,42,0.08)] sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-green-700">Soil report values</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-gray-900">Add your readings</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nitrogen (N)
              </label>

              <input
                type="number"
                name="nitrogen"
                min="0"
                step="any"
                required
                value={soilData.nitrogen}
                onChange={handleChange}
                placeholder="e.g. 90"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phosphorus (P)
              </label>

              <input
                type="number"
                name="phosphorus"
                min="0"
                step="any"
                required
                value={soilData.phosphorus}
                onChange={handleChange}
                placeholder="e.g. 45"
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
                min="0"
                step="any"
                required
                value={soilData.potassium}
                onChange={handleChange}
                placeholder="e.g. 55"
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
                min="0"
                max="14"
                required
                value={soilData.ph}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g. 6.5"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

          </div>

          {error && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{error}</p>}
          <button type="submit" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-green-700/20 transition hover:bg-green-700 focus-visible:outline focus-visible:outline-4 focus-visible:outline-green-200">
            Check soil preview <span className="ml-2">→</span>
          </button>
          <p className="mt-4 text-xs leading-5 text-gray-500">This quick preview uses pH only. The nutrient readings are not included in the recommendation yet.</p>
        </form>

        <section className={`rounded-3xl border p-6 shadow-sm sm:p-7 ${result ? "border-green-200 bg-gradient-to-br from-green-100 to-white" : "border-green-100 bg-white"}`} aria-live="polite">
          {result ? (
            <>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-200 text-2xl">🌿</span>
              <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-green-700">Quick result</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900">{result.condition} soil</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-green-100">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500">pH reading</p>
                  <p className="mt-1 text-3xl font-extrabold text-green-700">{soilData.ph}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Crops to explore</p>
                  <p className="mt-1 font-bold leading-6 text-gray-900">{result.crops}</p>
                </div>
                <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{result.suggestion}</p>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-64 flex-col justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-100 text-2xl">🧭</span>
              <h2 className="mt-5 text-xl font-extrabold text-gray-900">Your result will appear here</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">Add your pH and nutrient values, then run the quick check to see a simple soil category and crops to explore.</p>
            </div>
          )}
        </section>
        </div>

      </main>
    </div>
  );
}

export default SoilAnalysis;
