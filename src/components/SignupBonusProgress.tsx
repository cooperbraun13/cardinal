import { daysUntil, formatCurrency, formatDate, formatNumber, formatRewardType } from "@/lib/format";
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

export function SignupBonusProgress({ bonus }: { bonus: BonusWithProgress }) {
  const days = daysUntil(bonus.deadline);
  const expired = days < 0 && !bonus.met;

  return (
    <article className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{bonus.card.name}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Earn {formatNumber(bonus.rewardAmount)} {formatRewardType(bonus.rewardType)} after{" "}
            {formatCurrency(bonus.spendRequirement, { compact: true })} in eligible spend.
          </p>
        </div>
        {bonus.met ? (
          <Badge variant="outline">Earned</Badge>
        ) : expired ? (
          <Badge className="border-destructive/30 bg-destructive/10 text-destructive">Expired</Badge>
        ) : (
          <Badge className="border-primary/30 bg-primary/10 text-primary">{days}d left</Badge>
        )}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <Progress value={bonus.progress} className="flex-1" />
        <span className="text-xs font-semibold tabular-nums text-muted-foreground">
          {bonus.progress.toFixed(0)}%
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        {formatCurrency(bonus.eligibleSpend)} of {formatCurrency(bonus.spendRequirement)} / due{" "}
        {formatDate(bonus.deadline)}
      </p>
    </article>
  );
}
