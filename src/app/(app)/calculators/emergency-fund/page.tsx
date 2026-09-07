import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmergencyFundCalculator } from "@/components/calculators/EmergencyFundCalculator";

export const metadata = { title: "Emergency fund calculator - Cardinal" };

export default function EmergencyFundPage() {
  return (
    <div className="page-shell page-stack">
      <Link href="/calculators" className="text-link w-fit"><ArrowLeftIcon className="size-4" /> All calculators</Link>
      <PageHeader eyebrow="Calculator" title="Emergency fund" description="Choose a target number of months and see how it compares with the savings you have set aside." />
      <EmergencyFundCalculator />
    </div>
  );
}
