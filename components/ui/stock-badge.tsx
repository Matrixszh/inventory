import { cn, getStockStatus } from "@/lib/utils";
import type { InventoryItem } from "@/types";

const styles = {
  OK: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  LOW: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  OUT: "bg-red-500/15 text-red-400 border-red-500/20",
};

export function StockBadge({
  item,
}: {
  item: Pick<InventoryItem, "currentStock" | "minStockLevel">;
}) {
  const status = getStockStatus(item);

  return (
    <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", styles[status])}>
      {status === "OK" ? "In Stock" : status === "LOW" ? "Low Stock" : "Out Of Stock"}
    </span>
  );
}
