"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, error, children, ...props },
  ref,
) {
  return (
    <div className="space-y-2">
      <select
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-white/10 bg-[#1A1D27] px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-indigo-500",
          error && "border-red-500",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
});
