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
    <div className={cn("min-w-0 break-words", className)}>
      <p className="eyebrow">{label}</p>
      <p
        className={cn(
          "mt-design-xs font-medium tracking-[-0.02em] tabular-nums",
          emphasis ? "display-number" : "text-[26px] sm:text-[36px]",
        )}
      >
        {value}
      </p>
      {detail && (
        <div className="mt-1.5 text-xs leading-5 text-muted-foreground">
          {detail}
        </div>
      )}
      {children}
    </div>
  );
}
