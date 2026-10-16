import React from "react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { useOrders } from "../context/OrderContext";

/**
 * OrderHistory Subroute Component (/orders/history)
 */
export default function OrderHistory() {
  const { orderHistory } = useOrders();

  if (orderHistory.length === 0) {
    return (
      <div className="py-12 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white">No Order History Yet</h3>
        <p className="text-xs text-neutral-400">
          Delivered past orders and invoices will appear here.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      {orderHistory.map((order) => (
        <div
          key={order.id}
          className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
            <div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Invoice ID</span>
              <strong className="text-sm font-mono text-amber-400">#{order.id}</strong>
            </div>

            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Delivered</span>
            </span>
          </div>

          <div className="text-xs text-neutral-400 flex items-center justify-between">
            <span>Delivered on: {order.date || "Recent Order"}</span>
            <span>Payment: {order.customerInfo?.paymentMethod || "Card"}</span>
          </div>

          <div className="pt-2 border-t border-neutral-800/80 flex justify-between items-center text-xs">
            <span className="text-neutral-400">Total Paid:</span>
            <strong className="font-mono text-base font-black text-amber-400">
              ${(order.total || 0).toFixed(2)}
            </strong>
          </div>
        </div>
      ))}
    </div>
  );
}
