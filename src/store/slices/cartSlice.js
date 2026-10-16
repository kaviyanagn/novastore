import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "redux_cart_items";

// Helper to calculate cart totals (Requirement d)
export function calculateTotals(items) {
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  // 10% discount on orders exceeding $100
  const discount = subtotal > 100 ? Number((subtotal * 0.1).toFixed(2)) : 0;

  // Free delivery over $150, else $15 delivery fee; $0 if cart is empty
  const deliveryCharge = items.length === 0 ? 0 : subtotal > 150 ? 0 : 15;

  const finalAmount = Number(Math.max(0, subtotal - discount + deliveryCharge).toFixed(2));

  return {
    itemCount,
    subtotal: Number(subtotal.toFixed(2)),
    discount,
    deliveryCharge,
    finalAmount,
  };
}

// Load persisted cart from localStorage (Requirement f)
function loadPersistedCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to load persisted Redux cart:", err);
  }
  return [
    {
      id: 101,
      name: "Quantum Sound Pro Headphones",
      brand: "NovaAcoustics",
      category: "Audio",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      quantity: 1,
    },
  ];
}

const initialItems = loadPersistedCart();
const initialTotals = calculateTotals(initialItems);

const initialState = {
  items: initialItems,
  ...initialTotals,
  actionLogs: [
    {
      id: Date.now() - 1000,
      type: "cart/initStore",
      message: "Cart initialized with persisted storage",
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // b) addToCart()
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          id: product.id,
          name: product.name || product.title,
          brand: product.brand || "NovaStore",
          category: product.category || "General",
          price: Number(product.price) || 0,
          image: product.image || product.thumbnail || "",
          quantity: 1,
        });
      }

      const totals = calculateTotals(state.items);
      Object.assign(state, totals);
    },

    // b) removeFromCart()
    removeFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);

      const totals = calculateTotals(state.items);
      Object.assign(state, totals);
    },

    // b) updateQuantity()
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        const item = state.items.find((i) => i.id === id);
        if (item) {
          item.quantity = Math.max(1, quantity);
        }
      }

      const totals = calculateTotals(state.items);
      Object.assign(state, totals);
    },

    // b) clearCart()
    clearCart(state) {
      state.items = [];
      const totals = calculateTotals([]);
      Object.assign(state, totals);
    },

    // e) Append action log (invoked by cart monitor middleware)
    recordMiddlewareLog(state, action) {
      state.actionLogs.unshift({
        id: Date.now(),
        type: action.payload.type,
        message: action.payload.message,
        timestamp: new Date().toLocaleTimeString(),
      });
      if (state.actionLogs.length > 20) {
        state.actionLogs.pop();
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  recordMiddlewareLog,
} = cartSlice.actions;

export default cartSlice.reducer;
