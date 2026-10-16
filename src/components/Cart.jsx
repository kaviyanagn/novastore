import React, { useMemo } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { PROMO_CODES } from "../data/products";

/**
 * Cart Component (Golden Effect - Light & Dark Mode)
 * Slide-over drawer component
 * Requirement c & d: Consumes cart items, financial calculations (useMemo),
 * and cart actions (useCallback) directly from CartContext.
 * Requirement e: Calculates subtotal, discount, delivery fee, and total charges using useMemo.
 * Requirement h: Displays conditional message "Your cart is empty".
 */
export default function Cart({
  isOpen: propIsOpen,
  onClose: propOnClose,
  cartItems: propCartItems,
  onUpdateQuantity: propOnUpdateQuantity,
  onRemoveFromCart: propOnRemoveFromCart,
  onClearCart: propOnClearCart,
  onProceedToCheckout: propOnProceedToCheckout,
  subtotal: propSubtotal,
  discount: propDiscount,
  deliveryFee: propDeliveryFee,
  deliveryCharges: propDeliveryCharges,
  totalPayable: propTotalPayable,
  totalCharges: propTotalCharges,
  couponCode: propCouponCode,
  setCouponCode: propSetCouponCode,
  appliedCoupon: propAppliedCoupon,
  onApplyCoupon: propOnApplyCoupon,
  onRemoveCoupon: propOnRemoveCoupon,
  isDarkMode
}) {
  // Requirement c & d: Retrieve cart state and operations from CartContext
  const context = useCart();

  const isOpen = propIsOpen !== undefined ? propIsOpen : context.isCartOpen;
  const onClose = propOnClose || (() => context.setIsCartOpen(false));
  const cartItems = propCartItems !== undefined ? propCartItems : context.cartItems;
  const onUpdateQuantity = propOnUpdateQuantity || context.updateQuantity;
  const onRemoveFromCart = propOnRemoveFromCart || context.removeFromCart;
  const onClearCart = propOnClearCart || context.clearCart;
  const onProceedToCheckout = propOnProceedToCheckout || context.proceedToCheckout;

  const couponCode = propCouponCode !== undefined ? propCouponCode : context.couponCode;
  const setCouponCode = propSetCouponCode || context.setCouponCode;
  const appliedCoupon = propAppliedCoupon !== undefined ? propAppliedCoupon : context.appliedCoupon;
  const onApplyCoupon = propOnApplyCoupon || (() => context.applyCoupon());
  const onRemoveCoupon = propOnRemoveCoupon || context.removeCoupon;

  // Requirement e: Calculate cart subtotal using useMemo
  const subtotal = useMemo(() => {
    if (propSubtotal !== undefined) return Number(propSubtotal) || 0;
    // Fall back to context if cartItems came from context
    if (!propCartItems && context?.cartSubtotal !== undefined) {
      return Number(context.cartSubtotal) || 0;
    }
    return (cartItems || []).reduce((sum, item) => {
      const price = item?.product?.price ?? item?.price ?? 0;
      const qty = item?.quantity ?? 1;
      return sum + Number(price) * Number(qty);
    }, 0);
  }, [propSubtotal, propCartItems, context?.cartSubtotal, cartItems]);

  // Requirement e: Calculate discount using useMemo
  const discount = useMemo(() => {
    if (propDiscount !== undefined) return Number(propDiscount) || 0;
    if (!appliedCoupon || subtotal === 0) return 0;
    const rule = PROMO_CODES?.[appliedCoupon] || 0;
    if (rule < 1) return subtotal * rule;
    if (subtotal >= 150) return Math.min(rule, subtotal);
    return 0;
  }, [propDiscount, appliedCoupon, subtotal]);

  // Requirement e: Calculate delivery charge using useMemo (Free over $50, else $9.99)
  const deliveryFee = useMemo(() => {
    if (propDeliveryFee !== undefined) return Number(propDeliveryFee) || 0;
    if (propDeliveryCharges !== undefined) return Number(propDeliveryCharges) || 0;
    if (!propCartItems && context?.deliveryFee !== undefined) {
      return Number(context.deliveryFee) || 0;
    }
    if (subtotal === 0) return 0;
    return subtotal >= 50 ? 0 : 9.99;
  }, [propDeliveryFee, propDeliveryCharges, propCartItems, context?.deliveryFee, subtotal]);

  // Requirement e: Calculate Total Charges / Total Payable using useMemo
  const totalPayable = useMemo(() => {
    if (propTotalPayable !== undefined) return Number(propTotalPayable) || 0;
    if (propTotalCharges !== undefined) return Number(propTotalCharges) || 0;
    if (subtotal === 0) return 0;
    return Math.max(0, subtotal - discount + deliveryFee);
  }, [propTotalPayable, propTotalCharges, subtotal, discount, deliveryFee]);

  // Accessibility: Close on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalQuantity = (cartItems || []).reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-heading"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-fade-in text-neutral-100"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md shadow-2xl flex flex-col text-left border-l transition-colors ${
            isDarkMode
              ? "bg-[#121215] border-amber-500/30 text-neutral-100"
              : "bg-white border-neutral-200 text-neutral-900"
          }`}
        >
          {/* Drawer Header */}
          <div className={`p-5 border-b flex items-center justify-between ${
            isDarkMode ? "border-neutral-800 bg-[#16161a]" : "border-neutral-200 bg-neutral-50"
          }`}>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" aria-hidden="true" />
              <h2 id="cart-heading" className={`text-base font-black m-0 ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
                Your Shopping Cart
              </h2>
              <span className="px-2 py-0.5 text-xs font-black bg-amber-400 text-neutral-950 rounded-full shadow-xs" aria-label={`${totalQuantity} items in cart`}>
                {totalQuantity}
              </span>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-full transition-colors cursor-pointer focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                isDarkMode ? "text-neutral-400 hover:text-amber-300 hover:bg-neutral-800" : "text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100"
              }`}
              aria-label="Close cart"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Requirement h: Conditional message "Your cart is empty" */}
            {cartItems.length === 0 ? (
              <div id="cart-empty-message" className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center shadow-inner ${
                  isDarkMode ? "bg-neutral-900 border-amber-400/20 text-amber-400" : "bg-neutral-100 border-neutral-200 text-neutral-400"
                }`}>
                  <ShoppingCart className="w-10 h-10" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-400 border border-amber-400/30">
                  Status: Empty
                </span>
                <h3 className={`text-lg font-black ${isDarkMode ? "text-amber-100" : "text-neutral-900"}`}>
                  Your cart is empty
                </h3>
                <p className={`text-xs max-w-xs ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
                  Looks like you haven't added any products to your cart yet. Explore our curated collections!
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-950 text-xs font-black rounded-xl hover:from-amber-300 hover:to-yellow-300 transition-all cursor-pointer shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item, index) => {
                  const product = item.product || item;
                  const productId = product.id ?? item.id ?? index;
                  const productName = product.name ?? item.name ?? "Product";
                  const productPrice = Number(product.price ?? item.price ?? 0);
                  const productImage = product.image ?? item.image ?? "";
                  const productBrand = product.brand ?? item.brand ?? "";
                  const itemQuantity = Number(item.quantity) || 1;
                  const itemStock = product.stockCount || 99;

                  return (
                    <div
                      key={productId}
                      className={`flex gap-3 p-3 rounded-2xl border transition-all ${
                        isDarkMode
                          ? "bg-[#18181c] border-neutral-800 hover:border-amber-400/50"
                          : "bg-neutral-50 border-neutral-200 hover:border-amber-400"
                      }`}
                    >
                      {productImage && (
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-20 h-20 rounded-xl object-cover bg-neutral-900 shrink-0 border border-neutral-800"
                        />
                      )}

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            {productBrand && (
                              <span className="text-[10px] font-bold text-amber-500 block uppercase tracking-wider">
                                {productBrand}
                              </span>
                            )}
                            <h4 className={`text-xs font-bold truncate ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
                              {productName}
                            </h4>
                          </div>
                          <button
                            onClick={() => onRemoveFromCart(productId)}
                            className="text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className={`text-xs font-black ${isDarkMode ? "text-amber-300" : "text-neutral-950"}`}>
                          ${productPrice.toFixed(2)}
                        </span>

                        {/* Quantity Selector (useCallback updateQuantity) */}
                        <div className="flex items-center justify-between mt-1">
                          <div className={`flex items-center gap-2 px-2 py-1 rounded-lg border ${
                            isDarkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-neutral-200"
                          }`}>
                            <button
                              onClick={() => onUpdateQuantity(productId, -1)}
                              className="text-neutral-400 hover:text-amber-400 cursor-pointer"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className={`text-xs font-bold w-4 text-center ${isDarkMode ? "text-amber-100" : "text-neutral-900"}`}>
                              {itemQuantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(productId, 1)}
                              disabled={itemQuantity >= itemStock}
                              className="text-neutral-400 hover:text-amber-400 disabled:opacity-30 cursor-pointer"
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-extrabold text-amber-500">
                            ${(productPrice * itemQuantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={onClearCart}
                  className="w-full text-center text-xs text-rose-500 hover:text-rose-600 font-semibold py-1 cursor-pointer transition-colors"
                >
                  Clear All Cart Items
                </button>
              </div>
            )}
          </div>

          {/* Footer Financials (useMemo calculations: subtotal, discount, delivery fee, total payable) */}
          {cartItems.length > 0 && (
            <div className={`p-5 border-t space-y-4 ${
              isDarkMode ? "border-neutral-800 bg-[#16161a]" : "border-neutral-200 bg-neutral-50"
            }`}>
              {/* Promo Coupon Section */}
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-500" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="SAVE10, SAVE20 or WELCOME50"
                      className={`w-full pl-9 pr-3 py-2 text-xs uppercase font-bold rounded-xl border outline-none ${
                        isDarkMode
                          ? "bg-neutral-900 text-amber-100 placeholder-neutral-500 border-neutral-800 focus:border-amber-400"
                          : "bg-white text-neutral-900 placeholder-neutral-400 border-neutral-300 focus:border-amber-500"
                      }`}
                    />
                  </div>
                  <button
                    onClick={() => onApplyCoupon(couponCode)}
                    className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-950 text-xs font-black rounded-xl transition-all cursor-pointer shadow-sm hover:from-amber-300 hover:to-yellow-300 hover:scale-105 active:scale-95"
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <div className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg border ${
                    isDarkMode ? "text-amber-300 bg-neutral-900 border-amber-400/40" : "text-amber-800 bg-amber-50 border-amber-300"
                  }`}>
                    <span className="font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-amber-500" /> Coupon '{appliedCoupon}' Applied!
                    </span>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-[11px] underline font-medium text-rose-500 hover:text-rose-600 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown (useMemo calculations) */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className={`font-bold ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-amber-500 font-bold">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Charges</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className={`font-bold uppercase text-[10px] px-1.5 py-0.5 rounded border ${
                        isDarkMode ? "text-amber-300 bg-neutral-900 border-amber-400/30" : "text-amber-800 bg-amber-50 border-amber-300"
                      }`}>
                        FREE (Over $50)
                      </span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className={`flex justify-between items-baseline pt-2 border-t text-sm ${
                  isDarkMode ? "border-neutral-800" : "border-neutral-200"
                }`}>
                  <span className={`font-bold ${isDarkMode ? "text-white" : "text-neutral-900"}`}>
                    Total Charges
                  </span>
                  <span className="text-xl font-black text-amber-400">
                    ${totalPayable.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                id="checkout-from-cart-btn"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
