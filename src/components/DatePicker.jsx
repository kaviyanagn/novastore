import React from "react";
import { Calendar, AlertCircle } from "lucide-react";

/**
 * Reusable DatePicker Component (Requirement h & f)
 * - Controlled component for picking reservation dates
 * - Date validation: prevents selecting past dates
 * - Displays label, calendar icon, and inline error message
 */
export default function DatePicker({
  label = "Reservation Date",
  value,
  onChange,
  minDate,
  error,
  required = true,
  disabled = false,
  id = "reservation-datepicker",
}) {
  // Calculate today's minimum date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];
  const effectiveMin = minDate || todayStr;

  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type="date"
          id={id}
          value={value}
          min={effectiveMin}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all cursor-pointer ${
            error
              ? "bg-rose-500/10 border border-rose-500 text-rose-200 focus:ring-2 focus:ring-rose-500/20"
              : "bg-neutral-900 border border-neutral-700 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      </div>

      {error && (
        <p className="text-xs text-rose-400 font-semibold flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
