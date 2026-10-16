import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag, Eye, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { logClientAction } from "../utils/logger";

/**
 * Reusable ProductCard Functional Component (JSX & Props)
 * Requirement c & d: Consumes CartContext directly using useCart() to share cart
 * state and perform addToCart operations without prop drilling.
 * Displays product image, title, rating, price, and actions
 */
export default function ProductCard({ product, onAddToCart, onSelectProduct, isDarkMode }) {
  // Requirement c & d: Access cart context directly
  const cart = useCart();

  const handleSelectDetails = () => {
    logClientAction(`[Function: onSelectProduct] Selected product "${product.name}" (ID: #${product.id})`, {
      functionName: "onSelectProduct(product)",
      productId: product.id,
      name: product.name,
      price: product.price,
      inStock: product.inStock,
    });
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const handleAddToCart = () => {
    logClientAction(`[Function: addToCart] Adding "${product.name}" to Cart (Price: $${product.price})`, {
      functionName: onAddToCart ? "onAddToCart(product)" : "cartContext.addToCart(product)",
      id: product.id,
      name: product.name,
      price: product.price,
      inStock: product.inStock,
    });
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      cart.addToCart(product);
    }
  };

  const itemInCart = cart?.cartItems?.find(
    (item) => (item.product?.id || item.id) === product.id
  );
  const cartQuantity = itemInCart?.quantity || 0;
  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between overflow-hidden ${
        isDarkMode
          ? "bg-[#141416] border-neutral-800 hover:border-amber-500/50 hover:shadow-amber-500/10 text-neutral-100"
          : "bg-white border-neutral-200 hover:border-amber-400 hover:shadow-neutral-300/50 text-neutral-900"
      }`}
    >
      {/* Product Image & Badges (Clickable to view details) */}
      <div
        onClick={handleSelectDetails}
        className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-500/10 via-neutral-900 to-black flex items-center justify-center cursor-pointer"
        title={`Click to view details for ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="eager"
          decoding="async"
          width="300"
          height="300"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 -z-1 flex items-center justify-center font-black text-4xl text-amber-500/20 select-none">
          {product.category}
        </div>
        {product.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-black rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-950 shadow-md">
            {product.badge}
          </span>
        )}
        <span
          className={`absolute bottom-3 left-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md ${
            isDarkMode ? "bg-black/70 text-amber-300" : "bg-white/80 text-neutral-900"
          }`}
        >
          {product.category}
        </span>
      </div>

      {/* Body Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-left">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`font-semibold ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-bold" aria-label={`Rating: ${product.rating} out of 5 stars`}>
              <Star className="w-3.5 h-3.5 fill-amber-400" aria-hidden="true" />
              <span>{product.rating}</span>
            </div>
          </div>
          <h3
            onClick={handleSelectDetails}
            className={`text-sm font-bold line-clamp-2 leading-snug cursor-pointer hover:text-amber-400 transition-colors ${
              isDarkMode ? "text-neutral-100" : "text-neutral-900"
            }`}
            title={`Click to view details for ${product.name}`}
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Actions */}
        <div className="pt-2 border-t border-neutral-800/40 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-lg font-black ${isDarkMode ? "text-amber-300" : "text-neutral-950"}`}>
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className={`text-xs line-through ${isDarkMode ? "text-neutral-500" : "text-neutral-400"}`}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className={`text-[11px] font-medium ${product.inStock ? "text-emerald-500" : "text-rose-500"}`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSelectDetails}
              aria-label={`Details - ${product.name}`}
              className={`flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                isDarkMode
                  ? "bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200"
              }`}
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Details</span>
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={cartQuantity > 0 ? `Added (${cartQuantity}) - ${product.name}` : `+ Cart - ${product.name}`}
              className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-black rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-amber-400 focus:outline-none"
            >
              {cartQuantity > 0 ? (
                <>
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Added ({cartQuantity})</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>+ Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Optimization: Memoize ProductCard to prevent unnecessary re-renders in catalog grid
export const MemoizedProductCard = React.memo(ProductCard);

