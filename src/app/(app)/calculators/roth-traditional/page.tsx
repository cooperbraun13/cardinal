import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { RothTraditionalCalculator } from "@/components/calculators/RothTraditionalCalculator";

export const metadata = { title: "Roth versus Traditional calculator - Cardinal" };

export default function RothTraditionalPage() {
  return <div className="page-shell page-stack"><Link href="/calculators" className="text-link w-fit"><ArrowLeftIcon className="size-4" /> All calculators</Link><PageHeader eyebrow="Calculator" title="Roth versus Traditional" description="Compare a simplified after-tax outcome using the same pre-tax amount and illustrative tax rates." /><RothTraditionalCalculator /></div>;
}
