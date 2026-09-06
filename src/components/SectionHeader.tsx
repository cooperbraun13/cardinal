import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-x-4 gap-y-design-xxs",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="section-title">{title}</h2>
        {description && (
          <p className="mt-design-xxs text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
