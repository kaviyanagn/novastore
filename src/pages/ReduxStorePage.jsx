import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProductsAsync,
  setSearchQuery,
  setSelectedCategory,
  simulateFetchError,
  clearFetchError,
} from "../store/slices/productsSlice";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Layers,
  Database,
  Terminal,
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  ArrowRight,
  Eye,
  X,
  CreditCard,
  ShieldCheck,
  Star,
} from "lucide-react";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../data/products";

export default function ReduxStorePage() {
  const dispatch = useDispatch();

  // Redux state selectors (Requirement a, c, d)
  const productsState = useSelector((state) => state.products);
  const cartState = useSelector((state) => state.cart);

  const { items: products, status, error, searchQuery, selectedCategory } = productsState;
  const {
    items: cartItems,
    itemCount,
    subtotal,
    discount,
    deliveryCharge,
    finalAmount,
    actionLogs,
  } = cartState;

  // Selected product for dynamic details modal (Requirement c: ProductDetail)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  // Filter products based on search and category
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase().trim()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-neutral-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="p-6 md:p-8 rounded-3xl border border-neutral-800 bg-gradient-to-r from-neutral-900/90 via-[#121118] to-black shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500 text-white shadow-md">
              Redux Toolkit & Middleware
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle className="w-3.5 h-3.5" />
              LocalStorage Synced
            </span>
            <span className="text-xs text-amber-400 flex items-center gap-1 font-mono bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              <Activity className="w-3.5 h-3.5" />
              Middleware Active
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Global Product & Cart State Management
          </h1>
          <p className="text-sm text-neutral-400 max-w-2xl">
            Redux Toolkit slices for products & cart, custom logging middleware, automated totals calculation, and local storage persistence.
          </p>
        </div>

        {/* Action Controls: Thunk Fetch, Error Simulation */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => dispatch(fetchProductsAsync())}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-purple-400 text-xs font-bold text-neutral-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
            <span>Fetch via Thunk</span>
          </button>
          {status === "failed" ? (
            <button
              onClick={() => dispatch(clearFetchError())}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold transition-colors"
            >
              <span>Clear Error</span>
            </button>
          ) : (
            <button
              onClick={() => dispatch(simulateFetchError())}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 text-xs font-bold transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Simulate Error</span>
            </button>
          )}
        </div>
      </div>

      {/* Requirement e: Middleware Monitor Terminal */}
      <div className="rounded-2xl border border-neutral-800 bg-[#0e0e12] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/80 border-b border-neutral-800 text-xs">
          <div className="flex items-center gap-2 text-neutral-300 font-mono font-bold">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>Redux Middleware Cart Action Monitor</span>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono">
            Capturing: cart/addToCart, updateQuantity, removeFromCart, clearCart
          </span>
        </div>
        <div className="p-4 font-mono text-xs max-h-36 overflow-y-auto space-y-1.5 scrollbar-thin">
          {actionLogs.length === 0 ? (
            <div className="text-neutral-500 italic">No cart actions intercepted yet.</div>
          ) : (
            actionLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between text-neutral-400 hover:text-white transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">[{log.timestamp}]</span>
                  <span className="text-amber-400 font-semibold">{log.type}</span>
                  <span className="text-neutral-300">→ {log.message}</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  persisted to storage
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Grid: Products (left) and Cart / Checkout Summary (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: ProductList & Filters (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Category Filter (Requirement c) */}
          <div className="p-4 rounded-2xl border border-neutral-800 bg-[#121216] space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder="Search products across global Redux store..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => dispatch(setSelectedCategory(cat))}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-purple-500 text-white font-black shadow-md shadow-purple-500/20"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Requirement g: Loading and Error States */}
          {status === "loading" ? (
            <Loading message="Dispatching Redux fetchProductsAsync thunk..." />
          ) : status === "failed" ? (
            <div className="p-8 rounded-3xl border border-rose-500/40 bg-rose-500/10 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Global Product Fetch Error</h3>
              <p className="text-xs text-rose-300 max-w-md mx-auto">{error}</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => dispatch(fetchProductsAsync())}
                  className="px-4 py-2 rounded-xl bg-purple-500 text-white text-xs font-bold shadow-md hover:bg-purple-600 transition-colors"
                >
                  Retry Thunk
                </button>
                <button
                  onClick={() => dispatch(clearFetchError())}
                  className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold hover:bg-neutral-700"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 rounded-3xl border border-neutral-800 bg-[#141418] text-center space-y-3">
              <h3 className="text-lg font-bold text-white">No products found</h3>
              <p className="text-xs text-neutral-400">Try adjusting your category or search filter.</p>
            </div>
          ) : (
            /* Requirement c: ProductList using reusable ProductCard and Redux dispatch */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => dispatch(addToCart(product))}
                  onSelectProduct={() => setSelectedProduct(product)}
                  isDarkMode={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Redux Cart & Checkout Component (Requirement b, c, d, f) */}
        <div className="space-y-6">
          <div className="p-5 rounded-3xl border border-neutral-800 bg-[#121118] space-y-5 shadow-2xl sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-black text-white">Redux Cart</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {itemCount} items
                </span>
              </div>
              {cartItems.length > 0 && (
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 space-y-2">
                  <ShoppingBag className="w-8 h-8 mx-auto opacity-30" />
                  <p className="text-xs">Your Redux cart is currently empty.</p>
                  <p className="text-[11px] text-neutral-600">
                    Add products from the left to watch middleware & totals update!
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 bg-black"
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-white line-clamp-1">{item.name}</h5>
                        <span className="text-[11px] text-amber-300 font-semibold">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Modifier Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() =>
                          dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                        }
                        className="w-6 h-6 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white min-w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                        }
                        className="w-6 h-6 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="p-1 text-neutral-500 hover:text-rose-400 transition-colors ml-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Requirement d: Calculate subtotal, discount, delivery charge, and final amount */}
            <div className="pt-3 border-t border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Discount (10% over $100)</span>
                <span className="font-semibold text-emerald-400">
                  {discount > 0 ? `-$${discount.toFixed(2)}` : "$0.00"}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Delivery Charge (Free over $150)</span>
                <span className="font-semibold text-white">
                  {deliveryCharge === 0 ? "FREE" : `$${deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Final Amount</span>
                <span className="text-xl font-black text-amber-300">
                  ${finalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Requirement c: Checkout Component trigger */}
            <button
              disabled={cartItems.length === 0}
              onClick={() => setShowCheckoutSuccess(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400 hover:opacity-95 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Checkout (${finalAmount.toFixed(2)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Requirement c: Dynamic ProductDetail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-[#141418] border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>Redux ProductDetail View</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full aspect-square object-cover rounded-2xl bg-black"
              />
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase text-purple-400">
                  {selectedProduct.category} • {selectedProduct.brand}
                </span>
                <h3 className="text-lg font-black text-white">{selectedProduct.name}</h3>
                <p className="text-xs text-neutral-300">{selectedProduct.description}</p>
                <div className="text-xl font-black text-amber-300">
                  ${selectedProduct.price.toFixed(2)}
                </div>
                <button
                  onClick={() => {
                    dispatch(addToCart(selectedProduct));
                    setSelectedProduct(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Dispatch Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Success Confirmation Modal */}
      {showCheckoutSuccess && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121118] border border-emerald-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white">Redux Order Placed Successfully!</h3>
            <p className="text-xs text-neutral-300">
              Your global Redux cart state has processed the order for{" "}
              <strong className="text-amber-300">${finalAmount.toFixed(2)}</strong> ({itemCount}{" "}
              items).
            </p>
            <button
              onClick={() => {
                dispatch(clearCart());
                setShowCheckoutSuccess(false);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black text-xs transition-colors"
            >
              Reset Cart & Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
