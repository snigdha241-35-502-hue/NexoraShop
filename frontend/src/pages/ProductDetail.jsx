import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const fallbackImage = (name = "Product") =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="700" height="700"><rect width="700" height="700" fill="#f3f4f6"/><text x="350" y="350" text-anchor="middle" font-family="Arial" font-size="38" fill="#6b7280">${name.slice(0,24)}</text></svg>`)}`;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data.product));
  }, [id]);

  if (!product) return <div className="page-loading">Loading...</div>;

  function handleAddToCart() {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="container product-detail">
      <button className="btn btn-ghost" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="product-detail-grid">
        <img src={product.image || fallbackImage(product.name)} alt={product.name} className="product-detail-img" onError={(e) => { e.currentTarget.src = fallbackImage(product.name); }} />
        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="product-rating">★ {product.rating} rating</div>
          <p className="product-detail-desc">{product.description}</p>
          <div className="price price-lg">${product.price.toFixed(2)}</div>
          <p className={`stock-note ${product.stock === 0 ? "out" : ""}`}>
            {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
          </p>

          <div className="qty-row">
            <label htmlFor="qty">Quantity</label>
            <input
              id="qty"
              type="number"
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) =>
                setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))
              }
            />
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
