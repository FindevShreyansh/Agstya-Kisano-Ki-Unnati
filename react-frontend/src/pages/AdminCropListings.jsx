import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useAdminCollection } from "../data/adminData";

const listingStatuses = {
  Active: "bg-green-100 text-green-800",
  "Under Review": "bg-amber-100 text-amber-800",
  Removed: "bg-gray-100 text-gray-700",
};

function AdminCropListings() {
  const { records, updateRecord } = useAdminCollection("crops");
  const [cropFilter, setCropFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const crops = [...new Set(records.map((record) => record.crop))];
  const filteredRecords = cropFilter === "All" ? records : records.filter((record) => record.crop === cropFilter);
  const selectedRecord = records.find((record) => record.id === selectedId);

  return (
    <AdminLayout title="Crop Listing Management" subtitle="Review, approve, and remove farmer crop listings.">
      <div className="mb-5 max-w-xs">
        <label htmlFor="crop-filter" className="mb-2 block text-sm font-semibold text-emerald-50/85">Filter by crop</label>
        <select id="crop-filter" value={cropFilter} onChange={(event) => setCropFilter(event.target.value)} className="w-full rounded-xl border border-emerald-100/20 bg-[#194a36] px-4 py-3 font-semibold text-emerald-50 shadow-lg shadow-black/10 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50">
          <option value="All">All Crops</option>
          {crops.map((crop) => <option key={crop} value={crop}>{crop}</option>)}
        </select>
      </div>
      <div className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#194a36] to-[#153e2e] shadow-xl shadow-black/25 ring-1 ring-inset ring-emerald-100/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-[#0f3325] text-amber-100">
              <tr>
                {["Farmer", "Crop", "Quantity", "Expected Price", "Quality", "Location", "Harvest Date", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100/10">
              {filteredRecords.map((listing) => (
                <tr key={listing.id} className="text-emerald-50/75 transition-colors hover:bg-white/[0.06]">
                  <td className="px-4 py-4 font-bold text-[#fff9e8]">{listing.farmerName}</td>
                  <td className="px-4 py-4">{listing.crop}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{listing.quantity.toLocaleString()} kg</td>
                  <td className="px-4 py-4 whitespace-nowrap">₹{listing.expectedPrice}/kg</td>
                  <td className="px-4 py-4">{listing.quality}</td>
                  <td className="px-4 py-4">{listing.location}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{listing.harvestDate}</td>
                  <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${listingStatuses[listing.status]}`}>{listing.status}</span></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <button type="button" onClick={() => setSelectedId(selectedId === listing.id ? null : listing.id)} className="rounded-lg bg-emerald-50 px-2.5 py-1.5 font-semibold text-emerald-800 transition hover:bg-emerald-100">View</button>
                      <button type="button" onClick={() => updateRecord(listing.id, { status: "Active" })} disabled={listing.status === "Active" || listing.status === "Removed"} className="rounded-lg bg-emerald-50 px-2.5 py-1.5 font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:bg-[#ecebe2] disabled:text-slate-400">Approve</button>
                      <button type="button" onClick={() => updateRecord(listing.id, { status: "Removed" })} disabled={listing.status === "Removed"} className="rounded-lg bg-red-50 px-2.5 py-1.5 font-semibold text-red-700 transition hover:bg-red-100 disabled:bg-[#ecebe2] disabled:text-slate-400">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && <tr><td colSpan="9" className="px-4 py-10 text-center font-semibold text-emerald-100/60">No crop listings found.</td></tr>}
            </tbody>
          </table>
        </div>
        {selectedRecord && (
          <div className="m-4 rounded-xl bg-[#103626] p-4 text-sm font-medium text-emerald-50/75 ring-1 ring-inset ring-emerald-100/10">
            <p className="font-bold text-[#fff9e8]">Listing {selectedRecord.id} · {selectedRecord.crop}</p>
            <p className="mt-1">{selectedRecord.farmerName} listed {selectedRecord.quantity.toLocaleString()} kg at ₹{selectedRecord.expectedPrice}/kg ({selectedRecord.quality}), harvest {selectedRecord.harvestDate} in {selectedRecord.location}.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminCropListings;
