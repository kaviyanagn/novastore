import { useState, useEffect, useMemo, useCallback } from "react";
import { INITIAL_PRODUCTS, PROMO_CODES } from "../data/products";
import { logClientAction } from "../utils/logger";

const CART_STORAGE_KEY = "novastore_cart";

/**
 * Custom Hook: useCart
 * Requirements:
 * - b) Manage adding, removing, updating quantities, and clearing products from the shopping cart.
 * - e) Use useMemo to calculate cart subtotal, discount, delivery charge, and final total.
 * - f) Use useCallback for cart operations: addToCart, removeFromCart, updateQuantity, clearCart.
 * - g) Use useEffect to synchronize cart information with browser storage (localStorage).
 */
export function useCart(onNotification) {
  // State for shopping cart items initialized from localStorage or URL test params
  const [cartItems, setCartItems] = useState(() => {
    try {
      if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("cart") === "open") {
        return [
          { product: INITIAL_PRODUCTS[0], quantity: 1 },
          { product: INITIAL_PRODUCTS[2], quantity: 2 },
        ];
      }
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
      return [];
    }
  });

  // Modal open/close state
  const [isCartOpen, setIsCartOpen] = useState(() => {
    return typeof window !== "undefined" && new URLSearchParams(window.location.search).get("cart") === "open";
  });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Promo coupon discount state
  const [couponCode, setCouponCode] = useState("SAVE20");
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    return typeof window !== "undefined" && new URLSearchParams(window.location.search).get("cart") === "open" ? "SAVE20" : null;
  });

  // Requirement g: Synchronize cart items to browser localStorage whenever cartItems change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to persist cart items to localStorage", e);
    }
  }, [cartItems]);

  // Requirement f: Use useCallback for addToCart()
  const addToCart = useCallback((product, quantity = 1) => {
    logClientAction(`Added item to cart: "${product.name}" (Qty: ${quantity}, Price: $${product.price})`, {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = Math.min(
          product.stockCount || 99,
          updated[existingIndex].quantity + quantity
        );
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        return [...prevItems, { product, quantity }];
      }
    });

    if (typeof onNotification === "function") {
      onNotification(`Added "${product.name}" to cart!`, "success");
    }
  }, [onNotification]);

  // Requirement f: Use useCallback for removeFromCart()
  const removeFromCart = useCallback((productId) => {
    logClientAction(`Removed item from cart (Product ID: ${productId})`, { productId });
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
    if (typeof onNotification === "function") {
      onNotification("Item removed from cart", "info");
    }
  }, [onNotification]);

  // Requirement f: Use useCallback for updateQuantity()
  const updateQuantity = useCallback((productId, delta) => {
    logClientAction(`Updated cart quantity for Product ID: ${productId} (Delta: ${delta > 0 ? `+${delta}` : delta})`, {
      productId,
      delta,
    });
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > (item.product.stockCount || 99)) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  }, []);

  // Requirement f: Use useCallback for clearCart()
  const clearCart = useCallback(() => {
    logClientAction("Cleared all items from cart");
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponCode("");
    if (typeof onNotification === "function") {
      onNotification("Shopping cart cleared", "info");
    }
  }, [onNotification]);

  // Coupon handling callbacks
  const applyCoupon = useCallback((codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) return;

    logClientAction(`Applying promo coupon: "${code}"`, { couponCode: code });

    if (PROMO_CODES[code]) {
      setAppliedCoupon(code);
      if (typeof onNotification === "function") {
        onNotification(`Coupon "${code}" applied successfully!`, "success");
      }
    } else {
      if (typeof onNotification === "function") {
        onNotification("Invalid coupon code. Try SAVE10, SAVE20 or WELCOME50", "warning");
      }
    }
  }, [couponCode, onNotification]);

  const removeCoupon = useCallback(() => {
    logClientAction("Removed promo coupon");
    setAppliedCoupon(null);
    setCouponCode("");
    if (typeof onNotification === "function") {
      onNotification("Coupon removed", "info");
    }
  }, [onNotification]);

  // Proceed from Cart to Checkout
  const proceedToCheckout = useCallback(() => {
    logClientAction("Proceeding to checkout");
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);

  // Requirement e: Use useMemo to calculate cart subtotal
  const cartSubtotal = useMemo(() => {
    return (cartItems || []).reduce((total, item) => {
      const price = item?.product?.price ?? item?.price ?? 0;
      const qty = item?.quantity ?? 1;
      return total + Number(price) * Number(qty);
    }, 0);
  }, [cartItems]);

  // Requirement e: Use useMemo to calculate cart discount
  const cartDiscount = useMemo(() => {
    if (!appliedCoupon || cartSubtotal === 0) return 0;
    const rule = PROMO_CODES[appliedCoupon];
    if (!rule) return 0;

    // Fractional percentage discount (e.g. 0.20 = 20%)
    if (rule < 1) {
      return cartSubtotal * rule;
    }
    // Flat dollar discount (e.g. $50 off orders over $150)
    if (cartSubtotal >= 150) {
      return Math.min(rule, cartSubtotal);
    }
    return 0;
  }, [cartSubtotal, appliedCoupon]);

  // Requirement e: Use useMemo to calculate delivery charge (Free over $50, else $9.99)
  const deliveryFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal >= 50 ? 0 : 9.99;
  }, [cartSubtotal]);

  // Requirement e: Use useMemo to calculate final total (total charges)
  const finalTotal = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return Math.max(0, cartSubtotal - cartDiscount + deliveryFee);
  }, [cartSubtotal, cartDiscount, deliveryFee]);

  // Total count of distinct units in cart using useMemo
  const cartItemCount = useMemo(() => {
    return (cartItems || []).reduce((total, item) => total + (Number(item?.quantity) || 1), 0);
  }, [cartItems]);

  return {
    cartItems,
    cartItemCount,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    deliveryCharges: deliveryFee, // alias for delivery charges
    finalTotal,
    totalPayable: finalTotal, // alias for backwards compatibility
    totalCharges: finalTotal, // alias for total charges
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    couponCode,
    setCouponCode,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    setIsCartOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    proceedToCheckout,
  };
}

export default useCart;
