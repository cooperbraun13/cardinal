import Link from "next/link";
import { CreditCardTile, type CreditCardTileData } from "@/components/CreditCardTile";

export function CardGrid({
  cards,
  maxCards = 3,
}: {
  cards: CreditCardTileData[];
  maxCards?: number;
}) {
  return (
    <div className="-mx-4 flex w-[calc(100%+2rem)] min-w-0 snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:w-full sm:px-0 xl:grid xl:grid-cols-3 xl:overflow-visible xl:pb-0">
      {cards.slice(0, maxCards).map((card) => (
        <Link
          key={card.id}
          href={`/cards/${card.id}`}
          aria-label={`View ${card.name}`}
          className="group w-[84vw] max-w-[23rem] shrink-0 snap-start rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/40 sm:w-[22rem] xl:w-auto xl:max-w-none"
        >
          <CreditCardTile card={card} />
        </Link>
      ))}
    </div>
  );
}
