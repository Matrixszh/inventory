import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import type { PredictionResult } from "@/types";

const urgencyStyles = {
  critical: {
    className: "bg-red-500/15 text-red-400",
    icon: AlertTriangle,
    label: "Critical",
  },
  soon: {
    className: "bg-amber-500/15 text-amber-400",
    icon: Clock3,
    label: "Soon",
  },
  ok: {
    className: "bg-emerald-500/15 text-emerald-400",
    icon: CheckCircle2,
    label: "OK",
  },
};

export function PredictionCard({
  prediction,
  itemName,
  onReorder,
}: {
  prediction: PredictionResult;
  itemName: string;
  onReorder?: () => void;
}) {
  const urgency = urgencyStyles[prediction.urgency];
  const Icon = urgency.icon;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#252836] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-50">{itemName}</h3>
          <p className="mt-1 text-sm text-slate-400">{prediction.reasoning}</p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${urgency.className}`}>
          <Icon className="h-3.5 w-3.5" />
          {urgency.label}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="7d" value={prediction.predictedDemand7d} />
        <Metric label="14d" value={prediction.predictedDemand14d} />
        <Metric label="30d" value={prediction.predictedDemand30d} />
        <Metric label="Reorder" value={prediction.recommendedReorderQty} />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Safety stock {formatNumber(prediction.safetyStock)} | Daily usage{" "}
          {formatNumber(prediction.averageDailyConsumption)}
        </p>
        {onReorder ? (
          <Button variant={prediction.urgency === "critical" ? "danger" : "secondary"} onClick={onReorder}>
            Reorder
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-[#1A1D27] p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-50">{formatNumber(value)}</p>
    </div>
  );
}
