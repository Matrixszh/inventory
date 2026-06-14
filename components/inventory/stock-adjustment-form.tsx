"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { type z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { recordStockMovement } from "@/lib/firestore";
import { stockAdjustmentSchema, type StockAdjustmentValues } from "@/lib/validators";

export function StockAdjustmentForm({
  inventoryId,
  performedBy,
  onSuccess,
  defaultType = "IN",
  hideTypeSelect = false,
  title = "Adjust Stock",
  description = "Record inbound, outbound, or adjustment activity.",
  submitLabel = "Record Movement",
}: {
  inventoryId: string;
  performedBy: string;
  onSuccess: () => void;
  defaultType?: StockAdjustmentValues["type"];
  hideTypeSelect?: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.input<typeof stockAdjustmentSchema>, unknown, StockAdjustmentValues>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      type: defaultType,
      quantity: 1,
      reason: "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      setError(null);
      await recordStockMovement(inventoryId, values, performedBy);
      form.reset({ type: defaultType, quantity: 1, reason: "" });
      onSuccess();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to record stock movement.");
    }
  });

  return (
    <form className="space-y-4 rounded-2xl border border-white/10 bg-[#252836] p-5" onSubmit={submit}>
      <div>
        <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <div className={`grid gap-4 ${hideTypeSelect ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        {!hideTypeSelect ? (
          <label className="space-y-2">
            <span className="text-sm text-slate-200">Type</span>
            <Select error={form.formState.errors.type?.message} {...form.register("type")}>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
              <option value="ADJUSTMENT">ADJUSTMENT</option>
            </Select>
          </label>
        ) : null}
        <label className="space-y-2">
          <span className="text-sm text-slate-200">Quantity</span>
          <Input type="number" error={form.formState.errors.quantity?.message} {...form.register("quantity")} />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-200">Reason</span>
          <Input error={form.formState.errors.reason?.message} {...form.register("reason")} />
        </label>
      </div>
      {error ? <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
