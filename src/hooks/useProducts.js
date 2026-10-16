import { useState, useEffect, useMemo, useCallback } from "react";
import { INITIAL_PRODUCTS, CATEGORIES, BRANDS } from "../data/products";

/**
 * Custom Hook: useProducts
 * Requirement a) Manage product data, product search, category filtering,
 * brand filtering, price filtering, and rating filtering.
 *
 * Demonstrates:
 * - useState: local state for products, search keywords, category, brand, and filter options
 * - useEffect: async loading simulation of product dataset and sync document title
 * - useMemo: efficient memoization of filtered and sorted products & active filter count
 * - useCallback: memoized reset filter function
 */
export function useProducts() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);

  // Search keyword state
  const [searchQuery, setSearchQuery] = useState("");

  // Category filtering state
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Brand filtering state
  const [selectedBrand, setSelectedBrand] = useState("All");

  // Filter criteria state (price ceiling, minimum rating, stock status, sorting)
  const [filters, setFilters] = useState({
    maxPrice: 1500,
    minRating: 0,
    inStockOnly: false,
    sortBy: "featured",
  });

  // Load product data with realistic async simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(INITIAL_PRODUCTS);
      setIsLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort products using useMemo for optimal rendering performance
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Category Filtering
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // 2. Brand Filtering
    if (selectedBrand !== "All") {
      result = result.filter(
        (item) => item.brand && item.brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // 3. Product Search (matches name, description, brand, or category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.brand && item.brand.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    // 4. Price Filtering (max price threshold)
    if (filters.maxPrice) {
      result = result.filter((item) => item.price <= filters.maxPrice);
    }

    // 5. Rating Filtering (minimum rating threshold)
    if (filters.minRating > 0) {
      result = result.filter((item) => item.rating >= filters.minRating);
    }

    // 6. In-Stock Filtering
    if (filters.inStockOnly) {
      result = result.filter((item) => item.inStock);
    }

    // 7. Sorting Criteria
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews-desc":
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      default:
        // 'featured' maintains default curated sequence
        break;
    }

    return result;
  }, [products, selectedCategory, selectedBrand, searchQuery, filters]);

  // Dynamically update document title when search & filtering criteria change
  useEffect(() => {
    document.title = `NovaStore (${filteredProducts.length} Products) — Custom Hooks & Context`;
  }, [filteredProducts.length, searchQuery, selectedCategory, selectedBrand, filters]);

  // Memoized count of active filters for UI badges
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (selectedBrand !== "All") count++;
    if (searchQuery.trim() !== "") count++;
    if (filters.maxPrice < 1500) count++;
    if (filters.minRating > 0) count++;
    if (filters.inStockOnly) count++;
    if (filters.sortBy !== "featured") count++;
    return count;
  }, [selectedCategory, selectedBrand, searchQuery, filters]);

  // Reset all search and filter conditions
  const resetFilters = useCallback(() => {
    setSelectedCategory("All");
    setSelectedBrand("All");
    setSearchQuery("");
    setFilters({
      maxPrice: 1500,
      minRating: 0,
      inStockOnly: false,
      sortBy: "featured",
    });
  }, []);

  return {
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
    categories: CATEGORIES,
    brands: BRANDS,
  };
}

export default useProducts;
