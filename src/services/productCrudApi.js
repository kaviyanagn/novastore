import axios from "axios";
import { INITIAL_PRODUCTS } from "../data/products";

const BASE_URL = "https://dummyjson.com/products";

/**
 * Product CRUD API Service
 * -------------------------------------------------------------
 * Demonstrates:
 * a) GET: Retrieve products
 * b) POST: Add new product
 * c) PUT / PATCH: Update existing product details
 * d) DELETE: Remove product
 * e) Asynchronous API response handling using async/await
 * f) Operation status indicators
 * g) Resilient error handling with descriptive messages
 */

// a) Retrieve products using GET
export async function getProducts({ limit = 8 } = {}) {
  try {
    const response = await axios.get(`${BASE_URL}?limit=${limit}`, { timeout: 6000 });
    if (response.data && Array.isArray(response.data.products)) {
      return {
        products: response.data.products.map(formatItem),
        source: "DummyJSON REST API (GET)",
        status: response.status,
      };
    }
  } catch (err) {
    console.warn("GET products failed, using local dataset fallback:", err.message);
  }

  return {
    products: INITIAL_PRODUCTS.slice(0, limit),
    source: "Mock Database (GET Fallback)",
    status: 200,
  };
}

// b) Add products using POST
export async function addProduct(productData) {
  try {
    const payload = {
      title: productData.name || productData.title,
      price: Number(productData.price) || 0,
      category: productData.category || "General",
      brand: productData.brand || "Generic",
      stock: Number(productData.stock) || 10,
      description: productData.description || "",
      thumbnail: productData.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    };

    const response = await axios.post(`${BASE_URL}/add`, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 6000,
    });

    if (response.data) {
      return {
        product: formatItem({ ...response.data, id: response.data.id || Date.now() }),
        status: response.status || 201,
        message: "Product created successfully via POST request.",
      };
    }
  } catch (err) {
    console.warn("POST product API failed, creating in local state:", err.message);
  }

  // Fallback local creation
  const newProduct = {
    id: Date.now(),
    name: productData.name || productData.title,
    brand: productData.brand || "NovaBrand",
    category: productData.category || "Electronics",
    price: Number(productData.price) || 99.99,
    originalPrice: Number(productData.price) * 1.2,
    rating: 4.8,
    image: productData.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    description: productData.description || "Created via local CRUD fallback.",
    inStock: true,
    stockCount: Number(productData.stock) || 15,
    badge: "New Arrival",
  };

  return {
    product: newProduct,
    status: 201,
    message: "Product created locally (HTTP 201 Created).",
  };
}

// c) Update product details using PUT or PATCH
export async function updateProduct(id, updatedFields) {
  try {
    const payload = {
      title: updatedFields.name || updatedFields.title,
      price: Number(updatedFields.price),
      category: updatedFields.category,
      brand: updatedFields.brand,
      stock: Number(updatedFields.stock),
      description: updatedFields.description,
    };

    const response = await axios.put(`${BASE_URL}/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 6000,
    });

    if (response.data) {
      return {
        product: formatItem({ ...response.data, id }),
        status: response.status || 200,
        message: `Product #${id} updated successfully via PUT request.`,
      };
    }
  } catch (err) {
    console.warn(`PUT product #${id} failed, updating in local state:`, err.message);
  }

  return {
    product: {
      id,
      name: updatedFields.name || updatedFields.title,
      brand: updatedFields.brand || "Updated Brand",
      category: updatedFields.category || "General",
      price: Number(updatedFields.price) || 0,
      originalPrice: Number(updatedFields.price) * 1.15,
      rating: 4.9,
      image: updatedFields.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
      description: updatedFields.description || "Updated via local fallback.",
      inStock: true,
      stockCount: Number(updatedFields.stock) || 20,
      badge: "Updated",
    },
    status: 200,
    message: `Product #${id} updated locally (HTTP 200 OK).`,
  };
}

// d) Delete products using DELETE
export async function deleteProduct(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`, { timeout: 6000 });
    return {
      id,
      status: response.status || 200,
      message: `Product #${id} deleted successfully via DELETE request.`,
    };
  } catch (err) {
    console.warn(`DELETE product #${id} API call failed, simulating local delete:`, err.message);
    return {
      id,
      status: 200,
      message: `Product #${id} removed locally (HTTP 200 OK).`,
    };
  }
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
      : p.price * 1.15,
    rating: p.rating ? Number(p.rating) : 4.7,
    image: p.thumbnail || (p.images && p.images[0]) || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    description: p.description || "Product item.",
    inStock: p.stock !== undefined ? p.stock > 0 : true,
    stockCount: p.stock || 20,
    badge: p.rating >= 4.7 ? "Top Rated" : "Featured",
  };
}
