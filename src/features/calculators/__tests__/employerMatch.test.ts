import { describe, expect, it } from "vitest";
import { calculateEmployerMatch } from "@/features/calculators/employerMatch";

describe("calculateEmployerMatch", () => {
  it("applies a match only up to the plan cap", () => {
    expect(calculateEmployerMatch({ annualSalary: 60000, employeeContributionPercent: 8, employerMatchPercent: 50, employerMatchCapPercent: 6 })).toEqual({
      employeeContribution: 4800,
      employerContribution: 1800,
      totalAnnualContribution: 6600,
    });
  });

  it("returns no employer contribution when the match rate is zero", () => {
    expect(calculateEmployerMatch({ annualSalary: 60000, employeeContributionPercent: 6, employerMatchPercent: 0, employerMatchCapPercent: 6 }).employerContribution).toBe(0);
  });

  it("rejects negative inputs", () => {
    expect(() => calculateEmployerMatch({ annualSalary: -1, employeeContributionPercent: 6, employerMatchPercent: 50, employerMatchCapPercent: 6 })).toThrow();
  });

  it("rejects percentages above 100", () => {
    expect(() => calculateEmployerMatch({ annualSalary: 60000, employeeContributionPercent: 101, employerMatchPercent: 50, employerMatchCapPercent: 6 })).toThrow();
  });
});
