"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CategoryStockDatum } from "@/types";

export function StockByCategoryChart({ data }: { data: CategoryStockDatum[] }) {
  return (
    <div className="h-80 rounded-2xl border border-white/10 bg-[#252836] p-5">
      <h3 className="mb-4 text-lg font-semibold text-slate-50">Stock By Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2f3346" />
          <XAxis dataKey="categoryName" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ background: "#1A1D27", border: "1px solid #252836", borderRadius: 12 }}
          />
          <Bar dataKey="stock" fill="#6366F1" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
