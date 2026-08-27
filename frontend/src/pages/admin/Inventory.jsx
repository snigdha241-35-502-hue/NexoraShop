import { useEffect, useState } from "react";
import api from "../../api/axios";

const emptyForm = { name: "", description: "", price: "", category: "", stock: "", image: "" };
const fallbackImage = (name = "Product") =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="700" viewBox="0 0 700 700">
      <rect width="700" height="700" fill="#f3f4f6"/>
      <text x="350" y="330" text-anchor="middle" font-family="Arial" font-size="38" fill="#6b7280">${name.slice(0,24)}</text>
      <text x="350" y="385" text-anchor="middle" font-family="Arial" font-size="22" fill="#9ca3af">NexoraShop</text>
    </svg>`
  )}`;

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await api.get("/products");
      setProducts(res.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load products.");
    }
  }

  useEffect(() => { load(); }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function startEdit(p) {
    setError("");
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price ?? "",
      category: p.category || "",
      stock: p.stock ?? "",
      image: p.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image || fallbackImage(form.name),
      };
      if (!payload.name.trim() || !payload.category.trim() || !Number.isFinite(payload.price)) {
        throw new Error("Name, category and valid price are required.");
      }

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      cancelEdit();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete product.");
    }
  }

  return (
    <div>
      <h1>Inventory Control</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-two-col">
        <div className="panel">
          <table className="admin-table">
            <thead>
              <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="inventory-product">
                      <img
                        src={p.image || fallbackImage(p.name)}
                        alt={p.name}
                        onError={(e) => { e.currentTarget.src = fallbackImage(p.name); }}
                      />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>${Number(p.price).toFixed(2)}</td>
                  <td className={p.stock <= 10 ? "low-stock-text" : ""}>{p.stock}</td>
                  <td className="row-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => startEdit(p)}>Edit</button>
                    <button className="btn btn-ghost btn-sm danger" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form className="panel checkout-form" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
          <label>Name<input name="name" value={form.name} onChange={handleChange} required /></label>
          <label>Description<textarea name="description" value={form.description} onChange={handleChange} /></label>
          <div className="form-row">
            <label>Price<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required /></label>
            <label>Stock<input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required /></label>
          </div>
          <label>Category<input name="category" value={form.category} onChange={handleChange} required /></label>

          <label>
            Product Image
            <input type="file" accept="image/*" onChange={handleImageFile} />
          </label>
          <label>
            Image URL
            <input name="image" value={form.image.startsWith("data:image") ? "" : form.image} onChange={handleChange} placeholder="https://... (optional)" />
          </label>

          {form.image && (
            <div className="image-preview">
              <img src={form.image} alt="Product preview" onError={(e) => { e.currentTarget.src = fallbackImage(form.name); }} />
              <span>Image preview</span>
            </div>
          )}

          <small className="form-help">Upload an image or paste an image URL. If empty, a visible fallback image is created automatically.</small>

          <div className="form-row">
            <button className="btn btn-primary btn-block" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId && <button type="button" className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
