import { categoryLabel } from "@/lib/categories";
import { formatCurrency, formatShortDate, nextOccurrence } from "@/lib/format";
import { cn } from "@/lib/utils";
import { utilization } from "@/services/rewards";
import { UtilizationBar } from "@/components/UtilizationBar";

export interface CreditCardTileData {
  id: string;
  name: string;
  issuer: string;
  network?: string | null;
  lastFour?: string | null;
  creditLimit: number;
  currentBalance: number;
  statementDay: number;
  dueDay: number;
  cardTheme: string;
  rewardCategories?: { category: string; multiplier: number }[];
}

const NETWORK_LABELS: Record<string, string> = {
  visa: "VISA",
  mastercard: "MASTERCARD",
  amex: "AMEX",
  discover: "DISCOVER",
};

function rewardSummary(card: CreditCardTileData): string {
  const rewards = [...(card.rewardCategories ?? [])]
    .sort((a, b) => b.multiplier - a.multiplier)
    .slice(0, 2);

  return rewards
    .map((reward) => `${reward.multiplier}x ${categoryLabel(reward.category)}`)
    .join(" / ");
}

export function CreditCardTile({
  card,
  className,
}: {
  card: CreditCardTileData;
  className?: string;
}) {
  const util = utilization(card.currentBalance, card.creditLimit);
  const rewards = rewardSummary(card);

  return (
    <article className={cn("min-w-0", className)}>
      <div
        className={cn(
          `card-theme-${card.cardTheme}`,
          "relative flex min-h-48 flex-col justify-between gap-design-md overflow-hidden rounded-none border border-white/15 p-design-sm text-white transition-[border-color] group-hover:border-white/40 sm:min-h-52 sm:p-6",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-[.16em] text-white/75 uppercase">
              {card.issuer}
            </p>
            <h3 className="mt-2 break-words text-lg font-medium tracking-tight">
              {card.name}
            </h3>
          </div>
          <span
            aria-hidden="true"
            className="grid h-7 w-9 shrink-0 grid-cols-3 overflow-hidden rounded-sm border border-white/30 bg-white/10"
          >
            <span className="border-r border-white/20" />
            <span className="border-r border-white/20" />
            <span />
          </span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <span className="font-mono text-xs tracking-[.15em] text-white/80">
            •••• {card.lastFour ?? "—"}
          </span>
          {card.network && (
            <span className="text-[11px] font-semibold tracking-wider">
              {NETWORK_LABELS[card.network] ?? card.network.toUpperCase()}
            </span>
          )}
        </div>
      </div>
      <div className="px-1 pt-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Current balance</p>
            <p className="mt-1 text-2xl font-medium tracking-tight tabular-nums">
              {formatCurrency(card.currentBalance)}
            </p>
          </div>
          <p className="pb-1 text-xs text-muted-foreground">
            Due {formatShortDate(nextOccurrence(card.dueDay))}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <UtilizationBar
            value={util}
            className="flex-1"
            trackClassName="bg-muted"
          />
          <span
            className={cn(
              "text-xs tabular-nums",
              util >= 30 ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {util.toFixed(0)}% used
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {formatCurrency(card.creditLimit)} limit
        </p>
        {rewards && (
          <p className="mt-4 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
            {rewards}
          </p>
        )}
      </div>
    </article>
  );
}
