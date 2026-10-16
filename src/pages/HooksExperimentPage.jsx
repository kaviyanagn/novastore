import React, { useState, useRef, useCallback } from "react";
import Header from "../components/Header";
import Home from "../components/Home";
import ProductList from "../components/ProductList";
import ProductDetail from "../components/ProductDetail";
import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import Footer from "../components/Footer";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import { INITIAL_PRODUCTS } from "../data/products";
import { Code2, CheckCircle2, Sparkles, Layers, Sliders } from "lucide-react";

/**
 * Experiment: React Functional Components & React Hooks
 * -------------------------------------------------------------
 * a) Functional components: Header, Home, ProductList, ProductCard, ProductDetail, SearchBar, FilterPanel, Cart, Checkout, Footer
 * b) useState: Search keywords, category, filters, cart items, customer info
 * c) useEffect: Product loading on start & query sync
 * d) useRef: Search input DOM referencing & auto-focus
 * e) useMemo: Filtered products, subtotal, discount, delivery fee, final total
 * f) useCallback: addToCart, removeFromCart, updateQuantity
 * g) Responsive CSS/Tailwind interface
 */
export default function HooksExperimentPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(() => {
    if (typeof window !== "undefined") {
      const modalParam = new URLSearchParams(window.location.search).get("modal");
      if (modalParam) {
        return INITIAL_PRODUCTS.find((p) => p.id === Number(modalParam)) || null;
      }
    }
    return null;
  });

  // Customer info managed via useState (Requirement b)
  const [customerInfo, setCustomerInfo] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace, Springfield, OR",
    city: "Springfield",
    postalCode: "97477",
    paymentMethod: "card",
  });

  const catalogRef = useRef(null);

  // useProducts custom hook demonstrating useState, useEffect, useMemo, useCallback
  const {
    products,
    filteredProducts,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    filters,
    setFilters,
    resetFilters,
    activeFilterCount,
    categories,
    brands,
  } = useProducts();

  // useCart context demonstrating useState, useMemo (subtotal, discount, delivery, total) and useCallback (addToCart, removeFromCart, updateQuantity)
  const cart = useCart();

  // URL search parameter handler for deterministic screenshot states
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modalId = params.get("modal");
    if (modalId && products.length > 0) {
      const found = products.find((p) => p.id === Number(modalId));
      if (found) setSelectedProduct(found);
    }
    const cartParam = params.get("cart");
    if (cartParam === "open" && products.length > 0) {
      if (cart.cartItems.length === 0) {
        cart.addToCart(products[0], 1);
        if (products[2]) cart.addToCart(products[2], 2);
      }
      cart.applyCoupon("SAVE20");
      cart.setIsCartOpen(true);
    } else if (cartParam === "empty") {
      cart.clearCart();
      cart.setIsCartOpen(true);
    }

    const searchParam = params.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }

    const catParam = params.get("category");
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [products]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const handleShopNow = useCallback(() => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const isCatalogFocus = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("view") === "catalog";

  return (
    <div
      className={`min-h-screen transition-colors flex flex-col ${
        isDarkMode ? "bg-[#0a0a0c] text-neutral-100" : "bg-neutral-50 text-neutral-900"
      }`}
    >
      {/* Experiment Header Banner for Lab Record / Output */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-neutral-950 px-4 py-2 text-xs font-bold shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-black text-amber-400 font-mono text-[11px] font-black uppercase">
              LAB EXPERIMENT
            </span>
            <span className="font-black text-sm">
              React Functional Components, JSX, Props & React Hooks
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-black/15 font-mono">useState</span>
            <span className="px-2 py-0.5 rounded bg-black/15 font-mono">useEffect</span>
            <span className="px-2 py-0.5 rounded bg-black/15 font-mono">useRef</span>
            <span className="px-2 py-0.5 rounded bg-black/15 font-mono">useMemo</span>
            <span className="px-2 py-0.5 rounded bg-black/15 font-mono">useCallback</span>
            <span className="px-2 py-0.5 rounded bg-black/15 font-mono">Props</span>
            <span className="px-2 py-0.5 rounded bg-black/15 font-mono">Tailwind CSS</span>
          </div>
        </div>
      </div>

      {/* Component 1: Header (incorporates Component 6: SearchBar and Component 7: FilterPanel) */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        brands={brands}
        categories={categories}
        filters={filters}
        setFilters={setFilters}
        onResetFilters={resetFilters}
        activeFilterCount={activeFilterCount}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onOpenCart={() => cart.setIsCartOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Component 2: Home Hero section */}
        {!isCatalogFocus && (
          <Home
            onShopNow={handleShopNow}
            totalProductsCount={filteredProducts.length}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Live Hooks Status Monitor Bar */}
        <section
          className={`p-4 rounded-2xl border transition-colors ${
            isDarkMode
              ? "bg-[#141418] border-amber-500/20 shadow-lg text-neutral-200"
              : "bg-white border-neutral-200 shadow-sm text-neutral-800"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-500">
                  Live Hooks Execution Monitor
                </h4>
                <p className="text-xs text-neutral-400">
                  Real-time memoized calculations and state synchronization
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div
                className={`px-3 py-1.5 rounded-xl border ${
                  isDarkMode ? "bg-neutral-900 border-neutral-800" : "bg-neutral-50 border-neutral-200"
                }`}
              >
                <span className="text-neutral-400 mr-1.5 font-medium">Filtered Items (useMemo):</span>
                <span className="font-bold text-amber-400">{filteredProducts.length}</span>
              </div>
              <div
                className={`px-3 py-1.5 rounded-xl border ${
                  isDarkMode ? "bg-neutral-900 border-neutral-800" : "bg-neutral-50 border-neutral-200"
                }`}
              >
                <span className="text-neutral-400 mr-1.5 font-medium">Cart Subtotal (useMemo):</span>
                <span className="font-bold text-emerald-400">${cart.cartSubtotal.toFixed(2)}</span>
              </div>
              <div
                className={`px-3 py-1.5 rounded-xl border ${
                  isDarkMode ? "bg-neutral-900 border-neutral-800" : "bg-neutral-50 border-neutral-200"
                }`}
              >
                <span className="text-neutral-400 mr-1.5 font-medium">Search Ref (useRef):</span>
                <span className="font-bold text-blue-400">Auto-focused</span>
              </div>
              <div
                className={`px-3 py-1.5 rounded-xl border ${
                  isDarkMode ? "bg-neutral-900 border-neutral-800" : "bg-neutral-50 border-neutral-200"
                }`}
              >
                <span className="text-neutral-400 mr-1.5 font-medium">Active Category (useState):</span>
                <span className="font-bold text-yellow-400">{selectedCategory}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Component 3: ProductList (renders Component 4: ProductCard) */}
        <ProductList
          products={filteredProducts}
          isLoading={isLoading}
          onAddToCart={cart.addToCart}
          onSelectProduct={(p) => setSelectedProduct(p)}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedBrand={selectedBrand}
          filters={filters}
          onResetFilters={resetFilters}
          listRef={catalogRef}
          isDarkMode={isDarkMode}
        />
      </main>

      {/* Component 5: ProductDetail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={cart.addToCart}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Component 8: Cart Slide-over Drawer */}
      <Cart
        isOpen={cart.isCartOpen}
        onClose={() => cart.setIsCartOpen(false)}
        cartItems={cart.cartItems}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveFromCart={cart.removeFromCart}
        onClearCart={cart.clearCart}
        onProceedToCheckout={() => {
          cart.setIsCartOpen(false);
          cart.setIsCheckoutOpen(true);
        }}
        subtotal={cart.cartSubtotal}
        discount={cart.cartDiscount}
        deliveryFee={cart.deliveryFee}
        deliveryCharges={cart.deliveryFee}
        totalPayable={cart.finalTotal}
        totalCharges={cart.finalTotal}
        couponCode={cart.couponCode}
        setCouponCode={cart.setCouponCode}
        appliedCoupon={cart.appliedCoupon}
        onApplyCoupon={cart.applyCoupon}
        onRemoveCoupon={cart.removeCoupon}
        isDarkMode={isDarkMode}
      />

      {/* Component 9: Checkout Modal */}
      <Checkout
        isOpen={cart.isCheckoutOpen}
        onClose={() => cart.setIsCheckoutOpen(false)}
        cartItems={cart.cartItems}
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        subtotal={cart.cartSubtotal}
        discount={cart.cartDiscount}
        deliveryFee={cart.deliveryFee}
        deliveryCharges={cart.deliveryFee}
        totalPayable={cart.finalTotal}
        totalCharges={cart.finalTotal}
        onOrderSuccess={() => {
          cart.clearCart();
          cart.setIsCheckoutOpen(false);
        }}
        isDarkMode={isDarkMode}
      />

      {/* Component 10: Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
