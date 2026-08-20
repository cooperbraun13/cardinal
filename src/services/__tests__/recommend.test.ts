import { describe, it, expect } from "vitest";
import { rankCards, type CandidateCard } from "@/services/recommend";

const card = (overrides: Partial<CandidateCard>): CandidateCard => ({
  id: "c1",
  name: "Card A",
  issuer: "Issuer",
  rewardType: "points",
  rules: [],
  categorySpendSoFar: 0,
  ...overrides,
});

const dining3x = {
  category: "dining",
  multiplier: 3,
  startDate: null,
  endDate: null,
  spendingCap: null,
};

const now = new Date("2026-08-15");

describe("rankCards", () => {
  it("matches the CLAUDE.md contract: $120 dining at 3x → 360 points", () => {
    const [best] = rankCards([card({ rules: [dining3x] })], "dining", 120, now);
    expect(best.rewardRate).toBe(3);
    expect(best.estimatedRewards).toBe(360);
  });

  it("ranks the highest-value card first and returns alternatives after", () => {
    const cards = [
      card({ id: "a", name: "1x Card" }),
      card({ id: "b", name: "3x Dining", rules: [dining3x] }),
      card({ id: "c", name: "2x Everything", rules: [{ ...dining3x, category: "everything", multiplier: 2 }] }),
    ];
    const ranked = rankCards(cards, "dining", 100, now);
    expect(ranked.map((r) => r.cardId)).toEqual(["b", "c", "a"]);
  });

  it("prefers an active 5x promo over a permanent 3x (practice ticket 9)", () => {
    const cards = [
      card({ id: "a", name: "3x Groceries", rules: [{ ...dining3x, category: "groceries" }] }),
      card({
        id: "b",
        name: "5x Promo",
        rules: [
          {
            category: "groceries",
            multiplier: 5,
            startDate: new Date("2026-08-01"),
            endDate: new Date("2026-09-30"),
            spendingCap: null,
          },
        ],
      }),
    ];
    const [best] = rankCards(cards, "groceries", 100, now);
    expect(best.cardId).toBe("b");
    expect(best.promo).toBe(true);
  });

  it("values cashback percent against point valuations", () => {
    // 2% cashback on $100 = $2.00 value; 3x points on $100 = 300 pts = $3.00 value.
    const cards = [
      card({ id: "cash", rewardType: "cashback", rules: [{ ...dining3x, multiplier: 2 }] }),
      card({ id: "pts", rules: [dining3x] }),
    ];
    const ranked = rankCards(cards, "dining", 100, now);
    expect(ranked[0].cardId).toBe("pts");
    expect(ranked[1].estimatedRewards).toBe(2); // dollars
  });

  it("demotes a card whose cap is exhausted", () => {
    const cards = [
      card({
        id: "capped",
        rules: [{ ...dining3x, multiplier: 4, spendingCap: 1500 }],
        categorySpendSoFar: 1500,
      }),
      card({ id: "steady", rules: [dining3x] }),
    ];
    const ranked = rankCards(cards, "dining", 100, now);
    expect(ranked[0].cardId).toBe("steady");
    expect(ranked[1].capped).toBe(true);
    expect(ranked[1].rewardRate).toBe(1);
  });

  it("returns an empty list when there are no cards", () => {
    expect(rankCards([], "dining", 100, now)).toEqual([]);
  });
});
