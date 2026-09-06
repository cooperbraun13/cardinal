import { AlertCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ErrorBanner({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-none border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm leading-6 text-destructive",
        className,
      )}
    >
      <AlertCircleIcon className="mt-1 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
