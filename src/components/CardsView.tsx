"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CreditCardTile, type CreditCardTileData } from "@/components/CreditCardTile";
import { NativeSelect } from "@/components/ui/native-select";
import { EmptyState } from "@/components/EmptyState";
import { AddCardButton } from "@/components/AddButtons";
import { utilization } from "@/services/rewards";
import { categoryLabel } from "@/lib/categories";
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

  const issuers = useMemo(() => [...new Set(cards.map((c) => c.issuer))].sort(), [cards]);
  const rewardCategories = useMemo(
    () => [...new Set(cards.flatMap((c) => c.rewardCategories.map((r) => r.category)))].sort(),
    [cards]
  );

  const visible = useMemo(() => {
    let list = cards;
    if (issuer !== "all") list = list.filter((c) => c.issuer === issuer);
    if (rewardType !== "all")
      list = list.filter((c) => c.rewardCategories.some((r) => r.category === rewardType));
    const daysToDue = (day: number) => {
      const now = new Date();
      const d = new Date(now.getFullYear(), now.getMonth(), day);
      if (d < now) d.setMonth(d.getMonth() + 1);
      return d.getTime();
    };
    return [...list].sort((a, b) => {
      switch (sort) {
        case "utilization":
          return (
            utilization(b.currentBalance, b.creditLimit) -
            utilization(a.currentBalance, a.creditLimit)
          );
        case "dueDate":
          return daysToDue(a.dueDay) - daysToDue(b.dueDay);
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
    <div className="space-y-5">
      <div className="panel grid gap-2 p-3 sm:grid-cols-3">
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
        <NativeSelect
          value={rewardType}
          onChange={(e) => setRewardType(e.target.value)}
          aria-label="Filter by reward category"
          wrapperClassName="w-full"
        >
          <option value="all">All reward types</option>
          {rewardCategories.map((c) => (
            <option key={c} value={c}>
              {categoryLabel(c)}
            </option>
          ))}
        </NativeSelect>
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
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((card) => (
          <Link
            key={card.id}
            href={`/cards/${card.id}`}
            aria-label={`View ${card.name}`}
            className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <CreditCardTile card={card} />
          </Link>
        ))}
      </div>
      {visible.length === 0 && (
        <p aria-live="polite" className="py-10 text-center text-sm text-muted-foreground">
          No cards match these filters.
        </p>
      )}
    </div>
  );
}
