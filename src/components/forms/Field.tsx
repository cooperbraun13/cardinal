import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

let fieldId = 0;

/** Label + control wrapper for form dialogs. */
export function Field({
  label,
  children,
  className,
  htmlFor,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  const id = htmlFor ?? `field-${++fieldId}`;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <div id={id}>{children}</div>
    </div>
  );
}
