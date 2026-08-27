import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // ---- STATE: cart items, initialized lazily from localStorage ----
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nexora_cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("nexora_cart", JSON.stringify(items));
  }, [items]);

  function addToCart(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, qty: Math.min(i.qty + qty, product.stock) }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          qty,
        },
      ];
    });
  }

  function updateQty(productId, qty) {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty } : i)).filter((i) => i.qty > 0)
    );
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  const value = { items, addToCart, updateQty, removeFromCart, clearCart, total, count };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
