"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/client";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { formatNumber, formatCurrency, formatRewardType } from "@/lib/format";
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

/** Compact "which card should I use?" widget for the dashboard. */
export function BestCardWidget() {
  const [category, setCategory] = useState("dining");
  const [amount, setAmount] = useState("50");
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function recommend() {
    setError("");
    setLoading(true);
    try {
      const res = await apiFetch<RecommendResponse>("/api/recommend-card", {
        method: "POST",
        body: { category, amount: Number(amount) },
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel p-5">
      <h3 className="text-base font-bold tracking-tight">Best card to use</h3>
      <div className="mt-3 flex gap-2">
        <NativeSelect
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Purchase category"
          className="flex-1"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {categoryLabel(c)}
            </option>
          ))}
        </NativeSelect>
        <Input
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-label="Purchase amount"
          className="w-24"
        />
      </div>
      <Button
        onClick={recommend}
        disabled={loading || !amount || Number(amount) <= 0}
        className="mt-3 w-full"
        size="sm"
      >
        {loading ? "Checking…" : "Recommend"}
      </Button>
      {error && <ErrorBanner message={error} className="mt-3" />}
      {result &&
        (result.recommendation ? (
          <div className="mt-3 rounded-xl bg-white/5 p-3">
            <p className="text-sm font-semibold">{result.recommendation.cardName}</p>
            <p className="mt-0.5 text-xs font-semibold text-primary">
              +{formatEstimate(result.recommendation)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {result.recommendation.explanation}
            </p>
          </div>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">{result.message}</p>
        ))}
    </div>
  );
}
