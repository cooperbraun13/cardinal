import { cn } from "@/lib/utils";

/** Color-coded utilization bar: green <10%, amber <30%, orange <50%, red beyond. */
export function UtilizationBar({
  value,
  className,
  trackClassName,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const color =
    clamped < 10
      ? "bg-emerald-400"
      : clamped < 30
        ? "bg-amber-400"
        : clamped < 50
          ? "bg-orange-400"
          : "bg-red-400";
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/10", trackClassName, className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", color)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
