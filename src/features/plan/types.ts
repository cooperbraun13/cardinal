import type { FinancialProfileValues } from "@/features/profile/types";

export type PlanContext = FinancialProfileValues | null;

export type PlanRecommendation = {
  id: string;
  priority: number;
  title: string;
  action: string;
  rationale: string;
  whySuggested: string;
  href: string;
  linkLabel: string;
  inputsUsed: string[];
  assumptions: string[];
};
