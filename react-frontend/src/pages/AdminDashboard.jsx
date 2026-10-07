import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useAdminCollection } from "../data/adminData";

const royalPointer = {
  cursor: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M5 3v22l6-6 4 9 5-2-4-9h9L5 3z' fill='%23124b35' stroke='%23f3cc70' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E\") 5 3, pointer",
};

const activityItems = [
  { icon: "👨‍🌾", text: "New farmer Ramesh Kumar registered", date: "Oct 7, 2026 · 10:24 AM" },
  { icon: "📋", text: "Bangalore Rice Traders posted a Rice requirement", date: "Oct 7, 2026 · 9:50 AM" },
  { icon: "🌾", text: "Anita Devi listed a Rice crop", date: "Oct 6, 2026 · 4:15 PM" }, 
  { icon: "✅", text: "Procurement request PR-402 accepted", date: "Oct 6, 2026 · 2:40 PM" },
  { icon: "🚚", text: "Pickup scheduled for procurement PR-403", date: "Oct 5, 2026 · 11:10 AM" },
];

function AdminDashboard() {
  const { records: farmers } = useAdminCollection("farmers");
  const { records: buyers } = useAdminCollection("buyers");
  const { records: crops } = useAdminCollection("crops");
  const { records: procurement } = useAdminCollection("procurement");

  const stats = [
    { label: "Total Farmers", value: farmers.length, icon: "👨‍🌾", link: "/admin/farmers", accent: "from-emerald-700 to-emerald-500", soft: "bg-emerald-50 text-emerald-800" },
    { label: "Total Buyers", value: buyers.length, icon: "🏢", link: "/admin/buyers", accent: "from-sky-800 to-sky-500", soft: "bg-sky-50 text-sky-800" },
    { label: "Crop Listings", value: crops.length, icon: "🌾", link: "/admin/crops", accent: "from-amber-700 to-yellow-500", soft: "bg-amber-50 text-amber-800" },
    { label: "Procurement Requests", value: procurement.length, icon: "📦", link: "/admin/procurement", accent: "from-violet-800 to-violet-500", soft: "bg-violet-50 text-violet-800" },
  ];

  const overview = [
    { label: "Active Farmer Count", value: farmers.filter((farmer) => farmer.status === "Active").length },
    { label: "Active Buyer Count", value: buyers.filter((buyer) => buyer.status === "Active").length },
    { label: "Pending Requests", value: procurement.filter((request) => request.status === "Pending").length },
    { label: "Completed Procurements", value: procurement.filter((request) => request.status === "Delivered").length },
  ];

  return (
    <AdminLayout
      title="AGSTYA Admin Dashboard"
      subtitle="A clear view of the people, produce and partnerships powering our agricultural network."
    >
      <section className="relative mb-7 overflow-hidden rounded-[26px] bg-gradient-to-br from-[#133e2c] via-[#1b573c] to-[#246747] px-6 py-7 text-white shadow-xl shadow-[#173c2c]/15 sm:px-8 sm:py-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-24 h-72 w-72 rounded-full border-[42px] border-amber-200/[0.07]" />
        <div aria-hidden="true" className="pointer-events-none absolute right-40 top-10 h-32 w-32 rounded-full border border-emerald-100/[0.12]" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200">
              <span className="h-px w-7 bg-amber-300/80" /> The AGSTYA network
            </p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              Cultivating growth.<br className="hidden sm:block" /> Connecting opportunity.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-emerald-50/70">
              Your command view for a stronger, more connected agricultural marketplace.
            </p>
          </div>
          <div className="flex gap-6 sm:gap-8">
            <div>
              <p className="text-2xl font-bold tabular-nums">{(farmers.length + buyers.length).toLocaleString()}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-emerald-100/60">Community members</p>
            </div>
            <span className="my-1 w-px bg-white/15" />
            <div>
              <p className="text-2xl font-bold tabular-nums">{procurement.length.toLocaleString()}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-emerald-100/60">Market connections</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Key platform metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            style={royalPointer}
            className="group relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1c533b] to-[#17432f] p-5 shadow-[0_12px_30px_rgba(3,19,12,0.28)] ring-1 ring-inset ring-emerald-100/[0.09] transition duration-200 hover:-translate-y-1 hover:from-[#205d42] hover:to-[#194b35] hover:shadow-xl hover:shadow-black/30"
          >
            <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.accent}`} />
            <div className="flex items-center justify-between">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${stat.soft}`}>{stat.icon}</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">Live</span>
            </div>
            <p className="mt-5 text-3xl font-extrabold tracking-tight text-[#fff9e8]">{stat.value.toLocaleString()}</p>
            <p className="mt-1 text-sm font-bold text-emerald-50/80">{stat.label}</p>
            <p className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-emerald-200">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-300/15">↗</span>
              Current platform total
            </p>
          </Link>
        ))}
      </section>

      <section aria-label="Platform overview" className="mb-7 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#1b4c36] to-[#173f2e] shadow-[0_12px_30px_rgba(3,19,12,0.26)] ring-1 ring-inset ring-emerald-100/[0.08]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100/10 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-200">Network pulse</p>
            <h2 className="mt-1 text-lg font-extrabold tracking-tight text-[#fff9e8]">Platform Overview</h2>
          </div>
          <span className="rounded-full bg-emerald-300/10 px-3 py-1.5 text-[10px] font-bold text-emerald-100 ring-1 ring-inset ring-emerald-100/10">Live collection data</span>
        </div>
        <div className="grid grid-cols-2 divide-x divide-y divide-emerald-100/10 lg:grid-cols-4 lg:divide-y-0">
          {overview.map((item, index) => (
            <div key={item.label} className="px-5 py-5 sm:px-6">
              <p className="text-[11px] font-bold leading-snug text-emerald-50/70 sm:text-xs">{item.label}</p>
              <p className={`mt-2 text-2xl font-extrabold tracking-tight ${index === 2 ? "text-amber-200" : index === 3 ? "text-emerald-200" : "text-[#fff9e8]"}`}>{item.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#1b4c36] to-[#173f2e] shadow-[0_12px_30px_rgba(3,19,12,0.26)] ring-1 ring-inset ring-emerald-100/[0.08]">
        <div className="flex items-center justify-between gap-3 border-b border-emerald-100/10 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-200">Marketplace updates</p>
            <h2 className="mt-1 text-lg font-extrabold tracking-tight text-[#fff9e8]">Recent Activity</h2>
          </div>
          <span className="rounded-full bg-emerald-300/10 px-3 py-1.5 text-[10px] font-bold text-emerald-100 ring-1 ring-inset ring-emerald-100/10">{activityItems.length} updates</span>
        </div>
        <ol className="divide-y divide-emerald-100/10 px-5 sm:px-6">
          {activityItems.map((activity) => (
            <li key={activity.text} className="group flex items-center gap-3 py-4 transition-colors hover:bg-white/[0.04] sm:gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100/10 text-xl shadow-sm ring-1 ring-inset ring-emerald-100/10">
                {activity.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-emerald-50">{activity.text}</p>
                <time className="mt-1 block text-xs font-medium text-emerald-100/55">{activity.date}</time>
              </div>
              <span className="hidden h-2 w-2 rounded-full bg-emerald-500 sm:block" />
            </li>
          ))}
        </ol>
      </section>
    </AdminLayout>
  );
}

export default AdminDashboard;
