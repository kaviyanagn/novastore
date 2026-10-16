import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";
import Button from "../components/Button";

/**
 * CartPage Component (Route: /cart)
 * -------------------------------------------------------------
 * Requirements:
 * c) Protected Route restricted by ProtectedRoute component.
 * i) Step 6 of 8: Add to Cart -> Cart -> Checkout.
 * h) Uses reusable Button component.
 */
export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, finalTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-neutral-400">
          Looks like you haven't added any luxury items to your cart yet. Explore our curated catalog to begin.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:scale-102 transition-all"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      <div>
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
          <Link to="/" className="hover:text-amber-400">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-amber-400">Products</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">Protected Cart</span>
        </div>
        <h1 className="text-3xl font-black text-white">Your Shopping Cart</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Review your selected items, adjust quantities, and proceed to protected express checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 rounded-3xl border border-neutral-800 bg-[#141418] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs text-neutral-400 font-bold uppercase tracking-wider">
            <span>Product Item</span>
            <span>Quantity & Subtotal</span>
          </div>

          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800/80 transition-all hover:border-neutral-700"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-neutral-950 shrink-0 border border-neutral-800"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-amber-500">
                      {item.product.category}
                    </span>
                    <h3 className="text-sm font-bold text-white truncate">
                      {item.product.name}
                    </h3>
                    <span className="text-xs font-mono text-neutral-400">
                      ${item.product.price.toFixed(2)} each
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-neutral-700 rounded-xl overflow-hidden bg-neutral-950">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1 text-xs font-mono font-black text-amber-400 min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-sm font-mono font-black text-white min-w-16 text-right">
                    ${(item.quantity * item.product.price).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4 rounded-3xl border border-neutral-800 bg-[#141418] p-6 space-y-5 shadow-xl">
          <div className="border-b border-neutral-800 pb-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-amber-400">
              Cart Summary
            </h4>
            <span className="text-xs text-neutral-400">{cartItems.length} Products Selected</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-neutral-300">
              <span>Subtotal:</span>
              <span className="font-mono font-bold">${finalTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Express Delivery:</span>
              <span className="font-bold text-emerald-400">FREE</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Tax & Handling:</span>
              <span className="font-mono">$0.00</span>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-between items-center text-sm">
              <span className="font-bold text-white">Total Payable:</span>
              <span className="font-mono text-xl font-black text-amber-400">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate("/checkout")}
            className="w-full py-4 text-xs font-black uppercase tracking-wider"
            id="proceed-to-checkout-btn"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Protected Route: Authenticated session confirmed.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
