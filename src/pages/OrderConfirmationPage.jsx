import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Package, Truck, MapPin, CreditCard, Sparkles } from "lucide-react";
import Button from "../components/Button";

/**
 * OrderConfirmationPage Component (Step 8 of 8: Order Confirmation)
 * -------------------------------------------------------------
 * Requirements:
 * i) Final step in the complete flow: Checkout -> Order Confirmation.
 * h) Reusable Button component.
 */
export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;
  const orderId = location.state?.orderId || "ORD-2026-98741";

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-left animate-fade-in space-y-6">
      <div className="p-8 rounded-3xl border border-emerald-500/40 bg-[#141418] shadow-2xl space-y-6">
        {/* Top Success Banner */}
        <div className="text-center space-y-2 border-b border-neutral-800 pb-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
            Flow Complete • Step 8 of 8
          </span>
          <h1 className="text-3xl font-black text-white">
            Order Confirmed Successfully!
          </h1>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Thank you for shopping with NovaStore. Your order has been placed and is being prepared for express delivery.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
            <div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase">
                Order Tracking ID
              </span>
              <div className="text-xl font-mono font-black text-amber-400">
                #{orderId}
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Status: Processing Delivery
            </span>
          </div>

          {order && (
            <div className="space-y-4 text-xs">
              {/* Delivery info */}
              <div className="space-y-1">
                <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-bold">
                  Shipping Destination:
                </span>
                <p className="text-neutral-300">
                  <strong className="text-white block">{order.customerInfo.fullName}</strong>
                  {order.customerInfo.address}, {order.customerInfo.city} - {order.customerInfo.zipCode}
                </p>
                <p className="text-neutral-400">
                  Contact: {order.customerInfo.phone} • {order.customerInfo.email}
                </p>
              </div>

              {/* Payment and total */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
                <div>
                  <span className="text-neutral-500 text-[10px] block">Payment Method:</span>
                  <strong className="text-white">{order.customerInfo.paymentMethod}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] block">Total Amount Paid:</span>
                  <strong className="text-amber-400 text-sm font-mono font-black">
                    ${order.total?.toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            variant="primary"
            onClick={() => navigate("/orders")}
            className="flex-1"
          >
            <Truck className="w-4 h-4" />
            <span>Track in Orders (/orders)</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate("/products")}
            className="flex-1"
          >
            <Package className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
