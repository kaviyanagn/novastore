import { createContext, useContext } from "react";

export const CartContext = createContext(null);

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext / useCart must be used within a <CartProvider>");
  }
  return context;
}

export const useCart = useCartContext;
