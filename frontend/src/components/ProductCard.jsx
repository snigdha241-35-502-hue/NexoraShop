import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const fallbackImage = (name = "Product") =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="700" height="700"><rect width="700" height="700" fill="#f3f4f6"/><text x="350" y="350" text-anchor="middle" font-family="Arial" font-size="38" fill="#6b7280">${name.slice(0,24)}</text></svg>`)}`;

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  // EVENT handler: adds this product to the cart without navigating away.
  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-img">
        <img src={product.image || fallbackImage(product.name)} alt={product.name} loading="lazy" onError={(e) => { e.currentTarget.src = fallbackImage(product.name); }} />
        {product.stock <= 10 && product.stock > 0 && (
          <span className="badge badge-warning">Low stock</span>
        )}
        {product.stock === 0 && <span className="badge badge-danger">Out of stock</span>}
      </div>
      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <div className="product-rating">★ {product.rating}</div>
        <div className="product-card-footer">
          <span className="price">${product.price.toFixed(2)}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
