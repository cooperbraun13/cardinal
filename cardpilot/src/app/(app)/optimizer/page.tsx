import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { OptimizerView } from "@/components/OptimizerView";

export const metadata = { title: "Optimizer — CardPilot" };

export default async function OptimizerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Rewards optimizer</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Always know which card to swipe before you pay.
        </p>
      </div>
      <OptimizerView />
    </div>
  );
}
