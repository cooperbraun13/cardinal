import { describe, expect, it } from "vitest";
import { calculatorDefinitions, getCalculatorBySlug } from "@/features/calculators/registry";

describe("calculator registry", () => {
  it("describes every current pure calculator exactly once", () => {
    expect(calculatorDefinitions).toHaveLength(6);
    expect(new Set(calculatorDefinitions.map((calculator) => calculator.slug)).size).toBe(6);
    expect(calculatorDefinitions.every((calculator) => calculator.version >= 1 && calculator.inputFields.length > 0)).toBe(true);
  });

  it("looks up calculators by stable slug", () => {
    expect(getCalculatorBySlug("mortgage-payment")?.id).toBe("mortgage-payment");
    expect(getCalculatorBySlug("missing")).toBeUndefined();
  });
});
