import axios from "axios";
import { INITIAL_PRODUCTS, CATEGORIES } from "../data/products";

const BASE_URL = "https://dummyjson.com/products";

/**
 * Product REST API Service
 * -------------------------------------------------------------
 * Demonstrates:
 * - REST API integration using Axios and Fetch API
 * - Async/Await handling
 * - Pagination & limited product loading (page, limit, skip)
 * - Search query & category filtering parameters
 * - Dynamic single product retrieval by ID
 * - Resilient fallback if external API is unreachable
 */

// a) Fetch product list with pagination, search, and category filtering using Axios
export async function fetchProducts({ page = 1, limit = 8, search = "", category = "All" } = {}) {
  const skip = (page - 1) * limit;

  try {
    let url = `${BASE_URL}?limit=${limit}&skip=${skip}`;

    if (search.trim()) {
      url = `${BASE_URL}/search?q=${encodeURIComponent(search.trim())}&limit=${limit}&skip=${skip}`;
    } else if (category && category !== "All") {
      url = `${BASE_URL}/category/${encodeURIComponent(category.toLowerCase())}?limit=${limit}&skip=${skip}`;
    }

    const response = await axios.get(url, { timeout: 6000 });

    if (response.data && Array.isArray(response.data.products)) {
      return {
        products: response.data.products.map(formatApiProduct),
        total: response.data.total,
        skip: response.data.skip,
        limit: response.data.limit,
        source: "DummyJSON REST API (Axios)",
      };
    }
  } catch (err) {
    console.warn("Axios API fetch failed, falling back to local dataset:", err.message);
  }

  // Fallback: Local dataset pagination and filtering
  let result = [...INITIAL_PRODUCTS];

  if (category && category !== "All") {
    result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
    );
  }

  const total = result.length;
  const paginated = result.slice(skip, skip + limit);

  return {
    products: paginated,
    total,
    skip,
    limit,
    source: "Mock REST API (Resilient Fallback)",
  };
}

// d) Fetch individual product details dynamically using Fetch API
export async function fetchProductById(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return formatApiProduct(data);
  } catch (err) {
    console.warn(`Fetch API request for #${id} failed, using local product data:`, err.message);
    const found = INITIAL_PRODUCTS.find((p) => String(p.id) === String(id));
    if (found) return found;
    throw new Error(`Product #${id} not found.`);
  }
}

// c) Fetch categories list from API
export async function fetchCategories() {
  try {
    const response = await axios.get(`${BASE_URL}/categories`, { timeout: 4000 });
    if (Array.isArray(response.data)) {
      const names = response.data.map((c) => (typeof c === "object" ? c.name || c.slug : c));
      return ["All", ...names.slice(0, 7)];
    }
  } catch {
    // fallback
  }
  return CATEGORIES;
}

function formatApiProduct(item) {
  return {
    id: item.id,
    name: item.title || item.name,
    brand: item.brand || "Premium",
    category: item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : "General",
    price: Number(item.price) || 0,
    originalPrice: item.discountPercentage
      ? Number((item.price * (1 + item.discountPercentage / 100)).toFixed(2))
      : item.price * 1.15,
    rating: item.rating ? Number(item.rating) : 4.7,
    image: item.thumbnail || (item.images && item.images[0]) || "",
    description: item.description || "High quality product.",
    inStock: item.stock !== undefined ? item.stock > 0 : true,
    stockCount: item.stock || 25,
    badge: item.rating >= 4.7 ? "Top Rated" : "Featured",
    specs: {
      Brand: item.brand || "NovaStore",
      Rating: `${item.rating || 4.5} ★`,
      Warranty: item.warrantyInformation || "1 Year Official Warranty",
      Shipping: item.shippingInformation || "Free Express Shipping",
    },
  };
}
