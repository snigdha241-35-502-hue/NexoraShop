const express = require("express");
const { users, orders } = require("../data/db");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

function publicUser(user) {
  const { password, ...rest } = user;
  return rest;
}

// GET /api/users (admin - customer profile list)
router.get("/", protect, adminOnly, (req, res) => {
  const customers = users
    .filter((u) => u.role === "customer")
    .map((u) => {
      const userOrders = orders.filter((o) => o.userId === u.id);
      const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
      return {
        ...publicUser(u),
        orderCount: userOrders.length,
        totalSpent: Number(totalSpent.toFixed(2)),
      };
    });
  res.json({ customers });
});

// GET /api/users/:id (admin - single customer profile + purchase history)
router.get("/:id", protect, adminOnly, (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "Customer not found" });

  const userOrders = orders
    .filter((o) => o.userId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ customer: publicUser(user), orders: userOrders });
});

module.exports = router;
