// Best-card recommendation. Pure ranking logic — data assembly happens in the
// API layer so this stays unit-testable.

import { selectRewardRule, calculateReward, type RewardRule } from "@/services/rewards";
import { categoryLabel } from "@/lib/categories";

export interface CandidateCard {
  id: string;
  name: string;
  issuer: string;
  rewardType: string; // points | miles | cashback
  rules: RewardRule[];
  /** Posted non-refund spend already accumulated in this category (for cap checks). */
  categorySpendSoFar: number;
}

export interface Recommendation {
  cardId: string;
  cardName: string;
  issuer: string;
  rewardRate: number;
  rewardType: string;
  /** Points/miles earned, or dollars for cashback. */
  estimatedRewards: number;
  /** Comparable dollar value used for ranking. */
  estimatedValue: number;
  capped: boolean;
  promo: boolean;
  explanation: string;
}

// Simple default valuations for cross-card comparison (1 pt = 1¢, 1 mile = 1.2¢).
const VALUE_PER_UNIT: Record<string, number> = { points: 0.01, miles: 0.012 };

export function scoreCard(card: CandidateCard, category: string, amount: number, date: Date) {
  const selection = selectRewardRule(card.rules, category, date, card.categorySpendSoFar);
  const rate = selection.multiplier;
  const isCashback = card.rewardType === "cashback";
  // Cashback multiplier means percent back; points/miles mean units per dollar.
  const estimatedRewards = isCashback
    ? Math.round(amount * rate) / 100
    : calculateReward(amount, rate);
  const estimatedValue = isCashback
    ? estimatedRewards
    : Math.round(estimatedRewards * (VALUE_PER_UNIT[card.rewardType] ?? 0.01) * 100) / 100;
  const promo = !!selection.rule && (selection.rule.startDate != null || selection.rule.endDate != null);
  return { selection, rate, estimatedRewards, estimatedValue, promo };
}

/** Ranks active cards for a purchase; returns best first. */
export function rankCards(
  cards: CandidateCard[],
  category: string,
  amount: number,
  date: Date = new Date()
): Recommendation[] {
  return cards
    .map((card) => {
      const { selection, rate, estimatedRewards, estimatedValue, promo } = scoreCard(
        card,
        category,
        amount,
        date
      );
      return {
        cardId: card.id,
        cardName: card.name,
        issuer: card.issuer,
        rewardRate: rate,
        rewardType: card.rewardType,
        estimatedRewards,
        estimatedValue,
        capped: selection.capped,
        promo,
        explanation: buildExplanation(card, category, rate, selection.capped, promo),
      };
    })
    .sort((a, b) => b.estimatedValue - a.estimatedValue || b.rewardRate - a.rewardRate);
}

function buildExplanation(
  card: CandidateCard,
  category: string,
  rate: number,
  capped: boolean,
  promo: boolean
): string {
  const label = categoryLabel(category).toLowerCase();
  const unit = card.rewardType === "cashback" ? `${rate}% back` : `${rate}x ${card.rewardType}`;
  if (capped)
    return `Earns ${unit} on ${label} — a higher-rate rule exists but its spending cap is exhausted.`;
  if (promo) return `Earns ${unit} on ${label} thanks to a limited-time promotion.`;
  if (rate <= 1) return `No ${label} bonus on this card — earns the base rate of ${unit}.`;
  return `Earns ${unit} on ${label} purchases.`;
}
