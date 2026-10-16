import React from "react";
import { Table as TableIcon, Users, CheckCircle2, XCircle } from "lucide-react";

/**
 * Reusable TableCard Component (Requirement h & f)
 * - Displays individual table status, seating capacity, and table type
 * - Enforces table availability & capacity validation
 * - Provides interactive visual feedback on selection
 */
export default function TableCard({
  table,
  isSelected = false,
  onSelect,
  guestCount = 1,
  className = "",
}) {
  if (!table) return null;

  const isCapacityAdequate = table.capacity >= guestCount;
  const isSelectable = table.isAvailable && isCapacityAdequate;

  const handleClick = () => {
    if (isSelectable && onSelect) {
      onSelect(table);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={isSelectable ? 0 : -1}
      aria-label={`Table ${table.number}, ${table.capacity} guests`}
      className={`relative p-4 rounded-2xl border text-center transition-all duration-200 flex flex-col justify-between ${
        !table.isAvailable
          ? "opacity-35 cursor-not-allowed bg-neutral-950/80 border-neutral-850 text-neutral-500"
          : !isCapacityAdequate
          ? "opacity-45 cursor-not-allowed bg-neutral-950 border-neutral-800 text-neutral-400"
          : isSelected
          ? "ring-2 ring-amber-400 border-amber-400 bg-amber-400/15 shadow-lg shadow-amber-400/10 scale-102 cursor-pointer"
          : "bg-neutral-900 hover:bg-neutral-850 border-neutral-800 hover:border-amber-400/60 cursor-pointer"
      } ${className}`}
    >
      {/* Top Header: Table Number & Availability Badge */}
      <div className="flex items-center justify-between text-[11px] mb-2">
        <span className="font-mono font-bold text-neutral-400">#{table.number}</span>
        {table.isAvailable ? (
          <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
            <CheckCircle2 className="w-3 h-3" />
            <span>Open</span>
          </span>
        ) : (
          <span className="text-rose-400 font-bold flex items-center gap-1 text-[10px]">
            <XCircle className="w-3 h-3" />
            <span>Booked</span>
          </span>
        )}
      </div>

      {/* Center Table Icon & Type */}
      <div className="py-1">
        <div
          className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-1 transition-colors ${
            isSelected
              ? "bg-amber-400 text-neutral-950 shadow-md"
              : table.isAvailable
              ? "bg-neutral-800 text-amber-400"
              : "bg-neutral-900 text-neutral-600"
          }`}
        >
          <TableIcon className="w-5 h-5" />
        </div>
        <div className="text-xs font-black text-white">Table #{table.number}</div>
        <div className="text-[10px] text-neutral-400 font-medium truncate">{table.type}</div>
      </div>

      {/* Footer: Capacity info */}
      <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
        <span className="text-neutral-500 text-[10px] flex items-center gap-1">
          <Users className="w-3 h-3 text-amber-500" /> Seats:
        </span>
        <strong className="text-amber-400 font-black">{table.capacity} Guests</strong>
      </div>

      {/* Insufficient capacity badge if applicable */}
      {table.isAvailable && !isCapacityAdequate && (
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/90 text-white shadow-xs">
          Too small
        </span>
      )}
    </div>
  );
}
