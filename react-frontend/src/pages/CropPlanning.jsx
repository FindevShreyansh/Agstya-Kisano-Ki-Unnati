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
const [formError, setFormError] = useState("");

 const handleChange = (e) => {
    setCropData({
      ...cropData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateProfit = () => {
  const { crop, land, cost, production, price } = cropData;

  if (!crop || !land || cost === "" || !production || price === "") {
    setFormError("Complete each field before calculating your estimate.");
    return;
  }
  if (Number(land) <= 0 || Number(cost) < 0 || Number(production) <= 0 || Number(price) < 0) {
    setFormError("Land and production must be above zero. Cost and price cannot be negative.");
    return;
  }
  setFormError("");

  const revenue = Number(production) * Number(price);
  const profit = revenue - Number(cost);

  setProfitResult({
    crop,
    revenue,
    profit,
  });
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

        <header className="mb-8 rounded-[1.8rem] bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 p-6 text-white shadow-lg shadow-green-900/10 sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.15em] ring-1 ring-inset ring-white/20">🌾 Season planning</span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Plan your crop returns</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">Use your own estimates to compare expected revenue with your costs.</p>
        </header>

        {/* Form */}
        <div className="rounded-3xl border border-green-100 bg-white p-5 shadow-[0_12px_35px_rgba(24,70,42,0.08)] sm:p-8">

          <h3 className="mb-6 text-xl font-extrabold tracking-tight text-gray-900">
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
                <option value="">Select crop</option>
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
                  min="0.01"
                  step="any"
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
                min="0"
                step="any"
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
                    min="0.01"
                    step="any"
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
                 min="0"
                 step="any"
                 value={cropData.price}
                  onChange={handleChange}
                placeholder="₹ Price per quintal"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

          </div>

          {formError && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{formError}</p>}
          <button
            type="button"
            onClick={calculateProfit}
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-green-700/20 transition hover:bg-green-700"
          >
            Calculate estimate <span className="ml-2">→</span>
          </button>

          {profitResult && (
            <section className="mt-7 rounded-2xl border border-green-200 bg-gradient-to-br from-green-100 to-lime-50 p-5 sm:p-6" aria-live="polite">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-[0.15em] text-green-700">Your estimate</span>
                  <h3 className="mt-1 text-xl font-extrabold text-gray-900">{profitResult.crop} outlook</h3>
                </div>
                <span className="rounded-full bg-white px-3 py-1.5 text-sm font-bold text-gray-700 shadow-sm">{cropData.land} acres</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white/85 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Expected revenue</p>
                  <p className="mt-1 text-xl font-extrabold text-green-700">
                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(profitResult.revenue)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/85 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Estimated profit</p>
                  <p className={`mt-1 text-xl font-extrabold ${profitResult.profit >= 0 ? "text-green-700" : "text-red-700"}`}>
                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(profitResult.profit)}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-gray-600">Estimate based only on the figures you entered. Actual returns can vary.</p>
            </section>
          )}

        </div>

      </main>
    </div>
  );
}

export default CropPlanning;
