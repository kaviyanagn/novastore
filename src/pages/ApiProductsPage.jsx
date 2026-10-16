import React, { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Database,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  Star,
  ShoppingBag,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { fetchProducts, fetchProductById, fetchCategories } from "../services/productApi";
import { useCart } from "../context/CartContext";

/**
 * ApiProductsPage Component
 * -------------------------------------------------------------
 * Experiment: Develop E-Commerce Application with Product REST API
 * Requirements:
 * a) Fetch product information from REST API using Axios / Fetch
 * b) Display products using reusable ProductCard components
 * c) Implement product search and category filtering using API data
 * d) Display product details using dynamic API requests (fetchProductById)
 * e) Handle asynchronous operations using async/await
 * f) Display loading and error states with retry functionality
 * g) Implement pagination and limited product loading (limit = 8)
 */
export default function ApiProductsPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState(["All"]);
  const [apiSource, setApiSource] = useState("");

  // Search & Filter State (Requirement c)
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Pagination State (Requirement g: limit = 8)
  const [page, setPage] = useState(1);
  const limit = 8;

  // Loading & Error States (Requirement f)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic Product Detail Modal State (Requirement d)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const { addToCart } = useCart();

  // Load Categories on Mount
  useEffect(() => {
    async function loadCategories() {
      const cats = await fetchCategories();
      setCategories(cats);
    }
    loadCategories();
  }, []);

  // Requirement a, c, e, f, g: Asynchronous API fetching using async/await
  async function loadProducts() {
    setIsLoading(true);
    setError(null);
    try {
      // Async request with pagination, search, and category
      const data = await fetchProducts({
        page,
        limit,
        search,
        category: selectedCategory,
      });

      setProducts(data.products);
      setTotal(data.total);
      setApiSource(data.source);
    } catch (err) {
      setError(err.message || "Failed to fetch products from REST API.");
    } finally {
      setIsLoading(false);
    }
  }

  // Reload products when page, category, or debounced search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, selectedCategory, search]);

  // Requirement d: Fetch individual product details dynamically using API
  async function handleSelectProduct(product) {
    setIsLoadingDetail(true);
    setDetailError(null);
    setSelectedProduct(product); // initial quick preview
    try {
      const fullDetail = await fetchProductById(product.id);
      setSelectedProduct(fullDetail);
    } catch (err) {
      setDetailError(err.message || "Failed to load dynamic product details.");
    } finally {
      setIsLoadingDetail(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Top Banner */}
      <div className="rounded-3xl border border-neutral-800 bg-gradient-to-r from-amber-500/10 via-neutral-900 to-black p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-amber-400 text-neutral-950">
              REST API MODE
            </span>
            <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Source: {apiSource || "Connecting to REST API..."}</span>
            </span>
          </div>
          <h1 className="text-3xl font-black text-white">Product REST API Integration</h1>
          <p className="text-xs text-neutral-300 mt-1 max-w-xl">
            Asynchronous data fetching with Axios, Fetch API, pagination limits, dynamic product lookup,
            and live loading/error state handling.
          </p>
        </div>

        <button
          onClick={loadProducts}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-xs font-bold text-white transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh API</span>
        </button>
      </div>

      {/* Requirement c: Search and Category Filtering Controls */}
      <div className="p-4 rounded-2xl border border-neutral-800 bg-[#141418] shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
            <input
              type="text"
              id="api-product-search-input"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // reset to page 1 on new search
              }}
              placeholder="Search REST API products by title, keyword, or brand..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-400 outline-none"
            />
          </div>

          <span className="text-xs font-mono text-neutral-400 font-bold">
            Total Available: <strong className="text-amber-400">{total}</strong>
          </span>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mr-1 shrink-0">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1); // reset to page 1
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                selectedCategory === cat
                  ? "bg-amber-400 text-neutral-950 border-amber-300 font-black shadow-md shadow-amber-400/20"
                  : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Requirement f: Loading and Error States */}
      {isLoading ? (
        <Loading message="Fetching products from REST API with Axios..." />
      ) : error ? (
        <div className="rounded-3xl border border-rose-500/40 bg-[#161318] p-8 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white">API Request Error</h3>
          <p className="text-xs text-rose-300">{error}</p>
          <button
            onClick={loadProducts}
            className="px-5 py-2.5 rounded-xl bg-amber-400 text-neutral-950 text-xs font-bold"
          >
            Retry Request
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-neutral-800 bg-[#141418] p-12 text-center max-w-md mx-auto space-y-3">
          <h3 className="text-lg font-black text-white">No products found</h3>
          <p className="text-xs text-neutral-400">
            No items matched your current REST API query or filter.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
            className="px-4 py-2 bg-amber-400 text-neutral-950 text-xs font-black rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Requirement b: Display products using reusable ProductCard components */
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelectProduct={() => handleSelectProduct(p)}
                onAddToCart={() => addToCart(p, 1)}
                isDarkMode={true}
              />
            ))}
          </div>

          {/* Requirement g: Pagination Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-neutral-800 bg-[#141418]">
            <div className="text-xs text-neutral-400">
              Showing page <strong className="text-white">{page}</strong> of{" "}
              <strong className="text-white">{totalPages}</strong> ({total} total products)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      page === num
                        ? "bg-amber-400 text-neutral-950 font-black shadow-md shadow-amber-400/20"
                        : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requirement d: Dynamic Product Detail API Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#141418] border border-amber-500/40 rounded-3xl p-6 text-white shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dynamic REST API Product Details (ID: #{selectedProduct.id})</span>
            </div>

            {isLoadingDetail ? (
              <Loading message="Fetching dynamic product specifications from API..." />
            ) : detailError ? (
              <div className="text-center py-8 text-rose-400 text-xs">{detailError}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full aspect-square rounded-2xl object-cover bg-neutral-950 border border-neutral-800"
                />
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                    {selectedProduct.category} • {selectedProduct.brand}
                  </span>
                  <h2 className="text-xl font-black">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{selectedProduct.rating} / 5</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                  <div className="text-2xl font-black text-amber-300">
                    ${selectedProduct.price.toFixed(2)}
                  </div>

                  {selectedProduct.specs && (
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] space-y-1">
                      {Object.entries(selectedProduct.specs).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-neutral-400">{k}:</span>
                          <span className="text-white font-medium">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                    }}
                    className="w-full py-3 bg-amber-400 text-neutral-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-amber-300"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
