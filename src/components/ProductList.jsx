import React from "react";
import ProductCard from "./ProductCard";
import { PackageSearch, Sparkles, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";

/**
 * ProductList Component (Golden Effect - Light & Dark Mode)
 * Functional component using JSX and Props
 * - Requirement c & d: Accesses CartContext using useCart() and avoids prop drilling
 *   cart actions down into ProductCard.
 * - Requirement h: Displays appropriate conditional message "No products found".
 */
export default function ProductList({
  products,
  isLoading,
  onAddToCart,
  onSelectProduct,
  searchQuery,
  selectedCategory,
  selectedBrand,
  filters,
  onResetFilters,
  listRef,
  isDarkMode
}) {
  // Requirement c: CartContext access
  const cart = useCart();
  const handleAddToCart = onAddToCart || cart.addToCart;

  return (
    <section ref={listRef} id="product-catalog" className="space-y-6">
      {/* Catalog Header Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border transition-colors ${
          isDarkMode
            ? "bg-[#131316] border-neutral-800 shadow-lg shadow-black/30 text-neutral-100"
            : "bg-white border-neutral-200 shadow-sm text-neutral-900"
        }`}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h2 className={`text-base font-black m-0 ${isDarkMode ? "text-amber-100" : "text-neutral-950"}`}>
            {selectedCategory === "All" ? "All Golden Collections" : selectedCategory}
          </h2>
          <span className={`text-xs font-semibold ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
            ({products.length} {products.length === 1 ? "item" : "items"} available)
          </span>
        </div>

        {/* Active Filter Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {searchQuery && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDarkMode
                ? "bg-neutral-900 text-amber-300 border-amber-500/40"
                : "bg-amber-50 text-neutral-900 border-amber-300"
            }`}>
              Search: "{searchQuery}"
            </span>
          )}
          {selectedBrand && selectedBrand !== "All" && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDarkMode
                ? "bg-neutral-900 text-amber-300 border-amber-500/40"
                : "bg-amber-50 text-neutral-900 border-amber-300"
            }`}>
              <Tag className="w-3 h-3 text-amber-500" />
              Brand: {selectedBrand}
            </span>
          )}
          {filters && filters.maxPrice < 1500 && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDarkMode
                ? "bg-neutral-900 text-amber-300 border-amber-500/40"
                : "bg-amber-50 text-neutral-900 border-amber-300"
            }`}>
              Under ${filters.maxPrice}
            </span>
          )}
          {filters && filters.minRating > 0 && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDarkMode
                ? "bg-amber-400/15 text-amber-300 border-amber-400/40"
                : "bg-amber-100 text-amber-900 border-amber-300"
            }`}>
              {filters.minRating}★ & above
            </span>
          )}
          {filters && filters.inStockOnly && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDarkMode
                ? "bg-neutral-900 text-emerald-400 border-neutral-700"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}>
              In-Stock Only
            </span>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-4 space-y-4 animate-pulse ${
                isDarkMode ? "bg-[#131316] border-neutral-800" : "bg-white border-neutral-200"
              }`}
            >
              <div className={`aspect-square rounded-xl ${isDarkMode ? "bg-neutral-800" : "bg-neutral-100"}`} />
              <div className={`h-4 rounded w-1/3 ${isDarkMode ? "bg-neutral-800" : "bg-neutral-100"}`} />
              <div className={`h-5 rounded w-3/4 ${isDarkMode ? "bg-neutral-800" : "bg-neutral-100"}`} />
              <div className="flex justify-between items-center pt-2">
                <div className={`h-6 rounded w-1/4 ${isDarkMode ? "bg-neutral-800" : "bg-neutral-100"}`} />
                <div className={`h-8 rounded w-1/3 ${isDarkMode ? "bg-neutral-800" : "bg-neutral-100"}`} />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Requirement h: Display conditional message "No products found" */
        <div
          id="no-products-found-message"
          className={`rounded-3xl border p-12 text-center max-w-lg mx-auto shadow-2xl ${
            isDarkMode
              ? "bg-[#131316] border-neutral-800"
              : "bg-white border-neutral-200"
          }`}
        >
          <div className="w-16 h-16 bg-neutral-800 text-amber-400 border border-amber-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <PackageSearch className="w-8 h-8" />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400/20 text-amber-400 border border-amber-400/30 mb-2 inline-block">
            Search & Filter Alert
          </span>
          <h3 className={`text-xl font-black mb-2 ${isDarkMode ? "text-amber-100" : "text-neutral-950"}`}>
            No products found
          </h3>
          <p className={`text-xs mb-6 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
            No products match your active search keyword, category, brand, or filter criteria.
          </p>
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 text-xs font-black rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onSelectProduct={onSelectProduct}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}
    </section>
  );
}
