import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Lock,
  ArrowRight,
  Star,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { logClientAction } from "../utils/logger";

/**
 * HomePage Component (Step 2 of 8: Home)
 * -------------------------------------------------------------
 * Clean, high-conversion landing page demonstrating flow navigation
 */
export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleExploreCatalog = () => {
    logClientAction('[Function: handleExploreCatalog] Navigating to "/products"', {
      functionName: 'navigate("/products")',
      destination: "/products",
    });
    navigate("/products");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-left">
      {/* Hero Showcase Card */}
      <div className="relative rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900 via-[#141418] to-[#0d0d10] p-8 sm:p-14 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/15 border border-amber-400/30 text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>NovaStore 2026 Collection</span>
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {isAuthenticated ? (
              <>
                Welcome Back, <span className="text-amber-400">{user?.name}</span>!
              </>
            ) : (
              <>
                Curated Luxury for <span className="text-amber-400">Modern Living</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
            Discover precision-engineered electronics, noise-cancelling acoustics, minimalist footwear, and luxury everyday essentials with protected checkout.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              variant="primary"
              onClick={handleExploreCatalog}
              id="hero-shop-products-btn"
            >
              <span>Explore Product Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Link
              to="/orders"
              className="px-6 py-3.5 rounded-xl text-xs font-bold border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 transition-colors flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Track Orders</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Value Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Truck,
            title: "Free Express Delivery",
            desc: "Complimentary priority shipping on all domestic orders.",
          },
          {
            icon: ShieldCheck,
            title: "100% Genuine Guarantee",
            desc: "Authentic merchandise direct from verified manufacturers.",
          },
          {
            icon: RotateCcw,
            title: "30-Day Easy Returns",
            desc: "Zero-hassle replacements and immediate full refunds.",
          },
          {
            icon: Lock,
            title: "Protected Checkout",
            desc: "Tokenized payment gateways with military-grade 256-bit encryption.",
          },
        ].map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-neutral-800 bg-[#141418] space-y-2 hover:border-amber-400/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">{pillar.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{pillar.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Featured Banner Callout */}
      <div className="rounded-3xl border border-neutral-800 bg-[#141418] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
            Seasonal Promo
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Save Up to 35% on Flagship Audio & Wearables
          </h2>
          <p className="text-xs text-neutral-400">
            Limited stock available with verified manufacturer warranty.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleExploreCatalog}
        >
          <span>Shop Collection Now</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
