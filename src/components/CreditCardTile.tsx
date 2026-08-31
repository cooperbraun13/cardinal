"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatCurrency, nextOccurrence, formatShortDate } from "@/lib/format";
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
}

const NETWORK_LABELS: Record<string, string> = {
  visa: "VISA",
  mastercard: "Mastercard",
  amex: "AMEX",
  discover: "Discover",
};

function wholeCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/** CSS-rendered credit card — flat theme gradient, functional data, no ornament. */
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

  return (
    <motion.div
      whileHover={onClick ? { y: -3 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === "Enter" || e.key === " ") && onClick() : undefined}
      className={cn(
        `card-theme-${card.cardTheme}`,
        "relative aspect-[1.586] w-full min-w-60 select-none overflow-hidden rounded-xl p-4 text-white ring-1 ring-white/10 ring-inset sm:p-5",
        onClick && "cursor-pointer transition-shadow hover:ring-white/25",
        selected && "ring-2 ring-white/70",
        className
      )}
    >
      <div className="relative flex h-full flex-col">
        {/* Issuer / network */}
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-[10px] leading-4 font-semibold tracking-[0.16em] text-white/55 uppercase">
            {card.issuer}
          </p>
          {card.network && (
            <span className="shrink-0 text-xs font-bold tracking-widest text-white/75 italic">
              {NETWORK_LABELS[card.network] ?? card.network}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-base leading-5 font-bold tracking-tight">{card.name}</p>

        {/* Chip + number */}
        <div className="my-auto flex items-center gap-3 py-1.5">
          <div className="relative h-6 w-8 shrink-0 overflow-hidden rounded-[4px] bg-white/20">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/30" />
            <div className="absolute inset-y-0 left-1/3 w-px bg-black/30" />
            <div className="absolute inset-y-0 right-1/3 w-px bg-black/30" />
          </div>
          <span className="font-mono text-xs tracking-[0.3em] text-white/75">
            •••• {card.lastFour ?? "0000"}
          </span>
        </div>

        {/* Balance / limit */}
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] leading-4 font-semibold tracking-[0.16em] text-white/50 uppercase">
              Balance
            </p>
            <p className="text-[17px] leading-6 font-bold tracking-tight tabular-nums">
              {formatCurrency(card.currentBalance)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[9px] leading-4 font-semibold tracking-[0.16em] text-white/50 uppercase">
              Limit
            </p>
            <p className="text-sm leading-6 font-medium tabular-nums text-white/85">
              {wholeCurrency(card.creditLimit)}
            </p>
          </div>
        </div>

        {/* Utilization */}
        <div className="mt-2 flex items-center gap-2">
          <UtilizationBar value={util} className="flex-1" trackClassName="bg-black/30" />
          <span className="w-8 text-right text-[11px] font-semibold tabular-nums text-white/70">
            {util.toFixed(0)}%
          </span>
        </div>

        {!compact && (
          <p className="mt-2 text-[11px] leading-4 text-white/55">
            Due {formatShortDate(nextOccurrence(card.dueDay))}
          </p>
        )}
      </div>
    </motion.div>
  );
}
