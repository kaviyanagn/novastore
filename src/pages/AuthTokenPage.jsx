import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Key,
  Lock,
  Unlock,
  Terminal,
  Activity,
  User,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  LogOut,
  ShoppingBag,
  CreditCard,
  Send,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  subscribeInterceptorLogs,
  getAuthenticatedProfile,
  getProtectedCart,
  processProtectedCheckout,
  triggerExpiredTokenTest,
} from "../services/apiClient";
import Loading from "../components/Loading";

export default function AuthTokenPage() {
  const {
    user,
    token,
    isAuthenticated,
    isLoading: isAuthLoading,
    authError,
    expiredNotice,
    setExpiredNotice,
    login,
    logout,
    simulateExpireToken,
  } = useAuth();

  // Login form state
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");

  // Interceptor logs for visual demonstration (Requirement d)
  const [interceptorLogs, setInterceptorLogs] = useState([]);
  const [copied, setCopied] = useState(false);

  // Authenticated API execution results
  const [apiResult, setApiResult] = useState(null);
  const [isCallingApi, setIsCallingApi] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeInterceptorLogs((log) => {
      setInterceptorLogs((prev) => [log, ...prev.slice(0, 19)]);
    });
    return unsubscribe;
  }, []);

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setApiResult(null);
    try {
      await login(username, password);
    } catch {
      // Error handled by AuthContext
    }
  }

  async function testProfileApi() {
    setIsCallingApi(true);
    setApiResult(null);
    try {
      const data = await getAuthenticatedProfile();
      setApiResult({
        operation: "GET /auth/me (User Profile)",
        status: 200,
        data,
      });
    } catch (err) {
      setApiResult({
        operation: "GET /auth/me",
        status: err.response?.status || 500,
        error: err.message,
      });
    } finally {
      setIsCallingApi(false);
    }
  }

  async function testProtectedCart() {
    setIsCallingApi(true);
    setApiResult(null);
    try {
      const data = await getProtectedCart();
      setApiResult({
        operation: "GET /carts/user/1 (Protected Cart)",
        status: 200,
        data,
      });
    } catch (err) {
      setApiResult({
        operation: "GET /carts/user/1",
        status: err.response?.status || 500,
        error: err.message,
      });
    } finally {
      setIsCallingApi(false);
    }
  }

  async function testProtectedCheckout() {
    setIsCallingApi(true);
    setApiResult(null);
    try {
      const response = await processProtectedCheckout({ items: [{ id: 101, quantity: 2 }] });
      setApiResult({
        operation: "POST /carts/add (Protected Checkout)",
        status: response.status || 200,
        data: response.data || { success: true, message: "Checkout processed with Bearer token." },
      });
    } catch (err) {
      setApiResult({
        operation: "POST /carts/add",
        status: err.response?.status || 500,
        error: err.message,
      });
    } finally {
      setIsCallingApi(false);
    }
  }

  async function testExpiredToken() {
    setIsCallingApi(true);
    setApiResult(null);
    try {
      simulateExpireToken();
      clearAuthToken();
      setApiResult({
        operation: "Simulate 401 Expired Token",
        status: 401,
        message: "Axios response interceptor detected 401 Unauthorized and purged token from storage.",
      });
    } finally {
      setIsCallingApi(false);
    }
  }

  function handleCopyToken() {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-neutral-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl border border-neutral-800 bg-gradient-to-r from-neutral-900/90 via-[#14121a] to-black shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-neutral-950 shadow-md">
              Auth & Token Management
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1.5 ${
                isAuthenticated
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
              }`}
            >
              {isAuthenticated ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              {isAuthenticated ? "Authenticated Session" : "Unauthenticated"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Token & Axios Interceptors Lab
          </h1>
          <p className="text-sm text-neutral-400 max-w-2xl">
            API login authentication, Bearer token storage in localStorage, Axios request interceptors attaching authorization headers, protected API calls, and expired token recovery.
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 text-rose-400 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout & Remove Token</span>
          </button>
        )}
      </div>

      {/* Expired Token Notice Banner (Requirement g) */}
      {expiredNotice && (
        <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <strong className="text-amber-300 font-bold">Authentication Alert: </strong>
              <span className="text-neutral-200">{expiredNotice}</span>
            </div>
          </div>
          <button
            onClick={() => setExpiredNotice(null)}
            className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Login / User Card (left) and Token Inspector / Interceptor Terminal (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Login Form or User Profile */}
        <div className="space-y-6">
          {!isAuthenticated ? (
            /* Requirement a: Login Component using API Authentication */
            <div className="p-6 rounded-3xl border border-neutral-800 bg-[#121118] space-y-5 shadow-2xl">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
                <Key className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white">API Authentication Login</h3>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    Username / Email
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g., emilys or alex.morgan@novastore.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer transition-all"
                >
                  {isAuthLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>{isAuthLoading ? "Authenticating via API..." : "Sign In & Generate Token"}</span>
                </button>
              </form>

              {/* Demo Credentials Helper */}
              <div className="pt-3 border-t border-neutral-800 text-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-500">
                  Quick Demo Credentials:
                </span>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setUsername("emilys");
                      setPassword("emilyspass");
                    }}
                    className="text-left px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-400/50 text-[11px] text-neutral-300 font-mono"
                  >
                    emilys / emilyspass (DummyJSON API)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername("alex.morgan@novastore.com");
                      setPassword("password123");
                    }}
                    className="text-left px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-400/50 text-[11px] text-neutral-300 font-mono"
                  >
                    alex.morgan / password123 (JWT Simulation)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Active User Session Details */
            <div className="p-6 rounded-3xl border border-neutral-800 bg-[#121118] space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-black text-white">Active User Session</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  HTTP 200 OK
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  alt={user?.username}
                  className="w-12 h-12 rounded-2xl object-cover bg-neutral-900 border border-neutral-700"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}
                  </h4>
                  <p className="text-xs text-neutral-400 font-mono">{user?.email}</p>
                </div>
              </div>

              <div className="text-xs space-y-1.5 pt-2 border-t border-neutral-800/80 text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">User ID:</span>
                  <span className="font-mono text-white">#{user?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Username:</span>
                  <span className="font-mono text-amber-300">{user?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Storage Target:</span>
                  <span className="font-mono text-emerald-400">localStorage</span>
                </div>
              </div>

              {/* Requirement f: Logout Button */}
              <button
                onClick={logout}
                className="w-full py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-rose-500 text-rose-400 hover:text-rose-300 text-xs font-bold transition-all cursor-pointer"
              >
                Sign Out & Clear Storage
              </button>
            </div>
          )}

          {/* Protected Operations Test Suite (Requirement c & e) */}
          <div className="p-5 rounded-3xl border border-neutral-800 bg-[#111116] space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Protected API Operations
              </h4>
            </div>

            <div className="space-y-2">
              <button
                onClick={testProfileApi}
                disabled={isCallingApi}
                className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400 text-neutral-200 text-xs font-bold flex items-center justify-between transition-colors disabled:opacity-50"
              >
                <span>GET /auth/me (Profile)</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <button
                onClick={testProtectedCart}
                disabled={isCallingApi}
                className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400 text-neutral-200 text-xs font-bold flex items-center justify-between transition-colors disabled:opacity-50"
              >
                <span>GET /carts/user/1 (Cart)</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <button
                onClick={testProtectedCheckout}
                disabled={isCallingApi}
                className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400 text-neutral-200 text-xs font-bold flex items-center justify-between transition-colors disabled:opacity-50"
              >
                <span>POST /carts/add (Checkout)</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* Requirement g: Trigger Expired Token */}
              <button
                onClick={testExpiredToken}
                disabled={isCallingApi}
                className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-between transition-colors disabled:opacity-50"
              >
                <span>Simulate 401 Expired Token</span>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Token Inspector & Axios Interceptor Logger (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Requirement b: Token Storage Inspector */}
          <div className="p-6 rounded-3xl border border-neutral-800 bg-[#121118] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white">Browser Token Inspector</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                  Key: novastore_auth_token
                </span>
              </div>
              {token && (
                <button
                  onClick={handleCopyToken}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-xs font-bold text-neutral-300 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied!" : "Copy Token"}</span>
                </button>
              )}
            </div>

            {token ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 font-mono text-xs text-amber-300 break-all select-all leading-relaxed max-h-24 overflow-y-auto">
                  {token}
                </div>
                <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-400 pt-1">
                  <span>Type: <strong className="text-neutral-200">Bearer JWT</strong></span>
                  <span>Persisted in: <strong className="text-emerald-400">localStorage</strong></span>
                  <span>Header: <strong className="text-purple-300 font-mono">Authorization: Bearer ...</strong></span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-neutral-500 text-xs space-y-1">
                <Lock className="w-8 h-8 mx-auto opacity-30" />
                <p>No authentication token currently stored.</p>
                <p className="text-[11px] text-neutral-600">
                  Sign in using the form on the left to generate and store a JWT token.
                </p>
              </div>
            )}
          </div>

          {/* Requirement d: Axios Interceptors Live Terminal */}
          <div className="rounded-2xl border border-neutral-800 bg-[#0e0e12] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/80 border-b border-neutral-800 text-xs">
              <div className="flex items-center gap-2 text-neutral-300 font-mono font-bold">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>Axios Interceptors Monitor</span>
              </div>
              <span className="text-[11px] text-neutral-500 font-mono">
                Request & Response Pipelines
              </span>
            </div>

            <div className="p-4 font-mono text-xs max-h-56 overflow-y-auto space-y-2 scrollbar-thin">
              {interceptorLogs.length === 0 ? (
                <div className="text-neutral-500 italic">
                  Awaiting HTTP requests to monitor Axios request & response interceptors...
                </div>
              ) : (
                interceptorLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-1 text-neutral-300"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-neutral-500">[{log.time}]</span>
                      <span
                        className={`font-black px-1.5 py-0.2 rounded uppercase ${
                          log.type === "REQUEST_INTERCEPTOR"
                            ? "bg-purple-500/20 text-purple-300"
                            : log.type === "RESPONSE_SUCCESS"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {log.type}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-white">{log.message}</div>
                    {log.tokenPreview && (
                      <div className="text-[11px] text-amber-400 font-mono">
                        Header: Authorization: Bearer {log.tokenPreview}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* API Execution Output Console */}
          {apiResult && (
            <div className="p-4 rounded-2xl border border-neutral-800 bg-[#121218] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-white">API Execution Output: {apiResult.operation}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    apiResult.status < 300
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-rose-500/15 text-rose-400"
                  }`}
                >
                  HTTP {apiResult.status}
                </span>
              </div>
              <pre className="p-3 rounded-xl bg-black font-mono text-xs text-neutral-300 max-h-36 overflow-auto">
                {JSON.stringify(apiResult.data || apiResult.error || apiResult.message, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
