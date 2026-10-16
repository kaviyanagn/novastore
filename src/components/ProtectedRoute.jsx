import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logClientAction } from "../utils/logger";

/**
 * Reusable ProtectedRoute Component (Requirement c, d, h)
 * Restricts access to authenticated users.
 * Redirects unauthenticated users to /login and saves current location in state.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    logClientAction(`[ProtectedRoute Guard] 🔒 Protected route "${location.pathname}" blocked: User is not logged in!`, {
      functionName: "ProtectedRoute({ children })",
      status: "REDIRECT_TO_LOGIN",
      requestedRoute: location.pathname,
      currentUser: user || null,
      explanation: "This route requires authentication. Redirecting to /login now.",
    });
    // Requirement d: Redirect to /login using Navigate component
    // Requirement e: Pass requested path in state so Login can redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
