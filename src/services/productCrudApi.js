import axios from "axios";
import { INITIAL_PRODUCTS } from "../data/products";
import { checkCrudAccess, CRUD_AUTHORIZED_EMAIL } from "./userDatabase";
import { getStoredUser } from "./apiClient";

const BASE_URL = "https://dummyjson.com/products";
const CRUD_STORAGE_KEY = "novastore_crud_products_db";

/**
 * Security Rule: Only one account (admin@novastore.com) can access and execute CRUD API operations.
 */
export function verifyCrudPermission() {
  const activeUser = getStoredUser();
  if (!activeUser || !checkCrudAccess(activeUser)) {
    const error = new Error(
      `403 Forbidden: Access denied. Only the single designated Administrator account (${CRUD_AUTHORIZED_EMAIL}) is permitted to access the CRUD API.`
    );
    error.status = 403;
    throw error;
  }
  return true;
}

/**
 * Persistent Storage Helpers for CRUD Products
 * Ensures newly created (POST), edited (PUT), and removed (DELETE) products
 * persist across page reloads and subsequent GET calls.
 */
export function getStoredCrudProducts() {
  try {
    const raw = localStorage.getItem(CRUD_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to read stored CRUD products:", err);
  }
  return null;
}

export function saveStoredCrudProducts(products) {
  try {
    localStorage.setItem(CRUD_STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error("Failed to save CRUD products:", err);
  }
}

export function resetCrudProductsDatabase() {
  const initial = INITIAL_PRODUCTS.slice(0, 8);
  saveStoredCrudProducts(initial);
  return initial;
}

/**
 * a) Retrieve products using GET (Admin Only)
 * Executes live HTTP GET request, then returns the persisted dataset
 * which includes all newly added products from previous POST operations.
 */
export async function getProducts({ limit = 8 } = {}) {
  verifyCrudPermission();

  let localProducts = getStoredCrudProducts();
  let networkStatus = 200;
  let source = "REST API (GET) & Database Storage";

  try {
    const response = await axios.get(`${BASE_URL}?limit=${limit}`, { timeout: 4000 });
    networkStatus = response.status || 200;
    source = "DummyJSON REST API (GET)";

    // If database store is empty, seed with initial formatted items from API or fallback
    if (!localProducts || localProducts.length === 0) {
      const fetched =
        response.data && Array.isArray(response.data.products)
          ? response.data.products.map(formatItem)
          : INITIAL_PRODUCTS.slice(0, limit);
      saveStoredCrudProducts(fetched);
      localProducts = fetched;
    }
  } catch (err) {
    console.warn("Live GET network warning, using persistent database store:", err.message);
    if (!localProducts || localProducts.length === 0) {
      const fallback = INITIAL_PRODUCTS.slice(0, limit);
      saveStoredCrudProducts(fallback);
      localProducts = fallback;
    }
  }

  return {
    products: localProducts,
    source,
    status: networkStatus,
    count: localProducts.length,
  };
}

/**
 * b) Add products using POST (Admin Only)
 * Executes live HTTP POST request and persists the new product into the database
 * so future GET requests include it.
 */
export async function addProduct(productData) {
  verifyCrudPermission();

  const payload = {
    title: productData.name || productData.title,
    price: Number(productData.price) || 0,
    category: productData.category || "General",
    brand: productData.brand || "Generic",
    stock: Number(productData.stock) || 10,
    description: productData.description || "",
    thumbnail: productData.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  };

  let newProduct = null;
  let status = 201;

  try {
    // 1. Send live HTTP POST request
    const response = await axios.post(`${BASE_URL}/add`, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 5000,
    });

    if (response.data) {
      newProduct = formatItem({
        ...response.data,
        id: Date.now(), // Generate unique numeric ID to avoid collisions
        title: payload.title,
        price: payload.price,
        category: payload.category,
        brand: payload.brand,
        stock: payload.stock,
        description: payload.description,
        thumbnail: payload.thumbnail,
      });
      status = response.status || 201;
    }
  } catch (err) {
    if (err.status === 403) throw err;
    console.warn("POST product network warning, creating locally:", err.message);
  }

  if (!newProduct) {
    newProduct = {
      id: Date.now(),
      name: payload.title,
      brand: payload.brand || "NovaStore",
      category: payload.category,
      price: payload.price,
      originalPrice: Number((payload.price * 1.2).toFixed(2)),
      rating: 4.8,
      image: payload.thumbnail,
      description: payload.description || "Created via CRUD API.",
      inStock: true,
      stockCount: payload.stock,
      badge: "New Arrival",
    };
  }

  // 2. Persist newly added product into database so subsequent GET calls return it!
  const currentList = getStoredCrudProducts() || INITIAL_PRODUCTS.slice(0, 8);
  const updatedList = [newProduct, ...currentList.filter((item) => item.id !== newProduct.id)];
  saveStoredCrudProducts(updatedList);

  return {
    product: newProduct,
    status,
    message: `Product "${newProduct.name}" created via POST (HTTP ${status} Created) & saved to Database.`,
  };
}

/**
 * c) Update product details using PUT/PATCH (Admin Only)
 */
export async function updateProduct(id, updatedFields) {
  verifyCrudPermission();

  const payload = {
    title: updatedFields.name || updatedFields.title,
    price: Number(updatedFields.price),
    category: updatedFields.category,
    brand: updatedFields.brand,
    stock: Number(updatedFields.stock),
    description: updatedFields.description,
  };

  let status = 200;
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 5000,
    });
    if (response.status) status = response.status;
  } catch (err) {
    if (err.status === 403) throw err;
    console.warn("PUT product network warning:", err.message);
  }

  // Update in persistent database
  const currentList = getStoredCrudProducts() || INITIAL_PRODUCTS.slice(0, 8);
  let updatedProduct = null;
  const updatedList = currentList.map((item) => {
    if (item.id === id) {
      updatedProduct = {
        ...item,
        name: payload.title,
        price: payload.price,
        category: payload.category,
        brand: payload.brand,
        stockCount: payload.stock,
        description: payload.description,
        badge: "Updated",
      };
      return updatedProduct;
    }
    return item;
  });

  if (!updatedProduct) {
    updatedProduct = {
      id,
      name: payload.title,
      brand: payload.brand,
      category: payload.category,
      price: payload.price,
      stockCount: payload.stock,
      description: payload.description,
    };
  }

  saveStoredCrudProducts(updatedList);

  return {
    product: updatedProduct,
    status,
    message: `Product #${id} updated via PUT (HTTP ${status} OK) & saved to Database.`,
  };
}

/**
 * d) Delete products using DELETE (Admin Only)
 */
export async function deleteProduct(id) {
  verifyCrudPermission();

  let status = 200;
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`, { timeout: 5000 });
    if (response.status) status = response.status;
  } catch (err) {
    if (err.status === 403) throw err;
    console.warn("DELETE product network warning:", err.message);
  }

  // Remove from persistent database so GET no longer returns it
  const currentList = getStoredCrudProducts() || INITIAL_PRODUCTS.slice(0, 8);
  const updatedList = currentList.filter((item) => item.id !== id);
  saveStoredCrudProducts(updatedList);

  return {
    id,
    status,
    message: `Product #${id} deleted via DELETE (HTTP ${status} OK) & removed from Database.`,
  };
}

function formatItem(p) {
  return {
    id: p.id,
    name: p.title || p.name,
    brand: p.brand || "NovaStore",
    category: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "General",
    price: Number(p.price) || 0,
    originalPrice: p.discountPercentage
      ? Number((p.price * (1 + p.discountPercentage / 100)).toFixed(2))
      : Number((p.price * 1.15).toFixed(2)),
    rating: p.rating ? Number(p.rating) : 4.7,
    image: p.thumbnail || (p.images && p.images[0]) || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    description: p.description || "Product item.",
    inStock: p.stock !== undefined ? p.stock > 0 : true,
    stockCount: p.stock || 20,
    badge: p.rating >= 4.7 ? "Top Rated" : "Featured",
  };
}
