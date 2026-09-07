import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { CompoundGrowthCalculator } from "@/components/calculators/CompoundGrowthCalculator";

export const metadata = { title: "Compound growth calculator - Cardinal" };

export default function CompoundGrowthPage() {
  return (
    <div className="page-shell page-stack">
      <Link href="/calculators" className="text-link w-fit"><ArrowLeftIcon className="size-4" /> All calculators</Link>
      <PageHeader eyebrow="Calculator" title="Compound growth" description="Explore how a starting amount and regular contributions might grow under a chosen rate and time period." />
      <CompoundGrowthCalculator />
    </div>
  );
}
