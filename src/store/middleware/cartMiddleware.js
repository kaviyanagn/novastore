import { recordMiddlewareLog } from "../slices/cartSlice";

const STORAGE_KEY = "redux_cart_items";

/**
 * Custom Redux Middleware to Monitor Cart Actions (Requirement e)
 * -------------------------------------------------------------
 * Intercepts all cart actions, logs details to console and store,
 * and automatically synchronizes cart state to browser storage (Requirement f).
 */
export const cartMonitorMiddleware = (storeAPI) => (next) => (action) => {
  // Let the action execute through the reducers first
  const result = next(action);

  // Monitor any action directed towards cart management
  if (typeof action.type === "string" && action.type.startsWith("cart/")) {
    const currentState = storeAPI.getState();
    const cartItems = currentState.cart?.items || [];

    // f) Persist cart items to browser storage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.warn("Middleware failed to persist cart to localStorage:", err);
    }

    // e) Intercept and generate human-readable action audit log
    if (action.type !== recordMiddlewareLog.type) {
      let description = `Action ${action.type}`;

      if (action.type === "cart/addToCart") {
        description = `Added "${action.payload?.name || "Item"}" to cart ($${action.payload?.price || 0})`;
      } else if (action.type === "cart/removeFromCart") {
        description = `Removed item #${action.payload} from cart`;
      } else if (action.type === "cart/updateQuantity") {
        description = `Updated item #${action.payload?.id} quantity to ${action.payload?.quantity}`;
      } else if (action.type === "cart/clearCart") {
        description = "Cleared all items from cart";
      }

      console.log(`[Redux Middleware Monitor] [${new Date().toLocaleTimeString()}]:`, {
        type: action.type,
        payload: action.payload,
        itemCount: currentState.cart?.itemCount,
        finalAmount: currentState.cart?.finalAmount,
      });

      // Dispatch non-recursive log action
      storeAPI.dispatch(
        recordMiddlewareLog({
          type: action.type,
          message: description,
        })
      );
    }
  }

  return result;
};
