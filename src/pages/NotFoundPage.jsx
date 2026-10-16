import React from "react";
import { Link } from "react-router-dom";

/**
 * Wildcard 404 Route Component
 */
export default function NotFoundPage() {
  return (
    <div className="card" style={{ maxWidth: "500px", margin: "40px auto", textAlign: "center", padding: "40px" }}>
      <h1 style={{ fontSize: "3rem", color: "var(--primary)", margin: "0" }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ color: "var(--muted)", margin: "16px 0 24px" }}>
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
