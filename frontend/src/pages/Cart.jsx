import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, updateQty, removeFromCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleCheckout() {
    navigate(user ? "/checkout" : "/login?next=/checkout");
  }

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <h2>Your cart is empty</h2>
        <Link to="/" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {/* LIST OPERATIONS: mapping cart items to rows */}
          {items.map((item) => (
            <div className="cart-row" key={item.productId}>
              <img src={item.image} alt={item.name} />
              <div className="cart-row-info">
                <h4>{item.name}</h4>
                <span className="price">${item.price.toFixed(2)}</span>
              </div>
              <div className="qty-stepper">
                <button onClick={() => updateQty(item.productId, item.qty - 1)}>−</button>
                <input
                  type="number"
                  value={item.qty}
                  min="1"
                  max={item.stock}
                  onChange={(e) => updateQty(item.productId, Number(e.target.value))}
                />
                <button
                  onClick={() =>
                    updateQty(item.productId, Math.min(item.stock, item.qty + 1))
                  }
                >
                  +
                </button>
              </div>
              <span className="line-total">${(item.price * item.qty).toFixed(2)}</span>
              <button className="btn-icon" onClick={() => removeFromCart(item.productId)}>
                🗑️
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary btn-block" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
