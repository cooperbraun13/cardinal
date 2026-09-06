"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CreditCardIcon, LoaderCircleIcon } from "lucide-react";
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
import { EmptyState } from "@/components/EmptyState";

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
  const [result, setResult] = useState<
    (RecommendResponse & { category: string; amount: number }) | null
  >(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function recommend(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const response = await apiFetch<RecommendResponse>(
        "/api/recommend-card",
        {
          method: "POST",
          body: {
            category,
            amount: Number(amount),
            merchant: merchant || undefined,
          },
        },
      );
      setResult({ ...response, category, amount: Number(amount) });
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  const ranked = result?.recommendation
    ? [result.recommendation, ...result.alternatives].slice(0, 4)
    : [];

  return (
    <div className="grid items-start gap-design-md xl:grid-cols-[minmax(18rem,.8fr)_minmax(0,1.2fr)]">
      <form
        onSubmit={recommend}
        className="panel panel-body xl:sticky xl:top-24"
        aria-busy={loading}
      >
        <h2 className="section-title">Plan a purchase</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Enter a category and amount to compare reward value.
        </p>
        <div className="mt-design-md grid gap-design-sm">
          {error && <ErrorBanner message={error} />}
          <Field label="Category">
            <NativeSelect
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
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
          <p className="text-xs leading-5 text-muted-foreground">
            Comparisons use the category and amount. Merchant names do not
            affect the ranking.
          </p>
          <Button
            type="submit"
            disabled={loading || !amount || Number(amount) <= 0}
          >
            {loading && (
              <LoaderCircleIcon
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {loading ? "Comparing cards..." : "Find the best card"}
          </Button>
        </div>
      </form>

      <section
        aria-live="polite"
        aria-busy={loading}
        aria-label="Card recommendations"
        className="min-w-0"
      >
        {loading ? (
          <div
            className="panel panel-body grid min-h-80 content-center gap-design-sm"
            role="status"
          >
            <LoaderCircleIcon className="size-6 animate-spin text-foreground" />
            <h2 className="text-xl font-medium">Finding your best fit...</h2>
            <p className="text-sm text-muted-foreground">
              Comparing earning rates, promotions, and spending caps.
            </p>
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-5 w-1/2" />
          </div>
        ) : (
          !result && (
            <div className="flex min-h-96 flex-col justify-center px-2 sm:px-8">
              <span className="mb-6 flex size-12 items-center justify-center border border-border">
                <CreditCardIcon className="size-5 text-muted-foreground" />
              </span>
              <p className="eyebrow">Before you buy</p>
              <h2 className="mt-4 max-w-sm text-[36px] leading-tight font-medium tracking-[-.02em]">
                The right card for what’s next.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                A dinner out. Your next trip. An everyday essential. See which
                card gives you the most value for the purchase you have in mind.
              </p>
            </div>
          )
        )}
        {result && !result.recommendation && (
          <EmptyState
            icon={CreditCardIcon}
            title="Let’s start with your wallet"
            description={
              result.message || "Add an active card to compare your rewards."
            }
            action={
              <Link href="/cards" className="text-link">
                Go to your cards <ArrowRightIcon className="size-4" />
              </Link>
            }
            className="panel min-h-80"
          />
        )}
        {ranked.length > 0 && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              For your {formatCurrency(result?.amount ?? 0)}{" "}
              {categoryLabel(result?.category ?? "").toLowerCase()} purchase
            </p>
            <ol className="space-y-5">
              {ranked.map((recommendation, index) => (
                <li
                  key={recommendation.cardId}
                  className={
                    index === 0
                      ? "panel panel-body border-foreground/30"
                      : "border-t border-border py-5"
                  }
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={
                        index === 0 ? "eyebrow text-foreground" : "eyebrow"
                      }
                    >
                      {index === 0
                        ? "Your best match"
                        : `Alternative 0${index}`}
                    </p>
                    {recommendation.promo && (
                      <Badge variant="outline" className="text-foreground">
                        Promotion
                      </Badge>
                    )}
                    {recommendation.capped && (
                      <Badge variant="outline">Cap reached</Badge>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap items-start justify-between gap-design-sm">
                    <div className="min-w-0">
                      <h2
                        className={
                          index === 0
                            ? "break-words text-2xl font-medium tracking-tight"
                            : "text-base font-medium"
                        }
                      >
                        {recommendation.cardName}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {recommendation.issuer}
                      </p>
                    </div>
                    <p className="text-xl font-medium tabular-nums">
                      {recommendation.rewardRate}
                      {recommendation.rewardType === "cashback" ? "%" : "x"}
                      <span className="ml-1 text-xs text-muted-foreground">
                        rate
                      </span>
                    </p>
                  </div>
                  <p
                    className={
                      index === 0
                        ? "mt-design-md text-3xl font-medium tracking-tight tabular-nums"
                        : "mt-4 text-lg font-medium tabular-nums"
                    }
                  >
                    {formatEstimate(recommendation)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Approximately{" "}
                    {formatCurrency(recommendation.estimatedValue)} in reward
                    value
                  </p>
                  <p className="mt-design-sm text-sm leading-6 text-muted-foreground">
                    {recommendation.explanation}
                  </p>
                  <Link
                    href={`/cards/${recommendation.cardId}`}
                    className="text-link mt-3"
                  >
                    View card <ArrowRightIcon className="size-4" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </div>
  );
}
