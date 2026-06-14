"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MovementTrendDatum } from "@/types";

export function MovementTrendChart({ data }: { data: MovementTrendDatum[] }) {
  return (
    <div className="h-80 rounded-2xl border border-white/10 bg-[#252836] p-5">
      <h3 className="mb-4 text-lg font-semibold text-slate-50">Movement Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2f3346" />
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ background: "#1A1D27", border: "1px solid #252836", borderRadius: 12 }}
          />
          <Legend />
          <Line type="monotone" dataKey="in" stroke="#10B981" strokeWidth={2} />
          <Line type="monotone" dataKey="out" stroke="#EF4444" strokeWidth={2} />
          <Line type="monotone" dataKey="adjustments" stroke="#F59E0B" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
