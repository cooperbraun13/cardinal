import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-design-md xl:flex-row xl:items-end xl:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow mb-design-sm">{eyebrow}</div>}
        <h1 className="page-title break-words">{title}</h1>
        {description && (
          <p className="mt-design-sm max-w-xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-design-xs">
          {actions}
        </div>
      )}
    </header>
  );
}
