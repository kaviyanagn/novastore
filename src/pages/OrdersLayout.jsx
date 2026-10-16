import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { Truck, Clock, ShieldCheck, Sparkles } from "lucide-react";

/**
 * OrdersLayout Component (Route: /orders)
 * -------------------------------------------------------------
 * Requirements:
 * c) Protected Route restricted by ProtectedRoute.
 * Nested routes for current deliveries and historical receipts using Outlet.
 */
export default function OrdersLayout() {
  const getTabClass = ({ isActive }) =>
    `flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
      isActive
        ? "bg-amber-400 text-neutral-950 font-black shadow-md shadow-amber-400/20"
        : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
    }`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      <div>
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
          <Link to="/" className="hover:text-amber-400">Home</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">Protected Orders</span>
        </div>
        <h1 className="text-3xl font-black text-white">Your Orders</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Track active shipments in real-time or view past delivered receipts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#141418] border border-neutral-800 w-fit">
        <NavLink to="/orders/current" className={getTabClass}>
          <Truck className="w-3.5 h-3.5" />
          <span>Active Shipments</span>
        </NavLink>
        <NavLink to="/orders/history" className={getTabClass}>
          <Clock className="w-3.5 h-3.5" />
          <span>Order History</span>
        </NavLink>
      </div>

      {/* Outlet renders matched subroute */}
      <div className="rounded-3xl border border-neutral-800 bg-[#141418] p-6 shadow-xl animate-fade-in">
        <Outlet />
      </div>
    </div>
  );
}
