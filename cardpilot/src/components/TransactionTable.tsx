"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { categoryLabel } from "@/lib/categories";
import { formatCurrency, formatNumber, formatShortDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ErrorBanner";
import { cn } from "@/lib/utils";

export interface TransactionView {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  transactionDate: Date | string;
  status: string;
  isRefund: boolean;
  card?: { name: string; cardTheme?: string };
  rewards?: { rewardAmount: number; rewardType: string; multiplier: number }[];
}

function rewardLabel(reward: { rewardAmount: number; rewardType: string }): string {
  if (reward.rewardType === "cashback") {
    return `${formatCurrency(reward.rewardAmount / 100)} back`;
  }
  return `${formatNumber(reward.rewardAmount)} ${reward.rewardType === "miles" ? "mi" : "pts"}`;
}

export function TransactionTable({
  transactions,
  showCard = true,
  allowDelete = false,
  linkRows = false,
}: {
  transactions: TransactionView[];
  showCard?: boolean;
  allowDelete?: boolean;
  linkRows?: boolean;
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function remove(id: string) {
    setError("");
    setDeletingId(id);
    try {
      await apiFetch(`/api/transactions/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to delete this transaction.");
    } finally {
      setDeletingId(null);
    }
  }

  if (transactions.length === 0) {
    return (
      <p className="py-6 text-sm leading-6 text-muted-foreground">
        No transactions yet. Add one to start tracking spending and rewards.
      </p>
    );
  }

  return (
    <div>
      {error && <ErrorBanner message={error} className="mb-3" />}
      <div className="divide-y divide-border">
        {transactions.map((transaction) => {
          const reward = transaction.rewards?.[0];
          const rowContent = (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {transaction.merchant}
                  {transaction.isRefund && (
                    <span className="ml-2 text-[11px] font-semibold text-primary">Refund</span>
                  )}
                  {transaction.status === "pending" && (
                    <span className="ml-2 text-[11px] font-medium text-muted-foreground">
                      Pending
                    </span>
                  )}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {categoryLabel(transaction.category)}
                  {showCard && transaction.card ? ` / ${transaction.card.name}` : ""} /{" "}
                  {formatShortDate(transaction.transactionDate)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p
                  className={cn(
                    "text-sm font-medium tabular-nums",
                    transaction.isRefund ? "text-primary" : "text-foreground"
                  )}
                >
                  {transaction.isRefund ? "+" : ""}
                  {formatCurrency(transaction.amount)}
                </p>
                {reward && reward.rewardAmount > 0 && (
                  <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">
                    +{rewardLabel(reward)}
                  </p>
                )}
              </div>
            </>
          );

          return linkRows ? (
            <Link
              key={transaction.id}
              href={`/transactions?search=${encodeURIComponent(transaction.merchant)}`}
              className="group flex items-center gap-4 py-3.5 transition-colors hover:text-primary focus-visible:rounded focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
            >
              {rowContent}
            </Link>
          ) : (
            <div key={transaction.id} className="group flex items-center gap-3 py-3.5">
              {rowContent}
              {allowDelete && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete ${transaction.merchant} transaction`}
                  disabled={deletingId === transaction.id}
                  onClick={() => remove(transaction.id)}
                  className="shrink-0 text-muted-foreground sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                >
                  <Trash2Icon className="size-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
