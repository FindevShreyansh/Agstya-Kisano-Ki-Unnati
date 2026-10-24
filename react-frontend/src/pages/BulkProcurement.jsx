import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";

const initialForm = {
  cropName: "Tomato",
  variety: "",
  quantity: "",
  unit: "quintal",
  minimumQuality: "B",
  deliveryState: "Karnataka",
  deliveryDistrict: "",
  deliveryCity: "",
  deliveryDate: "",
  maxBudget: "",
  maxFarmers: 6,
  partialFulfillment: false,
};

function BulkProcurement() {
  const [form, setForm] = useState(initialForm);
  const [places, setPlaces] = useState([]);
  const [result, setResult] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiRequest("/bulk/places").then(setPlaces).catch(() => setPlaces([]));
  }, []);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const createPlan = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSelectedPlan(null);
    setLoading(true);
    try {
      setResult(await apiRequest("/bulk/requirements/plan", { method: "POST", body: form }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmPlan = async () => {
    if (!selectedPlan || !result) return;
    setError("");
    try {
      await apiRequest(`/bulk/requirements/${result.requirementId}/confirm`, {
        method: "POST",
        body: { planId: selectedPlan.id },
      });
      setMessage("Plan confirmed. Each farmer will review their own request before inventory is reserved.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF7]">
      <nav className="border-b border-green-100 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <img src="/agstya-logo.png" alt="AGSTYA Logo" className="h-[70px] w-auto" />
          <Link to="/buyer/dashboard" className="text-sm font-semibold text-green-700">← Back to Buyer Dashboard</Link>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <header className="mb-8">
          <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-800">📦 Bulk procurement</span>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Source from multiple farmers</h1>
          <p className="mt-2 text-gray-500">Create one business requirement and compare explainable sourcing plans.</p>
        </header>

        <form onSubmit={createPlan} className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["cropName", "Crop", "Tomato"],
              ["quantity", "Total quantity", "100"],
              ["deliveryState", "State", "Karnataka"],
              ["deliveryDistrict", "District", "Tumkur"],
              ["deliveryCity", "City", "Tumkur"],
              ["deliveryDate", "Delivery date", ""],
            ].map(([name, label, placeholder]) => (
              <label key={name} className="text-sm font-semibold text-gray-700">
                {label}
                <input name={name} value={form[name]} onChange={update} required={name !== "deliveryState"} type={name === "deliveryDate" ? "date" : name === "quantity" ? "number" : "text"} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100" />
              </label>
            ))}
            <label className="text-sm font-semibold text-gray-700">Unit<select name="unit" value={form.unit} onChange={update} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal"><option value="quintal">Quintal</option><option value="kg">Kilogram</option></select></label>
            <label className="text-sm font-semibold text-gray-700">Minimum quality<select name="minimumQuality" value={form.minimumQuality} onChange={update} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal"><option value="A">Grade A</option><option value="B">Grade B or better</option><option value="C">Any grade</option></select></label>
            <label className="text-sm font-semibold text-gray-700">Maximum farmers<input name="maxFarmers" value={form.maxFarmers} onChange={update} type="number" min="1" max="10" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" /></label>
            <label className="text-sm font-semibold text-gray-700">Maximum produce budget (₹)<input name="maxBudget" value={form.maxBudget} onChange={update} type="number" min="0" placeholder="Optional" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal" /></label>
          </div>
          <label className="mt-5 flex items-center gap-2 text-sm text-gray-600"><input name="partialFulfillment" type="checkbox" checked={form.partialFulfillment} onChange={update} /> Allow partial fulfillment if the full quantity is unavailable</label>
          <button disabled={loading} className="mt-6 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800 disabled:bg-green-300">{loading ? "Comparing supply…" : "Find sourcing plans"}</button>
        </form>

        {error && <p role="alert" className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {message && <p role="status" className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">{message}</p>}

        {result && (
          <section className="mt-8">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div><h2 className="text-2xl font-extrabold text-gray-900">Compare plans</h2><p className="text-sm text-gray-500">{result.quantityKg.toLocaleString()} kg requested · logistics is an estimate</p></div>
              <button type="button" onClick={confirmPlan} disabled={!selectedPlan} className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-green-950 disabled:bg-gray-200 disabled:text-gray-400">Confirm selected plan</button>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {result.plans.map((plan) => (
                <button type="button" key={plan.id} onClick={() => setSelectedPlan(plan)} className={`text-left rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 ${selectedPlan?.id === plan.id ? "border-green-600 ring-2 ring-green-100" : "border-green-100"}`}>
                  <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold text-gray-900">{plan.planType === "LOWEST_COST" ? "Lowest cost" : plan.planType === "FEWEST_FARMERS" ? "Fewest farmers" : "Balanced plan"}</h3><span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800">{plan.farmerCount} farmers</span></div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><p className="rounded-xl bg-gray-50 p-3"><span className="block text-xs text-gray-500">Produce</span><b>₹{plan.produceSubtotal.toLocaleString()}</b></p><p className="rounded-xl bg-gray-50 p-3"><span className="block text-xs text-gray-500">Logistics est.</span><b>₹{plan.logisticsEstimate.toLocaleString()}</b></p><p className="rounded-xl bg-green-50 p-3 col-span-2"><span className="block text-xs text-green-700">Estimated total</span><b className="text-green-800">₹{plan.totalCost.toLocaleString()}</b></p></div>
                  <div className="mt-4 space-y-2">{plan.allocations.map((allocation) => <div key={allocation.listingId} className="rounded-xl border border-gray-100 p-3 text-xs"><div className="flex justify-between font-bold text-gray-800"><span>{allocation.farmerName}</span><span>{allocation.quantityKg.toLocaleString()} kg</span></div><div className="mt-1 text-gray-500">₹{allocation.unitPrice}/kg · {allocation.distanceKm} km est. · Trust {allocation.trustBand} ({allocation.trustScore})</div></div>)}</div>
                </button>
              ))}
            </div>
          </section>
        )}
        {places.length > 0 && <p className="mt-6 text-xs text-gray-400">Place estimates currently use the platform place catalog. Delivery places supported: {places.length}.</p>}
      </main>
    </div>
  );
}

export default BulkProcurement;
