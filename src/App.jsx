import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";

// Critical Shell Components
import Header from "./components/Header";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// Requirement a & b: Code splitting via React.lazy for on-demand bundle loading
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => {
  console.log("%c[NovaStore Lazy Loading] 🚀 On-demand chunk loaded: ProductDetailPage", "color: #f59e0b; font-weight: bold; background: #18181c; padding: 4px 8px; border-radius: 4px;");
  return import("./pages/ProductDetailPage");
});
const CartPage = lazy(() => {
  console.log("%c[NovaStore Lazy Loading] 🛒 On-demand chunk loaded: CartPage", "color: #3b82f6; font-weight: bold; background: #18181c; padding: 4px 8px; border-radius: 4px;");
  return import("./pages/CartPage");
});
const CheckoutPage = lazy(() => {
  console.log("%c[NovaStore Lazy Loading] 💳 On-demand chunk loaded: CheckoutPage", "color: #10b981; font-weight: bold; background: #18181c; padding: 4px 8px; border-radius: 4px;");
  return import("./pages/CheckoutPage");
});
const OrderConfirmationPage = lazy(() => import("./pages/OrderConfirmationPage"));
const OrdersLayout = lazy(() => import("./pages/OrdersLayout"));
const CurrentOrders = lazy(() => import("./pages/CurrentOrders"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const HooksExperimentPage = lazy(() => import("./pages/HooksExperimentPage"));
const ApiProductsPage = lazy(() => import("./pages/ApiProductsPage"));
const ReduxStorePage = lazy(() => import("./pages/ReduxStorePage"));
const ProductCrudPage = lazy(() => import("./pages/ProductCrudPage"));
const AuthTokenPage = lazy(() => import("./pages/AuthTokenPage"));

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";

/**
 * Main Application
 * -------------------------------------------------------------
 * Optimization: Lazy loading, Code splitting, Accessible Navigation
 */
function AppLayout() {
  const location = useLocation();
  const isHooks = location.pathname.startsWith("/hooks");

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-neutral-100 flex flex-col font-sans">
      {/* Accessibility: Skip-to-content link for keyboard & screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-400 focus:text-neutral-950 focus:rounded-xl focus:font-black focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Global Header */}
      {!isHooks && <Header isDarkMode={true} />}

      {/* Main Content Router View with Suspense Fallback */}
      <main id="main-content" className="flex-1" tabIndex="-1">
        <Suspense fallback={<Loading message="Loading NovaStore experience..." />}>
          <Routes>
          {/* Step 2: Home Route (Public) */}
          <Route path="/" element={<HomePage />} />

          {/* Product Search, Filtering and Cart Management (Custom Hooks & Context API Experiment) */}
          <Route path="/hooks" element={<HooksExperimentPage />} />
          <Route path="/hooks-experiment" element={<HooksExperimentPage />} />

          {/* Step 3: Product List Route (Public) */}
          <Route path="/products" element={<ProductsPage />} />

          {/* REST API Products (Axios & Fetch, Async/Await, Pagination, Search & Category Filter) */}
          <Route path="/api-products" element={<ApiProductsPage />} />
          <Route path="/rest-api" element={<ApiProductsPage />} />

          {/* Global State Management with Redux Toolkit, Middleware & Persistence */}
          <Route path="/redux-store" element={<ReduxStorePage />} />
          <Route path="/redux" element={<ReduxStorePage />} />

          {/* Product CRUD Operations using APIs (GET, POST, PUT, DELETE) */}
          <Route path="/crud" element={<ProductCrudPage />} />
          <Route path="/product-crud" element={<ProductCrudPage />} />

          {/* Authentication & Token Management with Axios Interceptors */}
          <Route path="/auth-token" element={<AuthTokenPage />} />
          <Route path="/auth-lab" element={<AuthTokenPage />} />

          {/* Step 4 & 5: Product Details Dynamic Route with Add to Cart */}
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* Step 1: Login Route (Controlled Form with Validations) */}
          <Route path="/login" element={<LoginPage />} />

          {/*
            Requirement c: Protected Route for /cart (Step 6)
            Unauthenticated access redirected to /login with state.from
          */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          {/*
            Requirement c: Protected Route for /checkout (Step 7)
          */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          {/*
            Step 8: Order Confirmation
          */}
          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />

          {/*
            Requirement c: Protected Route for /orders (Nested Routing)
          */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="current" replace />} />
            <Route path="current" element={<CurrentOrders />} />
            <Route path="history" element={<OrderHistory />} />
          </Route>

          {/* Wildcard 404 Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </main>

      {/* Footer */}
      {!isHooks && (
        <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500 bg-[#0b0b0e]">
          <p>
            © {new Date().getFullYear()} NovaStore — Protected Routes with Authentication, Context API & Error Boundaries
          </p>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <ErrorBoundary>
              <AppLayout />
            </ErrorBoundary>
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
