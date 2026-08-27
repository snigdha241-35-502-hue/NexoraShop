const express = require("express");
const { tickets, uuid, now } = require("../data/db");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// POST /api/tickets (customer opens a support ticket)
router.post("/", protect, (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ message: "Subject and message are required" });
  }
  const newTicket = {
    id: uuid(),
    userId: req.user.id,
    userName: req.user.name,
    userEmail: req.user.email,
    subject,
    message,
    status: "open",
    createdAt: now(),
    replies: [],
  };
  tickets.push(newTicket);
  res.status(201).json({ ticket: newTicket });
});

// GET /api/tickets/my (customer's own tickets)
router.get("/my", protect, (req, res) => {
  const myTickets = tickets
    .filter((t) => t.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ tickets: myTickets });
});

// GET /api/tickets (admin - support system inbox)
router.get("/", protect, adminOnly, (req, res) => {
  const { status } = req.query;
  let result = [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (status && status !== "All") result = result.filter((t) => t.status === status);
  res.json({ tickets: result });
});

// PUT /api/tickets/:id (admin - reply and/or update status)
router.put("/:id", protect, adminOnly, (req, res) => {
  const { status, reply } = req.body;
  const ticket = tickets.find((t) => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  if (reply) {
    ticket.replies.push({ from: "admin", message: reply, at: now() });
  }
  if (status) {
    ticket.status = status;
  }
  res.json({ ticket });
});

module.exports = router;
