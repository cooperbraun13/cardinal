"use client";

import { useRouter } from "next/navigation";
import { CreditCardTile, type CreditCardTileData } from "@/components/CreditCardTile";

/** Horizontal scrollable row of credit cards; clicking a card opens its detail page. */
export function CardCarousel({ cards }: { cards: CreditCardTileData[] }) {
  const router = useRouter();
  return (
    <div className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 py-2">
      {cards.map((card) => (
        <div key={card.id} className="w-72 shrink-0 sm:w-80">
          <CreditCardTile card={card} onClick={() => router.push(`/cards/${card.id}`)} />
        </div>
      ))}
    </div>
  );
}
