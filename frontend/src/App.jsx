import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ProtectedRoute, AdminRoute } from "./components/RouteGuards";

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Support from "./pages/Support";

import AdminLayout from "./pages/admin/AdminLayout";
import Analytics from "./pages/admin/Analytics";
import Customers from "./pages/admin/Customers";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import Inventory from "./pages/admin/Inventory";
import SupportAdmin from "./pages/admin/SupportAdmin";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* ---------- E-commerce ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          }
        />

        {/* ---------- CRM (admin only) ---------- */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Analytics />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="support" element={<SupportAdmin />} />
        </Route>

        <Route path="*" element={<div className="container">Page not found.</div>} />
      </Routes>
    </>
  );
}
