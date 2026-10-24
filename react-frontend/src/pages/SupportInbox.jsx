import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest, clearSession } from "../api";

const categories = [
  ["SOIL", "Soil testing and reports"],
  ["CROP_PLANNING", "Crop recommendations and planning"],
  ["LISTINGS", "Crop listings"],
  ["BUYER_ENQUIRIES", "Buyer enquiries"],
  ["PURCHASE_REQUESTS", "Purchase requests"],
  ["ACCOUNT", "Account and platform"],
  ["OTHER", "Other"],
];

const dateTime = (value) => value ? new Date(value).toLocaleString() : "—";
const prettyStatus = (value) => value === "UNESCALATED" ? "Open conversation" : (value || "").replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

function SupportInbox({ role }) {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const basePath = role === "FARMER" ? "/farmer" : "/buyer";
  const [conversations, setConversations] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [category, setCategory] = useState("OTHER");
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const loadConversations = useCallback(async () => {
    try {
      const rows = await apiRequest("/support/conversations");
      setConversations(rows);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
      if (requestError.status === 401) navigate(`${basePath}/login`);
    } finally {
      setLoadingList(false);
    }
  }, [basePath, navigate]);

  const loadThread = useCallback(async () => {
    if (!conversationId) {
      setConversation(null);
      setMessages([]);
      return;
    }
    try {
      const data = await apiRequest(`/support/conversations/${conversationId}`);
      setConversation({ ...data.conversation, aiAvailable: data.aiAvailable });
      setMessages(data.messages);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
      if (requestError.status === 401) navigate(`${basePath}/login`);
    } finally {
      setLoadingThread(false);
    }
  }, [basePath, conversationId, navigate]);

  useEffect(() => {
    const initial = window.setTimeout(loadConversations, 0);
    const timer = window.setInterval(loadConversations, 12000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [loadConversations]);

  useEffect(() => {
    const initial = window.setTimeout(() => {
      setLoadingThread(Boolean(conversationId));
      loadThread();
    }, 0);
    if (!conversationId) return () => window.clearTimeout(initial);
    const timer = window.setInterval(loadThread, 5000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [conversationId, loadThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const createConversation = async (event) => {
    event.preventDefault();
    setCreating(true);
    setError("");
    try {
      const created = await apiRequest("/support/conversations", {
        method: "POST",
        body: { category },
      });
      setShowNew(false);
      await loadConversations();
      navigate(`${basePath}/support/${created.id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCreating(false);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !conversationId || sending) return;
    setSending(true);
    setNotice("");
    setError("");
    try {
      const clientMessageId = window.crypto?.randomUUID?.() || `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const result = await apiRequest(`/support/conversations/${conversationId}/messages`, {
        method: "POST",
        body: { body, clientMessageId },
      });
      setDraft("");
      setNotice(result.message || "Your message has been saved.");
      await Promise.all([loadThread(), loadConversations()]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSending(false);
    }
  };

  const escalate = async () => {
    if (!conversationId || escalating) return;
    setEscalating(true);
    setError("");
    try {
      const ticket = await apiRequest(`/support/conversations/${conversationId}/escalate`, {
        method: "POST",
        body: { reason: "The user requested human support." },
      });
      setNotice(`Sent to the support team as ${ticket.ticket_code}.`);
      await Promise.all([loadThread(), loadConversations()]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setEscalating(false);
    }
  };

  const logout = () => {
    clearSession();
    navigate(`${basePath}/login`);
  };

  return (
    <div className="support-page min-h-screen">
      <header className="support-topbar">
        <Link to={`${basePath}/dashboard`} className="support-back">← Dashboard</Link>
        <div><span className="support-eyebrow">AGSTYA HELP DESK</span><h1>{role === "FARMER" ? "Farmer Support" : "Buyer Support"}</h1></div>
        <button type="button" className="support-logout" onClick={logout}>Logout</button>
      </header>

      <main className="support-layout">
        <aside className="support-sidebar">
          <div className="support-sidebar-heading">
            <div><span className="support-eyebrow">YOUR HELP REQUESTS</span><h2>Conversations</h2></div>
            <button className="support-new-button" type="button" onClick={() => setShowNew((open) => !open)} aria-label="Start a new support conversation">＋ New</button>
          </div>
          {showNew && (
            <form className="support-new-form" onSubmit={createConversation}>
              <label>What do you need help with?
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <p className="support-form-hint">Your first message will automatically become the conversation name.</p>
              <button className="support-primary-button" disabled={creating}>{creating ? "Starting…" : "Start conversation"}</button>
            </form>
          )}
          {loadingList ? <p className="support-muted">Loading your conversations…</p> : conversations.length === 0 ? (
            <div className="support-list-empty"><span>🌱</span><p>No support requests yet.</p><small>Start a conversation when you need help.</small></div>
          ) : (
            <div className="support-conversation-list">
              {conversations.map((item) => (
                <Link key={item.id} to={`${basePath}/support/${item.id}`} className={`support-conversation-card ${String(item.id) === conversationId ? "is-selected" : ""}`}>
                  <div className="support-card-heading"><strong>{item.subject}</strong>{item.unread_admin_reply ? <i aria-label="Unread admin response" /> : null}</div>
                  <p>{item.latest_message || "No messages yet"}</p>
                  <div className="support-card-meta"><span>{item.ticket_code || "Support chat"}</span><span>{prettyStatus(item.ticket_status || item.state)}</span></div>
                </Link>
              ))}
            </div>
          )}
        </aside>

        <section className="support-chat-panel" aria-label="Support conversation">
          {!conversationId ? (
            <div className="support-chat-empty">
              <span className="support-empty-icon">💬</span>
              <h2>How can we help?</h2>
              <p>Start a support conversation to describe your question. Your messages are saved to your account.</p>
              <button className="support-primary-button" type="button" onClick={() => setShowNew(true)}>Start a conversation</button>
            </div>
          ) : loadingThread && !conversation ? <div className="support-chat-empty"><p>Loading conversation…</p></div> : conversation ? (
            <>
              <div className="support-thread-header">
                <div><span className="support-eyebrow">{categories.find(([value]) => value === conversation.category)?.[1] || "Support request"}</span><h2>{conversation.subject}</h2></div>
                <div className="support-thread-status">
                  {conversation.ticket_code && <strong>{conversation.ticket_code}</strong>}
                  <span className={`support-status-badge status-${(conversation.ticket_status || conversation.state).toLowerCase()}`}>{prettyStatus(conversation.ticket_status || conversation.state)}</span>
                </div>
              </div>
              {!conversation.aiAvailable && conversation.state === "UNESCALATED" && (
                <div className="support-ai-unavailable" role="status">
                  <span aria-hidden="true">ℹ</span><p><strong>AI assistant is not connected yet.</strong> Your messages will be saved. You can request a human admin at any time.</p>
                </div>
              )}
              {conversation.state === "ESCALATED" && (
                <div className="support-escalated-banner" role="status">
                  <strong>{conversation.ticket_code} was sent to the support team.</strong>
                  <span>Status: {prettyStatus(conversation.ticket_status)}. Continue here; your conversation history is attached.</span>
                </div>
              )}
              <div className="support-messages" aria-live="polite">
                {messages.length === 0 ? <p className="support-first-message">Tell us what happened and include any helpful details. Please avoid sending passwords or payment card information.</p> : messages.map((message) => (
                  <article key={message.id} className={`support-message message-${message.sender_type.toLowerCase()}`}>
                    <div className="support-message-label">{message.sender_type === "USER" ? "You" : message.sender_type === "ADMIN" ? "AGSTYA Support Team" : "AI Support"}</div>
                    <p>{message.body}</p>
                    <time dateTime={message.created_at}>{dateTime(message.created_at)}</time>
                  </article>
                ))}
                <div ref={bottomRef} />
              </div>
              {notice && <p className="support-success-notice" role="status">{notice}</p>}
              {error && <p className="support-error-notice" role="alert">{error}</p>}
              <form className="support-composer" onSubmit={sendMessage}>
                <label className="sr-only" htmlFor="support-message">Write a message</label>
                <textarea id="support-message" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={4000} placeholder="Write your message…" rows={2} required disabled={sending} />
                <button className="support-primary-button" type="submit" disabled={sending || !draft.trim()}>{sending ? "Saving…" : "Send message"}</button>
              </form>
              {conversation.state !== "ESCALATED" ? (
                <div className="support-escalate-row"><p>Need a person, or is this issue unresolved?</p><button type="button" className="support-secondary-button" onClick={escalate} disabled={escalating}>{escalating ? "Sending…" : "Escalate to Admin"}</button></div>
              ) : <p className="support-poll-note">This conversation refreshes automatically while the support team responds.</p>}
            </>
          ) : <div className="support-chat-empty"><h2>Conversation unavailable</h2><p>It may have been removed or you may not have access.</p></div>}
        </section>
      </main>
    </div>
  );
}

export default SupportInbox;
