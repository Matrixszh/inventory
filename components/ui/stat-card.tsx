import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down";
  icon: LucideIcon;
}

export function StatCard({ label, value, trend, trendDirection = "up", icon: Icon }: StatCardProps) {
  const TrendIcon = trendDirection === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#252836] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-50">{value}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <Icon className="h-5 w-5 text-indigo-400" />
        </div>
      </div>
      {trend ? (
        <div
          className={cn(
            "mt-4 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
            trendDirection === "up"
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-red-500/15 text-red-400",
          )}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          {trend}
        </div>
      ) : null}
    </div>
  );
}
