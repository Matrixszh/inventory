import { Header } from "@/components/layout/header";
import { StockValueAreaChart, TopMovedItemsChart } from "@/components/charts/analytics-charts";
import { getAnalyticsData } from "@/lib/firestore";
import { formatDateTime, formatNumber } from "@/lib/utils";

export default async function AnalyticsPage() {
  const analyticsResult = await getAnalyticsData()
    .then((analytics) => ({ analytics, error: null }))
    .catch((error: unknown) => ({
      analytics: null,
      error: error instanceof Error ? error.message : "Unable to load analytics data.",
    }));

  if (analyticsResult.analytics) {
    return (
      <div className="space-y-8">
        <Header
          title="Analytics"
          description="Track valuation trends, movement leaders, dead stock, and supplier performance."
        />

        <section className="grid gap-6 xl:grid-cols-2">
          <StockValueAreaChart data={analyticsResult.analytics.stockValueOverTime} />
          <TopMovedItemsChart data={analyticsResult.analytics.topMovedItems} />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <StaticTable
            title="Dead Stock Report"
            emptyMessage="No dead stock items."
            headers={["Item", "SKU", "Current Stock", "Location"]}
            rows={analyticsResult.analytics.deadStockItems.map((item) => [
              item.name,
              item.sku,
              String(item.currentStock),
              item.location,
            ])}
          />

          <StaticTable
            title="Supplier Performance"
            emptyMessage="No supplier performance data."
            headers={["Supplier", "Avg Delivery Qty", "Frequency", "Last Delivery"]}
            rows={analyticsResult.analytics.supplierPerformance.map((supplier) => [
              supplier.supplierName,
              formatNumber(supplier.averageDeliveryQty),
              formatNumber(supplier.deliveryFrequency),
              supplier.lastMovementAt ? formatDateTime(supplier.lastMovementAt) : "No deliveries",
            ])}
          />
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Header
        title="Analytics"
        description="Track valuation trends, movement leaders, dead stock, and supplier performance."
      />
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">
        {analyticsResult.error}
      </div>
    </div>
  );
}

function StaticTable({
  title,
  headers,
  rows,
  emptyMessage,
}: {
  title: string;
  headers: string[];
  rows: string[][];
  emptyMessage: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#252836]">
      <div className="border-b border-white/10 p-4">
        <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-4 py-10 text-center text-sm text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={`${title}-${index}`} className="hover:bg-white/5">
                  {row.map((cell, cellIndex) => (
                    <td key={`${title}-${index}-${cellIndex}`} className="px-4 py-4 text-sm text-slate-200">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
