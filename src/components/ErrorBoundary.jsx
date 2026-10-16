import React from "react";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";
import Button from "./Button";

/**
 * Reusable ErrorBoundary Component (Requirements g & h)
 * - Catches unexpected JavaScript errors anywhere in the child component tree
 * - Logs the error details safely
 * - Displays a user-friendly, responsive fallback UI with recover actions
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Catch details from the error stack
    console.error("ErrorBoundary caught an unexpected render error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 text-left">
          <div className="max-w-xl w-full p-8 rounded-3xl border border-rose-500/40 bg-[#161318] shadow-2xl shadow-rose-950/40 space-y-6">
            {/* Header Icon & Title */}
            <div className="flex items-center gap-4 border-b border-neutral-800 pb-5">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>React Error Boundary Activated</span>
                </span>
                <h2 className="text-2xl font-black text-white mt-0.5">
                  Something Went Wrong
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              An unexpected runtime error occurred while rendering this view. The application has intercepted the error to prevent the entire browser session from crashing.
            </p>

            {/* Error Message Box */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-rose-500/30 text-rose-300 text-xs font-mono space-y-2">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Error details:</span>
                <button
                  type="button"
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  className="text-[11px] text-amber-400 underline cursor-pointer hover:text-amber-300"
                >
                  {this.state.showDetails ? "Hide stack trace" : "View stack trace"}
                </button>
              </div>
              <p className="break-words">
                {this.state.error?.toString() || "Unknown rendering exception"}
              </p>
              {this.state.showDetails && this.state.errorInfo && (
                <pre className="text-[10px] text-neutral-400 overflow-x-auto p-2 bg-neutral-900 rounded-lg max-h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            {/* Recovery Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                onClick={this.handleReset}
                className="flex-1"
                id="error-return-home-btn"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </Button>

              <Button
                variant="secondary"
                onClick={this.handleReload}
                className="flex-1"
                id="error-reload-page-btn"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
