import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmployerMatchCalculator } from "@/components/calculators/EmployerMatchCalculator";

export const metadata = { title: "Employer match calculator - Cardinal" };

export default function EmployerMatchPage() {
  return <div className="page-shell page-stack"><Link href="/calculators" className="text-link w-fit"><ArrowLeftIcon className="size-4" /> All calculators</Link><PageHeader eyebrow="Calculator" title="Employer match" description="Illustrate how a workplace retirement match could add to your annual contribution." /><EmployerMatchCalculator /></div>;
}
