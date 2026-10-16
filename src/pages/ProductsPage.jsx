import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Sparkles, Filter } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { logClientAction } from "../utils/logger";

/**
 * ProductsPage Component (Step 3 of 8: Product List)
 * -------------------------------------------------------------
 * Requirements:
 * h) Reusable ProductCard and Loading components.
 * i) Navigates to Product Details on selection, or adds item to cart.
 */
export default function ProductsPage() {
  const { products, isLoading } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  if (isLoading) {
    return <Loading message="Loading curated luxury catalog..." />;
  }

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCat === "All" || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleSelectProduct = (product) => {
    logClientAction(`[Function: handleSelectProduct] Navigating to /products/${product.id}`, {
      functionName: "navigate(`/products/${product.id}`)",
      product: { id: product.id, name: product.name, price: product.price },
    });
    // Navigate to Dynamic Product Details Route: /products/:id
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (product) => {
    logClientAction(`[Function: handleAddToCart] Adding product #${product.id} to cart`, {
      functionName: "addToCart(product, 1)",
      product: { id: product.id, name: product.name, price: product.price },
    });
    addToCart(product, 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      <div>
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
          <Link to="/" className="hover:text-amber-400">Home</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">Products</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Product Catalog</h1>
            <p className="text-xs text-neutral-400 mt-1">
              Select any item to inspect dynamic specifications or add directly to cart.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-neutral-900 border border-neutral-800 text-amber-400">
            {filtered.length} Items Listed
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-neutral-800 bg-[#141418] shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title, category, or brand..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-400 outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                logClientAction(`[Function: setSelectedCat] Filter category changed to: "${cat}"`, {
                  functionName: "setSelectedCat(category)",
                  selectedCategory: cat,
                  totalMatchingProducts: products.filter(
                    (p) => cat === "All" || p.category === cat
                  ).length,
                });
                setSelectedCat(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedCat === cat
                  ? "bg-amber-400 text-neutral-950 border-amber-300 font-black shadow-md shadow-amber-400/20"
                  : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Requirement h: Reusable ProductCard Component Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            isDarkMode={true}
          />
        ))}
      </div>
    </div>
  );
}
