import { AlertCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ErrorBanner({ message, className }: { message: string; className?: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={cn(
        "flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
        className
      )}
    >
      <AlertCircleIcon className="size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
