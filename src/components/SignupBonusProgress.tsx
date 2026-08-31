import { formatCurrency, formatNumber, formatDate, daysUntil, formatRewardType } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface BonusWithProgress {
  id: string;
  spendRequirement: number;
  rewardAmount: number;
  rewardType: string;
  deadline: Date | string;
  eligibleSpend: number;
  progress: number;
  met: boolean;
  card: { name: string };
}

export function SignupBonusProgress({
  bonus,
  flat = false,
}: {
  bonus: BonusWithProgress;
  /** true when rendered inside an existing panel — skips its own surface. */
  flat?: boolean;
}) {
  const days = daysUntil(bonus.deadline);
  const expired = days < 0 && !bonus.met;
  return (
    <div className={flat ? "" : "panel p-4"}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{bonus.card.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Earn {formatNumber(bonus.rewardAmount)} {formatRewardType(bonus.rewardType)} after{" "}
            {formatCurrency(bonus.spendRequirement, { compact: true })} spend
          </p>
        </div>
        {bonus.met ? (
          <Badge variant="secondary">Earned</Badge>
        ) : expired ? (
          <Badge className="bg-primary/15 text-primary">Expired</Badge>
        ) : (
          <Badge variant="secondary">{days}d left</Badge>
        )}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Progress value={bonus.progress} className="h-2 flex-1" />
        <span className="text-xs font-medium tabular-nums text-muted-foreground">
          {bonus.progress.toFixed(0)}%
        </span>
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        {formatCurrency(bonus.eligibleSpend)} of {formatCurrency(bonus.spendRequirement)} · by{" "}
        {formatDate(bonus.deadline)}
      </p>
    </div>
  );
}
