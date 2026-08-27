const express = require("express");
const { products, uuid, saveProducts } = require("../data/db");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// GET /api/products?search=&category=&minPrice=&maxPrice=&sort=
router.get("/", (req, res) => {
  const { search, category, minPrice, maxPrice, sort } = req.query;
  let result = [...products];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  if (category && category !== "All") {
    result = result.filter((p) => p.category === category);
  }
  if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));

  if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
  if (sort === "rating") result.sort((a, b) => b.rating - a.rating);

  res.json({ products: result, categories: [...new Set(products.map((p) => p.category))] });
});

// GET /api/products/:id
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ product });
});

// POST /api/products  (admin - inventory control)
router.post("/", protect, adminOnly, (req, res) => {
  const { name, description, price, category, stock, image } = req.body;
  if (!name || price == null || !category) {
    return res.status(400).json({ message: "name, price and category are required" });
  }
  const newProduct = {
    id: uuid(),
    name,
    description: description || "",
    price: Number(price),
    category,
    stock: Number(stock) || 0,
    image: image || `https://picsum.photos/seed/${encodeURIComponent(name)}/500/500`,
    rating: 0,
  };
  products.push(newProduct);
  saveProducts();
  res.status(201).json({ product: newProduct });
});

// PUT /api/products/:id (admin - inventory control)
router.put("/:id", protect, adminOnly, (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const { name, description, price, category, stock, image } = req.body;
  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = Number(price);
  if (category !== undefined) product.category = category;
  if (stock !== undefined) product.stock = Number(stock);
  if (image !== undefined) product.image = image;

  saveProducts();
  res.json({ product });
});

// DELETE /api/products/:id (admin - inventory control)
router.delete("/:id", protect, adminOnly, (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  const [removed] = products.splice(index, 1);
  saveProducts();
  res.json({ message: "Product deleted", product: removed });
});

module.exports = router;
