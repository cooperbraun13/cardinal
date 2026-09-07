export type EmployerMatchInput = {
  annualSalary: number;
  employeeContributionPercent: number;
  employerMatchPercent: number;
  employerMatchCapPercent: number;
};

export type EmployerMatchResult = {
  employeeContribution: number;
  employerContribution: number;
  totalAnnualContribution: number;
};

const roundToCents = (value: number) => {
  const rounded = Math.round(value * 100) / 100;
  if (!Number.isFinite(rounded)) throw new Error("Employer-match result is outside the supported range.");
  return rounded;
};

export function calculateEmployerMatch(input: EmployerMatchInput): EmployerMatchResult {
  const { annualSalary, employeeContributionPercent, employerMatchPercent, employerMatchCapPercent } = input;
  if (![annualSalary, employeeContributionPercent, employerMatchPercent, employerMatchCapPercent].every(Number.isFinite)) throw new Error("Employer-match inputs must be finite numbers.");
  if ([annualSalary, employeeContributionPercent, employerMatchPercent, employerMatchCapPercent].some((value) => value < 0)) throw new Error("Employer-match inputs cannot be negative.");
  const employeeContribution = roundToCents(annualSalary * employeeContributionPercent / 100);
  const matchedSalary = annualSalary * Math.min(employeeContributionPercent, employerMatchCapPercent) / 100;
  const employerContribution = roundToCents(matchedSalary * employerMatchPercent / 100);
  return { employeeContribution, employerContribution, totalAnnualContribution: roundToCents(employeeContribution + employerContribution) };
}
