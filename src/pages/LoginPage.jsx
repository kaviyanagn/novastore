import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  User,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  Bug,
  Database,
  UserPlus,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import { logClientAction } from "../utils/logger";

/**
 * LoginPage Component (Route: /login)
 * -------------------------------------------------------------
 * Features:
 * - Credentials verified against persistent User Database (IndexedDB & LocalDB)
 * - User Registration: Saves new user accounts into the database
 * - Single-Account CRUD Access Rule: Only admin@novastore.com has access to the CRUD API
 * - ErrorBoundary demonstration trigger
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login,
    register,
    logout,
    user,
    isAuthenticated,
    isCrudAuthorized,
    crudAuthorizedEmail,
  } = useAuth();


  // Target destination route if redirected from ProtectedRoute
  const from = location.state?.from?.pathname || "/cart";

  // Tab mode: 'login' or 'register'
  const [tabMode, setTabMode] = useState("login");

  // Controlled form state for Login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });


  // Controlled form state for Register
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Form validation & feedback state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [triggerError, setTriggerError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ErrorBoundary test trigger
  if (triggerError) {
    throw new Error("Simulated ErrorBoundary Test: Unexpected render error in LoginPage!");
  }

  // Handle Login form change
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: null, form: null }));
    }
  };

  // Handle Register form change
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: null, form: null }));
    }
  };

  // Field validation rules
  const validateField = (field, value, isRegister = false) => {
    let error = null;

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !value.trim()) {
        error = "Email address or username is required.";
      } else if (value.includes("@") && !emailRegex.test(value.trim())) {
        error = "Please enter a valid email address (e.g. user@novastore.com).";
      }
    } else if (field === "password") {
      if (!value) {
        error = "Password is required.";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters in length.";
      }
    } else if (field === "name" && isRegister) {
      if (!value || !value.trim()) {
        error = "Full Name is required for registration.";
      }
    } else if (field === "confirmPassword" && isRegister) {
      if (!value) {
        error = "Please confirm your password.";
      } else if (value !== registerData.password) {
        error = "Passwords do not match.";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  // Submit Login: Checks credentials against persistent Database
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const emailErr = validateField("email", loginData.email);
    const passErr = validateField("password", loginData.password);
    setTouched({ email: true, password: true });

    if (emailErr || passErr) {
      logClientAction("[Function: handleLoginSubmit] ❌ Login Form Validation Failed", {
        errors: { email: emailErr, password: passErr },
      });
      return;
    }

    try {
      logClientAction(`[Function: handleLoginSubmit] 🔍 Verifying credentials in Database for ${loginData.email}...`);

      // Calls AuthContext login -> verified by userDatabase.js
      const result = await login(loginData.email, loginData.password);

      logClientAction(`[Function: handleLoginSubmit] ✅ Database Authentication Succeeded! User: ${result.user.name}`);
      setIsSuccess(true);
      setSuccessMessage(
        `Welcome back, ${result.user.name}! Database credentials verified.`
      );

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 700);
    } catch (err) {
      logClientAction(`[Function: handleLoginSubmit] ❌ Database Authentication Failed: ${err.message}`);
      setErrors((prev) => ({
        ...prev,
        form: err.message || "Invalid credentials. Please verify your email and password.",
      }));
    }
  };

  // Submit Registration: Stores new user in persistent Database
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const nameErr = validateField("name", registerData.name, true);
    const emailErr = validateField("email", registerData.email, true);
    const passErr = validateField("password", registerData.password, true);
    const confirmErr = validateField("confirmPassword", registerData.confirmPassword, true);

    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (nameErr || emailErr || passErr || confirmErr) {
      return;
    }

    try {
      logClientAction(`[Function: handleRegisterSubmit] 💾 Registering user "${registerData.name}" into Database...`);

      // Calls AuthContext register -> saves to userDatabase.js and logs in
      const result = await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      });

      logClientAction(`[Function: handleRegisterSubmit] ✅ User stored in Database: ${result.user.email}`);
      setIsSuccess(true);
      setSuccessMessage(
        `Account created successfully and stored in the database! Signed in as ${result.user.name}.`
      );

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 900);
    } catch (err) {
      logClientAction(`[Function: handleRegisterSubmit] ❌ Database Registration Failed: ${err.message}`);
      setErrors((prev) => ({
        ...prev,
        form: err.message || "Failed to create user in database.",
      }));
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10 text-left space-y-6">
      {/* Protected Route Redirection Notice */}
      {location.state?.from && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-3 animate-fade-in">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-white font-bold">Authentication Required</strong>
            <span>
              You attempted to access protected route{" "}
              <code className="text-amber-300 font-mono font-bold bg-neutral-900 px-1 py-0.5 rounded">
                {location.state.from.pathname}
              </code>
              . Please sign in with your database credentials below to proceed.
            </span>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="p-8 rounded-3xl border border-neutral-800 bg-[#141418] shadow-2xl space-y-6">
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-400 text-neutral-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/25">
            <Database className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Database Connected (IndexedDB & Local Storage)</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            {tabMode === "login" ? "Database Account Login" : "Create Database Account"}
          </h2>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {tabMode === "login"
              ? "Credentials are verified directly against registered database accounts. Only the single authorized Admin account can access the CRUD API."
              : "Register a new user profile stored persistently in the database."}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        {!isAuthenticated && (
          <div className="flex rounded-2xl bg-neutral-900 p-1 border border-neutral-800">
            <button
              type="button"
              onClick={() => {
                setTabMode("login");
                setErrors({});
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                tabMode === "login"
                  ? "bg-amber-400 text-neutral-950 shadow-md font-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTabMode("register");
                setErrors({});
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                tabMode === "register"
                  ? "bg-amber-400 text-neutral-950 shadow-md font-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* Currently Authenticated State */}
        {isAuthenticated && !isSuccess ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-bold text-white">Currently Signed In:</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Name:</span>
                  <span className="text-neutral-200 font-bold">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Email:</span>
                  <span className="text-neutral-200">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Role:</span>
                  <span className="text-amber-400 font-bold">{user?.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">CRUD API Access:</span>
                  <span
                    className={`font-bold ${
                      isCrudAuthorized ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {isCrudAuthorized ? "⭐ Authorized (Admin Only)" : "⛔ Restricted (Customer)"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              {isCrudAuthorized && (
                <Button
                  variant="primary"
                  onClick={() => navigate("/crud")}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-neutral-950 font-black hover:opacity-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Access Product CRUD API</span>
                </Button>
              )}

              <Button
                variant={isCrudAuthorized ? "outline" : "primary"}
                onClick={() => navigate(from, { replace: true })}
                className="w-full"
              >
                <span>Proceed to {from === "/" ? "Home" : "Destination"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                onClick={logout}
                className="w-full border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Current Account</span>
              </Button>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center space-y-2 animate-fade-in">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-black text-white">Database Verification Succeeded!</h3>
            <p className="text-neutral-300 text-[11px]">{successMessage}</p>
            <p className="text-amber-400 font-mono text-[11px] pt-1">
              Redirecting to {from}...
            </p>
          </div>
        ) : tabMode === "login" ? (
          /* ================= LOGIN FORM ================= */
          <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
            {/* Form Error Banner */}
            {errors.form && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errors.form}</span>
              </div>
            )}

            <Input
              label="Username or Email Address"
              name="email"
              type="text"
              icon={Mail}
              value={loginData.email}
              onChange={handleLoginChange}
              onBlur={() => validateField("email", loginData.email)}
              placeholder="e.g. admin@novastore.com or customer@novastore.com"
              error={touched.email ? errors.email : ""}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                icon={Lock}
                value={loginData.password}
                onChange={handleLoginChange}
                onBlur={() => validateField("password", loginData.password)}
                placeholder="Enter account password"
                error={touched.password ? errors.password : ""}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-8.5 z-10 p-1 rounded-lg text-neutral-400 hover:text-amber-400 bg-neutral-900/80 hover:bg-neutral-800 transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3.5 font-black"
                id="submit-login-btn"
              >
                <span>Verify Credentials & Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        ) : (
          /* ================= REGISTER FORM ================= */
          <form onSubmit={handleRegisterSubmit} className="space-y-4" noValidate>
            {/* Form Error Banner */}
            {errors.form && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errors.form}</span>
              </div>
            )}

            <Input
              label="Full Name"
              name="name"
              type="text"
              icon={User}
              value={registerData.name}
              onChange={handleRegisterChange}
              onBlur={() => validateField("name", registerData.name, true)}
              placeholder="e.g. Sarah Connor"
              error={touched.name ? errors.name : ""}
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              value={registerData.email}
              onChange={handleRegisterChange}
              onBlur={() => validateField("email", registerData.email, true)}
              placeholder="e.g. sarah@example.com"
              error={touched.email ? errors.email : ""}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                icon={Lock}
                value={registerData.password}
                onChange={handleRegisterChange}
                onBlur={() => validateField("password", registerData.password, true)}
                placeholder="Minimum 6 characters"
                error={touched.password ? errors.password : ""}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-8.5 z-10 p-1 rounded-lg text-neutral-400 hover:text-amber-400 bg-neutral-900/80 hover:bg-neutral-800 transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                icon={Lock}
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                onBlur={() => validateField("confirmPassword", registerData.confirmPassword, true)}
                placeholder="Re-enter password"
                error={touched.confirmPassword ? errors.confirmPassword : ""}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-8.5 z-10 p-1 rounded-lg text-neutral-400 hover:text-amber-400 bg-neutral-900/80 hover:bg-neutral-800 transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
              <strong className="text-amber-400 font-bold block mb-1">Single Account Security Policy:</strong>
              New accounts registered in the database are assigned the <span className="text-white font-semibold">Customer</span> role. Access to the CRUD API is strictly restricted to the primary Administrator account (<code className="text-amber-300 font-mono font-bold">{crudAuthorizedEmail}</code>).
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3.5 font-black"
                id="submit-register-btn"
              >
                <span>Save to Database & Sign In</span>
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
          </form>
        )}

        {/* ErrorBoundary Demonstration Trigger */}
        <div className="pt-2 border-t border-neutral-800/80">
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
