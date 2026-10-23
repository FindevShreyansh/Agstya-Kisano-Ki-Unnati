import { Link } from "react-router-dom";
import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useAdminCollection } from "../data/adminData";
import { getSoilBookings, saveSoilBookings } from "../data/soilBookings";

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
  const [soilBookings, setSoilBookings] = useState(getSoilBookings);
  const [bookingActionMessage, setBookingActionMessage] = useState("");
  const [bookingActionError, setBookingActionError] = useState("");
  const [bookingView, setBookingView] = useState("Pending");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingPage, setBookingPage] = useState(1);
  const bookingsPerPage = 8;

  const bookingCounts = {
    Pending: soilBookings.filter((booking) => booking.status === "Pending").length,
    Accepted: soilBookings.filter((booking) => booking.status === "Accepted").length,
    Rejected: soilBookings.filter((booking) => booking.status === "Rejected").length,
    All: soilBookings.length,
  };
  const filteredBookings = soilBookings
    .filter((booking) => {
      const matchesView = bookingView === "All" || booking.status === bookingView;
      const searchText = `${booking.farmerName || ""} ${booking.mobileNumber || ""} ${booking.landAddress || ""}`.toLowerCase();
      return matchesView && searchText.includes(bookingSearch.trim().toLowerCase());
    })
    .sort((first, second) => (Date.parse(second.submittedAt) || 0) - (Date.parse(first.submittedAt) || 0));
  const bookingPageCount = Math.max(1, Math.ceil(filteredBookings.length / bookingsPerPage));
  const currentBookingPage = Math.min(bookingPage, bookingPageCount);
  const pageBookings = filteredBookings.slice(
    (currentBookingPage - 1) * bookingsPerPage,
    currentBookingPage * bookingsPerPage
  );

  const updateSoilBookingStatus = (bookingId, status) => {
    setBookingActionError("");
    setBookingActionMessage("");

    try {
      // Read the latest saved list before updating so rapid actions never write stale state.
      const savedBookings = getSoilBookings();
      const currentBookings = Array.isArray(savedBookings) ? savedBookings : soilBookings;
      const target = currentBookings.find((booking) => booking.id === bookingId);

      if (!target || target.status !== "Pending") return;

      const updatedBookings = currentBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status } : booking
      );
      saveSoilBookings(updatedBookings);
      setSoilBookings(updatedBookings);
      setBookingActionMessage(`${target.farmerName || "Farmer"}’s soil analysis request was ${status.toLowerCase()}.`);
      setBookingView("Pending");
      setBookingPage(1);
    } catch (error) {
      console.error("Unable to update soil analysis booking status.", error);
      setBookingActionError("The request status could not be saved. Please try again.");
    }
  };

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
      <section className="relative mb-7 overflow-hidden rounded-[2rem] bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 px-6 py-8 text-white shadow-xl shadow-green-900/15 sm:px-9 sm:py-10 lg:px-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-24 h-72 w-72 rounded-full border-[42px] border-amber-200/[0.07]" />
        <div aria-hidden="true" className="pointer-events-none absolute right-40 top-10 h-32 w-32 rounded-full border border-emerald-100/[0.12]" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200">
              <span className="h-px w-7 bg-amber-300/80" /> YOUR AGSTYA NETWORK
            </p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              Cultivating growth.<br className="hidden sm:block" /> Connecting opportunity.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-emerald-50/70">
              A clear view of the farmers, buyers, crops and procurement activity on the platform.
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
        <Link to="/admin/farmers" className="relative mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-amber-300 px-5 py-3 text-sm font-extrabold text-green-950 shadow-lg shadow-green-950/15 transition hover:-translate-y-0.5 hover:bg-amber-200">
          Manage the network <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <section aria-label="Key platform metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
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

      <section className="mt-7 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#1b4c36] to-[#173f2e] shadow-[0_12px_30px_rgba(3,19,12,0.26)] ring-1 ring-inset ring-emerald-100/[0.08]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100/10 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-200">Farmer services</p>
            <h2 className="mt-1 text-lg font-extrabold tracking-tight text-[#fff9e8]">Soil Analysis Bookings</h2>
          </div>
          <span className="rounded-full bg-emerald-300/10 px-3 py-1.5 text-[10px] font-bold text-emerald-100 ring-1 ring-inset ring-emerald-100/10">
            {bookingCounts.Pending} pending
          </span>
        </div>

        {bookingActionMessage && (
          <p className="mx-4 mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800 sm:mx-5" role="status" aria-live="polite">
            {bookingActionMessage}
          </p>
        )}
        {bookingActionError && (
          <p className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 sm:mx-5" role="alert">
            {bookingActionError}
          </p>
        )}

        <div className="flex flex-col gap-4 px-4 pt-5 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" aria-label="Filter soil analysis bookings">
            {["Pending", "Accepted", "Rejected", "All"].map((view) => (
              <button
                key={view}
                type="button"
                aria-pressed={bookingView === view}
                onClick={() => {
                  setBookingView(view);
                  setBookingPage(1);
                  setBookingActionMessage("");
                }}
                className={`min-h-10 rounded-full px-4 py-2 text-xs font-extrabold transition ${
                  bookingView === view
                    ? "bg-green-700 text-white shadow-sm"
                    : "border border-green-100 bg-white text-green-800 hover:bg-green-50"
                }`}
              >
                {view === "All" ? "All requests" : view}
                <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${bookingView === view ? "bg-white/20" : "bg-green-50"}`}>
                  {bookingCounts[view]}
                </span>
              </button>
            ))}
          </div>
          <label className="block w-full lg:max-w-sm">
            <span className="sr-only">Search bookings</span>
            <input
              type="search"
              value={bookingSearch}
              onChange={(event) => {
                setBookingSearch(event.target.value);
                setBookingPage(1);
              }}
              placeholder="Search farmer, phone, or address"
              className="min-h-11 w-full rounded-xl border border-green-100 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
            />
          </label>
        </div>

        {soilBookings.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-600 sm:px-6">
            No soil analysis bookings have been submitted yet.
          </p>
        ) : filteredBookings.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-600 sm:px-6" role="status">
            {bookingSearch ? "No bookings match your search in this view." : `There are no ${bookingView.toLowerCase()} bookings.`}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 lg:grid-cols-2">
            {pageBookings.map((booking) => (
              <article key={booking.id} className="rounded-2xl border border-emerald-100/10 bg-white/[0.05] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="text-base font-bold text-[#fff9e8]">{booking.farmerName}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    booking.status === "Accepted"
                      ? "bg-emerald-300/15 text-emerald-200"
                      : booking.status === "Rejected"
                        ? "bg-red-300/15 text-red-200"
                        : "bg-amber-300/15 text-amber-200"
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-1 gap-x-5 gap-y-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-emerald-100/55">Mobile number</dt>
                    <dd className="mt-0.5 break-words font-medium text-emerald-50">{booking.mobileNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-emerald-100/55">Land size</dt>
                    <dd className="mt-0.5 font-medium text-emerald-50">{booking.landSizeAcres} acres</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-emerald-100/55">Land address</dt>
                    <dd className="mt-0.5 break-words font-medium text-emerald-50">{booking.landAddress}</dd>
                  </div>
                  <div>
                    <dt className="text-emerald-100/55">Preferred visit date</dt>
                    <dd className="mt-0.5 font-medium text-emerald-50">{booking.preferredVisitDate}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-3 border-t border-emerald-100/10 pt-4">
                  <button
                    type="button"
                    onClick={() => updateSoilBookingStatus(booking.id, "Accepted")}
                    disabled={booking.status !== "Pending"}
                    aria-label={`Accept soil analysis request from ${booking.farmerName}`}
                    className="min-h-11 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-100 disabled:text-green-800 disabled:shadow-none"
                  >
                    {booking.status === "Accepted" ? "Accepted" : "Accept request"}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSoilBookingStatus(booking.id, "Rejected")}
                    disabled={booking.status !== "Pending"}
                    aria-label={`Reject soil analysis request from ${booking.farmerName}`}
                    className="min-h-11 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-extrabold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    {booking.status === "Rejected" ? "Rejected" : "Reject request"}
                  </button>
                </div>
              </article>
            ))}
            </div>
            <div className="flex flex-col gap-3 border-t border-green-100 px-5 py-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {(currentBookingPage - 1) * bookingsPerPage + 1}–{Math.min(currentBookingPage * bookingsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBookingPage((page) => Math.max(1, page - 1))}
                  disabled={currentBookingPage === 1}
                  className="min-h-10 rounded-lg border border-green-100 bg-white px-3 text-xs font-bold text-green-800 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Previous
                </button>
                <span className="min-w-16 text-center text-xs font-bold text-gray-600">{currentBookingPage} / {bookingPageCount}</span>
                <button
                  type="button"
                  onClick={() => setBookingPage((page) => Math.min(bookingPageCount, page + 1))}
                  disabled={currentBookingPage === bookingPageCount}
                  className="min-h-10 rounded-lg border border-green-100 bg-white px-3 text-xs font-bold text-green-800 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </AdminLayout>
  );
}

export default AdminDashboard;
