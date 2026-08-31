import { formatCurrency, formatDate } from "@/lib/format";
import { BENEFIT_TYPE_LABELS } from "@/lib/categories";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { BenefitStatus } from "@/services/benefits";

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
  available: { label: "Available", className: "bg-white/8 text-foreground" },
  partial: { label: "Partially used", className: "bg-white/8 text-foreground/80" },
  used: { label: "Used", className: "bg-white/6 text-muted-foreground" },
  expiring: { label: "Expiring soon", className: "bg-primary/15 text-primary" },
  expired: { label: "Expired", className: "bg-primary/15 text-primary" },
  inactive: { label: "Inactive", className: "bg-white/6 text-muted-foreground" },
};

const FREQUENCY_LABELS: Record<string, string> = {
  monthly: "Resets monthly",
  quarterly: "Resets quarterly",
  semiannual: "Resets semiannually",
  annual: "Resets annually",
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
  const pct = benefit.totalValue > 0 ? (benefit.usedValue / benefit.totalValue) * 100 : 0;
  return (
    <div className="panel p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{benefit.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {benefit.card?.name ? `${benefit.card.name} · ` : ""}
            {BENEFIT_TYPE_LABELS[benefit.benefitType] ?? benefit.benefitType}
          </p>
        </div>
        <Badge className={badge.className}>{badge.label}</Badge>
      </div>
      <div className="mt-3">
        <Progress value={Math.min(100, pct)} className="h-2" />
        <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {formatCurrency(benefit.usedValue)} used · {formatCurrency(benefit.remaining)} left
          </span>
          <span>
            {FREQUENCY_LABELS[benefit.resetFrequency] ?? benefit.resetFrequency}
            {benefit.effectiveExpiry ? ` · until ${formatDate(benefit.effectiveExpiry)}` : ""}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
