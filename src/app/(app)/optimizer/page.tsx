import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { OptimizerView } from "@/components/OptimizerView";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Optimizer - Cardinal" };

export default async function OptimizerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="page-shell page-stack">
      <PageHeader
        eyebrow="Card optimizer"
        title="Make the most of your next purchase."
        description="One purchase. Your cards, compared. Find the reward that goes further."
      />
      <OptimizerView />
    </div>
  );
}
