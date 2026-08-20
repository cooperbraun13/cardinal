// Demo data seed: `npm run db:seed`
// Login: demo@cardpilot.app / demo1234

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { selectRewardRule, calculateReward } from "../src/services/rewards";

const prisma = new PrismaClient();

// Deterministic PRNG so reseeding produces stable data.
let seedState = 42;
function rand(): number {
  seedState = (seedState * 1103515245 + 12345) % 2147483648;
  return seedState / 2147483648;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d;
}
function daysFromNow(n: number): Date {
  return daysAgo(-n);
}

const MERCHANTS: Record<string, string[]> = {
  dining: ["Blue Bottle Coffee", "Chipotle", "Nobu", "Shake Shack", "Olive Garden", "DoorDash"],
  groceries: ["Whole Foods", "Trader Joe's", "Kroger", "Safeway", "Costco"],
  travel: ["Delta Air Lines", "Marriott", "Uber", "Airbnb", "United Airlines"],
  gas: ["Shell", "Chevron", "Exxon"],
  streaming: ["Netflix", "Spotify", "Max", "Disney+"],
  drugstores: ["CVS", "Walgreens"],
  online_shopping: ["Amazon", "Best Buy", "Target.com"],
  entertainment: ["AMC Theatres", "Ticketmaster", "Steam"],
  utilities: ["PG&E", "Comcast", "Verizon"],
  other: ["USPS", "Home Depot", "IKEA"],
};

async function main() {
  const email = "demo@cardpilot.app";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Demo user already exists — deleting and reseeding.");
    await prisma.user.delete({ where: { id: existing.id } });
  }

  const user = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email,
      passwordHash: await bcrypt.hash("demo1234", 10),
    },
  });

  const quarterStart = new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 1);
  const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
  const yearStart = new Date(new Date().getFullYear(), 0, 1);

  const cardSpecs = [
    {
      name: "Sapphire Preferred",
      issuer: "Chase",
      network: "visa",
      lastFour: "4821",
      creditLimit: 12000,
      annualFee: 95,
      statementDay: 12,
      dueDay: 8,
      openedAt: daysAgo(45),
      cardTheme: "sapphire",
      rewardType: "points",
      rules: [
        { category: "dining", multiplier: 3 },
        { category: "streaming", multiplier: 3 },
        { category: "travel", multiplier: 2 },
      ],
      bonus: {
        spendRequirement: 4000,
        rewardAmount: 60000,
        rewardType: "points",
        deadline: daysFromNow(45),
        completed: false,
      },
      benefits: [
        {
          name: "$50 Hotel Credit",
          benefitType: "hotel_credit",
          totalValue: 50,
          usedValue: 0,
          resetFrequency: "annual",
          startDate: yearStart,
        },
      ],
    },
    {
      name: "Gold Card",
      issuer: "American Express",
      network: "amex",
      lastFour: "1005",
      creditLimit: 10000,
      annualFee: 250,
      statementDay: 20,
      dueDay: 15,
      openedAt: new Date("2024-03-15"),
      cardTheme: "gold",
      rewardType: "points",
      rules: [
        { category: "dining", multiplier: 4 },
        { category: "groceries", multiplier: 4, spendingCap: 25000 },
      ],
      bonus: {
        spendRequirement: 4000,
        rewardAmount: 60000,
        rewardType: "points",
        deadline: new Date("2024-06-15"),
        completed: true,
      },
      benefits: [
        {
          name: "$10 Monthly Dining Credit",
          benefitType: "dining_credit",
          totalValue: 10,
          usedValue: 10,
          resetFrequency: "monthly",
          startDate: yearStart,
        },
        {
          name: "$100 Streaming Credit",
          benefitType: "streaming_credit",
          totalValue: 100,
          usedValue: 45,
          resetFrequency: "annual",
          startDate: yearStart,
        },
      ],
    },
    {
      name: "Freedom Flex",
      issuer: "Chase",
      network: "mastercard",
      lastFour: "7734",
      creditLimit: 6000,
      annualFee: 0,
      statementDay: 3,
      dueDay: 28,
      openedAt: new Date("2023-08-01"),
      cardTheme: "violet",
      rewardType: "cashback",
      rules: [
        // Rotating 5% quarterly promo with the classic $1,500 cap (practice ticket 9 material).
        {
          category: "groceries",
          multiplier: 5,
          startDate: quarterStart,
          endDate: quarterEnd,
          spendingCap: 1500,
        },
        { category: "dining", multiplier: 3 },
        { category: "drugstores", multiplier: 3 },
        { category: "everything", multiplier: 1 },
      ],
      bonus: {
        spendRequirement: 500,
        rewardAmount: 200,
        rewardType: "cashback",
        deadline: new Date("2023-11-01"),
        completed: true,
      },
      benefits: [],
    },
    {
      name: "Venture X",
      issuer: "Capital One",
      network: "visa",
      lastFour: "9042",
      creditLimit: 15000,
      annualFee: 395,
      statementDay: 25,
      dueDay: 20,
      openedAt: new Date("2025-01-10"),
      cardTheme: "midnight",
      rewardType: "miles",
      rules: [
        { category: "travel", multiplier: 5 },
        { category: "everything", multiplier: 2 },
      ],
      bonus: {
        spendRequirement: 4000,
        rewardAmount: 75000,
        rewardType: "miles",
        deadline: new Date("2025-04-10"),
        completed: true,
      },
      benefits: [
        {
          name: "$300 Travel Credit",
          benefitType: "travel_credit",
          totalValue: 300,
          usedValue: 120,
          resetFrequency: "annual",
          startDate: yearStart,
        },
        {
          name: "Lounge Visits",
          benefitType: "lounge_access",
          totalValue: 8,
          usedValue: 3,
          resetFrequency: "annual",
          startDate: yearStart,
        },
      ],
    },
  ];

  for (const spec of cardSpecs) {
    const card = await prisma.card.create({
      data: {
        userId: user.id,
        name: spec.name,
        issuer: spec.issuer,
        network: spec.network,
        lastFour: spec.lastFour,
        creditLimit: spec.creditLimit,
        annualFee: spec.annualFee,
        statementDay: spec.statementDay,
        dueDay: spec.dueDay,
        openedAt: spec.openedAt,
        cardTheme: spec.cardTheme,
        rewardCategories: {
          create: spec.rules.map((r) => ({
            category: r.category,
            multiplier: r.multiplier,
            startDate: "startDate" in r ? (r.startDate as Date) : null,
            endDate: "endDate" in r ? (r.endDate as Date) : null,
            spendingCap: "spendingCap" in r ? (r.spendingCap as number) : null,
          })),
        },
        signupBonuses: { create: spec.bonus },
        benefits: { create: spec.benefits },
      },
      include: { rewardCategories: true },
    });

    // ~15 transactions per card over the last 90 days (newer cards only after opening).
    const maxAge = Math.min(90, Math.floor((Date.now() - spec.openedAt.getTime()) / 86400000));
    const categories = spec.rules.map((r) => r.category).filter((c) => c !== "everything");
    let balance = 0;

    for (let i = 0; i < 15; i++) {
      const category = rand() < 0.6 ? pick(categories) : pick(Object.keys(MERCHANTS));
      const merchant = pick(MERCHANTS[category] ?? MERCHANTS.other);
      const amount = Math.round((8 + rand() * 180) * 100) / 100;
      const transactionDate = daysAgo(Math.floor(rand() * Math.max(1, maxAge)));
      const isRefund = rand() < 0.05;
      const status = rand() < 0.1 ? "pending" : "posted";

      const selection = selectRewardRule(card.rewardCategories, category, transactionDate);
      await prisma.transaction.create({
        data: {
          userId: user.id,
          cardId: card.id,
          merchant,
          amount,
          category,
          transactionDate,
          status,
          isRefund,
          rewards: {
            create: {
              cardId: card.id,
              multiplier: selection.multiplier,
              rewardAmount: calculateReward(amount, selection.multiplier, isRefund),
              rewardType: spec.rewardType,
            },
          },
        },
      });
      balance += isRefund ? -amount : amount;
    }

    await prisma.card.update({
      where: { id: card.id },
      data: { currentBalance: Math.max(0, Math.round(balance * 100) / 100) },
    });
  }

  console.log("Seeded demo account: demo@cardpilot.app / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
