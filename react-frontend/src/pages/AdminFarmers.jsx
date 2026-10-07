import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useAdminCollection } from "../data/adminData";

function AdminFarmers() {
  const { records, updateRecord } = useAdminCollection("farmers");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const filteredRecords = records.filter((farmer) =>
    `${farmer.name} ${farmer.location}`.toLowerCase().includes(search.toLowerCase())
  );
  const selectedRecord = records.find((farmer) => farmer.id === selectedId);

  return (
    <AdminLayout title="Farmer Management" subtitle="Search farmer profiles and manage account status.">
      <label className="mb-5 block max-w-xl">
        <span className="mb-2 block text-sm font-semibold text-emerald-50/85">Search name or location</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search farmers..."
          className="w-full rounded-xl border border-emerald-100/20 bg-[#194a36] px-4 py-3 font-semibold text-emerald-50 shadow-lg shadow-black/10 placeholder:text-emerald-100/45 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
        />
      </label>
      <div className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#194a36] to-[#153e2e] shadow-xl shadow-black/25 ring-1 ring-inset ring-emerald-100/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#0f3325] text-amber-100">
              <tr>
                {["Farmer Name", "Mobile", "Location", "Main Crop", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100/10">
              {filteredRecords.map((farmer) => (
                <tr key={farmer.id} className="text-emerald-50/75 transition-colors hover:bg-white/[0.06]">
                  <td className="px-4 py-4 font-bold text-[#fff9e8]">{farmer.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{farmer.mobile}</td>
                  <td className="px-4 py-4">{farmer.location}</td>
                  <td className="px-4 py-4">{farmer.mainCrop}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${farmer.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                      {farmer.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <button type="button" onClick={() => setSelectedId(selectedId === farmer.id ? null : farmer.id)}                       className="rounded-lg bg-emerald-50 px-2.5 py-1.5 font-semibold text-emerald-800 transition hover:bg-emerald-100">View</button>
                      <button
                        type="button"
                        onClick={() => updateRecord(farmer.id, { status: farmer.status === "Active" ? "Inactive" : "Active" })}
                        className="font-semibold text-gray-700 hover:underline"
                      >
                        {farmer.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-10 text-center font-semibold text-emerald-100/60">No farmers match this search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {selectedRecord && (
          <div className="m-4 rounded-xl bg-[#103626] p-4 text-sm font-medium text-emerald-50/75 ring-1 ring-inset ring-emerald-100/10">
            <p className="font-bold text-[#fff9e8]">{selectedRecord.name} · {selectedRecord.id}</p>
            <p className="mt-1">Mobile: {selectedRecord.mobile} · Main crop: {selectedRecord.mainCrop} · Location: {selectedRecord.location}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminFarmers;
