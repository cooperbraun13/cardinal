import { cn } from "@/lib/utils";

/** Flat stat — small gray label over a bold number. No box; whitespace separates. */
export function StatCard({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-[13px] text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-lg font-semibold tracking-tight tabular-nums">{value}</p>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}
