import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CardsView } from "@/components/CardsView";
import { AddCardButton } from "@/components/AddButtons";

export const metadata = { title: "Cards — Cardinal" };

export default async function CardsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const cards = await prisma.card.findMany({
    where: { userId: user.id, active: true },
    include: { rewardCategories: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your cards</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {cards.length} active {cards.length === 1 ? "card" : "cards"}
          </p>
        </div>
        <AddCardButton />
      </div>
      <CardsView cards={cards} />
    </div>
  );
}
