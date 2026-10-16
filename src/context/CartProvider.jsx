import React from "react";
import { useCart as useCartState } from "../hooks/useCart";
import { CartContext } from "./CartContextInstance";

/**
 * CartProvider Component
 * Requirements:
 * - c) Share cart information between ProductCard, ProductList, Cart, and Checkout
 * - d) Avoid passing cart data through multiple levels of components using Props
 */
export default function CartProvider({ children, onNotification }) {
  const cart = useCartState(onNotification);

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
}
