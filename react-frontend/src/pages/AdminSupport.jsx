import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { apiRequest, clearSession } from "../api";
import { useNavigate } from "react-router-dom";

const statusOptions = {
  OPEN: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
  IN_PROGRESS: ["IN_PROGRESS", "OPEN", "WAITING_FOR_USER", "RESOLVED", "CLOSED"],
  WAITING_FOR_USER: ["WAITING_FOR_USER", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
  RESOLVED: ["RESOLVED", "OPEN", "IN_PROGRESS", "CLOSED"],
  CLOSED: ["CLOSED", "OPEN"],
};
const categories = ["SOIL", "CROP_PLANNING", "LISTINGS", "BUYER_ENQUIRIES", "PURCHASE_REQUESTS", "ACCOUNT", "OTHER"];
const priorities = ["LOW", "NORMAL", "HIGH", "URGENT"];
const dateTime = (value) => value ? new Date(value).toLocaleString() : "—";
const pretty = (value) => (value || "").replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

function AdminSupport() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("agstya_user") || "{}");
  const [overview, setOverview] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ role: "", category: "", priority: "", status: "", sort: "newest" });
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadTickets = useCallback(async () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
    try {
      const [stats, rows] = await Promise.all([
        apiRequest("/support/tickets/overview"),
        apiRequest(`/support/tickets?${params.toString()}`),
      ]);
      setOverview(stats);
      setTickets(rows);
      setError("");
      setSelectedId((current) => current && rows.some((row) => row.id === current) ? current : rows[0]?.id || null);
    } catch (requestError) {
      setError(requestError.message);
      if (requestError.status === 401 || requestError.status === 403) {
        clearSession();
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }, [filters, navigate, search]);

  const loadDetail = useCallback(async () => {
    if (!selectedId) { setDetail(null); return; }
    try {
      const data = await apiRequest(`/support/tickets/${selectedId}`);
      setDetail(data);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }, [selectedId]);

  useEffect(() => {
    const initial = window.setTimeout(loadTickets, 0);
    const timer = window.setInterval(loadTickets, 10000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [loadTickets]);

  useEffect(() => {
    const initial = window.setTimeout(loadDetail, 0);
    if (!selectedId) return () => window.clearTimeout(initial);
    const timer = window.setInterval(loadDetail, 5000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [loadDetail, selectedId]);

  const updateTicket = async (updates) => {
    if (!selectedId || saving) return;
    setSaving(true);
    setNotice("");
    setError("");
    try {
      await apiRequest(`/support/tickets/${selectedId}`, { method: "PATCH", body: updates });
      setNotice("Ticket updated.");
      await Promise.all([loadDetail(), loadTickets()]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const sendReply = async (event) => {
    event.preventDefault();
    if (!reply.trim() || !selectedId || saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await apiRequest(`/support/tickets/${selectedId}/messages`, { method: "POST", body: { body: reply.trim() } });
      setReply("");
      setNotice("Reply sent in this support conversation.");
      await Promise.all([loadDetail(), loadTickets()]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const metricCards = [
    ["All tickets", overview?.total ?? "—", "support-metric-green"],
    ["Open", overview?.open ?? "—", "support-metric-amber"],
    ["Awaiting admin", overview?.awaitingAdmin ?? "—", "support-metric-red"],
    ["In progress", overview?.inProgress ?? "—", "support-metric-blue"],
    ["Resolved", overview?.resolved ?? "—", "support-metric-green"],
  ];

  return (
    <AdminLayout title="Support Centre" subtitle="Review escalations, reply in the same thread, and manage resolution status.">
      <section className="admin-support-page">
        <div className="admin-support-metrics">
          {metricCards.map(([label, value, tint]) => <article className={`admin-support-metric ${tint}`} key={label}><span>{label}</span><strong>{value}</strong></article>)}
        </div>
        {error && <p className="support-error-notice" role="alert">{error}</p>}
        {notice && <p className="support-success-notice" role="status">{notice}</p>}

        <div className="admin-support-workspace">
          <aside className="admin-ticket-inbox">
            <div className="admin-inbox-title"><div><span className="support-eyebrow">ESCALATED REQUESTS</span><h2>Ticket inbox</h2></div><span className="admin-inbox-count">{tickets.length}</span></div>
            <label className="admin-filter-label">Search by ticket or user
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ticket ID, name, email…" />
            </label>
            <div className="admin-ticket-filters">
              <select aria-label="Filter by user role" value={filters.role} onChange={(event) => setFilters((value) => ({ ...value, role: event.target.value }))}><option value="">All roles</option><option value="FARMER">Farmer</option><option value="BUYER">Buyer</option></select>
              <select aria-label="Filter by category" value={filters.category} onChange={(event) => setFilters((value) => ({ ...value, category: event.target.value }))}><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{pretty(item)}</option>)}</select>
              <select aria-label="Filter by priority" value={filters.priority} onChange={(event) => setFilters((value) => ({ ...value, priority: event.target.value }))}><option value="">All priorities</option>{priorities.map((item) => <option key={item} value={item}>{pretty(item)}</option>)}</select>
              <select aria-label="Filter by status" value={filters.status} onChange={(event) => setFilters((value) => ({ ...value, status: event.target.value }))}><option value="">All statuses</option>{["OPEN", "IN_PROGRESS", "WAITING_FOR_USER", "RESOLVED", "CLOSED"].map((item) => <option key={item} value={item}>{pretty(item)}</option>)}</select>
              <select aria-label="Sort tickets" value={filters.sort} onChange={(event) => setFilters((value) => ({ ...value, sort: event.target.value }))}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="priority">Priority</option></select>
            </div>
            <div className="admin-ticket-list" aria-label="Support tickets">
              {loading ? <p className="support-muted">Loading tickets…</p> : tickets.length === 0 ? <div className="admin-ticket-empty"><span>✓</span><p>No tickets match these filters.</p></div> : tickets.map((ticket) => (
                <button key={ticket.id} type="button" onClick={() => setSelectedId(ticket.id)} className={`admin-ticket-row ${selectedId === ticket.id ? "is-selected" : ""}`}>
                  <div className="admin-ticket-row-top"><strong>{ticket.ticket_code}</strong><span className={`admin-priority priority-${ticket.priority.toLowerCase()}`}>{pretty(ticket.priority)}</span></div>
                  <b>{ticket.user_name} <small>· {pretty(ticket.owner_role)}</small></b>
                  <span className="admin-ticket-subject">{ticket.subject}</span>
                  <p>{ticket.latest_message || "No message"}</p>
                  <div className="admin-ticket-row-bottom"><span>{pretty(ticket.status)}</span><time>{dateTime(ticket.updated_at)}</time></div>
                  {Boolean(ticket.awaiting_admin) && <em>Reply needed</em>}
                </button>
              ))}
            </div>
          </aside>

          <section className="admin-ticket-detail" aria-label="Selected support ticket">
            {!selectedId ? <div className="admin-detail-empty"><span>💬</span><h2>Select a ticket</h2><p>Choose a support request from the inbox to review its conversation.</p></div> : !detail ? <div className="admin-detail-empty"><p>Loading ticket conversation…</p></div> : (
              <>
                <header className="admin-detail-header">
                  <div><span className="support-eyebrow">{detail.ticket.ticket_code} · {pretty(detail.ticket.category)}</span><h2>{detail.ticket.subject}</h2><p>From {detail.ticket.user_name} ({pretty(detail.ticket.owner_role)}) · {detail.ticket.user_email}{detail.ticket.user_phone ? ` · ${detail.ticket.user_phone}` : ""}</p></div>
                  <button type="button" className="admin-assign-button" onClick={() => updateTicket({ assignToMe: !(Number(detail.ticket.assigned_admin_id) === Number(currentUser.userId || currentUser.id)) })} disabled={saving}>
                    {Number(detail.ticket.assigned_admin_id) === Number(currentUser.userId || currentUser.id)
                      ? "Unassign me"
                      : detail.ticket.assigned_admin_id
                        ? `Take ownership · ${detail.ticket.assigned_admin_name || "Assigned"}`
                        : "Assign to me"}
                  </button>
                </header>
                <div className="admin-ticket-controls">
                  <label>Status<select value={detail.ticket.status} onChange={(event) => updateTicket({ status: event.target.value })} disabled={saving}>{(statusOptions[detail.ticket.status] || [detail.ticket.status]).map((item) => <option key={item} value={item}>{pretty(item)}</option>)}</select></label>
                  <label>Priority<select value={detail.ticket.priority} onChange={(event) => updateTicket({ priority: event.target.value })} disabled={saving}>{priorities.map((item) => <option key={item} value={item}>{pretty(item)}</option>)}</select></label>
                  <div><span>Created</span><strong>{dateTime(detail.ticket.created_at)}</strong></div>
                  <div><span>Updated</span><strong>{dateTime(detail.ticket.updated_at)}</strong></div>
                </div>
                <div className="admin-ticket-context">
                  <div><span>Escalation reason</span><p>{detail.ticket.escalation_reason}</p></div>
                  <div><span>{detail.ticket.summary_is_ai ? "AI-generated issue summary" : "Issue summary"}</span><p>{detail.ticket.summary || "No AI summary is available. Review the conversation below."}</p></div>
                </div>
                <div className="admin-ticket-messages" aria-live="polite">
                  {detail.messages.map((message) => <article key={message.id} className={`support-message message-${message.sender_type.toLowerCase()}`}><div className="support-message-label">{message.sender_type === "USER" ? detail.ticket.user_name : message.sender_type === "ADMIN" ? "Admin · AGSTYA Support" : "AI Support"}</div><p>{message.body}</p><time>{dateTime(message.created_at)}</time></article>)}
                  {detail.messages.length === 0 && <p className="support-muted">No messages were sent before escalation.</p>}
                </div>
                {detail.ticket.status !== "CLOSED" && <form className="admin-reply-form" onSubmit={sendReply}><label htmlFor="admin-support-reply">Reply in this conversation</label><textarea id="admin-support-reply" value={reply} onChange={(event) => setReply(event.target.value)} maxLength={4000} rows={3} placeholder="Write a helpful response…" required disabled={saving} /><button className="support-primary-button" type="submit" disabled={saving || !reply.trim()}>{saving ? "Sending…" : "Send reply"}</button></form>}
                <p className="support-poll-note">Ticket inbox and messages refresh automatically every few seconds.</p>
              </>
            )}
          </section>
        </div>
      </section>
    </AdminLayout>
  );
}

export default AdminSupport;
