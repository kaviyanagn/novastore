import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

/**
 * Navbar Component with Authentication status and dynamic links
 */
export default function Navbar() {
  const { cartItemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const getNavClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <Link to="/" className="nav-brand">
        NovaStore
      </Link>

      <nav className="nav-menu">
        <NavLink to="/" end className={getNavClass}>
          Home
        </NavLink>
        <NavLink to="/products" className={getNavClass}>
          Products
        </NavLink>
        <NavLink to="/cart" className={getNavClass}>
          Cart ({cartItemCount})
        </NavLink>
        <NavLink to="/checkout" className={getNavClass}>
          Checkout
        </NavLink>
        <NavLink to="/orders" className={getNavClass}>
          Orders
        </NavLink>

        {isAuthenticated ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              {user?.name || user?.email}
            </span>
            <button
              onClick={logout}
              className="btn btn-danger"
              style={{ padding: "4px 8px", fontSize: "0.75rem" }}
            >
              Logout
            </button>
          </div>
        ) : (
          <NavLink to="/login" className={getNavClass}>
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
}
