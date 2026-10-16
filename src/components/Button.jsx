import React from "react";
import { logClientAction } from "../utils/logger";

/**
 * Reusable Button Component (Requirement h)
 * Supports variants: primary (gold gradient), secondary, outline, danger
 * Provides accessible styling, disabled states, and hover micro-animations.
 */
export default function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  className = "",
  size = "md",
  id,
  ...props
}) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-xs sm:text-sm",
    lg: "px-6 py-3.5 text-sm sm:text-base font-black",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 font-black shadow-lg shadow-amber-500/20 active:scale-98",
    secondary:
      "bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold border border-neutral-700 active:scale-98",
    outline:
      "bg-transparent hover:bg-amber-400/10 text-amber-400 border border-amber-400/50 hover:border-amber-400 font-bold active:scale-98",
    danger:
      "bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md shadow-rose-600/30 active:scale-98",
    ghost:
      "bg-transparent hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold",
  };

  const handleClick = (e) => {
    if (disabled) return;
    const label = typeof children === "string" ? children : id || "Button";
    logClientAction(`Button clicked: "${label}"`, { id, variant });
    if (onClick) onClick(e);
  };

  return (
    <button
      id={id}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl transition-all uppercase tracking-wider cursor-pointer ${
        sizeClasses[size] || sizeClasses.md
      } ${variantClasses[variant] || variantClasses.primary} ${
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:scale-102"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
