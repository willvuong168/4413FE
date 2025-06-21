import { createContext, useState, useEffect } from "react";

// CartContext: Provides cart state and actions (add, remove, clear, update quantity)
export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to parse cart from localStorage", err);
      return [];
    }
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.vid === item.vid);
      if (exists) {
        return prev.map((i) =>
          i.vid === item.vid ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (vid) => {
    setCartItems((prev) => prev.filter((i) => i.vid !== vid));
  };

  const updateQuantity = (vid, quantity) => {
    if (quantity <= 0) {
      removeItem(vid);
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.vid === vid ? { ...i, quantity } : i))
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
