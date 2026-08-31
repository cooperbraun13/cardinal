"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/client";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { formatCurrency, formatNumber, formatRewardType } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { ErrorBanner } from "@/components/ErrorBanner";
import type { Recommendation } from "@/services/recommend";

interface RecommendResponse {
  recommendedCard: string | null;
  recommendation?: Recommendation;
  alternatives: Recommendation[];
  message?: string;
}

export function formatEstimate(rec: Recommendation): string {
  return rec.rewardType === "cashback"
    ? `${formatCurrency(rec.estimatedRewards)} back`
    : `${formatNumber(rec.estimatedRewards)} ${formatRewardType(rec.rewardType)}`;
}

export function BestCardWidget() {
  const [category, setCategory] = useState("dining");
  const [amount, setAmount] = useState("50");
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function recommend(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await apiFetch<RecommendResponse>("/api/recommend-card", {
        method: "POST",
        body: { category, amount: Number(amount) },
      });
      setResult(response);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel p-5 sm:p-6" aria-labelledby="best-card-heading">
      <h2 id="best-card-heading" className="text-base font-semibold tracking-[-0.02em]">
        Best card to use
      </h2>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        Compare the reward value before you buy.
      </p>

      <form onSubmit={recommend} className="mt-4">
        <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-2">
          <NativeSelect
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Purchase category"
          >
            {CATEGORIES.map((purchaseCategory) => (
              <option key={purchaseCategory} value={purchaseCategory}>
                {categoryLabel(purchaseCategory)}
              </option>
            ))}
          </NativeSelect>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              aria-label="Purchase amount"
              className="pl-7"
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading || !amount || Number(amount) <= 0}
          className="mt-3 w-full"
        >
          {loading ? "Checking..." : "Recommend a card"}
        </Button>
      </form>

      {error && <ErrorBanner message={error} className="mt-3" />}
      <div aria-live="polite">
        {result &&
          (result.recommendation ? (
            <div className="mt-4 border-t border-border pt-4">
              <p className="eyebrow text-primary">Recommended</p>
              <p className="mt-2 text-base font-semibold">{result.recommendation.cardName}</p>
              <p className="mt-1 text-sm font-semibold text-primary">
                {result.recommendation.rewardRate}x - {formatEstimate(result.recommendation)}
              </p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {result.recommendation.explanation}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">{result.message}</p>
          ))}
      </div>
    </section>
  );
}
