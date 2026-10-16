import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Reusable Loading Component (Requirement h)
 * Displays a clean animated spinner and status message
 */
export default function Loading({ message = "Loading gourmet dining experiences..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
      <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      <span className="text-xs uppercase tracking-wider font-bold text-neutral-400">
        {message}
      </span>
    </div>
  );
}
