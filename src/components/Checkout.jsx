import React, { useState, useMemo } from "react";
import { X, CheckCircle2, ShieldCheck, CreditCard, Banknote, Smartphone, Lock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { PROMO_CODES } from "../data/products";

import { sanitizeInput } from "../utils/security";

/**
 * Checkout Component (Golden Effect - Light & Dark Mode)
 * Requirement c & d: Consumes cart items, financial calculations (useMemo),
 * and order reset directly from CartContext to avoid prop drilling.
 * Requirement e: Calculates subtotal, discount, delivery fee, and total charges using useMemo.
 */
export default function Checkout({
  isOpen: propIsOpen,
  onClose: propOnClose,
  cartItems: propCartItems,
  customerInfo: propCustomerInfo,
  setCustomerInfo: propSetCustomerInfo,
  subtotal: propSubtotal,
  discount: propDiscount,
  deliveryFee: propDeliveryFee,
  deliveryCharges: propDeliveryCharges,
  totalPayable: propTotalPayable,
  totalCharges: propTotalCharges,
  onOrderSuccess: propOnOrderSuccess,
  isDarkMode
}) {
  // Requirement c & d: Retrieve cart information directly from CartContext
  const cart = useCart();

  const isOpen = propIsOpen !== undefined ? propIsOpen : cart.isCheckoutOpen;
  const onClose = propOnClose || (() => cart.setIsCheckoutOpen(false));
  const cartItems = propCartItems !== undefined ? propCartItems : cart.cartItems;
  const appliedCoupon = cart.appliedCoupon;

  // Requirement e: Calculate subtotal using useMemo
  const subtotal = useMemo(() => {
    if (propSubtotal !== undefined) return Number(propSubtotal) || 0;
    if (!propCartItems && cart?.cartSubtotal !== undefined) {
      return Number(cart.cartSubtotal) || 0;
    }
    return (cartItems || []).reduce((sum, item) => {
      const price = item?.product?.price ?? item?.price ?? 0;
      const qty = item?.quantity ?? 1;
      return sum + Number(price) * Number(qty);
    }, 0);
  }, [propSubtotal, propCartItems, cart?.cartSubtotal, cartItems]);

  // Requirement e: Calculate discount using useMemo
  const discount = useMemo(() => {
    if (propDiscount !== undefined) return Number(propDiscount) || 0;
    if (!appliedCoupon || subtotal === 0) return 0;
    const rule = PROMO_CODES?.[appliedCoupon] || 0;
    if (rule < 1) return subtotal * rule;
    if (subtotal >= 150) return Math.min(rule, subtotal);
    return 0;
  }, [propDiscount, appliedCoupon, subtotal]);

  // Requirement e: Calculate delivery fee using useMemo
  const deliveryFee = useMemo(() => {
    if (propDeliveryFee !== undefined) return Number(propDeliveryFee) || 0;
    if (propDeliveryCharges !== undefined) return Number(propDeliveryCharges) || 0;
    if (!propCartItems && cart?.deliveryFee !== undefined) {
      return Number(cart.deliveryFee) || 0;
    }
    if (subtotal === 0) return 0;
    return subtotal >= 50 ? 0 : 9.99;
  }, [propDeliveryFee, propDeliveryCharges, propCartItems, cart?.deliveryFee, subtotal]);

  // Requirement e: Calculate Total Charges / Final Payable using useMemo
  const totalPayable = useMemo(() => {
    if (propTotalPayable !== undefined) return Number(propTotalPayable) || 0;
    if (propTotalCharges !== undefined) return Number(propTotalCharges) || 0;
    if (subtotal === 0) return 0;
    return Math.max(0, subtotal - discount + deliveryFee);
  }, [propTotalPayable, propTotalCharges, subtotal, discount, deliveryFee]);

  // Local state for customer fields if not supplied via props
  const [localCustomerInfo, setLocalCustomerInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "card",
  });

  const customerInfo = propCustomerInfo || localCustomerInfo;
  const setCustomerInfo = propSetCustomerInfo || setLocalCustomerInfo;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [errors, setErrors] = useState({});

  // Accessibility: Close checkout modal when Escape is pressed
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

  // Security: Sanitize input values as user types
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitized = sanitizeInput(value);
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: sanitized
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!customerInfo.fullName?.trim()) errs.fullName = "Full name is required";
    if (!customerInfo.email?.trim() || !customerInfo.email.includes("@")) {
      errs.email = "Valid email is required";
    }
    if (!customerInfo.phone?.trim()) errs.phone = "Phone number is required";
    if (!customerInfo.address?.trim()) errs.address = "Shipping address is required";
    if (!customerInfo.city?.trim()) errs.city = "City is required";
    if (!customerInfo.zipCode?.trim()) errs.zipCode = "Zip code is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Generate random order tracking ID
    const generatedId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(generatedId);
    setIsSubmitted(true);

    if (typeof propOnOrderSuccess === "function") {
      propOnOrderSuccess();
    } else {
      cart.clearCart();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-heading"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in text-left text-neutral-100"
    >
      <div className={`relative w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border ${
        isDarkMode
          ? "bg-[#131316] border-amber-500/40 text-neutral-100"
          : "bg-white border-neutral-200 text-neutral-900 shadow-neutral-950/20"
      }`}>
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          aria-label="Close checkout modal"
          className={`absolute top-4 right-4 z-20 p-2 rounded-full border transition-all cursor-pointer focus:ring-2 focus:ring-amber-400 focus:outline-none ${
            isDarkMode
              ? "text-neutral-400 hover:text-amber-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-700"
              : "text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border-neutral-200"
          }`}
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {isSubmitted ? (
          /* Order Confirmation View */
          <div className="p-8 sm:p-12 text-center max-w-lg mx-auto space-y-5">
            <div className="w-20 h-20 bg-amber-400/20 text-amber-400 border border-amber-400/40 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
            </div>

            <div>
              <h2 className={`text-2xl font-black mb-1 ${isDarkMode ? "text-white" : "text-neutral-950"}`}>
                Order Confirmed!
              </h2>
              <p className={`text-sm ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>
                Thank you, <strong className="text-amber-500">{customerInfo.fullName}</strong>. Your payment was processed successfully.
              </p>
            </div>

            <div className={`border rounded-2xl p-4 text-xs space-y-2 text-left ${
              isDarkMode ? "bg-neutral-900 border-neutral-800" : "bg-neutral-50 border-neutral-200"
            }`}>
              <div className="flex justify-between">
                <span className={isDarkMode ? "text-neutral-400" : "text-neutral-500"}>Order Reference:</span>
                <span className="font-mono font-bold text-amber-500">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? "text-neutral-400" : "text-neutral-500"}>Shipping to:</span>
                <span className={`font-medium ${isDarkMode ? "text-white" : "text-neutral-900"}`}>{customerInfo.address}, {customerInfo.city}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? "text-neutral-400" : "text-neutral-500"}>Payment Method:</span>
                <span className="font-bold text-amber-500 uppercase">{customerInfo.paymentMethod}</span>
              </div>
              <div className={`flex justify-between border-t pt-2 text-sm font-bold ${
                isDarkMode ? "border-neutral-800" : "border-neutral-200"
              }`}>
                <span className={isDarkMode ? "text-white" : "text-neutral-900"}>Total Charged:</span>
                <span className="text-amber-500 font-black">${totalPayable.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all cursor-pointer hover:from-amber-300 hover:to-yellow-300 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-amber-400 focus:outline-none"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Checkout Form & Summary Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Customer Information Form */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              <div className={`border-b pb-4 ${isDarkMode ? "border-neutral-800" : "border-neutral-200"}`}>
                <div className="flex items-center gap-2 text-amber-500 mb-1">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider">Secure Checkout</span>
                </div>
                <h2 id="checkout-heading" className={`text-xl font-black m-0 ${isDarkMode ? "text-white" : "text-neutral-950"}`}>
                  Customer & Delivery Information
                </h2>
                <p className={`text-xs mt-1 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
                  Managed with React Context API & Custom Hooks
                </p>
              </div>

              <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4">
                <div>
                  <label htmlFor="checkout-fullName" className={`text-xs font-bold block mb-1 ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}>Full Name</label>
                  <input
                    id="checkout-fullName"
                    type="text"
                    name="fullName"
                    value={customerInfo.fullName}
                    onChange={handleInputChange}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    maxLength={100}
                    className={`w-full text-xs border rounded-xl px-3.5 py-2.5 outline-none transition-all ${
                      isDarkMode
                        ? "bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-400"
                        : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-amber-500"
                    } ${errors.fullName ? "border-rose-400 ring-2 ring-rose-400/20" : ""}`}
                  />
                  {errors.fullName && <span className="text-[11px] text-rose-500 mt-1 block">{errors.fullName}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="checkout-email" className={`text-xs font-bold block mb-1 ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}>Email Address</label>
                    <input
                      id="checkout-email"
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      placeholder="jane@example.com"
                      autoComplete="email"
                      maxLength={120}
                      className={`w-full text-xs border rounded-xl px-3.5 py-2.5 outline-none transition-all ${
                        isDarkMode
                          ? "bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-400"
                          : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-amber-500"
                      } ${errors.email ? "border-rose-400 ring-2 ring-rose-400/20" : ""}`}
                    />
                    {errors.email && <span className="text-[11px] text-rose-500 mt-1 block">{errors.email}</span>}
                  </div>

                  <div>
                    <label htmlFor="checkout-phone" className={`text-xs font-bold block mb-1 ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}>Phone Number</label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      autoComplete="tel"
                      maxLength={25}
                      className={`w-full text-xs border rounded-xl px-3.5 py-2.5 outline-none transition-all ${
                        isDarkMode
                          ? "bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-400"
                          : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-amber-500"
                      } ${errors.phone ? "border-rose-400 ring-2 ring-rose-400/20" : ""}`}
                    />
                    {errors.phone && <span className="text-[11px] text-rose-500 mt-1 block">{errors.phone}</span>}
                  </div>
                </div>

                <div>
                  <label htmlFor="checkout-address" className={`text-xs font-bold block mb-1 ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}>Street Address</label>
                  <input
                    id="checkout-address"
                    type="text"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    placeholder="742 Evergreen Terrace"
                    autoComplete="street-address"
                    maxLength={150}
                    className={`w-full text-xs border rounded-xl px-3.5 py-2.5 outline-none transition-all ${
                      isDarkMode
                        ? "bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-400"
                        : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-amber-500"
                    } ${errors.address ? "border-rose-400 ring-2 ring-rose-400/20" : ""}`}
                  />
                  {errors.address && <span className="text-[11px] text-rose-500 mt-1 block">{errors.address}</span>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="checkout-city" className={`text-xs font-bold block mb-1 ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}>City</label>
                    <input
                      id="checkout-city"
                      type="text"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      placeholder="Springfield"
                      autoComplete="address-level2"
                      maxLength={60}
                      className={`w-full text-xs border rounded-xl px-3.5 py-2.5 outline-none transition-all ${
                        isDarkMode
                          ? "bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-400"
                          : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-amber-500"
                      } ${errors.city ? "border-rose-400 ring-2 ring-rose-400/20" : ""}`}
                    />
                    {errors.city && <span className="text-[11px] text-rose-500 mt-1 block">{errors.city}</span>}
                  </div>

                  <div>
                    <label htmlFor="checkout-zipCode" className={`text-xs font-bold block mb-1 ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}>ZIP / Postal Code</label>
                    <input
                      id="checkout-zipCode"
                      type="text"
                      name="zipCode"
                      value={customerInfo.zipCode}
                      onChange={handleInputChange}
                      placeholder="97477"
                      autoComplete="postal-code"
                      maxLength={15}
                      className={`w-full text-xs border rounded-xl px-3.5 py-2.5 outline-none transition-all ${
                        isDarkMode
                          ? "bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-400"
                          : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-amber-500"
                      } ${errors.zipCode ? "border-rose-400 ring-2 ring-rose-400/20" : ""}`}
                    />
                    {errors.zipCode && <span className="text-[11px] text-rose-500 mt-1 block">{errors.zipCode}</span>}
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="pt-2">
                  <label className={`text-xs font-bold block mb-2 ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}>Payment Method</label>
                  <div className="grid grid-cols-3 gap-2" aria-label="Payment Method Selection">
                    {[
                      { id: "card", label: "Credit Card", icon: CreditCard },
                      { id: "upi", label: "UPI / NetBanking", icon: Smartphone },
                      { id: "cod", label: "Cash on Delivery", icon: Banknote }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = customerInfo.paymentMethod === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={isSelected}
                          aria-label={item.label}
                          onClick={() => setCustomerInfo((prev) => ({ ...prev, paymentMethod: item.id }))}
                          className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                            isSelected
                              ? "border-amber-400 bg-amber-400/15 text-amber-500 font-bold shadow-xs"
                              : isDarkMode
                              ? "border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
                              : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                          }`}
                        >
                          <Icon className="w-4 h-4" aria-hidden="true" />
                          <span className="text-[11px] leading-tight">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  id="place-order-submit-btn"
                  className="w-full mt-4 py-3.5 px-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] focus:ring-2 focus:ring-amber-400 focus:outline-none"
                >
                  <ShieldCheck className="w-4 h-4 text-neutral-950" aria-hidden="true" />
                  <span>Place Order • ${totalPayable.toFixed(2)}</span>
                </button>
              </form>
            </div>

            {/* Right Column: Order Summary & useMemo Totals from Context */}
            <div className={`lg:col-span-5 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l flex flex-col justify-between space-y-6 ${
              isDarkMode ? "bg-[#18181c] border-neutral-800" : "bg-neutral-50 border-neutral-200"
            }`}>
              <div>
                <h3 className={`text-sm font-black uppercase tracking-wider mb-4 ${isDarkMode ? "text-amber-400" : "text-neutral-900"}`}>
                  Order Summary ({cartItems.length} items)
                </h3>

                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {cartItems.map((item, idx) => {
                    const product = item.product || item;
                    const productId = product.id ?? item.id ?? idx;
                    const productName = product.name ?? item.name ?? "Product";
                    const productPrice = Number(product.price ?? item.price ?? 0);
                    const productImage = product.image ?? item.image ?? "";
                    const itemQty = Number(item.quantity) || 1;

                    return (
                      <div key={productId} className="flex items-center gap-3">
                        {productImage && (
                          <img
                            src={productImage}
                            alt={productName}
                            className="w-12 h-12 rounded-lg object-cover bg-neutral-900 shrink-0 border border-neutral-800"
                          />
                        )}
                        <div className="flex-1 min-w-0 text-xs">
                          <h4 className={`font-bold truncate ${isDarkMode ? "text-white" : "text-neutral-900"}`}>{productName}</h4>
                          <span className={isDarkMode ? "text-neutral-400" : "text-neutral-500"}>Qty: {itemQty} × ${productPrice.toFixed(2)}</span>
                        </div>
                        <span className="text-xs font-black text-amber-500">
                          ${(productPrice * itemQty).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className={`mt-6 pt-4 border-t space-y-2 text-xs ${isDarkMode ? "border-neutral-800" : "border-neutral-200"}`}>
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className={`font-bold ${isDarkMode ? "text-white" : "text-neutral-900"}`}>${subtotal.toFixed(2)}</span>
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
                          isDarkMode ? "text-amber-400 bg-neutral-900 border-amber-400/30" : "text-amber-800 bg-amber-50 border-amber-300"
                        }`}>
                          FREE
                        </span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className={`flex justify-between items-baseline pt-3 border-t text-sm ${isDarkMode ? "border-neutral-800" : "border-neutral-200"}`}>
                    <span className={`font-bold ${isDarkMode ? "text-white" : "text-neutral-900"}`}>Total Charges</span>
                    <span className="text-xl font-black text-amber-500">
                      ${totalPayable.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-xl border text-[11px] flex items-center gap-2 ${
                isDarkMode ? "bg-neutral-900 border-neutral-800 text-neutral-400" : "bg-white border-neutral-200 text-neutral-600"
              }`}>
                <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                <span>Encrypted with 256-bit SSL protocol for complete payment safety.</span>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
