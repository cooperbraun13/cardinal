import Link from "next/link";
import {
  CreditCardTile,
  type CreditCardTileData,
} from "@/components/CreditCardTile";

export function CardGrid({
  cards,
  maxCards = 3,
}: {
  cards: CreditCardTileData[];
  maxCards?: number;
}) {
  return (
    <div className="wallet-grid" data-columns={maxCards}>
      {cards.slice(0, maxCards).map((card) => (
        <Link
          key={card.id}
          href={`/cards/${card.id}`}
          aria-label={`View ${card.name}`}
          className="group block rounded-none focus-visible:outline-offset-4"
        >
          <CreditCardTile card={card} />
        </Link>
      ))}
    </div>
  );
}
