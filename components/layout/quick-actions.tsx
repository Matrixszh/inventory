"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const buttonClass =
  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition";

export function QuickActions() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-wrap gap-3">
      {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
        <>
          <Link href="/inventory" className={cn(buttonClass, "bg-indigo-500 text-white hover:bg-indigo-400")}>
            Add Inventory
          </Link>
          <Link href="/predictions" className={cn(buttonClass, "bg-[#252836] text-slate-100 hover:bg-[#2e3245]")}>
            View Predictions
          </Link>
        </>
      )}
      {user?.role === "ADMIN" && (
        <Link href="/users" className={cn(buttonClass, "bg-[#252836] text-slate-100 hover:bg-[#2e3245]")}>
          Manage Users
        </Link>
      )}
      <Link href="/analytics" className={cn(buttonClass, "bg-transparent text-slate-300 hover:bg-white/5")}>
        Open Analytics
      </Link>
    </div>
  );
}
