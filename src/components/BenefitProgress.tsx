import { BENEFIT_TYPE_LABELS } from "@/lib/categories";
import { formatCurrency, formatDate } from "@/lib/format";
import type { BenefitStatus } from "@/services/benefits";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface BenefitView {
  id: string;
  name: string;
  description?: string | null;
  benefitType: string;
  totalValue: number;
  usedValue: number;
  resetFrequency: string;
  remaining: number;
  status: BenefitStatus;
  effectiveExpiry?: Date | string | null;
  card?: { name: string };
}

const STATUS_BADGES: Record<BenefitStatus, { label: string; className: string }> = {
  available: { label: "Available", className: "border-border bg-transparent text-foreground" },
  partial: { label: "In use", className: "border-border bg-transparent text-foreground/80" },
  used: { label: "Used", className: "border-border bg-transparent text-muted-foreground" },
  expiring: { label: "Expiring soon", className: "border-primary/30 bg-primary/10 text-primary" },
  expired: { label: "Expired", className: "border-destructive/30 bg-destructive/10 text-destructive" },
  inactive: { label: "Inactive", className: "border-border bg-transparent text-muted-foreground" },
};

const FREQUENCY_LABELS: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  semiannual: "Semiannual",
  annual: "Annual",
  one_time: "One time",
};

export function BenefitProgress({
  benefit,
  children,
}: {
  benefit: BenefitView;
  children?: React.ReactNode;
}) {
  const badge = STATUS_BADGES[benefit.status];
  const percentage =
    benefit.totalValue > 0 ? Math.min(100, (benefit.usedValue / benefit.totalValue) * 100) : 0;

  return (
    <article className="panel flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{benefit.name}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {benefit.card?.name ? `${benefit.card.name} / ` : ""}
            {BENEFIT_TYPE_LABELS[benefit.benefitType] ?? benefit.benefitType}
          </p>
        </div>
        <Badge variant="outline" className={badge.className}>
          {badge.label}
        </Badge>
      </div>

      {benefit.description && (
        <p className="mt-3 text-xs leading-5 text-muted-foreground">{benefit.description}</p>
      )}

      <div className="mt-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-semibold tracking-[-0.03em] tabular-nums">
              {formatCurrency(benefit.remaining)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">remaining</p>
          </div>
          <p className="text-right text-xs tabular-nums text-muted-foreground">
            {formatCurrency(benefit.usedValue)} of {formatCurrency(benefit.totalValue)} used
          </p>
        </div>
        <Progress value={percentage} className="mt-3" />
        <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
          {FREQUENCY_LABELS[benefit.resetFrequency] ?? benefit.resetFrequency}
          {benefit.effectiveExpiry ? ` / ends ${formatDate(benefit.effectiveExpiry)}` : ""}
        </p>
      </div>

      {children && <div className="mt-auto">{children}</div>}
    </article>
  );
}
