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

function wholeCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

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
    <article
      className={cn(
        `card-theme-${card.cardTheme}`,
        "relative aspect-[1.586] w-full min-w-[17.5rem] overflow-hidden rounded-xl border border-white/10 p-4 text-white transition-[transform,border-color] duration-200 group-hover:-translate-y-0.5 group-hover:border-white/25 group-focus-visible:-translate-y-0.5 group-focus-visible:border-white/35 sm:p-5",
        className
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold tracking-[0.15em] text-white/80 uppercase">
              {card.issuer}
            </p>
            <p className="mt-1 truncate text-base font-semibold tracking-[-0.02em]">{card.name}</p>
          </div>
          {card.network && (
            <span className="shrink-0 text-[11px] font-bold tracking-[0.08em] text-white/90">
              {NETWORK_LABELS[card.network] ?? card.network.toUpperCase()}
            </span>
          )}
        </div>

        <div className="my-auto flex items-center gap-3 py-2">
          <div className="relative h-6 w-8 shrink-0 overflow-hidden rounded-[4px] border border-white/20 bg-white/20">
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/25" />
            <span className="absolute inset-y-0 left-1/3 w-px bg-black/25" />
            <span className="absolute inset-y-0 right-1/3 w-px bg-black/25" />
          </div>
          <span className="font-mono text-xs tracking-[0.22em] text-white/90">
            **** {card.lastFour ?? "0000"}
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold tracking-[0.13em] text-white/75 uppercase">
              Balance
            </p>
            <p className="mt-1 text-lg font-semibold tracking-[-0.03em] tabular-nums">
              {formatCurrency(card.currentBalance)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[9px] font-semibold tracking-[0.13em] text-white/75 uppercase">
              Limit
            </p>
            <p className="mt-1 text-sm font-medium tabular-nums text-white/90">
              {wholeCurrency(card.creditLimit)}
            </p>
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-2.5">
          <UtilizationBar value={util} className="flex-1" trackClassName="bg-black/25" />
          <span className="w-8 text-right text-[11px] font-semibold tabular-nums text-white/85">
            {util.toFixed(0)}%
          </span>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-3 text-[10px] leading-4 text-white/85">
          <span>Due {formatShortDate(nextOccurrence(card.dueDay))}</span>
          {rewards && <span className="truncate text-right">{rewards}</span>}
        </div>
      </div>
    </article>
  );
}
