import React from "react";
import { SlidersHorizontal, RotateCcw, Star, X, Tag } from "lucide-react";

/**
 * FilterPanel Component (Header Side Filter Options - Golden Light/Dark)
 * Controls filters:
 * - Brand selection (Requirement a)
 * - Price ceiling range (Requirement a)
 * - Minimum rating (Requirement a)
 * - In-Stock availability toggle
 * - Sorting criteria
 */
export default function FilterPanel({
  filters,
  setFilters,
  selectedBrand,
  setSelectedBrand,
  brands = [],
  onResetFilters,
  activeFilterCount,
  isOpen,
  onClose,
  isDarkMode
}) {
  if (!isOpen) return null;

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value }));
  };

  const handlePriceChange = (e) => {
    setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }));
  };

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating
    }));
  };

  const handleStockToggle = () => {
    setFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }));
  };

  const handleBrandChange = (e) => {
    if (setSelectedBrand) {
      setSelectedBrand(e.target.value);
    }
  };

  return (
    <div
      className={`absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl p-5 shadow-2xl z-50 text-left animate-fade-in backdrop-blur-xl border ${
        isDarkMode
          ? "bg-[#121215]/98 border-amber-500/35 shadow-black/80 text-neutral-100"
          : "bg-white/98 border-amber-500/30 shadow-neutral-900/15 text-neutral-900"
      }`}
    >
      {/* Panel Header */}
      <div className={`flex items-center justify-between pb-3 border-b ${
        isDarkMode ? "border-neutral-800" : "border-neutral-200"
      }`}>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-500" />
          <h3 className={`text-sm font-bold m-0 ${isDarkMode ? "text-amber-100" : "text-neutral-950"}`}>
            Filter Options
          </h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 text-[11px] font-black bg-amber-400 text-neutral-950 rounded-full shadow-xs">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-600 font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isDarkMode
                ? "text-neutral-400 hover:text-amber-300 hover:bg-neutral-800"
                : "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
            aria-label="Close filters"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4 pt-3 max-h-[75vh] overflow-y-auto pr-1">
        {/* Requirement a: Brand Filtering */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="header-brand-select" className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDarkMode ? "text-amber-300" : "text-neutral-700"
            }`}>
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              <span>Brand Filter</span>
            </label>
            {selectedBrand && selectedBrand !== "All" && (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/15 px-2 py-0.5 rounded">
                Active: {selectedBrand}
              </span>
            )}
          </div>
          <select
            id="header-brand-select"
            value={selectedBrand || "All"}
            onChange={handleBrandChange}
            className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-none cursor-pointer border transition-colors ${
              isDarkMode
                ? "bg-neutral-900 border-neutral-800 text-amber-100 focus:border-amber-400"
                : "bg-neutral-100 border-neutral-200 text-neutral-900 focus:border-amber-500"
            }`}
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b === "All" ? "All Brands (Sony, Apple, Nike, etc.)" : b}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className={`space-y-1.5 pt-2 border-t ${isDarkMode ? "border-neutral-800" : "border-neutral-200"}`}>
          <label htmlFor="header-sort-by" className={`text-xs font-bold uppercase tracking-wider block ${
            isDarkMode ? "text-amber-300" : "text-neutral-700"
          }`}>
            Sort Order
          </label>
          <select
            id="header-sort-by"
            value={filters.sortBy}
            onChange={handleSortChange}
            className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-none cursor-pointer border transition-colors ${
              isDarkMode
                ? "bg-neutral-900 border-neutral-800 text-amber-100 focus:border-amber-400"
                : "bg-neutral-100 border-neutral-200 text-neutral-900 focus:border-amber-500"
            }`}
          >
            <option value="featured">Featured & Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated (★)</option>
            <option value="reviews-desc">Most Reviewed</option>
          </select>
        </div>

        {/* Requirement a: Price Range Slider */}
        <div className={`space-y-2 pt-2 border-t ${isDarkMode ? "border-neutral-800" : "border-neutral-200"}`}>
          <div className="flex items-center justify-between">
            <label htmlFor="header-price-slider" className={`text-xs font-bold uppercase tracking-wider ${
              isDarkMode ? "text-amber-300" : "text-neutral-700"
            }`}>
              Max Price
            </label>
            <span className="text-xs font-black text-neutral-950 bg-gradient-to-r from-amber-400 to-yellow-400 px-2.5 py-0.5 rounded-md shadow-xs">
              ${filters.maxPrice}
            </span>
          </div>
          <input
            id="header-price-slider"
            type="range"
            min="50"
            max="1500"
            step="25"
            value={filters.maxPrice}
            onChange={handlePriceChange}
            className={`w-full accent-amber-500 cursor-pointer h-1.5 rounded-lg ${
              isDarkMode ? "bg-neutral-800" : "bg-neutral-200"
            }`}
          />
          <div className={`flex justify-between text-[10px] font-mono ${
            isDarkMode ? "text-neutral-500" : "text-neutral-400"
          }`}>
            <span>$50</span>
            <span>$750</span>
            <span>$1,500</span>
          </div>
        </div>

        {/* Requirement a: Minimum Rating Filter */}
        <div className={`space-y-2 pt-2 border-t ${isDarkMode ? "border-neutral-800" : "border-neutral-200"}`}>
          <label className={`text-xs font-bold uppercase tracking-wider block ${
            isDarkMode ? "text-amber-300" : "text-neutral-700"
          }`}>
            Customer Rating
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[4.8, 4.5, 4.0].map((rating) => {
              const isSelected = filters.minRating === rating;
              return (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-amber-400 text-neutral-950 font-bold border-amber-300 shadow-sm"
                      : isDarkMode
                      ? "border-neutral-800 text-neutral-300 hover:bg-neutral-800"
                      : "border-neutral-200 text-neutral-800 hover:bg-neutral-100"
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${isSelected ? "fill-neutral-950 text-neutral-950" : "fill-amber-400 text-amber-500"}`} />
                  <span>{rating}★ & up</span>
                </button>
              );
            })}
            <button
              onClick={() => handleRatingChange(0)}
              className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                filters.minRating === 0
                  ? isDarkMode
                    ? "bg-neutral-800 text-amber-300 border-amber-400/50 font-bold"
                    : "bg-neutral-200 text-neutral-900 border-neutral-300 font-bold"
                  : isDarkMode
                  ? "border-neutral-800 text-neutral-300 hover:bg-neutral-800"
                  : "border-neutral-200 text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              All Ratings
            </button>
          </div>
        </div>

        {/* Availability / Stock Toggle */}
        <div className={`pt-2 border-t ${isDarkMode ? "border-neutral-800" : "border-neutral-200"}`}>
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="text-xs">
              <span className={`font-semibold block ${isDarkMode ? "text-neutral-100" : "text-neutral-900"}`}>
                In-Stock Only
              </span>
              <span className={`text-[11px] ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
                Exclude unavailable items
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={filters.inStockOnly}
              onClick={handleStockToggle}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                filters.inStockOnly ? "bg-amber-400 shadow-sm" : isDarkMode ? "bg-neutral-800" : "bg-neutral-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-sm ring-0 transition duration-200 ease-in-out ${
                  filters.inStockOnly
                    ? "translate-x-4 bg-neutral-950"
                    : isDarkMode
                    ? "translate-x-0 bg-neutral-400"
                    : "translate-x-0 bg-white"
                }`}
              />
            </button>
          </label>
        </div>

      </div>
    </div>
  );
}
