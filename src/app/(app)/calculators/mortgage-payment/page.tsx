import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { MortgagePaymentCalculator } from "@/components/calculators/MortgagePaymentCalculator";

export const metadata = { title: "Mortgage payment calculator - Cardinal" };

export default function MortgagePaymentPage() {
  return <div className="page-shell page-stack"><Link href="/calculators" className="text-link w-fit"><ArrowLeftIcon className="size-4" /> All calculators</Link><PageHeader eyebrow="Calculator" title="Mortgage payment" description="Estimate the principal-and-interest payment for a fixed-rate mortgage." /><MortgagePaymentCalculator /></div>;
}
