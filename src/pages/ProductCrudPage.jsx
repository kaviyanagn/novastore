import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  Database,
  ArrowUpDown,
  Send,
  Loader2,
  Activity,
  Layers,
  Sparkles,
  DollarSign,
  Package,
} from "lucide-react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productCrudApi";
import Loading from "../components/Loading";

export default function ProductCrudPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiSource, setApiSource] = useState("");

  // Operation specific loading states (Requirement f)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);

  // Form State
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    name: "Nova Pro Wireless Mechanical Keyboard",
    category: "Electronics",
    brand: "NovaStore",
    price: "149.99",
    stock: "20",
    description: "Ultra-low latency wireless, RGB per-key backlighting, hot-swappable switches.",
  });

  // Network logs for visual demonstration of CRUD API requests
  const [networkLogs, setNetworkLogs] = useState([]);

  function logRequest(method, endpoint, status, message) {
    setNetworkLogs((prev) => [
      {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString(),
        method,
        endpoint,
        status,
        message,
      },
      ...prev.slice(0, 15),
    ]);
  }

  // Requirement a & e: Retrieve products using GET with async/await
  async function fetchProductsList() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts({ limit: 8 });
      setProducts(data.products);
      setApiSource(data.source);
      logRequest("GET", "/products?limit=8", data.status, `Loaded ${data.products.length} products.`);
    } catch (err) {
      setError(err.message || "Failed to retrieve products via GET.");
      logRequest("GET", "/products?limit=8", 500, err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProductsList();
  }, []);

  // Requirement b & e: Add products using POST
  async function handleCreateProduct(e) {
    if (e && e.preventDefault) e.preventDefault();
    setFormError(null);
    if (!formData.name.trim() || !formData.price) {
      setFormError("Please provide product title and price.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addProduct(formData);
      setProducts((prev) => [result.product, ...prev]);
      logRequest("POST", "/products/add", result.status, result.message);
      setIsAddModalOpen(false);
    } catch (err) {
      logRequest("POST", "/products/add", 500, err.message);
      setFormError(`POST failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Requirement c & e: Update product details using PUT/PATCH
  async function handleUpdateProduct(e) {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSubmitting(true);
    try {
      const result = await updateProduct(editingProduct.id, formData);
      setProducts((prev) =>
        prev.map((item) => (item.id === editingProduct.id ? result.product : item))
      );
      logRequest("PUT", `/products/${editingProduct.id}`, result.status, result.message);
      setEditingProduct(null);
    } catch (err) {
      logRequest("PUT", `/products/${editingProduct.id}`, 500, err.message);
      alert(`PUT failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Requirement d & e: Delete products using DELETE
  async function handleDeleteProduct(id) {
    setDeletingId(id);
    try {
      const result = await deleteProduct(id);
      setProducts((prev) => prev.filter((item) => item.id !== id));
      logRequest("DELETE", `/products/${id}`, result.status, result.message);
      setDeleteConfirmProduct(null);
    } catch (err) {
      logRequest("DELETE", `/products/${id}`, 500, err.message);
      alert(`DELETE failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  }

  function openEditModal(product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: String(product.price),
      stock: String(product.stockCount || 15),
      description: product.description,
    });
  }

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-neutral-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl border border-neutral-800 bg-gradient-to-r from-neutral-900/90 via-[#13121a] to-black shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500 text-neutral-950 shadow-md">
              REST API CRUD Operations
            </span>
            <span className="text-xs text-neutral-400 font-mono bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              Source: {apiSource || "REST Endpoints"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Product API Management
          </h1>
          <p className="text-sm text-neutral-400 max-w-2xl">
            Execute GET (Retrieve), POST (Create), PUT/PATCH (Update), and DELETE operations with asynchronous Axios/Fetch API calls, loading indicators, and error resilience.
          </p>
        </div>

        {/* Action Buttons: Reload GET & Add New POST */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchProductsList}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900 hover:border-cyan-400 text-xs font-bold text-neutral-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? "animate-spin" : ""}`} />
            <span>Reload GET</span>
          </button>
          <button
            onClick={() => {
              setFormData({
                name: "",
                category: "Electronics",
                brand: "NovaStore",
                price: "",
                stock: "15",
                description: "",
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-neutral-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product (POST)</span>
          </button>
        </div>
      </div>

      {/* Network Activity Logger Terminal */}
      <div className="rounded-2xl border border-neutral-800 bg-[#0e0e12] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/80 border-b border-neutral-800 text-xs">
          <div className="flex items-center gap-2 text-neutral-300 font-mono font-bold">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Live HTTP REST API Network Logger</span>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono">
            Async Axios & Fetch Requests
          </span>
        </div>
        <div className="p-4 font-mono text-xs max-h-36 overflow-y-auto space-y-1.5 scrollbar-thin">
          {networkLogs.length === 0 ? (
            <div className="text-neutral-500 italic">No network requests recorded yet.</div>
          ) : (
            networkLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between text-neutral-400 hover:text-white transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">[{log.time}]</span>
                  <span
                    className={`font-black px-1.5 py-0.5 rounded text-[10px] ${
                      log.method === "GET"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : log.method === "POST"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : log.method === "PUT"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {log.method}
                  </span>
                  <span className="text-neutral-200">{log.endpoint}</span>
                  <span className="text-neutral-400">→ {log.message}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    log.status >= 200 && log.status < 300
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-rose-400 bg-rose-500/10"
                  }`}
                >
                  HTTP {log.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Requirement f & g: Loading & Error States */}
      {isLoading ? (
        <Loading message="Executing GET /products API request..." />
      ) : error ? (
        <div className="p-8 rounded-3xl border border-rose-500/40 bg-rose-500/10 text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white">API Retrieval Error</h3>
          <p className="text-xs text-rose-300">{error}</p>
          <button
            onClick={fetchProductsList}
            className="px-5 py-2.5 rounded-xl bg-cyan-400 text-neutral-950 font-black text-xs"
          >
            Retry GET Request
          </button>
        </div>
      ) : (
        /* Requirement a: Retrieve products using GET (Table / Grid View) */
        <div className="rounded-3xl border border-neutral-800 bg-[#121216] overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-black text-white">Product Catalog ({products.length} Items)</h3>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              Live CRUD Database View
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900/80 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Product</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Brand</th>
                  <th className="py-3.5 px-4 font-bold">Price</th>
                  <th className="py-3.5 px-4 font-bold">Stock</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover bg-neutral-900 shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{item.name}</div>
                          <div className="text-[10px] text-neutral-500 font-mono">ID: #{item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-900 text-cyan-300 border border-neutral-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400">{item.brand}</td>
                    <td className="py-3.5 px-4 font-black text-amber-300 text-sm">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-400 font-semibold">{item.stockCount || 15} units</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Requirement c: Update using PUT */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-700 hover:border-amber-400 text-xs font-bold transition-all"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit (PUT)</span>
                        </button>
                        {/* Requirement d: Delete using DELETE */}
                        <button
                          onClick={() => setDeleteConfirmProduct(item)}
                          disabled={deletingId === item.id}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all disabled:opacity-50"
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Requirement b: Modal Form to Add Products using POST */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141418] border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  POST
                </span>
                <h3 className="text-base font-black text-white">Create New Product via REST API</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Wireless Mechanical Keyboard"
                  className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="129.99"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Audio">Audio</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Brand name"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="15"
                    className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description and specifications..."
                  className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-neutral-950 font-black text-xs shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{isSubmitting ? "Sending POST..." : "Submit POST Request"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Requirement c: Modal Form to Update Product details using PUT/PATCH */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141418] border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  PUT / PATCH
                </span>
                <h3 className="text-base font-black text-white">
                  Update Product #{editingProduct.id}
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Audio">Audio</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-950 font-black text-xs shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{isSubmitting ? "Updating..." : "Dispatch PUT Request"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Requirement d: Delete Confirmation Modal */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141418] border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">
              Confirm DELETE Request
            </h3>
            <p className="text-xs text-neutral-300">
              Are you sure you want to delete <strong className="text-white">"{deleteConfirmProduct.name}"</strong>? This will execute an HTTP DELETE call to the REST endpoint.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmProduct(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmProduct.id)}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-md shadow-rose-500/20"
              >
                Confirm DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
