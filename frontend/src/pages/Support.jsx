import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUS_COLORS = {
  open: "badge-warning",
  "in-progress": "badge-info",
  resolved: "badge-success",
};

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  function loadTickets() {
    api.get("/tickets/my").then((res) => setTickets(res.data.tickets));
  }

  useEffect(loadTickets, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/tickets", form);
      setForm({ subject: "", message: "" });
      setNotice("Ticket submitted! Our team will respond soon.");
      loadTickets();
      setTimeout(() => setNotice(""), 3000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <h1>Support Center</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Open a new ticket</h3>
          <label>
            Subject
            <input name="subject" value={form.subject} onChange={handleChange} required />
          </label>
          <label>
            Message
            <textarea name="message" rows="5" value={form.message} onChange={handleChange} required />
          </label>
          {notice && <p className="alert alert-success">{notice}</p>}
          <button className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Sending..." : "Submit Ticket"}
          </button>
        </form>

        <aside className="cart-summary">
          <h3>Your Tickets</h3>
          {tickets.length === 0 && <p className="muted">No tickets yet.</p>}
          {tickets.map((t) => (
            <div key={t.id} className="ticket-mini">
              <div className="ticket-mini-header">
                <strong>{t.subject}</strong>
                <span className={`badge ${STATUS_COLORS[t.status]}`}>{t.status}</span>
              </div>
              <p className="muted">{t.message}</p>
              {t.replies.map((r, i) => (
                <div key={i} className="ticket-reply">
                  <strong>Support:</strong> {r.message}
                </div>
              ))}
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
