export function formatCurrency(amount: number, opts?: { compact?: boolean }): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: opts?.compact ? 0 : 2,
    minimumFractionDigits: opts?.compact ? 0 : 2,
    ...(opts?.compact && amount >= 10000 ? { notation: "compact" as const } : {}),
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Next occurrence of a day-of-month (1-28), relative to `from`. */
export function nextOccurrence(dayOfMonth: number, from: Date = new Date()): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), dayOfMonth);
  if (d < from) d.setMonth(d.getMonth() + 1);
  return d;
}

export function daysUntil(date: Date | string, from: Date = new Date()): number {
  const target = new Date(date);
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
}

export function formatRewardType(type: string): string {
  return type === "cashback" ? "cash back" : type;
}
