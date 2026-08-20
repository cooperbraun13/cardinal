"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon, RotateCcwIcon } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { categoryLabel } from "@/lib/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { ReceiptIcon } from "lucide-react";
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
      <EmptyState
        icon={ReceiptIcon}
        title="No transactions yet"
        description="Add a transaction to start tracking spending and rewards."
      />
    );
  }

  return (
    <div className="divide-y divide-border/60">
      {transactions.map((t) => {
        const reward = t.rewards?.[0];
        return (
          <div key={t.id} className="flex items-center gap-3 py-2.5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium">{t.merchant}</p>
                {t.isRefund && (
                  <Badge className="bg-sky-500/15 text-sky-400">
                    <RotateCcwIcon className="size-3" /> Refund
                  </Badge>
                )}
                {t.status === "pending" && <Badge variant="secondary">Pending</Badge>}
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {formatDate(t.transactionDate)} · {categoryLabel(t.category)}
                {showCard && t.card ? ` · ${t.card.name}` : ""}
              </p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "text-sm font-medium tabular-nums",
                  t.isRefund && "text-emerald-400"
                )}
              >
                {t.isRefund ? "+" : "−"}
                {formatCurrency(t.amount)}
              </p>
              {reward && reward.rewardAmount !== 0 && (
                <p className="text-[11px] tabular-nums text-muted-foreground">
                  {reward.rewardAmount > 0 ? "+" : ""}
                  {reward.rewardType === "cashback"
                    ? formatCurrency(reward.rewardAmount / 100)
                    : formatNumber(reward.rewardAmount)}{" "}
                  {reward.rewardType === "cashback" ? "back" : reward.rewardType}
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
                className="text-muted-foreground hover:text-destructive"
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
