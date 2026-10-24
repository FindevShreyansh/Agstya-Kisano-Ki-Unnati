import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest, clearSession } from "../api";
import { useNotifications } from "../hooks/useNotifications";
import { TranslationTree } from "../i18n/TranslationTree";

const statusStyles = {
  PENDING: "bg-amber-100 text-amber-800",
  ASSIGNED: "bg-sky-100 text-sky-800",
  SCHEDULED: "bg-indigo-100 text-indigo-800",
  SAMPLE_COLLECTED: "bg-violet-100 text-violet-800",
  LAB_PROCESSING: "bg-orange-100 text-orange-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
};

const parameters = [
  ["pH", "ph", ""],
  ["Nitrogen", "nitrogen", "mg/kg"],
  ["Phosphorus", "phosphorus", "mg/kg"],
  ["Potassium", "potassium", "mg/kg"],
  ["Organic carbon", "organic_carbon", "%"],
  ["Electrical conductivity", "electrical_conductivity", "dS/m"],
];

function formatDate(value) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function SoilAnalysis() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { unreadCount } = useNotifications("farmer");
  const user = JSON.parse(localStorage.getItem("agstya_user") || "{}");

  useEffect(() => {
    apiRequest("/dashboard/farmer")
      .then(setDashboard)
      .catch((requestError) => {
        setError(requestError.message || "Unable to load soil analysis information.");
        if (requestError.status === 401) navigate("/farmer/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const requests = dashboard?.soilRequests || [];
  const reports = dashboard?.soilReports || [];
  const reportFor = (requestId) => reports.find((item) => String(item.requestId) === String(requestId));

  const logout = () => {
    clearSession();
    navigate("/farmer/login");
  };

  return (
    <TranslationTree>
      <div className="farmer-page min-h-screen bg-[#F7FAF7]">
        <nav className="sticky top-0 z-20 border-b border-green-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <Link to="/farmer/dashboard" aria-label="AGSTYA farmer dashboard">
              <img src="/agstya-logo.png" alt="AGSTYA Logo" className="h-[70px] w-auto max-w-full object-contain" />
            </Link>
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
              <Link to="/farmer/notifications" className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-bold text-green-700 transition hover:bg-green-50">
                🔔 Notifications{unreadCount > 0 && <span className="ml-2 rounded-full bg-green-700 px-2 py-0.5 text-xs text-white">{unreadCount}</span>}
              </Link>
              <span className="text-sm font-medium text-gray-700">Hello, {dashboard?.farmer?.name || user.name || "Farmer"} 👨‍🌾</span>
              <button type="button" onClick={logout} className="min-h-11 rounded-xl px-4 text-sm font-bold text-red-700 transition hover:bg-red-50">Logout</button>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
          <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 px-6 py-8 text-white shadow-xl shadow-green-900/15 sm:px-9 sm:py-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full border-[34px] border-white/10" />
            <div className="relative flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <Link to="/farmer/dashboard" className="text-sm font-semibold text-green-50/90 hover:text-white">← Farmer dashboard</Link>
                <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-green-50">Farm health</p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Soil analysis</h1>
                <p className="mt-3 text-sm leading-6 text-green-50/90 sm:text-base">Follow your soil test progress and review verified lab results and crop recommendations when they are ready.</p>
              </div>
              <Link to="/farmer/book-expert" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-amber-300 px-5 py-3 text-sm font-extrabold text-green-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-200">Book a soil expert <span className="ml-2">→</span></Link>
            </div>
          </section>

          {error && <div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">{error}</div>}
          {loading && <div role="status" className="mb-6 rounded-2xl border border-green-100 bg-white px-5 py-4 text-sm text-gray-600">Loading your soil analysis…</div>}

          {!loading && !error && requests.length === 0 && (
            <section className="rounded-3xl border border-green-100 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-3xl">🧪</span>
              <h2 className="mt-5 text-xl font-extrabold text-gray-900">No soil test requests yet</h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600">Once a soil test is requested for one of your farms, its progress and report will appear here.</p>
              <Link to="/farmer/book-expert" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-green-700 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-green-800">Book a soil analysis expert</Link>
            </section>
          )}

          <div className="space-y-6">
            {requests.map((request) => {
              const entry = reportFor(request.id);
              const report = entry?.report;
              const recommendations = entry?.recommendations || [];
              const status = request.status || "PENDING";
              return (
                <article key={request.id} className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm">
                  <header className="flex flex-wrap items-start justify-between gap-4 border-b border-green-50 px-5 py-5 sm:px-7">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-green-700">Soil test request #{request.id}</p>
                      <h2 className="mt-1 text-lg font-extrabold text-gray-900">{request.farm_location || "Registered farm"}</h2>
                      <p className="mt-1 text-sm text-gray-500">{[request.district, request.state].filter(Boolean).join(", ") || "Farm location"} · Requested {formatDate(request.created_at)}</p>
                    </div>
                    <span className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold ${statusStyles[status] || "bg-gray-100 text-gray-700"}`}>{status.replaceAll("_", " ")}</span>
                  </header>
                  <div className="grid gap-6 px-5 py-5 sm:px-7 lg:grid-cols-[0.8fr_1.2fr]">
                    <div className="rounded-2xl bg-green-50/70 p-5">
                      <h3 className="font-extrabold text-gray-900">Request details</h3>
                      <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between gap-3"><dt className="text-gray-500">Preferred visit</dt><dd className="text-right font-semibold text-gray-800">{formatDate(request.preferred_date)}</dd></div>
                        {request.preferred_time && <div className="flex justify-between gap-3"><dt className="text-gray-500">Preferred time</dt><dd className="font-semibold text-gray-800">{request.preferred_time}</dd></div>}
                        {request.scheduled_at && <div className="flex justify-between gap-3"><dt className="text-gray-500">Scheduled visit</dt><dd className="text-right font-semibold text-gray-800">{formatDate(request.scheduled_at)}</dd></div>}
                      </dl>
                      {!report && <p className="mt-5 rounded-xl border border-white bg-white/80 px-4 py-3 text-sm leading-5 text-gray-600">Your report and crop recommendations will appear here after lab processing is complete.</p>}
                    </div>

                    {report && (
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div><h3 className="font-extrabold text-gray-900">Lab report</h3><p className="mt-1 text-xs text-gray-500">{report.sample_id ? `Sample ${report.sample_id} · ` : ""}{report.verified ? "Verified report" : "Report"}</p></div>
                          {report.soil_type && <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-bold text-lime-800">{report.soil_type}</span>}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {parameters.filter(([, key]) => report[key] !== null && report[key] !== undefined).map(([label, key, unit]) => (
                            <div key={key} className="rounded-2xl border border-green-100 p-3.5"><p className="text-xs font-semibold text-gray-500">{label}</p><p className="mt-1 text-lg font-extrabold text-green-800">{report[key]}{unit && <span className="ml-1 text-xs font-semibold text-gray-500">{unit}</span>}</p></div>
                          ))}
                        </div>
                        {recommendations.length > 0 && <div className="mt-5"><h4 className="text-sm font-extrabold text-gray-900">Crop recommendations</h4><div className="mt-3 flex flex-wrap gap-2">{recommendations.map((recommendation) => <span key={`${recommendation.crop_name}-${recommendation.suitability}`} className={`rounded-xl px-3 py-2 text-xs font-bold ${recommendation.suitability === "HIGH" ? "bg-emerald-100 text-emerald-800" : recommendation.suitability === "MEDIUM" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"}`}>{recommendation.crop_name} · {recommendation.suitability}</span>)}</div></div>}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      </div>
    </TranslationTree>
  );
}

export default SoilAnalysis;
