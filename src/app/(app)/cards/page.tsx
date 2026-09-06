import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AddCardButton } from "@/components/AddButtons";
import { CardsView } from "@/components/CardsView";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Cards - Cardinal" };

export default async function CardsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const cards = await prisma.card.findMany({
    where: { userId: user.id, active: true },
    include: { rewardCategories: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="page-shell page-stack">
      <PageHeader
        eyebrow="Your wallet"
        title="A home for every card."
        description="Keep your balances in sight and your next payment in mind."
        actions={<AddCardButton />}
      />
      <CardsView cards={cards} />
    </div>
  );
}
