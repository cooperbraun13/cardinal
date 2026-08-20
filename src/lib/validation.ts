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

// Shared between frontend forms and backend routes. Backend validation is the
// source of truth; frontend reuses these for immediate feedback.

const dateString = z
  .string()
  .refine((s) => !Number.isNaN(Date.parse(s)), "Invalid date");

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const cardSchema = z.object({
  name: z.string().trim().min(1, "Card name is required").max(100),
  issuer: z.string().trim().min(1, "Issuer is required").max(100),
  network: z.enum(NETWORKS).nullish(),
  lastFour: z
    .string()
    .regex(/^\d{4}$/, "Last four must be exactly 4 digits")
    .nullish()
    .or(z.literal("").transform(() => null)),
  creditLimit: z.coerce.number().positive("Credit limit must be positive"),
  currentBalance: z.coerce.number().min(0, "Balance cannot be negative").default(0),
  annualFee: z.coerce.number().min(0, "Annual fee cannot be negative").default(0),
  statementDay: z.coerce.number().int().min(1, "Must be 1-28").max(28, "Must be 1-28"),
  dueDay: z.coerce.number().int().min(1, "Must be 1-28").max(28, "Must be 1-28"),
  openedAt: dateString.nullish(),
  cardTheme: z.enum(CARD_THEMES).default("midnight"),
  active: z.boolean().default(true),
});

export const cardUpdateSchema = cardSchema.partial();

export const rewardCategorySchema = z.object({
  category: z.enum([...CATEGORIES, EVERYTHING] as [string, ...string[]]),
  multiplier: z.coerce.number().positive("Multiplier must be positive").max(100),
  startDate: dateString.nullish(),
  endDate: dateString.nullish(),
  spendingCap: z.coerce.number().positive().nullish(),
  notes: z.string().max(300).nullish(),
});

export const benefitSchema = z.object({
  name: z.string().trim().min(1, "Benefit name is required").max(120),
  description: z.string().max(500).nullish(),
  benefitType: z.enum(BENEFIT_TYPES),
  totalValue: z.coerce.number().positive("Value must be positive"),
  usedValue: z.coerce.number().min(0).default(0),
  resetFrequency: z.enum(RESET_FREQUENCIES),
  startDate: dateString,
  expirationDate: dateString.nullish(),
  active: z.boolean().default(true),
});

export const benefitUpdateSchema = benefitSchema.partial();

export const signupBonusSchema = z.object({
  spendRequirement: z.coerce.number().positive("Spend requirement must be positive"),
  rewardAmount: z.coerce.number().positive("Reward amount must be positive"),
  rewardType: z.enum(REWARD_TYPES),
  deadline: dateString,
  completed: z.boolean().default(false),
});

export const transactionSchema = z.object({
  cardId: z.string().min(1, "Card is required"),
  merchant: z.string().trim().min(1, "Merchant is required").max(120),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  category: z.enum(CATEGORIES),
  transactionDate: dateString,
  status: z.enum(["pending", "posted"]).default("posted"),
  isRefund: z.boolean().default(false),
});

export const transactionUpdateSchema = transactionSchema.partial().omit({ cardId: true });

export const recommendSchema = z.object({
  category: z.enum(CATEGORIES),
  amount: z.coerce.number().positive("Amount must be positive"),
  merchant: z.string().trim().max(120).optional(),
});
