import { useEffect, useState } from "react";
import api from "../../api/axios";

const STATUSES = ["open", "in-progress", "resolved"];

export default function SupportAdmin() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("All");
  const [replyDrafts, setReplyDrafts] = useState({});

  function load() {
    api.get("/tickets", { params: { status: filter } }).then((res) => setTickets(res.data.tickets));
  }

  useEffect(load, [filter]);

  async function updateStatus(id, status) {
    await api.put(`/tickets/${id}`, { status });
    load();
  }

  async function sendReply(id) {
    const reply = replyDrafts[id];
    if (!reply) return;
    await api.put(`/tickets/${id}`, { reply, status: "in-progress" });
    setReplyDrafts((prev) => ({ ...prev, [id]: "" }));
    load();
  }

  return (
    <div>
      <h1>Support Tickets</h1>
      <select className="admin-search" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option>All</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="ticket-list">
        {tickets.length === 0 && <p className="muted">No tickets found.</p>}
        {tickets.map((t) => (
          <div className="panel ticket-admin-card" key={t.id}>
            <div className="ticket-mini-header">
              <div>
                <strong>{t.subject}</strong>
                <p className="muted">
                  {t.userName} ({t.userEmail}) · {new Date(t.createdAt).toLocaleString()}
                </p>
              </div>
              <select value={t.status} onChange={(e) => updateStatus(t.id, e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <p>{t.message}</p>
            {t.replies.map((r, i) => (
              <div key={i} className="ticket-reply">
                <strong>Support:</strong> {r.message}
              </div>
            ))}
            <div className="reply-row">
              <input
                placeholder="Type a reply..."
                value={replyDrafts[t.id] || ""}
                onChange={(e) =>
                  setReplyDrafts((prev) => ({ ...prev, [t.id]: e.target.value }))
                }
              />
              <button className="btn btn-primary btn-sm" onClick={() => sendReply(t.id)}>
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
