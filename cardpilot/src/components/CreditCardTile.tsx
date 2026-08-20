"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatCurrency, nextOccurrence, formatShortDate } from "@/lib/format";
import { categoryLabel } from "@/lib/categories";
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
  topCategories?: { category: string; multiplier: number }[];
}

const NETWORK_LABELS: Record<string, string> = {
  visa: "VISA",
  mastercard: "Mastercard",
  amex: "AMEX",
  discover: "Discover",
};

/** The CSS-rendered credit card visual — real-card proportions, per-card gradient theme. */
export function CreditCardTile({
  card,
  selected = false,
  onClick,
  compact = false,
  className,
}: {
  card: CreditCardTileData;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
  className?: string;
}) {
  const util = utilization(card.currentBalance, card.creditLimit);
  const topCategories = (card.topCategories ?? [])
    .filter((c) => c.multiplier > 1)
    .sort((a, b) => b.multiplier - a.multiplier)
    .slice(0, 3);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === "Enter" || e.key === " ") && onClick() : undefined}
      className={cn(
        `card-theme-${card.cardTheme}`,
        "relative aspect-[1.586] w-full min-w-64 select-none overflow-hidden rounded-2xl p-4 text-white shadow-lg shadow-black/40 transition-shadow sm:p-5",
        onClick && "cursor-pointer hover:shadow-xl hover:shadow-black/50",
        selected && "ring-2 ring-white/70 ring-offset-2 ring-offset-background",
        className
      )}
    >
      {/* subtle sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium tracking-wide text-white/70">
              {card.issuer}
            </p>
            <p className="truncate text-base font-semibold sm:text-lg">{card.name}</p>
          </div>
          {card.network && (
            <span className="shrink-0 text-sm font-bold tracking-wider text-white/80 italic">
              {NETWORK_LABELS[card.network] ?? card.network}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* chip graphic */}
          <div className="grid h-7 w-9 shrink-0 grid-cols-3 gap-px overflow-hidden rounded-md bg-gradient-to-br from-yellow-200/90 to-yellow-500/90 p-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[1px] bg-yellow-700/40" />
            ))}
          </div>
          <span className="font-mono text-sm tracking-[0.2em] text-white/80">
            •••• {card.lastFour ?? "0000"}
          </span>
        </div>

        <div>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[11px] tracking-wide text-white/60 uppercase">Balance</p>
              <p className="text-lg font-semibold tabular-nums sm:text-xl">
                {formatCurrency(card.currentBalance)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] tracking-wide text-white/60 uppercase">Limit</p>
              <p className="text-sm font-medium tabular-nums text-white/85">
                {formatCurrency(card.creditLimit, { compact: true })}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <UtilizationBar value={util} className="flex-1" />
            <span className="text-[11px] font-medium tabular-nums text-white/75">
              {util.toFixed(0)}%
            </span>
          </div>

          {!compact && (
            <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] text-white/65">
              <span>
                Due {formatShortDate(nextOccurrence(card.dueDay))} · Closes{" "}
                {formatShortDate(nextOccurrence(card.statementDay))}
              </span>
              {topCategories.length > 0 && (
                <span className="flex gap-1">
                  {topCategories.map((c) => (
                    <span
                      key={c.category}
                      className="rounded-full bg-white/15 px-1.5 py-0.5 font-medium whitespace-nowrap"
                    >
                      {c.multiplier}x {categoryLabel(c.category)}
                    </span>
                  ))}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
