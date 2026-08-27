import { useEffect, useState } from "react";
import api from "../../api/axios";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  function load() {
    api
      .get("/orders", { params: { status: filter } })
      .then((res) => setOrders(res.data.orders));
  }

  useEffect(load, [filter]);

  async function updateStatus(orderId, status) {
    await api.put(`/orders/${orderId}/status`, { status });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }

  return (
    <div>
      <h1>Order Management</h1>
      <select className="admin-search" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option>All</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Placed</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id.slice(0, 8)}</td>
                <td>{o.userName}</td>
                <td>{o.items.reduce((s, i) => s + i.qty, 0)} items</td>
                <td>${o.total.toFixed(2)}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="muted">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
