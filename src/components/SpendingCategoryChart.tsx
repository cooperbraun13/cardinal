import { categoryLabel } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";

/** Spending breakdown — label, proportional red bar, right-aligned amount. */
export function SpendingCategoryChart({
  data,
}: {
  data: { category: string; amount: number }[];
}) {
  if (data.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        No spending yet this month. Add transactions to see the breakdown.
      </p>
    );
  }
  const max = Math.max(...data.map((d) => d.amount));
  return (
    <div className="space-y-3.5">
      {data.slice(0, 6).map((d) => (
        <div key={d.category} className="grid grid-cols-[88px_1fr_auto] items-center gap-4">
          <span className="truncate text-sm text-foreground/90">{categoryLabel(d.category)}</span>
          <div className="h-1.5 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.max(4, (d.amount / max) * 100)}%` }}
            />
          </div>
          <span className="text-sm tabular-nums text-muted-foreground">
            {formatCurrency(d.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}
