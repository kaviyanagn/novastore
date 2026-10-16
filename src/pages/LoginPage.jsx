import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  User,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  Bug,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import { logClientAction } from "../utils/logger";

/**
 * LoginPage Component (Route: /login)
 * -------------------------------------------------------------
 * Requirements:
 * a) Develop a Login component using controlled components to collect username/email & password.
 * b) Consumes AuthContext to maintain authentication status.
 * d) Receives redirected unauthenticated users from ProtectedRoute with location.state.from.
 * e) After successful login, redirects user to requested protected page.
 * f) Validates required fields, email format, and password length (min 6 characters).
 * g) ErrorBoundary simulation trigger to demonstrate error catching.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, user, isAuthenticated } = useAuth();

  // Requirement e: Target destination route if redirected from ProtectedRoute
  const from = location.state?.from?.pathname || "/cart";

  // Requirement a: Controlled form state
  const [formData, setFormData] = useState({
    email: "alex.morgan@novastore.com",
    password: "password123",
  });

  // Requirement f: Form validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [triggerError, setTriggerError] = useState(false);

  // Requirement g: ErrorBoundary test trigger
  if (triggerError) {
    throw new Error("Simulated ErrorBoundary Test: Unexpected render error in LoginPage!");
  }

  // Requirement a: Controlled change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  // Requirement f: Form validation rules
  const validateField = (field, value) => {
    let error = null;

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !value.trim()) {
        error = "Email address or username is required.";
      } else if (!emailRegex.test(value.trim())) {
        error = "Please enter a valid email address (e.g. user@novastore.com).";
      }
    } else if (field === "password") {
      if (!value) {
        error = "Password is required.";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters in length.";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailErr = validateField("email", formData.email);
    const passErr = validateField("password", formData.password);

    setTouched({ email: true, password: true });

    if (emailErr || passErr) {
      logClientAction("[Function: handleSubmit] ❌ Login Form Validation Failed", {
        functionName: "handleSubmit(e)",
        status: "VALIDATION_ERROR",
        errors: { email: emailErr, password: passErr },
        whyNotWorking: "Required credentials failed validation. Please fix the highlighted errors.",
      });
      return;
    }

    try {
      // Authenticate user via AuthContext (Requirement b)
      const displayName = formData.email.split("@")[0] || "Customer";
      const userPayload = {
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email: formData.email,
        role: "Verified Member",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      };

      logClientAction(`[Function: handleSubmit] 🔑 Logging in as "${userPayload.name}" (${formData.email})`, {
        functionName: "await login(userPayload, password)",
        email: formData.email,
        status: "AUTHENTICATING",
      });

      await login(userPayload, formData.password);

      logClientAction(`[Function: handleSubmit] ✅ Login Successful! Redirecting to "${from}"`, {
        status: "AUTHENTICATED",
        user: userPayload,
        redirectTarget: from,
      });

      setIsSuccess(true);

      // Requirement e: Redirect to requested protected page or home
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (err) {
      logClientAction(`[Function: handleSubmit] ❌ Login Failed: ${err.message}`, {
        status: "LOGIN_REJECTED",
        error: err.message,
      });
      setErrors((prev) => ({ ...prev, form: err.message || "Invalid credentials." }));
    }
  };

  const handleQuickDemo = (demoEmail, demoPass) => {
    setFormData({
      email: demoEmail,
      password: demoPass,
    });
    setErrors({});
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-left space-y-6">
      {/* Protected Route Redirection Notice (Requirement d & e) */}
      {location.state?.from && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-3 animate-fade-in">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-white font-bold">Authentication Required</strong>
            <span>
              You attempted to access protected route{" "}
              <code className="text-amber-300 font-mono font-bold bg-neutral-900 px-1 py-0.5 rounded">
                {location.state.from.pathname}
              </code>
              . Please sign in below to continue.
            </span>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <div className="p-8 rounded-3xl border border-neutral-800 bg-[#141418] shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-400 text-neutral-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/25">
            <User className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-black">
            Topic: Protected Routes & AuthContext
          </span>
          <h2 className="text-2xl font-black text-white">Customer Sign In</h2>
          <p className="text-xs text-neutral-400">
            Sign in to access your protected shopping cart, express checkout, and order history.
          </p>
        </div>

        {/* If already authenticated */}
        {isAuthenticated && !isSuccess ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Currently Signed In:</span>
                <span className="font-mono text-emerald-200">{user?.email}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="primary"
                onClick={() => navigate(from, { replace: true })}
                className="w-full"
              >
                <span>Proceed to {from === "/" ? "Home" : "Protected Destination"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                onClick={logout}
                className="w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Current Account</span>
              </Button>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center space-y-2 animate-fade-in">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-black text-white">Authentication Successful!</h3>
            <p className="text-neutral-300 text-[11px]">
              Requirement e: Redirecting to requested page{" "}
              <code className="text-amber-400 font-mono font-bold">{from}</code>...
            </p>
          </div>
        ) : (
          /* Controlled Login Form (Requirements a & f) */
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Username / Email Address"
              name="email"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              placeholder="e.g. alex.morgan@novastore.com"
              error={touched.email ? errors.email : ""}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              placeholder="Minimum 6 characters"
              error={touched.password ? errors.password : ""}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3.5"
                id="submit-login-btn"
              >
                <span>Sign In & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Demo Pre-fill helper buttons */}
            <div className="pt-3 border-t border-neutral-800 text-center space-y-2">
              <span className="text-[11px] text-neutral-500 block">
                Quick Demo Credentials:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("alex.morgan@novastore.com", "password123")}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-700 text-[11px] font-mono cursor-pointer"
                >
                  alex.morgan@novastore.com
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("vip.customer@novastore.com", "vipsecret2026")}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-700 text-[11px] font-mono cursor-pointer"
                >
                  vip.customer@novastore.com
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Requirement g: ErrorBoundary Demonstration Trigger */}
        <div className="pt-4 border-t border-neutral-800/80">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Bug className="w-3.5 h-3.5 text-rose-400" />
              <span>ErrorBoundary Test:</span>
            </span>
            <button
              type="button"
              onClick={() => setTriggerError(true)}
              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer"
              id="test-error-boundary-btn"
            >
              Trigger Render Error
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
