import { describe, expect, it } from "vitest";
import { calculateEmergencyFund } from "@/features/calculators/emergencyFund";

describe("calculateEmergencyFund", () => {
  it("calculates a user-selected target and remaining gap", () => {
    expect(calculateEmergencyFund({ monthlyEssentialExpenses: 2400, targetMonths: 3, currentSavings: 1000 })).toEqual({
      targetAmount: 7200,
      currentSavings: 1000,
      remainingGap: 6200,
    });
  });

  it("does not report a negative gap when savings exceed the target", () => {
    expect(calculateEmergencyFund({ monthlyEssentialExpenses: 1000, targetMonths: 1, currentSavings: 1500 }).remainingGap).toBe(0);
  });

  it("rejects negative inputs", () => {
    expect(() => calculateEmergencyFund({ monthlyEssentialExpenses: -1, targetMonths: 3, currentSavings: 0 })).toThrow();
  });

  it("rejects finite inputs whose calculation exceeds the supported range", () => {
    expect(() => calculateEmergencyFund({
      monthlyEssentialExpenses: Number.MAX_VALUE,
      targetMonths: 1,
      currentSavings: 0,
    })).toThrow(/supported numeric range/);
  });
});
