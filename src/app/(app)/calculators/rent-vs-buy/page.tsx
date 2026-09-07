import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { RentVsBuyCalculator } from "@/components/calculators/RentVsBuyCalculator";

export const metadata = { title: "Rent versus buy calculator - Cardinal" };

export default function RentVsBuyPage() {
  return <div className="page-shell page-stack"><Link href="/calculators" className="text-link w-fit"><ArrowLeftIcon className="size-4" /> All calculators</Link><PageHeader eyebrow="Calculator" title="Rent versus buy" description="Compare simplified rent and home-buying costs over a selected period." /><RentVsBuyCalculator /></div>;
}
