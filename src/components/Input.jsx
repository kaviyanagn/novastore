import React from "react";
import { AlertCircle } from "lucide-react";

/**
 * Reusable Controlled Input Component (Requirements f & h)
 * - Controlled input handling value & onChange
 * - Displays label, required indicator, helper text, and validation error messages
 */
export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  required = false,
  disabled = false,
  icon: Icon,
  className = "",
  id,
  min,
  max,
  ...props
}) {
  const inputId = id || name;

  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5"
        >
          {Icon && <Icon className="w-3.5 h-3.5 text-amber-400" />}
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          className={`w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-neutral-900 border text-white placeholder-neutral-500 outline-none transition-all ${
            error
              ? "border-rose-500 bg-rose-500/10 focus:ring-2 focus:ring-rose-500/20 text-rose-100"
              : "border-neutral-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-rose-400 font-semibold flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
