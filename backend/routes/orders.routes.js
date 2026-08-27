const express = require("express");
const { orders, products, uuid, now } = require("../data/db");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

// POST /api/orders  (checkout flow)
router.post("/", protect, (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order must contain at least one item" });
  }
  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
    return res.status(400).json({ message: "Shipping address is required" });
  }

  // Validate stock & compute authoritative pricing from the catalog
  const orderItems = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(404).json({ message: `Product ${item.productId} not found` });
    }
    if (item.qty < 1 || item.qty > product.stock) {
      return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    }
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: item.qty,
      image: product.image,
    });
  }

  // Decrement stock (inventory control impact)
  orderItems.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    product.stock -= item.qty;
  });

  const total = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const newOrder = {
    id: uuid(),
    userId: req.user.id,
    userName: req.user.name,
    items: orderItems,
    total: Number(total.toFixed(2)),
    status: "pending",
    shippingAddress,
    createdAt: now(),
  };
  orders.push(newOrder);

  res.status(201).json({ order: newOrder });
});

// GET /api/orders/my  (order history)
router.get("/my", protect, (req, res) => {
  const myOrders = orders
    .filter((o) => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ orders: myOrders });
});

// GET /api/orders  (admin - order management, all orders)
router.get("/", protect, adminOnly, (req, res) => {
  const { status } = req.query;
  let result = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (status && status !== "All") {
    result = result.filter((o) => o.status === status);
  }
  res.json({ orders: result });
});

// PUT /api/orders/:id/status (admin - update fulfillment status)
router.put("/:id/status", protect, adminOnly, (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
  }
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;
  res.json({ order });
});

module.exports = router;
