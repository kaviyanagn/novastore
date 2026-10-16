import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import Input from "../components/Input";
import Button from "../components/Button";

/**
 * CheckoutPage Component (Route: /checkout)
 * -------------------------------------------------------------
 * Requirements:
 * c) Protected route restricted to authenticated users.
 * f) Comprehensive form validation:
 *    - Required field validation
 *    - Email validation
 *    - Phone number validation
 *    - Address validation
 *    - Payment method validation
 * h) Reusable Input and Button components.
 * i) Step 7 of 8: Checkout -> Order Confirmation.
 */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, finalTotal, clearCart } = useCart();
  const { addOrder } = useOrders();

  // Requirement f: Controlled checkout state
  const [formData, setFormData] = useState({
    fullName: "Alex Morgan",
    email: "alex.morgan@novastore.com",
    phone: "9876543210",
    address: "742 Evergreen Terrace, Suite 4",
    city: "San Francisco",
    zipCode: "94107",
    paymentMethod: "Card",
    cardNumber: "4532 1234 5678 9012",
    upiId: "alex@okaxis",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  // Requirement f: Form validation logic
  const validateField = (field, value) => {
    let error = null;

    if (field === "fullName") {
      if (!value || !value.trim()) error = "Full name is required.";
      else if (value.trim().length < 3) error = "Name must be at least 3 characters.";
    } else if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !value.trim()) error = "Email address is required.";
      else if (!emailRegex.test(value.trim())) error = "Please enter a valid email address.";
    } else if (field === "phone") {
      const digits = (value || "").replace(/\D/g, "");
      if (!value || !value.trim()) error = "Phone number is required.";
      else if (digits.length < 10) error = "Phone number must have at least 10 digits.";
    } else if (field === "address") {
      if (!value || !value.trim()) error = "Street address is required.";
      else if (value.trim().length < 6) error = "Address must be at least 6 characters.";
    } else if (field === "city") {
      if (!value || !value.trim()) error = "City is required.";
    } else if (field === "zipCode") {
      if (!value || !value.trim()) error = "Postal / ZIP Code is required.";
    } else if (field === "cardNumber" && formData.paymentMethod === "Card") {
      const digits = (value || "").replace(/\D/g, "");
      if (!value || !value.trim()) error = "Card number is required.";
      else if (digits.length < 16) error = "Card number must be 16 digits.";
    } else if (field === "upiId" && formData.paymentMethod === "UPI") {
      if (!value || !value.trim()) error = "UPI ID is required.";
      else if (!value.includes("@")) error = "Enter a valid UPI ID (e.g. name@bank).";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty! Please add products before checking out.");
      navigate("/products");
      return;
    }

    // Validate all fields
    const nameErr = validateField("fullName", formData.fullName);
    const emailErr = validateField("email", formData.email);
    const phoneErr = validateField("phone", formData.phone);
    const addrErr = validateField("address", formData.address);
    const cityErr = validateField("city", formData.city);
    const zipErr = validateField("zipCode", formData.zipCode);
    const cardErr = validateField("cardNumber", formData.cardNumber);
    const upiErr = validateField("upiId", formData.upiId);

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      zipCode: true,
      cardNumber: true,
      upiId: true,
    });

    if (nameErr || emailErr || phoneErr || addrErr || cityErr || zipErr || cardErr || upiErr) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Create new order
      const newOrder = addOrder({
        customerInfo: formData,
        items: cartItems,
        total: finalTotal,
      });

      clearCart();
      setIsSubmitting(false);

      // Requirement i: Navigate to Order Confirmation
      navigate("/order-confirmation", {
        state: { orderId: newOrder.id, order: newOrder },
      });
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      <div>
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
          <Link to="/" className="hover:text-amber-400">Home</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-amber-400">Cart</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">Protected Checkout</span>
        </div>
        <h1 className="text-3xl font-black text-white">Express Checkout</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Complete your customer delivery details and select a secure payment method.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Checkout Form (Requirements f & h) */}
        <div className="lg:col-span-7 rounded-3xl border border-neutral-800 bg-[#141418] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Customer Information & Address</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> 256-bit Secure
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Section 1: Customer Details */}
            <div className="space-y-4">
              <Input
                label="Full Name"
                name="fullName"
                icon={User}
                value={formData.fullName}
                onChange={handleChange}
                onBlur={() => handleBlur("fullName")}
                error={touched.fullName ? errors.fullName : ""}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  error={touched.email ? errors.email : ""}
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  icon={Phone}
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur("phone")}
                  placeholder="10-digit number"
                  error={touched.phone ? errors.phone : ""}
                  required
                />
              </div>
            </div>

            {/* Section 2: Delivery Address (Requirement f) */}
            <div className="space-y-4 pt-3 border-t border-neutral-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Shipping Address
              </h4>

              <Input
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={() => handleBlur("address")}
                error={touched.address ? errors.address : ""}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={() => handleBlur("city")}
                  error={touched.city ? errors.city : ""}
                  required
                />
                <Input
                  label="Postal / ZIP Code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  onBlur={() => handleBlur("zipCode")}
                  error={touched.zipCode ? errors.zipCode : ""}
                  required
                />
              </div>
            </div>

            {/* Section 3: Payment Method (Requirement f) */}
            <div className="space-y-4 pt-3 border-t border-neutral-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> Payment Method
              </h4>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "Card", label: "Credit Card" },
                  { id: "UPI", label: "UPI Transfer" },
                  { id: "COD", label: "Cash on Delivery" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, paymentMethod: m.id }));
                      setErrors((prev) => ({ ...prev, paymentMethod: null }));
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      formData.paymentMethod === m.id
                        ? "bg-amber-400 text-neutral-950 border-amber-300 font-black shadow-md"
                        : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {formData.paymentMethod === "Card" && (
                <Input
                  label="16-Digit Card Number"
                  name="cardNumber"
                  icon={CreditCard}
                  value={formData.cardNumber}
                  onChange={handleChange}
                  onBlur={() => handleBlur("cardNumber")}
                  placeholder="4532 1234 5678 9012"
                  error={touched.cardNumber ? errors.cardNumber : ""}
                  required
                />
              )}

              {formData.paymentMethod === "UPI" && (
                <Input
                  label="Virtual Payment Address (UPI ID)"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  onBlur={() => handleBlur("upiId")}
                  placeholder="username@bank"
                  error={touched.upiId ? errors.upiId : ""}
                  required
                />
              )}

              {formData.paymentMethod === "COD" && (
                <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Pay with cash or card upon delivery at your doorstep.</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-neutral-800">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full py-4 text-xs font-black uppercase tracking-wider"
                id="place-order-btn"
              >
                <span>{isSubmitting ? "Processing Order..." : "Confirm & Place Order"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Cart Order Summary */}
        <div className="lg:col-span-5 rounded-3xl border border-neutral-800 bg-[#141418] p-6 space-y-5 shadow-xl">
          <div className="border-b border-neutral-800 pb-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-amber-400">
              Order Summary
            </h4>
            <span className="text-xs text-neutral-400">{cartItems.length} Unique Items</span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-xs"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover bg-neutral-950 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white truncate">{item.product.name}</div>
                  <div className="text-[11px] text-neutral-400">
                    Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                  </div>
                </div>
                <div className="font-mono font-bold text-amber-400 shrink-0">
                  ${(item.quantity * item.product.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-800 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Delivery Fee:</span>
              <span className="text-emerald-400 font-bold">FREE</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-neutral-800">
              <span>Final Payable Total:</span>
              <span className="font-mono text-lg font-black text-amber-400">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
