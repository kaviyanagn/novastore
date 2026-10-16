import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import { cartMonitorMiddleware } from "./middleware/cartMiddleware";

/**
 * Global Redux Toolkit Store Configuration (Requirement a & e)
 * - products: Manages catalog, search/category filter, async thunk, and loading/error states
 * - cart: Manages cart items, recalculation of subtotal/discount/delivery/finalAmount, action logs
 * - cartMonitorMiddleware: Custom middleware monitoring cart actions and persisting to localStorage
 */
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(cartMonitorMiddleware),
});

export default store;
