import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/users").then((res) => setCustomers(res.data.customers));
  }, []);

  function openProfile(customer) {
    setSelected(customer);
    api.get(`/users/${customer.id}`).then((res) => setSelectedOrders(res.data.orders));
  }

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Customer Profiles</h1>
      <input
        className="admin-search"
        placeholder="Search customers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="admin-two-col">
        <div className="panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} onClick={() => openProfile(c)} className="clickable-row">
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.orderCount}</td>
                  <td>${c.totalSpent.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>Purchase History</h3>
          {!selected ? (
            <p className="muted">Select a customer to view their profile.</p>
          ) : (
            <div>
              <h4>{selected.name}</h4>
              <p className="muted">{selected.email}</p>
              <p className="muted">
                Joined {new Date(selected.createdAt).toLocaleDateString()}
              </p>
              <hr />
              {selectedOrders.length === 0 ? (
                <p className="muted">No orders placed yet.</p>
              ) : (
                selectedOrders.map((o) => (
                  <div key={o.id} className="order-item">
                    <span>#{o.id.slice(0, 8)}</span>
                    <span>{o.status}</span>
                    <span>${o.total.toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
