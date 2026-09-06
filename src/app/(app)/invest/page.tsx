import { LandmarkIcon } from "lucide-react";
import { FeaturePlaceholder } from "@/components/FeaturePlaceholder";

export const metadata = { title: "Invest - Cardinal" };

export default function InvestPage() {
  return <FeaturePlaceholder eyebrow="Invest" title="Understand investing before you begin." description="Cardinal will introduce accounts, funds, and long-term investing in plain language." icon={LandmarkIcon} availableNow="Investing lessons are the next educational area Cardinal is preparing." links={[{ href: "/learn", label: "Browse lessons" }]} />;
}
