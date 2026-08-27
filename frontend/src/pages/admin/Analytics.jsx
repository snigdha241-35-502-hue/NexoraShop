import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics").then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="page-loading">Loading analytics...</div>;

  return (
    <div>
      <h1>Overview</h1>
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Total Sales</span>
          <span className="stat-value">${data.totalSales.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{data.totalOrders}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active Customers</span>
          <span className="stat-value">{data.activeUsers}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Products Listed</span>
          <span className="stat-value">{data.totalProducts}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Open Tickets</span>
          <span className="stat-value">{data.openTickets}</span>
        </div>
      </div>

      <div className="admin-two-col">
        <div className="panel">
          <h3>Orders by Status</h3>
          {data.ordersByStatus.map((s) => (
            <div className="bar-row" key={s.status}>
              <span className="bar-label">{s.status}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${data.totalOrders ? (s.count / data.totalOrders) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="bar-value">{s.count}</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>⚠️ Low Inventory Alerts</h3>
          {data.lowStockProducts.length === 0 ? (
            <p className="muted">All products are well stocked.</p>
          ) : (
            <ul className="alert-list">
              {data.lowStockProducts.map((p) => (
                <li key={p.id}>
                  <span>{p.name}</span>
                  <span className="badge badge-danger">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
