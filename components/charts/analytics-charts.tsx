"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function StockValueAreaChart({ data }: { data: Array<{ date: string; value: number }> }) {
  return (
    <div className="h-80 rounded-2xl border border-white/10 bg-[#252836] p-5">
      <h3 className="mb-4 text-lg font-semibold text-slate-50">Stock Value Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2f3346" />
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ background: "#1A1D27", border: "1px solid #252836", borderRadius: 12 }}
          />
          <Area type="monotone" dataKey="value" stroke="#6366F1" fill="#6366F133" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopMovedItemsChart({
  data,
}: {
  data: Array<{ itemId: string; itemName: string; movementCount: number }>;
}) {
  return (
    <div className="h-80 rounded-2xl border border-white/10 bg-[#252836] p-5">
      <h3 className="mb-4 text-lg font-semibold text-slate-50">Top 10 Most Moved Items</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#2f3346" />
          <XAxis type="number" stroke="#9CA3AF" />
          <YAxis dataKey="itemName" type="category" stroke="#9CA3AF" width={120} />
          <Tooltip
            contentStyle={{ background: "#1A1D27", border: "1px solid #252836", borderRadius: 12 }}
          />
          <Bar dataKey="movementCount" fill="#6366F1" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
