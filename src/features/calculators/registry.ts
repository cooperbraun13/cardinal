export type CalculatorInputField = {
  name: string;
  label: string;
  unit: "dollars" | "percent" | "years" | "months" | "days";
};

export type CalculatorDefinition = {
  id: string;
  slug: string;
  title: string;
  description: string;
  inputFields: CalculatorInputField[];
  assumptions: string[];
  relatedLessonSlugs: string[];
  version: number;
};

export const calculatorDefinitions: CalculatorDefinition[] = [
  {
    id: "compound-growth",
    slug: "compound-growth",
    title: "Compound growth",
    description: "Illustrate how an initial amount and recurring contributions may grow over time.",
    inputFields: [
      { name: "initialAmount", label: "Starting amount", unit: "dollars" },
      { name: "monthlyContribution", label: "Monthly contribution", unit: "dollars" },
      { name: "annualRatePercent", label: "Annual growth rate", unit: "percent" },
      { name: "years", label: "Years", unit: "years" },
    ],
    assumptions: ["Monthly compounding and end-of-month contributions; results are illustrations, not guarantees."],
    relatedLessonSlugs: ["investing-basics", "diversification"],
    version: 1,
  },
  {
    id: "emergency-fund",
    slug: "emergency-fund",
    title: "Emergency fund",
    description: "Show a target based on a user-selected number of months of essential expenses.",
    inputFields: [
      { name: "monthlyEssentialExpenses", label: "Monthly essential expenses", unit: "dollars" },
      { name: "targetMonths", label: "Target months", unit: "months" },
      { name: "currentSavings", label: "Current savings", unit: "dollars" },
    ],
    assumptions: ["The target-month choice is supplied by the user; Cardinal does not decide what target is appropriate."],
    relatedLessonSlugs: ["emergency-fund"],
    version: 1,
  },
  {
    id: "credit-card-interest",
    slug: "credit-card-interest",
    title: "Credit-card interest estimate",
    description: "Estimate simple daily interest for a constant balance.",
    inputFields: [
      { name: "balance", label: "Balance", unit: "dollars" },
      { name: "aprPercent", label: "APR", unit: "percent" },
      { name: "days", label: "Days", unit: "days" },
    ],
    assumptions: ["Constant balance, a 365-day year, and simple daily interest; issuer methods can differ."],
    relatedLessonSlugs: ["apr", "credit-utilization"],
    version: 1,
  },
  {
    id: "employer-match",
    slug: "employer-match",
    title: "Employer match",
    description: "Illustrate an employer contribution with one salary-percentage cap.",
    inputFields: [
      { name: "annualSalary", label: "Annual salary", unit: "dollars" },
      { name: "employeeContributionPercent", label: "Employee contribution", unit: "percent" },
      { name: "employerMatchPercent", label: "Employer match rate", unit: "percent" },
      { name: "employerMatchCapPercent", label: "Match cap", unit: "percent" },
    ],
    assumptions: ["One salary-percentage cap; plan-specific limits, vesting, and payroll timing are excluded."],
    relatedLessonSlugs: ["employer-match", "401k"],
    version: 1,
  },
  {
    id: "mortgage-payment",
    slug: "mortgage-payment",
    title: "Mortgage payment",
    description: "Estimate principal and interest for a fixed-rate loan.",
    inputFields: [
      { name: "principal", label: "Loan principal", unit: "dollars" },
      { name: "annualRatePercent", label: "Annual interest rate", unit: "percent" },
      { name: "years", label: "Loan term", unit: "years" },
    ],
    assumptions: ["Principal and interest only; taxes, insurance, mortgage insurance, fees, and escrow are excluded."],
    relatedLessonSlugs: ["mortgages"],
    version: 1,
  },
  {
    id: "roth-traditional",
    slug: "roth-traditional",
    title: "Roth versus Traditional",
    description: "Compare simplified tax treatment using the same gross contribution.",
    inputFields: [
      { name: "grossContribution", label: "Pre-tax amount considered", unit: "dollars" },
      { name: "currentTaxRatePercent", label: "Current tax rate", unit: "percent" },
      { name: "futureTaxRatePercent", label: "Future tax rate", unit: "percent" },
    ],
    assumptions: ["Same gross contribution, simplified marginal tax rates, no growth, deductions, limits, or account-specific rules."],
    relatedLessonSlugs: ["roth-ira", "traditional-ira", "taxes"],
    version: 1,
  },
];

export function getCalculatorBySlug(slug: string) {
  return calculatorDefinitions.find((calculator) => calculator.slug === slug);
}
