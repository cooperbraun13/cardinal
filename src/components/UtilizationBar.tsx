import { cn } from "@/lib/utils";

/** Utilization bar — neutral white while healthy, cardinal red once it crosses 30%. */
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
  return (
    <div
      role="progressbar"
      aria-label="Credit utilization"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/10", trackClassName, className)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          clamped >= 30 ? "bg-primary" : "bg-white/85"
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
