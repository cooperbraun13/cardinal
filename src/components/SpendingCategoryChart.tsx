import { categoryLabel } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";

export function SpendingCategoryChart({
  data,
}: {
  data: { category: string; amount: number }[];
}) {
  if (data.length === 0)
    return (
      <p className="border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
        No posted spending this month. Your category breakdown will appear here.
      </p>
    );
  const max = Math.max(...data.map((item) => item.amount), 1);
  return (
    <ul className="grid gap-4" aria-label="Spending by category">
      {data.slice(0, 6).map((item, index) => (
        <li key={item.category}>
          <div className="mb-2 flex justify-between gap-3 text-xs">
            <span>{categoryLabel(item.category)}</span>
            <span className="tabular-nums text-muted-foreground">
              {formatCurrency(item.amount)}
            </span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-none bg-muted"
            aria-hidden="true"
          >
            <div
              className={
                index === 0
                  ? "h-full rounded-none bg-foreground/80"
                  : "h-full rounded-none bg-foreground/30"
              }
              style={{ width: `${Math.max(0, (item.amount / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
