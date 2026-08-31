import { cn } from "@/lib/utils";

export function Metric({
  label,
  value,
  detail,
  emphasis = false,
  children,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  detail?: React.ReactNode;
  emphasis?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 font-semibold tracking-[-0.035em] tabular-nums",
          emphasis ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
        )}
      >
        {value}
      </p>
      {detail && <div className="mt-1.5 text-xs leading-5 text-muted-foreground">{detail}</div>}
      {children}
    </div>
  );
}
