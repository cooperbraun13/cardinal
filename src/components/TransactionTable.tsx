"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { ReceiptTextIcon, Trash2Icon, LoaderCircleIcon } from "lucide-react";
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

function rewardLabel(reward: {
  rewardAmount: number;
  rewardType: string;
}): string {
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
  filtered = false,
}: {
  transactions: TransactionView[];
  showCard?: boolean;
  allowDelete?: boolean;
  linkRows?: boolean;
  filtered?: boolean;
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
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to delete this transaction.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (transactions.length === 0)
    return (
      <EmptyState
        icon={ReceiptTextIcon}
        title={filtered ? "No matching activity" : "A fresh page"}
        description={
          filtered
            ? "Try a different date range or clear your filters to see more transactions."
            : "Add a transaction to start following your spending and rewards."
        }
      />
    );

  return (
    <div>
      {error && <ErrorBanner message={error} className="mb-3" />}
      <div
        className="divide-y divide-border"
        role="list"
        aria-label="Transactions"
      >
        {transactions.map((transaction) => {
          const reward = transaction.rewards?.[0];
          const rowContent = (
            <>
              <span
                aria-hidden="true"
                className="hidden size-10 shrink-0 items-center justify-center border border-border bg-muted/30 text-sm text-muted-foreground sm:flex"
              >
                {transaction.merchant.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 break-words text-sm font-medium">
                  {transaction.merchant}
                  {transaction.isRefund && (
                    <Badge
                      variant="outline"
                      className="border-border text-foreground"
                    >
                      Refund
                    </Badge>
                  )}
                  {transaction.status === "pending" && (
                    <Badge variant="outline" className="text-muted-foreground">
                      Pending
                    </Badge>
                  )}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {categoryLabel(transaction.category)}
                  {showCard && transaction.card
                    ? ` / ${transaction.card.name}`
                    : ""}{" "}
                  / {formatShortDate(transaction.transactionDate)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p
                  className={cn(
                    "text-sm font-medium tabular-nums",
                    transaction.isRefund
                      ? "text-foreground"
                      : "text-foreground",
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

          return (
            <div key={transaction.id} role="listitem">
              {linkRows ? (
                <Link
                  href={`/transactions?search=${encodeURIComponent(transaction.merchant)}`}
                  className="group flex items-center gap-3 py-design-sm transition-colors hover:bg-muted/25 focus-visible:outline-offset-0"
                >
                  {rowContent}
                </Link>
              ) : (
                <div className="group flex items-center gap-2 py-5 sm:gap-3">
                  {rowContent}
                  {allowDelete && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${transaction.merchant} transaction`}
                      disabled={deletingId !== null}
                      onClick={() => remove(transaction.id)}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      {deletingId === transaction.id ? (
                        <LoaderCircleIcon className="size-4 animate-spin" />
                      ) : (
                        <Trash2Icon className="size-4" />
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
