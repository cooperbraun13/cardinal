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
    <div className="space-y-3.5" role="list" aria-label="Spending by category">
      {data.slice(0, 6).map((d) => (
        <div
          key={d.category}
          role="listitem"
          className="grid grid-cols-[5.5rem_minmax(4rem,1fr)_auto] items-center gap-3 sm:gap-4"
        >
          <span className="truncate text-sm text-foreground/85">{categoryLabel(d.category)}</span>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${Math.max(4, (d.amount / max) * 100)}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground sm:text-sm">
            {formatCurrency(d.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}
