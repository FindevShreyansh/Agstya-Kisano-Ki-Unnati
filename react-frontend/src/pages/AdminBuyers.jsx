import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useAdminCollection } from "../data/adminData";

function AdminBuyers() {
  const { records, updateRecord } = useAdminCollection("buyers");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const filteredRecords = records.filter((buyer) =>
    `${buyer.businessName} ${buyer.location}`.toLowerCase().includes(search.toLowerCase())
  );
  const selectedRecord = records.find((buyer) => buyer.id === selectedId);

  return (
    <AdminLayout title="Buyer Management" subtitle="Search business profiles and manage buyer status.">
      <label className="mb-5 block max-w-xl">
        <span className="mb-2 block text-sm font-semibold text-emerald-50/85">Search business or location</span>
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search buyers..." className="w-full rounded-xl border border-emerald-100/20 bg-[#194a36] px-4 py-3 font-semibold text-emerald-50 shadow-lg shadow-black/10 placeholder:text-emerald-100/45 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50" />
      </label>
      <div className="overflow-hidden rounded-[22px] bg-gradient-to-br from-[#194a36] to-[#153e2e] shadow-xl shadow-black/25 ring-1 ring-inset ring-emerald-100/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#0f3325] text-amber-100">
              <tr>
                {["Business Name", "Business Type", "Location", "Main Requirement", "Monthly Requirement", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100/10">
              {filteredRecords.map((buyer) => (
                <tr key={buyer.id} className="text-emerald-50/75 transition-colors hover:bg-white/[0.06]">
                  <td className="px-4 py-4 font-bold text-[#fff9e8]">{buyer.businessName}</td>
                  <td className="px-4 py-4">{buyer.businessType}</td>
                  <td className="px-4 py-4">{buyer.location}</td>
                  <td className="px-4 py-4">{buyer.mainRequirement}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{buyer.monthlyRequirement}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${buyer.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>{buyer.status}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <button type="button" onClick={() => setSelectedId(selectedId === buyer.id ? null : buyer.id)} className="rounded-lg bg-emerald-50 px-2.5 py-1.5 font-semibold text-emerald-800 transition hover:bg-emerald-100">View</button>
                      <button type="button" onClick={() => updateRecord(buyer.id, { status: buyer.status === "Active" ? "Inactive" : "Active" })} className="rounded-lg bg-[#ecebe2] px-2.5 py-1.5 font-semibold text-slate-600 transition hover:bg-[#e1dfd2] hover:text-slate-800">
                        {buyer.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr><td colSpan="7" className="px-4 py-10 text-center font-semibold text-emerald-100/60">No buyers match this search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {selectedRecord && (
          <div className="m-4 rounded-xl bg-[#103626] p-4 text-sm font-medium text-emerald-50/75 ring-1 ring-inset ring-emerald-100/10">
            <p className="font-bold text-[#fff9e8]">{selectedRecord.businessName} · {selectedRecord.id}</p>
            <p className="mt-1">{selectedRecord.businessType} · {selectedRecord.monthlyRequirement} monthly · Requirement: {selectedRecord.mainRequirement} · {selectedRecord.location}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminBuyers;
