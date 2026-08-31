"use client";

import { useState } from "react";
import { TrophyIcon } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NativeSelect } from "@/components/ui/native-select";
import { Field } from "@/components/forms/Field";
import { ErrorBanner } from "@/components/ErrorBanner";
import { formatEstimate } from "@/components/BestCardWidget";
import type { Recommendation } from "@/services/recommend";
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

  async function recommend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiFetch<RecommendResponse>("/api/recommend-card", {
        method: "POST",
        body: { category, amount: Number(amount), merchant: merchant || undefined },
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const all = result?.recommendation
    ? [result.recommendation, ...result.alternatives]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <form onSubmit={recommend} className="panel h-fit p-5">
        <h2 className="text-base font-bold tracking-tight">Plan a purchase</h2>
        <div className="mt-4 grid gap-3.5">
          {error && <ErrorBanner message={error} />}
          <Field label="Category">
            <NativeSelect value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel(c)}
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
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Field>
          <Field label="Merchant (optional)">
            <Input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="Whole Foods"
            />
          </Field>
          <Button type="submit" disabled={loading || !amount || Number(amount) <= 0}>
            {loading ? "Comparing cards…" : "Find the best card"}
          </Button>
        </div>
      </form>

      <div>
        {!result && (
          <div className="flex h-full min-h-48 items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="max-w-sm text-sm text-muted-foreground">
              Tell Cardinal what you're buying, and it will rank your cards by estimated reward
              value — accounting for promos, caps, and reward types.
            </p>
          </div>
        )}
        {result && !result.recommendation && (
          <div className="flex h-full min-h-48 items-center justify-center rounded-2xl border border-dashed border-border p-8">
            <p className="text-sm text-muted-foreground">{result.message}</p>
          </div>
        )}
        {all.length > 0 && (
          <div className="space-y-3">
            {all.slice(0, 4).map((rec, i) => (
              <div
                key={rec.cardId}
                className={cn("panel p-4", i === 0 && "ring-1 ring-primary/50")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {i === 0 && <TrophyIcon className="size-4 shrink-0 text-primary" />}
                      <p className="truncate text-sm font-semibold">{rec.cardName}</p>
                      {rec.promo && (
                        <Badge className="bg-primary/15 text-primary">Promo</Badge>
                      )}
                      {rec.capped && (
                        <Badge variant="secondary">Cap reached</Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{rec.issuer}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{rec.explanation}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-primary">
                      +{formatEstimate(rec)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      ≈ {formatCurrency(rec.estimatedValue)} value
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
