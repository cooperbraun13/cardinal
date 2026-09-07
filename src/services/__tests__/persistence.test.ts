import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { mkdtemp, mkdir, readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";

const state = vi.hoisted(() => ({ db: null as PrismaClient | null, token: "" }));
vi.mock("@/lib/db", () => ({ get prisma() { return state.db; } }));
vi.mock("next/headers", () => ({ cookies: async () => ({
  get: () => state.token ? { value: state.token } : undefined,
  set: (_name: string, token: string) => { state.token = token; },
  delete: () => { state.token = ""; },
}) }));

import { createTransactionWithEffects, updateTransactionWithEffects, deleteTransactionWithEffects } from "@/services/transactions";
import { updateBenefit } from "@/services/benefit-updates";
import { createRewardRule, deleteRewardRule } from "@/services/reward-rules";
import { upsertSignupBonus } from "@/services/signup-bonuses";
import { createSession, getCurrentUser, destroySession } from "@/lib/auth";
import { getCandidateCards, getDashboardData } from "@/services/data";
import * as transactionRoutes from "@/app/api/transactions/route";
import * as transactionRoute from "@/app/api/transactions/[id]/route";
import * as cardRoute from "@/app/api/cards/[id]/route";
import * as benefitRoute from "@/app/api/benefits/[id]/route";
import * as profileRoute from "@/app/api/profile/route";

let db: PrismaClient;
let directory: string;
let userId: string;
let cardId: string;
const params = (id: string) => ({ params: Promise.resolve({ id }) });
const request = (body: unknown, method = "PATCH") => new Request("http://localhost/api/test", {
  method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
});
const input = (extra = {}) => ({ cardId, merchant: "Fixture", amount: 100, category: "dining",
  transactionDate: new Date("2026-08-15"), status: "posted", isRefund: false, ...extra });
const profileInput = (extra = {}) => ({
  employmentStatus: "employed",
  annualIncomeRange: "50000_to_74999",
  savingsRange: "5000_to_9999",
  emergencyFundStatus: "starter_fund",
  creditCardDebtStatus: "some",
  otherDebtStatus: "none",
  employer401kStatus: "available",
  employerMatchStatus: "not_sure",
  investingExperience: "new",
  riskComfort: "not_sure",
  primaryGoal: "understand_money",
  investmentAccountType: "none",
  ...extra,
});

beforeAll(async () => {
  const root = path.join(process.cwd(), ".test-tmp");
  await mkdir(root, { recursive: true });
  directory = await mkdtemp(path.join(root, "persistence-"));
  db = new PrismaClient({ datasources: { db: { url: `file:${path.join(directory, "test.db")}` } } });
  state.db = db;
  const migrationsDirectory = path.join(process.cwd(), "prisma/migrations");
  const migrations = (await readdir(migrationsDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  for (const migration of migrations) {
    const sql = await readFile(
      path.join(migrationsDirectory, migration, "migration.sql"),
      "utf8",
    );
    for (const statement of sql.split(";").filter((part) => part.trim())) {
      await db.$executeRawUnsafe(statement);
    }
  }
});

beforeEach(async () => {
  state.token = "";
  await db.user.deleteMany();
  const user = await db.user.create({ data: { name: "Fixture", email: "fixture@example.test", passwordHash: "not-a-real-login" } });
  userId = user.id;
  const card = await db.card.create({ data: { userId, name: "Fixture card", issuer: "Fixture", creditLimit: 1000,
    currentBalance: 50, annualFee: 95, active: false, statementDay: 1, dueDay: 25, cardTheme: "midnight" } });
  cardId = card.id;
});

afterAll(async () => {
  await db?.$disconnect();
  // Only remove the uniquely created fixture directory, never a development database.
  if (directory) await rm(directory, { recursive: true });
});

describe("transaction persistence", () => {
  it("preserves refund credits and reverses their balance effect exactly", async () => {
    const transaction = await createTransactionWithEffects(userId, input({ isRefund: true }));
    expect((await db.card.findUniqueOrThrow({ where: { id: cardId } })).currentBalance).toBe(-50);
    expect((await db.reward.findFirstOrThrow()).rewardAmount).toBe(-100);
    await deleteTransactionWithEffects(userId, transaction.id);
    expect((await db.card.findUniqueOrThrow({ where: { id: cardId } })).currentBalance).toBe(50);
    expect(await db.reward.count()).toBe(0);
  });

  it("rounds repeated cent amounts and updates pending rewards only when posted", async () => {
    await createTransactionWithEffects(userId, input({ amount: 0.1 }));
    const transaction = await createTransactionWithEffects(userId, input({ amount: 0.2, status: "pending" }));
    expect((await db.card.findUniqueOrThrow({ where: { id: cardId } })).currentBalance).toBe(50.3);
    expect((await db.reward.findFirstOrThrow({ where: { transactionId: transaction.id } })).rewardAmount).toBe(0);
    await updateTransactionWithEffects(userId, transaction.id, { status: "posted" });
    expect((await db.reward.findFirstOrThrow({ where: { transactionId: transaction.id } })).rewardAmount).toBe(0.2);
  });

  it("splits caps and reallocates later rewards after backdating or deletion", async () => {
    await db.rewardCategory.create({ data: { cardId, category: "dining", multiplier: 5, spendingCap: 100 } });
    const later = await createTransactionWithEffects(userId, input());
    const earlier = await createTransactionWithEffects(userId, input({ amount: 90, transactionDate: new Date("2026-08-01") }));
    const reward = () => db.reward.findFirstOrThrow({ where: { transactionId: later.id } });
    expect((await reward()).rewardAmount).toBe(140);
    await updateTransactionWithEffects(userId, later.id, { merchant: "Renamed" });
    expect((await reward()).rewardAmount).toBe(140);
    await deleteTransactionWithEffects(userId, earlier.id);
    expect((await reward()).rewardAmount).toBe(500);
  });

  it("rolls back a PATCH if reward persistence fails", async () => {
    const transaction = await createTransactionWithEffects(userId, input());
    await db.$executeRawUnsafe("CREATE TRIGGER reject_reward BEFORE UPDATE ON Reward BEGIN SELECT RAISE(ABORT, 'fixture failure'); END");
    try {
      await expect(updateTransactionWithEffects(userId, transaction.id, { amount: 200 })).rejects.toThrow();
      expect((await db.transaction.findUniqueOrThrow({ where: { id: transaction.id } })).amount).toBe(100);
      expect((await db.card.findUniqueOrThrow({ where: { id: cardId } })).currentBalance).toBe(150);
      expect((await db.reward.findFirstOrThrow()).rewardAmount).toBe(100);
    } finally {
      await db.$executeRawUnsafe("DROP TRIGGER reject_reward");
    }
  });

  it("does not lose successful concurrent balance changes", async () => {
    const results = await Promise.allSettled([
      createTransactionWithEffects(userId, input({ amount: 10 })),
      createTransactionWithEffects(userId, input({ amount: 20 })),
    ]);
    const successful = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
    expect(successful.length).toBeGreaterThan(0);
    expect(await db.transaction.count()).toBe(successful.length);
    expect((await db.card.findUniqueOrThrow({ where: { id: cardId } })).currentBalance)
      .toBe(50 + successful.reduce((sum, transaction) => sum + transaction.amount, 0));
  });

  it("reconciles reward snapshots immediately when rules change", async () => {
    const transaction = await createTransactionWithEffects(userId, input());
    const reward = () => db.reward.findFirstOrThrow({ where: { transactionId: transaction.id } });
    expect((await reward()).rewardAmount).toBe(100);
    const rule = await createRewardRule(userId, cardId, {
      category: "dining", multiplier: 5, startDate: "2026-08-15T12:00:00Z", endDate: null,
      spendingCap: null, notes: null,
    });
    expect((await reward()).rewardAmount).toBe(500);
    await deleteRewardRule(userId, rule.id);
    expect((await reward()).rewardAmount).toBe(100);
  });
});

describe("authenticated API and ownership", () => {
  it("creates, expires, and destroys real database sessions", async () => {
    expect(await getCurrentUser()).toBeNull();
    await createSession(userId);
    expect((await getCurrentUser())?.id).toBe(userId);
    await db.session.updateMany({ data: { expiresAt: new Date(0) } });
    expect(await getCurrentUser()).toBeNull();
    await createSession(userId);
    await destroySession();
    expect(await getCurrentUser()).toBeNull();
    expect(await db.session.count()).toBe(0);
  });

  it("returns 401 without a session and 404 for another user's resources", async () => {
    const transaction = await createTransactionWithEffects(userId, input());
    expect((await transactionRoutes.GET(new Request("http://localhost/api/transactions"))).status).toBe(401);
    const other = await db.user.create({ data: { name: "Other", email: "other@example.test", passwordHash: "fixture" } });
    await createSession(other.id);
    expect((await cardRoute.GET(request({}), params(cardId))).status).toBe(404);
    expect((await cardRoute.PATCH(request({ name: "Stolen" }), params(cardId))).status).toBe(404);
    expect((await transactionRoute.PATCH(request({ amount: 1 }), params(transaction.id))).status).toBe(404);
    expect((await transactionRoute.DELETE(request({}), params(transaction.id))).status).toBe(404);
    expect((await transactionRoutes.POST(request({ ...input(), transactionDate: "2026-08-15" }, "POST"))).status).toBe(404);
    expect((await db.card.findUniqueOrThrow({ where: { id: cardId } })).currentBalance).toBe(150);
  });

  it("PATCH preserves omitted card/transaction defaults and clears openedAt", async () => {
    await createSession(userId);
    await db.card.update({ where: { id: cardId }, data: { openedAt: new Date("2026-01-01") } });
    const response = await cardRoute.PATCH(request({ name: "Renamed", openedAt: null }), params(cardId));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ name: "Renamed", currentBalance: 50, annualFee: 95, active: false, openedAt: null });
    const transaction = await createTransactionWithEffects(userId, input({ status: "pending", isRefund: true }));
    const updated = await transactionRoute.PATCH(request({ merchant: "Renamed" }), params(transaction.id));
    expect(updated.status).toBe(200);
    expect(await updated.json()).toMatchObject({ merchant: "Renamed", status: "pending", isRefund: true });
  });

  it("uses an exclusive UTC upper bound for transaction date filters", async () => {
    await createSession(userId);
    await db.transaction.createMany({ data: [
      { ...input({ transactionDate: new Date("2026-09-05T23:59:59Z") }), userId },
      { ...input({ transactionDate: new Date("2026-09-06T00:00:00Z") }), userId },
    ] });
    const response = await transactionRoutes.GET(new Request("http://localhost/api/transactions?to=2026-09-05"));
    expect(response.status).toBe(200);
    expect((await response.json()).transactions).toHaveLength(1);
  });
});

describe("financial profile persistence", () => {
  it("requires a session and only returns the current user's profile", async () => {
    expect(
      (await profileRoute.GET()).status,
    ).toBe(401);

    await createSession(userId);
    const saved = await profileRoute.PUT(request(profileInput(), "PUT"));
    expect(saved.status).toBe(200);
    expect(await saved.json()).toMatchObject({
      employmentStatus: "employed",
      annualIncomeRange: "50000_to_74999",
      creditCardDebtStatus: "some",
      profileVersion: 1,
      primaryGoal: "understand_money",
      investmentAccountType: "none",
    });
    const updated = await profileRoute.PUT(request(profileInput({ riskComfort: "growth" }), "PUT"));
    expect(await updated.json()).toMatchObject({ profileVersion: 2, riskComfort: "growth" });

    const other = await db.user.create({
      data: {
        name: "Other",
        email: "other-profile@example.test",
        passwordHash: "fixture",
        financialProfile: { create: { employmentStatus: "student" } },
      },
    });
    const response = await profileRoute.GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      employmentStatus: "employed",
    });
    expect(
      await db.financialProfile.findUnique({ where: { userId: other.id } }),
    ).toMatchObject({ employmentStatus: "student" });
  });

  it("validates profile ranges and clears an all-empty submission", async () => {
    await createSession(userId);
    expect(
      (
        await profileRoute.PUT(
          request(profileInput({ annualIncomeRange: "an_exact_amount" }), "PUT"),
        )
      ).status,
    ).toBe(400);
    expect(
      (
        await profileRoute.PUT(
          request(profileInput({ primaryGoal: "not_a_goal" }), "PUT"),
        )
      ).status,
    ).toBe(400);
    expect(
      (
        await profileRoute.PUT(
          request(profileInput({ investmentAccountType: "account_number" }), "PUT"),
        )
      ).status,
    ).toBe(400);

    await profileRoute.PUT(request(profileInput(), "PUT"));
    const emptyProfile = Object.fromEntries(
      Object.keys(profileInput()).map((key) => [key, null]),
    );
    const cleared = await profileRoute.PUT(request(emptyProfile, "PUT"));
    expect(cleared.status).toBe(200);
    expect(await cleared.json()).toBeNull();
    expect(
      await db.financialProfile.findUnique({ where: { userId } }),
    ).toBeNull();
    const recreated = await profileRoute.PUT(request(profileInput({ employmentStatus: "student" }), "PUT"));
    expect(await recreated.json()).toMatchObject({ profileVersion: 1, employmentStatus: "student" });
  });
});

describe("benefit updates and aggregates", () => {
  it("applies usage deltas to current state and validates merged patches", async () => {
    const benefit = await db.benefit.create({ data: { cardId, name: "Credit", benefitType: "dining_credit", totalValue: 100,
      usedValue: 10, resetFrequency: "one_time", startDate: new Date("2020-01-01") } });
    await updateBenefit(userId, benefit.id, { usageDelta: 20 });
    expect((await updateBenefit(userId, benefit.id, { usageDelta: 30 })).usedValue).toBe(60);
    await createSession(userId);
    const renamed = await benefitRoute.PATCH(request({ name: "Renamed" }), params(benefit.id));
    expect(renamed.status).toBe(200);
    expect(await renamed.json()).toMatchObject({ usedValue: 60, active: true });
    expect((await benefitRoute.PATCH(request({ totalValue: 5 }), params(benefit.id))).status).toBe(400);
    expect((await updateBenefit(userId, benefit.id, { usageDelta: 100 })).usedValue).toBe(100);
  });

  it("optimizer caps use rule windows and everything spend, not future purchases", async () => {
    await db.card.update({ where: { id: cardId }, data: { active: true } });
    const now = new Date();
    const rule = await db.rewardCategory.create({ data: { cardId, category: "everything", multiplier: 5, spendingCap: 100,
      startDate: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)) } });
    await createTransactionWithEffects(userId, input({ amount: 10, category: "gas", transactionDate: now }));
    await createTransactionWithEffects(userId, input({ amount: 100, transactionDate: new Date("2100-01-01") }));
    await createTransactionWithEffects(userId, input({ amount: 100, transactionDate: new Date("2000-01-01") }));
    const [candidate] = await getCandidateCards(userId);
    expect(typeof candidate.categorySpendSoFar === "function" && candidate.categorySpendSoFar(rule)).toBe(10);
    const dashboard = await getDashboardData(userId);
    expect(dashboard.totals.spendThisMonth).toBe(10);
    expect(dashboard.totals.rewardsValueThisMonth).toBe(0.5);
  });
});

describe("signup bonus persistence", () => {
  const bonus = { spendRequirement: 1000, rewardAmount: 100, rewardType: "points" as const,
    deadline: "2026-12-01" };

  it("preserves completion when an edit omits that field", async () => {
    const first = await upsertSignupBonus(userId, cardId, { ...bonus, completed: true });
    expect(first.created).toBe(true);
    const second = await upsertSignupBonus(userId, cardId, { ...bonus, rewardAmount: 200 });
    expect(second.created).toBe(false);
    expect(second.bonus.completed).toBe(true);
  });

  it("does not persist duplicate bonuses under concurrent upserts", async () => {
    const results = await Promise.allSettled([
      upsertSignupBonus(userId, cardId, bonus),
      upsertSignupBonus(userId, cardId, { ...bonus, rewardAmount: 200 }),
    ]);
    expect(results.some((result) => result.status === "fulfilled")).toBe(true);
    expect(await db.signupBonus.count({ where: { cardId } })).toBe(1);
  });
});
