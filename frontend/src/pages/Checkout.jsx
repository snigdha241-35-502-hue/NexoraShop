import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const initialAddress = {
  fullName: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  paymentMethod: "card",
};

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  // FORM CONTROL: a single controlled object holding every field
  const [form, setForm] = useState(initialAddress);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        shippingAddress: form,
      };
      const res = await api.post("/orders", payload);
      clearCart();
      navigate("/orders", { state: { justPlacedOrderId: res.data.order.id } });
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <h2>Nothing to check out</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Shipping Details</h3>
          <label>
            Full Name
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </label>
          <label>
            Address
            <input name="address" value={form.address} onChange={handleChange} required />
          </label>
          <div className="form-row">
            <label>
              City
              <input name="city" value={form.city} onChange={handleChange} required />
            </label>
            <label>
              Postal Code
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <label>
            Country
            <input name="country" value={form.country} onChange={handleChange} required />
          </label>

          <h3>Payment Method</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={form.paymentMethod === "card"}
                onChange={handleChange}
              />
              Credit / Debit Card
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={form.paymentMethod === "cod"}
                onChange={handleChange}
              />
              Cash on Delivery
            </label>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Placing order..." : `Place Order — $${total.toFixed(2)}`}
          </button>
        </form>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          {items.map((i) => (
            <div className="summary-row" key={i.productId}>
              <span>
                {i.name} × {i.qty}
              </span>
              <span>${(i.price * i.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
