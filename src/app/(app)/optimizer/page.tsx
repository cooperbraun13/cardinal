import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { OptimizerView } from "@/components/OptimizerView";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Optimizer - Cardinal" };

export default async function OptimizerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Rewards"
        title="Card optimizer"
        description="Compare your active cards for a purchase and see the strongest reward rate, estimated value, promotions, and alternatives."
      />
      <OptimizerView />
    </div>
  );
}
