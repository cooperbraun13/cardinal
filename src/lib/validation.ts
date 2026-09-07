import { z } from "zod";
import {
  CATEGORIES,
  EVERYTHING,
  BENEFIT_TYPES,
  RESET_FREQUENCIES,
  REWARD_TYPES,
  NETWORKS,
  CARD_THEMES,
} from "@/lib/categories";
import { dayStart } from "@/lib/dates";
import {
  ANNUAL_INCOME_RANGES,
  DEBT_STATUSES,
  EMERGENCY_FUND_STATUSES,
  EMPLOYER_RETIREMENT_STATUSES,
  EMPLOYMENT_STATUSES,
  INVESTING_EXPERIENCE_LEVELS,
  RISK_COMFORT_LEVELS,
  PRIMARY_GOALS,
  SAVINGS_RANGES,
} from "@/features/profile/options";

// Shared between frontend forms and backend routes. Backend validation is the
// source of truth; frontend reuses these for immediate feedback.

export const dateString = z.union([z.iso.date(), z.iso.datetime({ offset: true })]);

/** USD inputs must be representable in whole, safe integer cents. */
const money = z.union([z.number(), z.string().trim().min(1)]).pipe(
  z.coerce.number<string | number>().finite().multipleOf(0.01).refine(
    (value) => Number.isSafeInteger(Math.round(value * 100)),
    "Amount is too large"
  )
);
const positiveMoney = money.refine((value) => value > 0, "Amount must be positive");
const nonnegativeMoney = money.refine((value) => value >= 0, "Amount cannot be negative");

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const cardFields = z.object({
  name: z.string().trim().min(1, "Card name is required").max(100),
  issuer: z.string().trim().min(1, "Issuer is required").max(100),
  network: z.enum(NETWORKS).nullish(),
  lastFour: z
    .string()
    .regex(/^\d{4}$/, "Last four must be exactly 4 digits")
    .nullish()
    .or(z.literal("").transform(() => null)),
  creditLimit: positiveMoney,
  currentBalance: money,
  annualFee: nonnegativeMoney,
  statementDay: z.coerce.number().int().min(1, "Must be 1-28").max(28, "Must be 1-28"),
  dueDay: z.coerce.number().int().min(1, "Must be 1-28").max(28, "Must be 1-28"),
  openedAt: dateString.nullish(),
  cardTheme: z.enum(CARD_THEMES),
  active: z.boolean(),
});

export const cardSchema = cardFields.extend({
  currentBalance: money.default(0),
  annualFee: nonnegativeMoney.default(0),
  cardTheme: z.enum(CARD_THEMES).default("midnight"),
  active: z.boolean().default(true),
});
export const cardUpdateSchema = cardFields.partial();

const orderedDays = (start: string | null | undefined, end: string | null | undefined) =>
  !start || !end || dayStart(start).getTime() <= dayStart(end).getTime();

export const rewardCategorySchema = z.object({
  category: z.enum([...CATEGORIES, EVERYTHING] as [string, ...string[]]),
  multiplier: z.coerce.number().positive("Multiplier must be positive").max(100),
  startDate: dateString.nullish(),
  endDate: dateString.nullish(),
  spendingCap: positiveMoney.nullish(),
  notes: z.string().max(300).nullish(),
}).refine((rule) => orderedDays(rule.startDate, rule.endDate), {
  message: "End date must be on or after start date", path: ["endDate"],
});

const benefitFields = z.object({
  name: z.string().trim().min(1, "Benefit name is required").max(120),
  description: z.string().max(500).nullish(),
  benefitType: z.enum(BENEFIT_TYPES),
  totalValue: positiveMoney,
  usedValue: nonnegativeMoney,
  resetFrequency: z.enum(RESET_FREQUENCIES),
  startDate: dateString,
  expirationDate: dateString.nullish(),
  active: z.boolean(),
});

export const benefitSchema = benefitFields.extend({
  usedValue: nonnegativeMoney.default(0), active: z.boolean().default(true),
}).refine((benefit) => benefit.usedValue <= benefit.totalValue, {
  message: "Used value cannot exceed total value", path: ["usedValue"],
}).refine((benefit) => orderedDays(benefit.startDate, benefit.expirationDate), {
  message: "Expiration must be on or after start date", path: ["expirationDate"],
});
export const benefitUpdateSchema = benefitFields.partial().extend({
  usageDelta: positiveMoney.optional(),
}).refine((body) => body.usageDelta === undefined || body.usedValue === undefined, {
  message: "Send a usage delta or an absolute value, not both", path: ["usageDelta"],
});

export const signupBonusSchema = z.object({
  spendRequirement: positiveMoney,
  rewardAmount: z.coerce.number().positive("Reward amount must be positive"),
  rewardType: z.enum(REWARD_TYPES),
  deadline: dateString,
  completed: z.boolean().optional(),
});

const transactionFields = z.object({
  cardId: z.string().min(1, "Card is required"),
  merchant: z.string().trim().min(1, "Merchant is required").max(120),
  amount: positiveMoney,
  category: z.enum(CATEGORIES),
  transactionDate: dateString,
  status: z.enum(["pending", "posted"]),
  isRefund: z.boolean(),
});

export const transactionSchema = transactionFields.extend({
  status: z.enum(["pending", "posted"]).default("posted"),
  isRefund: z.boolean().default(false),
});
export const transactionUpdateSchema = transactionFields.omit({ cardId: true }).partial();

export const recommendSchema = z.object({
  category: z.enum(CATEGORIES),
  amount: positiveMoney,
  merchant: z.string().trim().max(120).optional(),
});

export const profileUpdateSchema = z.object({
  employmentStatus: z.enum(EMPLOYMENT_STATUSES).nullable(),
  annualIncomeRange: z.enum(ANNUAL_INCOME_RANGES).nullable(),
  savingsRange: z.enum(SAVINGS_RANGES).nullable(),
  emergencyFundStatus: z.enum(EMERGENCY_FUND_STATUSES).nullable(),
  creditCardDebtStatus: z.enum(DEBT_STATUSES).nullable(),
  otherDebtStatus: z.enum(DEBT_STATUSES).nullable(),
  employer401kStatus: z.enum(EMPLOYER_RETIREMENT_STATUSES).nullable(),
  employerMatchStatus: z.enum(EMPLOYER_RETIREMENT_STATUSES).nullable(),
  investingExperience: z.enum(INVESTING_EXPERIENCE_LEVELS).nullable(),
  riskComfort: z.enum(RISK_COMFORT_LEVELS).nullable(),
  primaryGoal: z.enum(PRIMARY_GOALS).nullable(),
}).strict();
