"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { formatCurrency, formatShortDate, formatNumber } from "@/lib/format";
import { categoryLabel } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TransactionView {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  transactionDate: Date | string;
  status: string;
  isRefund: boolean;
  card?: { name: string };
  rewards?: { rewardAmount: number; rewardType: string; multiplier: number }[];
}

function rewardLabel(reward: { rewardAmount: number; rewardType: string }): string {
  if (reward.rewardType === "cashback") return `${formatCurrency(reward.rewardAmount / 100)} back`;
  return `${formatNumber(reward.rewardAmount)} ${reward.rewardType === "miles" ? "mi" : "pts"}`;
}

/** Flat Robinhood-style activity list: avatar, merchant, context line, amount right. */
export function TransactionTable({
  transactions,
  showCard = true,
  allowDelete = false,
}: {
  transactions: TransactionView[];
  showCard?: boolean;
  allowDelete?: boolean;
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function remove(id: string) {
    setDeletingId(id);
    try {
      await apiFetch(`/api/transactions/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  if (transactions.length === 0) {
    return (
      <p className="py-6 text-sm text-muted-foreground">
        No transactions yet. Add one to start tracking spending and rewards.
      </p>
    );
  }

  return (
    <div>
      {transactions.map((t) => {
        const reward = t.rewards?.[0];
        return (
          <div key={t.id} className="group flex items-center gap-3 py-3">
            {/* Letter avatar */}
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/8 text-sm font-semibold text-foreground/80">
              {t.merchant.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {t.merchant}
                {t.isRefund && <span className="ml-1.5 text-xs font-normal text-primary">Refund</span>}
                {t.status === "pending" && (
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground">Pending</span>
                )}
              </p>
              <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
                {categoryLabel(t.category)}
                {showCard && t.card ? ` · ${t.card.name}` : ""} ·{" "}
                {formatShortDate(t.transactionDate)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p
                className={cn(
                  "text-sm font-medium tabular-nums",
                  t.isRefund ? "text-primary" : "text-foreground"
                )}
              >
                {t.isRefund ? "+" : ""}
                {formatCurrency(t.amount)}
              </p>
              {reward && reward.rewardAmount > 0 && (
                <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                  +{rewardLabel(reward)}
                </p>
              )}
            </div>
            {allowDelete && (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete ${t.merchant} transaction`}
                disabled={deletingId === t.id}
                onClick={() => remove(t.id)}
                className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive focus-visible:opacity-100"
              >
                <Trash2Icon className="size-4" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
