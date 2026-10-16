import React from "react";
import { Link } from "react-router-dom";

/**
 * Clean, professional Footer component
 */
export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        padding: "36px 20px 24px",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "28px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h3 style={{ color: "var(--primary)", margin: "0 0 10px 0" }}>NovaStore</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
            Premium e-commerce platform offering top-tier electronics, designer
            apparel, and home essentials with guaranteed fast shipping.
          </p>
        </div>

        <div>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "0.95rem" }}>Quick Navigation</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem" }}>
            <Link to="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
            <Link to="/products" style={{ color: "var(--muted)", textDecoration: "none" }}>Products Catalog</Link>
            <Link to="/cart" style={{ color: "var(--muted)", textDecoration: "none" }}>Shopping Cart</Link>
            <Link to="/orders" style={{ color: "var(--muted)", textDecoration: "none" }}>My Orders</Link>
          </div>
        </div>

        <div>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "0.95rem" }}>Customer Service</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--muted)" }}>
            <span>Free Delivery on $50+</span>
            <span>2-Year Official Warranty</span>
            <span>30-Day Hassle-Free Returns</span>
            <span>24/7 Priority Support</span>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          borderTop: "1px solid var(--border)",
          paddingTop: "16px",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "var(--muted)",
        }}
      >
        &copy; {new Date().getFullYear()} NovaStore Inc. All rights reserved.
      </div>
    </footer>
  );
}
