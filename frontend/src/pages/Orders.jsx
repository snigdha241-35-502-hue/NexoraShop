import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";

const STATUS_COLORS = {
  pending: "badge-neutral",
  processing: "badge-info",
  shipped: "badge-warning",
  delivered: "badge-success",
  cancelled: "badge-danger",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const justPlacedOrderId = location.state?.justPlacedOrderId;

  useEffect(() => {
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading orders...</div>;

  return (
    <div className="container">
      <h1>My Orders</h1>
      {justPlacedOrderId && (
        <div className="alert alert-success">
          🎉 Order placed successfully! Track its status below.
        </div>
      )}

      {orders.length === 0 ? (
        <div className="empty-state">You haven't placed any orders yet.</div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <strong>Order #{order.id.slice(0, 8)}</strong>
                  <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <div className="order-item" key={item.productId}>
                    <img src={item.image} alt={item.name} />
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-card-footer">
                <span>Ship to: {order.shippingAddress.address}, {order.shippingAddress.city}</span>
                <strong>Total: ${order.total.toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
