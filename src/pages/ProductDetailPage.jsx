import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, ShoppingBag, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import Button from "../components/Button";

/**
 * ProductDetailPage Component (Step 4 & 5 of 8: Product Details & Add to Cart)
 * -------------------------------------------------------------
 * Requirements:
 * i) Product Details -> Add to Cart -> Cart
 * h) Reusable Button component
 */
export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const product = products.find((p) => String(p.id) === String(id));

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-white">Product Not Found</h2>
        <p className="text-xs text-neutral-400">
          The requested product ID <code className="text-amber-400 font-mono">#{id}</code> was not found.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Step 5: Add to Cart (Requirement i)
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    // Proceed directly to Cart (Step 6)
    navigate("/cart");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      <div>
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
          <Link to="/" className="hover:text-amber-400">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-amber-400">Products</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">{product.name}</span>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-800 bg-[#141418] overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Product Image */}
          <div className="md:col-span-5 relative h-80 md:h-auto bg-neutral-950 flex items-center justify-center p-6">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain rounded-2xl"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-xl text-xs font-black bg-amber-400 text-neutral-950 shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Details Content */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  {product.brand} • {product.category}
                </span>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-400 font-black text-xs border border-amber-400/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating}</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm font-mono text-neutral-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="ml-2 text-xs font-bold text-emerald-400">
                  ● In Stock (Express Shipping Ready)
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {product.description}
              </p>

              {/* Added to cart toast feedback */}
              {addedNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Item added to your cart successfully!</span>
                </div>
              )}

              {/* Quantity selector */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Quantity:
                </span>
                <div className="flex items-center border border-neutral-700 rounded-xl overflow-hidden bg-neutral-950">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-white hover:bg-neutral-800 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-mono font-bold text-amber-400 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-white hover:bg-neutral-800 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Free Express</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>2-Yr Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>30-Day Return</span>
                </div>
              </div>
            </div>

            {/* Action Buttons (Requirement i: Add to Cart & Buy Now) */}
            <div className="pt-4 border-t border-neutral-800 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={handleAddToCart}
                className="flex-1 py-3.5"
                id="add-to-cart-detail-btn"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Add to Cart</span>
              </Button>

              <Button
                variant="primary"
                onClick={handleBuyNow}
                className="flex-1 py-3.5"
                id="buy-now-detail-btn"
              >
                <span>Buy Now &rarr; Go to Cart</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
