import React, { useState, useEffect } from "react";
import { X, Star, ShoppingBag, Plus, Minus, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";

/**
 * ProductDetail Component (Golden Effect - Light & Dark Mode)
 * Detailed view modal
 * Requirement c & d: Consumes addToCart directly from CartContext.
 */
export default function ProductDetail({ product, onClose, onAddToCart, isDarkMode }) {
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();
  const handleAddToCart = onAddToCart || cart.addToCart;

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const handleIncrement = () => {
    if (quantity < (product.stockCount || 10)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAdd = () => {
    handleAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in text-left">
      <div
        className={`relative w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border ${
          isDarkMode
            ? "bg-[#131316] border-amber-500/40 text-neutral-100 shadow-black/80"
            : "bg-white border-neutral-200 text-neutral-900 shadow-neutral-950/20"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full border transition-all cursor-pointer ${
            isDarkMode
              ? "text-neutral-400 hover:text-amber-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-700"
              : "text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border-neutral-200"
          }`}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image Section */}
          <div className={`relative p-6 flex items-center justify-center min-h-[320px] md:min-h-full ${
            isDarkMode ? "bg-neutral-900" : "bg-neutral-100"
          }`}>
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full max-h-[380px] object-cover rounded-2xl shadow-xl border ${
                isDarkMode ? "border-neutral-800" : "border-neutral-200"
              }`}
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-950 text-xs font-black rounded-lg shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Details Section */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                      isDarkMode ? "bg-neutral-900 border-neutral-800 text-neutral-300" : "bg-neutral-100 border-neutral-200 text-neutral-700"
                    }`}>
                      <Tag className="w-3 h-3 text-amber-500" />
                      {product.brand}
                    </span>
                  )}
                </div>
                <span className={product.inStock ? "text-emerald-500 text-xs font-semibold" : "text-rose-500 text-xs font-semibold"}>
                  {product.inStock ? `In Stock (${product.stockCount} left)` : "Out of Stock"}
                </span>
              </div>

              <h2 className={`text-xl sm:text-2xl font-black leading-tight ${isDarkMode ? "text-white" : "text-neutral-950"}`}>
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : isDarkMode ? "text-neutral-700 fill-neutral-700" : "text-neutral-200 fill-neutral-200"
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-xs font-bold ${isDarkMode ? "text-amber-200" : "text-neutral-800"}`}>{product.rating}</span>
                <span className={`text-xs ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>({product.reviewsCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className={`text-2xl sm:text-3xl font-black ${isDarkMode ? "text-amber-300" : "text-neutral-950"}`}>
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className={`text-sm line-through ${isDarkMode ? "text-neutral-500" : "text-neutral-400"}`}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-neutral-300" : "text-neutral-600"}`}>
                {product.description}
              </p>

              {/* Specs Table */}
              {product.specs && (
                <div className="pt-2">
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? "text-amber-300" : "text-neutral-950"}`}>Specifications</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className={`p-2 rounded-xl border ${
                        isDarkMode ? "bg-neutral-900 border-neutral-800" : "bg-neutral-50 border-neutral-200"
                      }`}>
                        <span className={`block text-[10px] uppercase font-semibold ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>{key}</span>
                        <span className={`font-semibold ${isDarkMode ? "text-amber-100" : "text-neutral-900"}`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar: Quantity & Add to Cart */}
            <div className={`pt-4 border-t space-y-4 ${isDarkMode ? "border-neutral-800" : "border-neutral-100"}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isDarkMode ? "text-amber-200" : "text-neutral-900"}`}>Quantity</span>
                <div className={`flex items-center gap-3 p-1 rounded-xl border ${
                  isDarkMode ? "bg-neutral-900 border-neutral-700" : "bg-neutral-100 border-neutral-200"
                }`}>
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className={`p-1 rounded-lg cursor-pointer ${
                      isDarkMode ? "bg-neutral-800 text-amber-300 hover:bg-neutral-700" : "bg-white text-neutral-800 shadow-2xs hover:bg-neutral-50"
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className={`w-6 text-center text-xs font-bold ${isDarkMode ? "text-amber-100" : "text-neutral-900"}`}>
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={!product.inStock || quantity >= (product.stockCount || 10)}
                    className={`p-1 rounded-lg cursor-pointer ${
                      isDarkMode ? "bg-neutral-800 text-amber-300 hover:bg-neutral-700" : "bg-white text-neutral-800 shadow-2xs hover:bg-neutral-50"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`w-full py-3.5 px-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  product.inStock
                    ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 shadow-amber-500/25 active:scale-[0.99]"
                    : "bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add {quantity} to Cart • ${(product.price * quantity).toFixed(2)}</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
