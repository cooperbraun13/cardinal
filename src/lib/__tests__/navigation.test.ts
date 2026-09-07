import { describe, expect, it } from "vitest";
import {
  getActiveSection,
  isNavigationPath,
  MONEY_LINKS,
} from "@/lib/navigation";

describe("navigation orientation", () => {
  it.each([
    "/calculators",
    "/calculators/compound-growth",
    "/cards/card-123",
    "/transactions",
    "/dashboard",
    "/optimizer",
    "/benefits",
  ])("keeps Money selected on %s", (path) => {
    expect(getActiveSection(path)?.label).toBe("Money");
    expect(
      MONEY_LINKS.filter(({ href }) => isNavigationPath(path, href)),
    ).toHaveLength(1);
  });
  it("selects Learn when opening a lesson from another section", () => {
    expect(getActiveSection("/learn/investing-basics")?.label).toBe("Learn");
  });
  it.each(["/home", "/invest", "/plan", "/profile"])(
    "selects the exact top-level section %s",
    (path) => {
      expect(getActiveSection(path)?.href).toBe(path);
    },
  );
  it("does not mistake a shared string prefix for a child route", () => {
    expect(isNavigationPath("/cards-archive", "/cards")).toBe(false);
    expect(getActiveSection("/learning")).toBeUndefined();
    expect(getActiveSection("/login")).toBeUndefined();
  });
});
