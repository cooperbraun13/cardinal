"use client";

import { useMemo, useState } from "react";
import type { CreditCardTileData } from "@/components/CreditCardTile";
import { CardGrid } from "@/components/CardGrid";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/forms/Field";
import { NativeSelect } from "@/components/ui/native-select";
import { EmptyState } from "@/components/EmptyState";
import { AddCardButton } from "@/components/AddButtons";
import { utilization } from "@/services/rewards";
import { categoryLabel } from "@/lib/categories";
import { nextOccurrence } from "@/lib/format";
import { WalletCardsIcon } from "lucide-react";

export interface CardListItem extends CreditCardTileData {
  annualFee: number;
  rewardCategories: { category: string; multiplier: number }[];
}

type SortKey = "utilization" | "dueDate" | "annualFee" | "balance";

export function CardsView({ cards }: { cards: CardListItem[] }) {
  const [issuer, setIssuer] = useState("all");
  const [rewardType, setRewardType] = useState("all");
  const [sort, setSort] = useState<SortKey>("utilization");

  const issuers = useMemo(
    () => [...new Set(cards.map((c) => c.issuer))].sort(),
    [cards],
  );
  const rewardCategories = useMemo(
    () =>
      [
        ...new Set(
          cards.flatMap((c) => c.rewardCategories.map((r) => r.category)),
        ),
      ].sort(),
    [cards],
  );

  const visible = useMemo(() => {
    let list = cards;
    if (issuer !== "all") list = list.filter((c) => c.issuer === issuer);
    if (rewardType !== "all")
      list = list.filter((c) =>
        c.rewardCategories.some((r) => r.category === rewardType),
      );
    const now = new Date();
    return [...list].sort((a, b) => {
      switch (sort) {
        case "utilization":
          return (
            utilization(b.currentBalance, b.creditLimit) -
            utilization(a.currentBalance, a.creditLimit)
          );
        case "dueDate":
          return (
            nextOccurrence(a.dueDay, now).getTime() -
            nextOccurrence(b.dueDay, now).getTime()
          );
        case "annualFee":
          return b.annualFee - a.annualFee;
        case "balance":
          return b.currentBalance - a.currentBalance;
      }
    });
  }, [cards, issuer, rewardType, sort]);

  if (cards.length === 0) {
    return (
      <EmptyState
        icon={WalletCardsIcon}
        title="No cards yet"
        description="Add your first credit card to get started."
        action={<AddCardButton label="Add your first card" size="default" />}
        className="py-16"
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 border-y border-border py-5 sm:grid-cols-3">
        <Field label="Issuer">
          <NativeSelect
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            aria-label="Filter by issuer"
            wrapperClassName="w-full"
          >
            <option value="all">All issuers</option>
            {issuers.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Reward category">
          <NativeSelect
            value={rewardType}
            onChange={(e) => setRewardType(e.target.value)}
            aria-label="Filter by reward category"
            wrapperClassName="w-full"
          >
            <option value="all">All categories</option>
            {rewardCategories.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Sort by">
          <NativeSelect
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort cards"
            wrapperClassName="w-full"
          >
            <option value="utilization">Sort: Utilization</option>
            <option value="dueDate">Sort: Due date</option>
            <option value="annualFee">Sort: Annual fee</option>
            <option value="balance">Sort: Balance</option>
          </NativeSelect>
        </Field>
      </div>

      <p className="text-xs text-muted-foreground" aria-live="polite">
        {visible.length} of {cards.length} cards
      </p>
      <CardGrid cards={visible} maxCards={visible.length} />
      {visible.length === 0 && (
        <EmptyState
          title="No matching cards"
          description="Try another issuer or reward category."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setIssuer("all");
                setRewardType("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  );
}
