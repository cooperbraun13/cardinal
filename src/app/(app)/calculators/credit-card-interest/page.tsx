import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { CreditCardInterestCalculator } from "@/components/calculators/CreditCardInterestCalculator";

export const metadata = { title: "Credit-card interest calculator - Cardinal" };

export default function CreditCardInterestPage() {
  return <div className="page-shell page-stack"><Link href="/calculators" className="text-link w-fit"><ArrowLeftIcon className="size-4" /> All calculators</Link><PageHeader eyebrow="Calculator" title="Credit-card interest estimate" description="Explore how APR and time can affect a constant balance." /><CreditCardInterestCalculator /></div>;
}
