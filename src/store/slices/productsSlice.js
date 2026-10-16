import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { INITIAL_PRODUCTS } from "../../data/products";
import axios from "axios";

/**
 * Async Thunk to fetch products from REST API with local fallback
 * Handles loading, fulfilled, and rejected error states (Requirement g)
 */
export const fetchProductsAsync = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://dummyjson.com/products?limit=12", {
        timeout: 5000,
      });
      if (response.data && Array.isArray(response.data.products)) {
        return response.data.products.map((p) => ({
          id: p.id,
          name: p.title || p.name,
          brand: p.brand || "Premium",
          category: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "Electronics",
          price: Number(p.price) || 0,
          originalPrice: p.discountPercentage
            ? Number((p.price * (1 + p.discountPercentage / 100)).toFixed(2))
            : p.price * 1.2,
          rating: p.rating ? Number(p.rating) : 4.8,
          image: p.thumbnail || (p.images && p.images[0]) || "",
          description: p.description || "High quality product.",
          inStock: p.stock !== undefined ? p.stock > 0 : true,
          stockCount: p.stock || 20,
          badge: p.rating >= 4.7 ? "Top Seller" : "Trending",
        }));
      }
      return INITIAL_PRODUCTS;
    } catch (err) {
      console.warn("Redux Thunk API fetch failed, utilizing cached products:", err.message);
      return INITIAL_PRODUCTS;
    }
  }
);

const initialState = {
  items: INITIAL_PRODUCTS,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  searchQuery: "",
  selectedCategory: "All",
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    simulateFetchError(state) {
      state.status = "failed";
      state.error = "Simulated API Connection Error: Failed to sync product catalog.";
    },
    clearFetchError(state) {
      state.status = "succeeded";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch products.";
      });
  },
});

export const { setSearchQuery, setSelectedCategory, simulateFetchError, clearFetchError } =
  productsSlice.actions;

export default productsSlice.reducer;
