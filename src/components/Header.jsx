import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ShoppingBag,
  Truck,
  User,
  LogOut,
  CreditCard,
  Lock,
  Package,
  Home,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Moon,
  Layers,
  Database,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";

/**
 * Header Component
 * -------------------------------------------------------------
 * Supports both:
 * 1) Custom Hooks & Context API Experiment (SearchBar, FilterPanel, Categories, Theme)
 * 2) Protected Routes & Authentication Flow
 */
export default function Header({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  brands,
  categories,
  filters,
  setFilters,
  onResetFilters,
  activeFilterCount = 0,
  isDarkMode = true,
  toggleTheme,
  onOpenCart,
}) {
  const { user, isAuthenticated, logout, isCrudAuthorized } = useAuth();
  const cartContext = useCart();

  const navigate = useNavigate();

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const isHooksMode = searchQuery !== undefined;
  const cartItems = cartContext?.cartItems || [];
  const cartItemCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
      isActive
        ? "bg-gradient-to-r from-amber-400/20 to-yellow-400/20 text-amber-400 border border-amber-400/40 shadow-xs"
        : isDarkMode
        ? "text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/80 border border-transparent"
        : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 border border-transparent"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-xl transition-colors bg-[#0b0b0e]/95 border-neutral-800 text-white shadow-xl shadow-black/40">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-1 text-center text-[11px] font-black text-neutral-950">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 mx-auto">
            <Sparkles className="w-3.5 h-3.5 fill-neutral-950" />
            <span>
              {isHooksMode
                ? "Custom Hooks (useProducts, useCart) • Context API • useState • useEffect • useMemo • useCallback"
                : "Protected Routes • Context API • Form Validation • Error Boundaries"}
            </span>
          </span>
          <NavLink
            to={isHooksMode ? "/" : "/hooks"}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black text-amber-400 text-[10px] font-black uppercase tracking-wider hover:bg-neutral-900 transition-colors"
          >
            <Layers className="w-3 h-3" />
            <span>{isHooksMode ? "Exit to Main App" : "View Hooks Experiment"}</span>
          </NavLink>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 relative">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand Logo with Link */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center text-neutral-950 shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-neutral-950" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight leading-none block">
                Nova<span className="text-amber-400">Store</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">
                {isHooksMode ? "Custom Hooks & Context" : "Protected Routes Edition"}
              </span>
            </div>
          </Link>

          {isHooksMode ? (
            /* Hooks Mode: SearchBar & Header Controls */
            <>
              <div className="flex-1 max-w-xl mx-2">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  isDarkMode={isDarkMode}
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Filter Trigger Button */}
                <button
                  type="button"
                  id="header-filters-toggle-btn"
                  onClick={() => setIsFilterPanelOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isFilterPanelOpen || activeFilterCount > 0
                      ? "bg-amber-400 text-neutral-950 border-amber-300 shadow-md font-black"
                      : "bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-amber-400/60"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="min-w-4 h-4 px-1 rounded-full text-[10px] bg-black text-amber-300 flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Theme Toggle */}
                {toggleTheme && (
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-amber-400/60 text-amber-400 transition-colors cursor-pointer"
                    title="Toggle Theme"
                  >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                )}

                {/* Cart Drawer Trigger */}
                <button
                  type="button"
                  id="header-cart-btn"
                  onClick={onOpenCart || (() => navigate("/cart"))}
                  className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 font-black text-xs shadow-md shadow-amber-500/20 cursor-pointer transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Cart</span>
                  <span className="min-w-5 h-5 px-1 rounded-full bg-neutral-950 text-amber-400 text-[11px] font-bold flex items-center justify-center">
                    {cartItemCount}
                  </span>
                </button>
              </div>
            </>
          ) : (
            /* Standard Mode: Navigation Links & Auth */
            <>
              <nav className="hidden md:flex items-center gap-1">
                <NavLink to="/" end className={navLinkClass}>
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </NavLink>
                <NavLink to="/hooks" className={navLinkClass}>
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hooks Lab</span>
                </NavLink>
                <NavLink to="/products" className={navLinkClass}>
                  <Package className="w-3.5 h-3.5" />
                  <span>Products</span>
                </NavLink>
                <NavLink
                  to="/crud"
                  className={navLinkClass}
                  title={isCrudAuthorized ? "CRUD API (Authorized Administrator)" : "CRUD API (Single Admin Account Only)"}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CRUD APIs</span>
                  {!isCrudAuthorized && <Lock className="w-2.5 h-2.5 text-amber-400/80" />}
                </NavLink>
                <NavLink to="/cart" className={navLinkClass}>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Cart</span>
                  {!isAuthenticated && <Lock className="w-2.5 h-2.5 text-amber-400/80" />}
                </NavLink>
                <NavLink to="/checkout" className={navLinkClass}>
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Checkout</span>
                  {!isAuthenticated && <Lock className="w-2.5 h-2.5 text-amber-400/80" />}
                </NavLink>
                <NavLink to="/orders" className={navLinkClass}>
                  <Truck className="w-3.5 h-3.5" />
                  <span>Orders</span>
                  {!isAuthenticated && <Lock className="w-2.5 h-2.5 text-amber-400/80" />}
                </NavLink>
              </nav>

              <div className="flex items-center gap-2">
                <NavLink
                  to="/cart"
                  id="header-cart-btn"
                  className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-xs font-bold text-neutral-200 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Cart</span>
                  <span className="flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-black bg-amber-400 text-neutral-950 rounded-full">
                    {cartItemCount}
                  </span>
                </NavLink>

                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <span className="block text-[11px] font-bold text-white line-clamp-1">
                          {user?.name || user?.email}
                        </span>
                        <span className="block text-[9px] text-emerald-400 font-mono">
                          Authenticated
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      id="nav-logout-btn"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
                      title="Sign out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                ) : (
                  <NavLink
                    to="/login"
                    id="nav-login-btn"
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isActive
                          ? "bg-amber-400/20 text-amber-400 border-amber-400/40"
                          : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-400/50"
                      }`
                    }
                  >
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sign In</span>
                  </NavLink>
                )}
              </div>
            </>
          )}
        </div>

        {/* Categories Bar in Hooks Mode */}
        {isHooksMode && categories && categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 border-t border-neutral-800/80 mt-2 text-xs scrollbar-none">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 shrink-0">
              Category:
            </span>
            <div className="flex items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory && setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                    selectedCategory === cat
                      ? "bg-amber-400 text-neutral-950 border-amber-300 font-black shadow-md shadow-amber-400/20"
                      : "bg-neutral-900/90 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FilterPanel dropdown */}
        {isHooksMode && (
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            brands={brands}
            onResetFilters={onResetFilters}
            activeFilterCount={activeFilterCount}
            isOpen={isFilterPanelOpen}
            onClose={() => setIsFilterPanelOpen(false)}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Mobile Navigation Links in Standard Mode */}
        {!isHooksMode && (
          <div className="md:hidden flex items-center justify-around border-t border-neutral-800/60 pt-2 mt-2 text-[11px]">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/hooks" className={navLinkClass}>Hooks</NavLink>
            <NavLink to="/products" className={navLinkClass}>Products</NavLink>
            <NavLink to="/cart" className={navLinkClass}>Cart</NavLink>
            <NavLink to="/checkout" className={navLinkClass}>Checkout</NavLink>
            <NavLink to="/orders" className={navLinkClass}>Orders</NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
