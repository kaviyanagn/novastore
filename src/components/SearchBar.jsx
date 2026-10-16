import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

/**
 * SearchBar Component (Golden Effect - Light & Dark Mode)
 * Demonstrates:
 * - useRef: Auto-focusing the search input on mount and programmatic focusing
 * - useState / Props: Two-way binding of search keyword
 */
export default function SearchBar({ searchQuery, setSearchQuery, onFocusCatalog, isDarkMode }) {
  // useRef hook to reference and control the input DOM element directly
  const searchInputRef = useRef(null);

  // useEffect hook using useRef to automatically focus input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Keyboard shortcut listener for '/' key to focus the search field
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClear = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  const handleManualFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.select();
    }
  };

  return (
    <div className="relative flex-1 max-w-xl">
      <div className="relative flex items-center">
        <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
          isDarkMode ? "text-amber-400" : "text-amber-600"
        }`} />
        <input
          ref={searchInputRef}
          type="text"
          id="product-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={onFocusCatalog}
          placeholder="Search catalog, luxury items, tech, apparel... (Press '/' to focus)"
          className={`w-full pl-10 pr-24 py-2.5 text-sm rounded-full transition-all outline-none ${
            isDarkMode
              ? "bg-neutral-900/90 hover:bg-neutral-900 focus:bg-neutral-950 text-amber-50 placeholder-neutral-500 border border-neutral-800 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20"
              : "bg-neutral-100 hover:bg-neutral-50 focus:bg-white text-neutral-900 placeholder-neutral-400 border border-neutral-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15"
          }`}
        />

        <div className="absolute right-2.5 flex items-center gap-1.5">
          {searchQuery && (
            <button
              onClick={handleClear}
              title="Clear search"
              className={`p-1 rounded-full transition-colors ${
                isDarkMode
                  ? "text-amber-400/70 hover:text-amber-300 hover:bg-neutral-800"
                  : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleManualFocus}
            title="Focus input using useRef"
            className={`hidden sm:flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded border shadow-2xs ${
              isDarkMode
                ? "text-amber-400 bg-neutral-900 border-amber-500/30 hover:bg-neutral-800"
                : "text-neutral-800 bg-white border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <span className={`font-mono text-[10px] font-bold ${isDarkMode ? "text-amber-400" : "text-amber-600"}`}>
              useRef
            </span>
            <kbd className={`font-mono text-[10px] px-1 rounded ${
              isDarkMode ? "bg-neutral-800 text-amber-300" : "bg-neutral-100 text-neutral-700"
            }`}>
              /
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
