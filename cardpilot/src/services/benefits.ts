// Benefit period + status logic. Pure functions for testability.
// All period math uses local calendar dates; timestamps are stored in UTC.

export type BenefitStatus = "available" | "partial" | "used" | "expiring" | "expired" | "inactive";

export interface BenefitLike {
  totalValue: number;
  usedValue: number;
  resetFrequency: string; // monthly | quarterly | semiannual | annual | one_time
  startDate: Date;
  expirationDate: Date | null;
  active: boolean;
}

/** End of the current reset period (start of the next period), or the expiration date for one-time benefits. */
export function currentPeriodEnd(benefit: BenefitLike, now: Date = new Date()): Date | null {
  switch (benefit.resetFrequency) {
    case "monthly":
      return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    case "quarterly": {
      const q = Math.floor(now.getMonth() / 3);
      return new Date(now.getFullYear(), q * 3 + 3, 1);
    }
    case "semiannual":
      return now.getMonth() < 6
        ? new Date(now.getFullYear(), 6, 1)
        : new Date(now.getFullYear() + 1, 0, 1);
    case "annual":
      return new Date(now.getFullYear() + 1, 0, 1);
    case "one_time":
    default:
      return benefit.expirationDate;
  }
}

/** The date the benefit stops being usable this cycle: the earlier of period end and hard expiration. */
export function effectiveExpiry(benefit: BenefitLike, now: Date = new Date()): Date | null {
  const periodEnd = currentPeriodEnd(benefit, now);
  const { expirationDate } = benefit;
  if (periodEnd && expirationDate) return periodEnd < expirationDate ? periodEnd : expirationDate;
  return periodEnd ?? expirationDate;
}

export function benefitRemaining(benefit: BenefitLike): number {
  return Math.max(0, Math.round((benefit.totalValue - benefit.usedValue) * 100) / 100);
}

export const EXPIRING_SOON_DAYS = 14;

export function benefitStatus(benefit: BenefitLike, now: Date = new Date()): BenefitStatus {
  if (!benefit.active) return "inactive";
  if (benefit.expirationDate && benefit.expirationDate < now) return "expired";
  if (now < benefit.startDate) return "inactive";
  const remaining = benefitRemaining(benefit);
  if (remaining <= 0) return "used";
  const expiry = effectiveExpiry(benefit, now);
  if (expiry) {
    const msLeft = expiry.getTime() - now.getTime();
    if (msLeft <= EXPIRING_SOON_DAYS * 24 * 60 * 60 * 1000) return "expiring";
  }
  return benefit.usedValue > 0 ? "partial" : "available";
}
