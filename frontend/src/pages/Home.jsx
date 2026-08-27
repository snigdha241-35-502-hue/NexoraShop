import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  // ---- STATE: catalog data + controlled form fields for search/filter ----
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");

  // Re-fetch whenever a filter changes (debounced for the free-text search).
  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      if (sort) params.sort = sort;

      api
        .get("/products", { params })
        .then((res) => {
          setProducts(res.data.products);
          setCategories(["All", ...res.data.categories]);
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(handle);
  }, [search, category, sort]);

  return (
    <div className="container">
      <section className="hero">
        <h1>Shop everything you need at NexoraShop</h1>
        <p>Quality products, fast delivery, and a support team that actually cares.</p>
      </section>

      {/* FORM CONTROL: controlled search/filter inputs driving the catalog */}
      <form className="filter-bar" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-search"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </form>

      {loading ? (
        <div className="page-loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products match your filters.</div>
      ) : (
        // LIST OPERATIONS: rendering a dynamic collection of ProductCard components
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
