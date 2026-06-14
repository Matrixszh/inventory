"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, error, ...props },
  ref,
) {
  return (
    <div className="space-y-2">
      <textarea
        ref={ref}
        className={cn(
          "min-h-28 w-full rounded-xl border border-white/10 bg-[#1A1D27] px-3 py-2 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-indigo-500",
          error && "border-red-500",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
});
