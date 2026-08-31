"use client";

import { useState } from "react";
import { TrophyIcon } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import type { Recommendation } from "@/services/recommend";
import { formatEstimate } from "@/components/BestCardWidget";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Field } from "@/components/forms/Field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

interface RecommendResponse {
  recommendedCard: string | null;
  recommendation?: Recommendation;
  alternatives: Recommendation[];
  message?: string;
}

export function OptimizerView() {
  const [category, setCategory] = useState("dining");
  const [amount, setAmount] = useState("100");
  const [merchant, setMerchant] = useState("");
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
        body: { category, amount: Number(amount), merchant: merchant || undefined },
      });
      setResult(response);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const ranked = result?.recommendation
    ? [result.recommendation, ...result.alternatives].slice(0, 4)
    : [];

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
      <form onSubmit={recommend} className="panel p-5 sm:p-6 xl:sticky xl:top-6">
        <h2 className="text-base font-semibold tracking-[-0.02em]">Plan a purchase</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Enter a category and amount to compare reward value.
        </p>
        <div className="mt-5 grid gap-4">
          {error && <ErrorBanner message={error} />}
          <Field label="Category">
            <NativeSelect value={category} onChange={(event) => setCategory(event.target.value)}>
              {CATEGORIES.map((purchaseCategory) => (
                <option key={purchaseCategory} value={purchaseCategory}>
                  {categoryLabel(purchaseCategory)}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Amount ($)">
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
          </Field>
          <Field label="Merchant (optional)">
            <Input
              value={merchant}
              onChange={(event) => setMerchant(event.target.value)}
              placeholder="Whole Foods"
            />
          </Field>
          <Button type="submit" disabled={loading || !amount || Number(amount) <= 0}>
            {loading ? "Comparing cards..." : "Find the best card"}
          </Button>
        </div>
      </form>

      <section aria-live="polite" aria-label="Card recommendations">
        {!result && (
          <div className="panel flex min-h-64 items-center justify-center p-8 text-center">
            <div className="max-w-md">
              <p className="eyebrow">Ready when you are</p>
              <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em]">
                Make every purchase work harder.
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Cardinal ranks your cards using category rates, active promotions, spending caps,
                and the estimated value of each reward type.
              </p>
            </div>
          </div>
        )}

        {result && !result.recommendation && (
          <div className="panel flex min-h-48 items-center justify-center p-8 text-center">
            <p className="text-sm text-muted-foreground">{result.message}</p>
          </div>
        )}

        {ranked.length > 0 && (
          <div className="panel overflow-hidden">
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <p className="text-sm font-semibold">Ranked recommendations</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Estimated for a {formatCurrency(Number(amount))} {categoryLabel(category).toLowerCase()} purchase.
              </p>
            </div>
            <ol className="divide-y divide-border">
              {ranked.map((recommendation, index) => (
                <li
                  key={recommendation.cardId}
                  className={cn("p-5 sm:p-6", index === 0 && "bg-primary/[0.045]")}
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {index === 0 && <TrophyIcon className="size-4 text-primary" />}
                        <p className="font-semibold">{recommendation.cardName}</p>
                        {recommendation.promo && (
                          <Badge className="border-primary/30 bg-primary/10 text-primary">Promo</Badge>
                        )}
                        {recommendation.capped && <Badge variant="outline">Cap reached</Badge>}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{recommendation.issuer}</p>
                      <p className="mt-3 max-w-xl text-xs leading-5 text-muted-foreground">
                        {recommendation.explanation}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-base font-semibold text-primary">
                        +{formatEstimate(recommendation)}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        approx. {formatCurrency(recommendation.estimatedValue)} value
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </div>
  );
}
