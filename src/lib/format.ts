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
    timeZone: "UTC",
  });
}

export function formatShortDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

/** Next occurrence of a day-of-month (1-28), relative to `from`. */
export function nextOccurrence(dayOfMonth: number, from: Date = new Date()): Date {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), dayOfMonth));
  if (d < dayStart(from)) d.setUTCMonth(d.getUTCMonth() + 1);
  return d;
}

export function daysUntil(date: Date | string, from: Date = new Date()): number {
  const start = dayStart(from);
  const end = dayStart(date);
  return Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
}

export function formatRewardType(type: string): string {
  return type === "cashback" ? "cash back" : type;
}
import { dayStart } from "@/lib/dates";
