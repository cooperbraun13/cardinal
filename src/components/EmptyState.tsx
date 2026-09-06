import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-5 py-12 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="mb-design-sm flex size-12 items-center justify-center ">
          <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
        </span>
      )}
      <h3 className="text-[26px] font-medium tracking-tight">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
