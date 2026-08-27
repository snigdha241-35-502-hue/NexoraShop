require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/products.routes");
const orderRoutes = require("./routes/orders.routes");
const userRoutes = require("./routes/users.routes");
const ticketRoutes = require("./routes/tickets.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const app = express();

// ---------- Core middleware ----------
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

// ---------- Health check ----------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "NexoraShop API", time: new Date().toISOString() });
});

// ---------- Feature routers ----------
// E-commerce
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// CRM (admin-protected inside each router)
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/analytics", analyticsRoutes);

// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---------- Central error handler ----------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`NexoraShop API running on http://localhost:${PORT}`);
  console.log(`Seeded admin login -> admin@nexorashop.com / admin123`);
  console.log(`Seeded customer login -> jamie@example.com / customer123`);
});
