import { Activity, AlertTriangle, Boxes, DollarSign } from "lucide-react";

import { MovementTrendChart } from "@/components/charts/movement-trend-chart";
import { StockByCategoryChart } from "@/components/charts/stock-by-category-chart";
import { Header } from "@/components/layout/header";
import { QuickActions } from "@/components/layout/quick-actions";
import { StatCard } from "@/components/ui/stat-card";
import { getDashboardData } from "@/lib/firestore";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const dashboardResult = await getDashboardData()
    .then((dashboard) => ({ dashboard, error: null }))
    .catch((error: unknown) => ({
      dashboard: null,
      error: error instanceof Error ? error.message : "Unable to load dashboard data.",
    }));

  if (dashboardResult.dashboard) {
    return (
      <div className="space-y-8">
        <Header title="Dashboard" description="Monitor stock health, activity, and operational KPIs in real time." />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total SKUs" value={String(dashboardResult.dashboard.kpis.totalSkus)} icon={Boxes} trend="Catalog size" />
          <StatCard
            label="Low Stock Alerts"
            value={String(dashboardResult.dashboard.kpis.lowStockAlerts)}
            icon={AlertTriangle}
            trend="Requires review"
            trendDirection="down"
          />
          <StatCard
            label="Total Stock Value"
            value={formatCurrency(dashboardResult.dashboard.kpis.totalStockValue)}
            icon={DollarSign}
            trend="Live valuation"
          />
          <StatCard
            label="Recent Movements"
            value={String(dashboardResult.dashboard.kpis.recentMovements)}
            icon={Activity}
            trend="Last 30 days"
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#252836] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-50">Quick Actions</h3>
              <p className="text-sm text-slate-400">Actions are automatically filtered by your assigned role.</p>
            </div>
          </div>
          <QuickActions />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <StockByCategoryChart data={dashboardResult.dashboard.categoryStock} />
          <MovementTrendChart data={dashboardResult.dashboard.movementTrend} />
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Header title="Dashboard" description="Monitor stock health, activity, and operational KPIs in real time." />
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">
        {dashboardResult.error}
      </div>
    </div>
  );
}
