const express = require("express");
const { users, products, orders, tickets } = require("../data/db");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// GET /api/analytics (admin - key business metrics)
router.get("/", protect, adminOnly, (req, res) => {
  const totalSales = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const activeUsers = users.filter((u) => u.role === "customer").length;

  const lowStockProducts = products
    .filter((p) => p.stock <= 10)
    .map((p) => ({ id: p.id, name: p.name, stock: p.stock }));

  const openTickets = tickets.filter((t) => t.status !== "resolved").length;

  const ordersByStatus = ["pending", "processing", "shipped", "delivered", "cancelled"].map(
    (status) => ({ status, count: orders.filter((o) => o.status === status).length })
  );

  const salesByCategory = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      const category = product ? product.category : "Unknown";
      salesByCategory[category] = (salesByCategory[category] || 0) + item.price * item.qty;
    });
  });

  res.json({
    totalSales: Number(totalSales.toFixed(2)),
    totalOrders: orders.length,
    activeUsers,
    totalProducts: products.length,
    openTickets,
    lowStockProducts,
    ordersByStatus,
    salesByCategory,
  });
});

module.exports = router;
