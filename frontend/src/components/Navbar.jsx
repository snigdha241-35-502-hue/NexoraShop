import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  // EVENT handler: logs the user out then redirects home.
  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Nexora<span>Shop</span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Shop</Link>
          {user && <Link to="/orders">My Orders</Link>}
          {user && <Link to="/support">Support</Link>}
          {isAdmin && (
            <Link to="/admin" className="admin-link">
              CRM Dashboard
            </Link>
          )}
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="cart-icon">
            🛒 {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="hello">Hi, {user.name.split(" ")[0]}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="user-menu">
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
