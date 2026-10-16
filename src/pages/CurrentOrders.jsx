import React from "react";
import { Link } from "react-router-dom";
import { Package, Truck, XCircle, ArrowRight } from "lucide-react";
import { useOrders } from "../context/OrderContext";

/**
 * CurrentOrders Subroute Component (/orders/current)
 */
export default function CurrentOrders() {
  const { currentOrders, cancelOrder } = useOrders();

  if (currentOrders.length === 0) {
    return (
      <div className="py-12 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center">
          <Truck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white">No Active Shipments</h3>
        <p className="text-xs text-neutral-400">
          You currently have no orders in transit.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs"
        >
          <span>Shop Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      {currentOrders.map((order) => (
        <div
          key={order.id}
          className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
            <div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Tracking ID</span>
              <strong className="text-sm font-mono text-amber-400">#{order.id}</strong>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {order.status || "In Transit"}
              </span>
              <button
                type="button"
                onClick={() => cancelOrder(order.id)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="text-xs text-neutral-300 space-y-1">
            <div>
              Recipient: <strong className="text-white">{order.customerInfo?.fullName}</strong> ({order.customerInfo?.phone})
            </div>
            <div className="text-neutral-400">
              Address: {order.customerInfo?.address}, {order.customerInfo?.city} - {order.customerInfo?.zipCode}
            </div>
            <div className="text-neutral-400">
              Payment: {order.customerInfo?.paymentMethod}
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-800/80 flex justify-between items-center text-xs">
            <span className="text-neutral-400">Payable Total:</span>
            <strong className="font-mono text-base font-black text-amber-400">
              ${(order.total || 0).toFixed(2)}
            </strong>
          </div>
        </div>
      ))}
    </div>
  );
}
