"use client";

import { useRouter } from "next/navigation";
import { CreditCardTile, type CreditCardTileData } from "@/components/CreditCardTile";

/** Cards on the page grid — same gutters as every other block. No carousel. */
export function CardGrid({ cards }: { cards: CreditCardTileData[] }) {
  const router = useRouter();
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <CreditCardTile
          key={card.id}
          card={card}
          onClick={() => router.push(`/cards/${card.id}`)}
        />
      ))}
    </div>
  );
}
