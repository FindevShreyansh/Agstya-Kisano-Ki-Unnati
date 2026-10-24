import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useAdminCollection } from "../data/adminData";
import { TranslationTree } from "../i18n/TranslationTree";
import { apiRequest } from "../api";

const procurementStatuses = [
  "Pending",
  "Accepted",
  "Pickup Scheduled",
  "In Transit",
  "Delivered",
  "Rejected",
];

const procurementStatusStyles = {
  Pending: "bg-amber-100 text-amber-800",
  Accepted: "bg-green-100 text-green-800",
  "Pickup Scheduled": "bg-blue-100 text-blue-800",
  "In Transit": "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

function AdminProcurement() {
  const { records, updateRecord } = useAdminCollection("procurement");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [disputeError, setDisputeError] = useState("");
  const filteredRecords = statusFilter === "All" ? records : records.filter((record) => record.status === statusFilter);
  const selectedRecord = records.find((record) => record.id === selectedId);

  const loadDisputes = () => apiRequest("/bulk/orders/disputes").then(setDisputes).catch((error) => setDisputeError(error.message));
  useEffect(() => { loadDisputes(); }, []);

  const resolveDispute = async (id, outcome) => {
    try {
      await apiRequest(`/bulk/orders/${id}/resolve`, { method: "PATCH", body: { outcome, notes: "Reviewed by platform administrator." } });
      loadDisputes();
    } catch (error) {
      setDisputeError(error.message);
    }
  };

  return (
    <TranslationTree><AdminLayout title="Procurement Monitoring" subtitle="Review procurement requests and update their progress.">
      {disputeError && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{disputeError}</p>}
      {disputes.length > 0 && (
        <section className="mb-6 rounded-[22px] bg-[#f8f6ed] p-5 shadow-xl shadow-black/20 ring-1 ring-inset ring-amber-200/20">
          <h2 className="text-lg font-bold text-[#19392a]">Open trust disputes</h2>
          <p className="mt-1 text-sm text-slate-500">Review the evidence before resolving a dispute.</p>
          <div className="mt-4 space-y-3">
            {disputes.map((dispute) => (
              <div key={dispute.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#e8eee2] p-4 text-sm">
                <div>
                  <p className="font-bold text-[#19392a]">Order #{dispute.id} · {dispute.crop_name}</p>
                  <p className="text-slate-600">{dispute.farmer_name} → {dispute.buyer_name} · {Number(dispute.quantity_kg).toLocaleString()} kg</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => resolveDispute(dispute.id, "BUYER_FAVOR")} className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-800">Buyer favour</button>
                  <button type="button" onClick={() => resolveDispute(dispute.id, "FARMER_FAVOR")} className="rounded-lg bg-green-100 px-3 py-2 text-xs font-bold text-green-800">Farmer favour</button>
                  <button type="button" onClick={() => resolveDispute(dispute.id, "DISMISSED")} className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-bold text-gray-700">Dismiss</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="mb-5 max-w-xs">
        <label htmlFor="procurement-filter" className="mb-2 block text-sm font-semibold text-emerald-50/85">Filter by status</label>
        <select id="procurement-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-xl border border-emerald-100/20 bg-[#f8f6ed] px-4 py-3 text-[#19392a] shadow-lg shadow-black/10 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50">
          <option value="All">All Statuses</option>
          {procurementStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>
      <div className="overflow-hidden rounded-[22px] bg-[#f8f6ed] shadow-xl shadow-black/20 ring-1 ring-inset ring-amber-200/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-gradient-to-r from-[#173e2e] to-[#24583e] text-emerald-50/90">
              <tr>
                {["Farmer", "Buyer", "Crop", "Quantity", "Expected Price", "Location", "Date", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e6d9]">
              {filteredRecords.map((request) => (
                <tr key={request.id} className="text-slate-600 transition-colors hover:bg-[#efeee3]">
                  <td className="px-4 py-4 font-semibold text-[#19392a]">{request.farmer}</td>
                  <td className="px-4 py-4">{request.buyer}</td>
                  <td className="px-4 py-4">{request.crop}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{request.quantity.toLocaleString()} kg</td>
                  <td className="px-4 py-4 whitespace-nowrap">₹{request.expectedPrice}/kg</td>
                  <td className="px-4 py-4">{request.location}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{request.date}</td>
                  <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${procurementStatusStyles[request.status]}`}>{request.status}</span></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <button type="button" onClick={() => setSelectedId(selectedId === request.id ? null : request.id)} className="rounded-lg bg-emerald-50 px-2.5 py-1.5 font-semibold text-emerald-800 transition hover:bg-emerald-100">View Details</button>
                      <select
                        aria-label={`Update status for ${request.id}`}
                        value={request.status}
                        onChange={(event) => updateRecord(request.id, { status: event.target.value })}
                        className="rounded-lg border border-[#d9dece] bg-[#f8f6ed] px-2 py-1.5 text-xs text-[#19392a] focus:border-emerald-500 focus:outline-none"
                      >
                        {procurementStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && <tr><td colSpan="9" className="px-4 py-10 text-center text-slate-500">No procurement requests match this status.</td></tr>}
            </tbody>
          </table>
        </div>
        {selectedRecord && (
          <div className="m-4 rounded-xl bg-[#e8eee2] p-4 text-sm text-slate-600 ring-1 ring-inset ring-emerald-900/10">
            <p className="font-bold text-[#19392a]">Request {selectedRecord.id}</p>
            <p className="mt-1">{selectedRecord.farmer} → {selectedRecord.buyer} · {selectedRecord.quantity.toLocaleString()} kg {selectedRecord.crop} at ₹{selectedRecord.expectedPrice}/kg</p>
            <p className="mt-1">Location: {selectedRecord.location} · Date: {selectedRecord.date} · Status: {selectedRecord.status}</p>
          </div>
        )}
      </div>
    </AdminLayout></TranslationTree>
  );
}

export default AdminProcurement;
