import React from "react";
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Zap, Sparkles } from "lucide-react";

/**
 * Home Component (Golden Effect - Light & Dark Mode)
 * Functional component serving as the landing hero section
 * Highlights the store features, special promos, and uses a CTA that scrolls to the product catalog
 */
export default function Home({ onShopNow, totalProductsCount, onSelectCategory, isDarkMode }) {
  return (
    <section
      className={`relative overflow-hidden transition-colors border-b pt-8 pb-12 sm:pb-16 ${
        isDarkMode
          ? "bg-gradient-to-b from-[#141416] via-[#0d0d0f] to-[#09090b] border-amber-500/20 text-neutral-100"
          : "bg-gradient-to-b from-amber-50/60 via-stone-50/40 to-white border-neutral-200 text-neutral-900"
      }`}
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -top-12 right-1/4 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text & Call to Action */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs border ${
              isDarkMode
                ? "bg-neutral-900/80 border-amber-400/40 text-amber-300"
                : "bg-white border-amber-500/40 text-neutral-900"
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Weekend Special: Up to 30% Off Tech & Luxury Essentials</span>
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] ${
              isDarkMode ? "text-white" : "text-neutral-950"
            }`}>
              Curated Luxury for <br />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                Modern Living & Tech
              </span>
            </h1>

            <p className={`text-base sm:text-lg max-w-xl leading-relaxed ${
              isDarkMode ? "text-neutral-300" : "text-neutral-600 font-medium"
            }`}>
              Explore our hand-picked collection of premium electronics, footwear, designer apparel, and home aesthetics. Built entirely with React 19 functional components and React Hooks in a Golden aesthetic.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onShopNow}
                id="hero-shop-now-btn"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Shop All {totalProductsCount ? `${totalProductsCount} Items` : "Products"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectCategory("Electronics")}
                className={`inline-flex items-center gap-2 px-5 py-3.5 font-bold text-sm rounded-xl border shadow-xs transition-all cursor-pointer ${
                  isDarkMode
                    ? "bg-neutral-900/90 hover:bg-neutral-800 text-amber-300 border-amber-500/30"
                    : "bg-white hover:bg-neutral-100 text-neutral-900 border-neutral-300"
                }`}
              >
                <span>Browse Tech</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className={`grid grid-cols-3 gap-4 pt-6 border-t ${
              isDarkMode ? "border-neutral-800" : "border-neutral-200"
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg shrink-0 border ${
                  isDarkMode ? "bg-amber-400/10 text-amber-400 border-amber-400/20" : "bg-amber-100 text-amber-700 border-amber-300"
                }`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isDarkMode ? "text-amber-100" : "text-neutral-900"}`}>Free Delivery</h4>
                  <p className={`text-[11px] ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>Orders over $50</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg shrink-0 border ${
                  isDarkMode ? "bg-amber-400/10 text-amber-400 border-amber-400/20" : "bg-amber-100 text-amber-700 border-amber-300"
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isDarkMode ? "text-amber-100" : "text-neutral-900"}`}>100% Genuine</h4>
                  <p className={`text-[11px] ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>Verified warranty</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg shrink-0 border ${
                  isDarkMode ? "bg-amber-400/10 text-amber-400 border-amber-400/20" : "bg-amber-100 text-amber-700 border-amber-300"
                }`}>
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isDarkMode ? "text-amber-100" : "text-neutral-900"}`}>Easy Returns</h4>
                  <p className={`text-[11px] ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>30-day window</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Hero Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Product Spotlight Card */}
              <div className={`relative rounded-3xl overflow-hidden shadow-2xl p-3 group border ${
                isDarkMode
                  ? "border-amber-500/30 bg-neutral-900"
                  : "border-neutral-200 bg-white"
              }`}>
                <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-neutral-950">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                    alt="Featured Sony WH-1000XM5 Headphones"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-950 rounded-full text-xs font-black shadow-md">
                      🔥 Deal of the Day
                    </span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-5 text-white z-10">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Electronics</span>
                    <h3 className="text-lg font-bold mt-0.5 text-white">Sony WH-1000XM5 Wireless</h3>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-amber-300">$349.99</span>
                        <span className="text-xs text-neutral-400 line-through">$399.99</span>
                      </div>
                      <span className="text-xs bg-neutral-900 border border-amber-400/40 text-amber-300 font-bold px-2.5 py-1 rounded-lg shadow-sm">
                        Save $50
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating React Hook Badge - Top Right */}
              <div className={`absolute -top-3 -right-2 sm:-right-4 z-20 px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 hover:scale-105 transition-transform border backdrop-blur-md ${
                isDarkMode
                  ? "bg-[#141416]/95 border-amber-400/40 text-amber-200"
                  : "bg-white/95 border-amber-500/40 text-neutral-900"
              }`}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-400 text-neutral-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/30">
                  <Zap className="w-4 h-4 fill-neutral-950" />
                </div>
                <div className="text-left">
                  <div className={`text-xs font-bold ${isDarkMode ? "text-amber-200" : "text-neutral-900"}`}>Custom Hooks & Context API</div>
                  <div className={`text-[10px] font-medium ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>useProducts • useCart • CartContext</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
