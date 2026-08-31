import Image from "next/image";
import { cn } from "@/lib/utils";

export function Brand({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className="relative block size-8 shrink-0" aria-hidden="true">
        <Image
          src="/cardinal-logo.png"
          alt=""
          fill
          sizes="48px"
          className="scale-[1.45] object-contain mix-blend-screen"
          priority
        />
      </span>
      {!compact && <span className="text-lg font-semibold tracking-[-0.025em]">Cardinal</span>}
    </span>
  );
}
