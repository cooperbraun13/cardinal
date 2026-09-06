import type { Lesson } from "@/features/learn/types";

export const lessons: Lesson[] = [
  {
    slug: "credit-utilization",
    title: "Credit utilization",
    summary: "See how much of your available credit is currently in use.",
    topic: "Credit",
    estimatedMinutes: 4,
    sections: [
      {
        key: "whatItIs",
        title: "What it is",
        body: [
          "Credit utilization is the share of a credit limit that is currently being used. For one card, divide its balance by its credit limit. You can also look at the same ratio across all of your cards.",
        ],
      },
      {
        key: "whyItMatters",
        title: "Why it matters",
        body: [
          "It is a quick way to understand how much room you have left before a card reaches its limit. Credit scoring models may also consider reported balances, so a high ratio can be a useful signal to review your payment plan.",
        ],
      },
      {
        key: "whoItIsFor",
        title: "Who it is for",
        body: [
          "Anyone who uses a credit card can use this number to keep an eye on their available credit and balances. It is especially useful before a large purchase or a statement closing date.",
        ],
      },
      {
        key: "howItWorks",
        title: "How it works",
        body: [
          "For example, a $300 balance on a card with a $1,000 limit is 30% utilization. Paying down a balance lowers the ratio; a refund can lower it too. Each card can have a different ratio, and the overall ratio combines balances and limits.",
        ],
      },
      {
        key: "importantConsiderations",
        title: "Important considerations",
        body: [
          "A card issuer reports on its own schedule, so the number a lender sees may differ from today’s balance. Utilization is only one part of a credit profile. Paying on time and keeping debt manageable are important, too.",
        ],
      },
    ],
    nextSteps: [
      {
        label: "Review your cards",
        href: "/cards",
        description: "See each card’s balance, limit, and utilization.",
      },
    ],
    relatedSlugs: ["apr"],
  },
  {
    slug: "apr",
    title: "APR",
    summary: "Understand the annual rate used to calculate borrowing costs.",
    topic: "Credit",
    estimatedMinutes: 4,
    sections: [
      {
        key: "whatItIs",
        title: "What it is",
        body: [
          "APR stands for annual percentage rate. On a credit card, it is the yearly interest rate that can be used to calculate interest on balances that are carried from one billing cycle to the next.",
        ],
      },
      {
        key: "whyItMatters",
        title: "Why it matters",
        body: [
          "A higher APR can make a carried balance more expensive over time. Knowing the rate helps you understand the cost of borrowing and compare payment options.",
        ],
      },
      {
        key: "whoItIsFor",
        title: "Who it is for",
        body: [
          "APR is useful to understand before opening a card and whenever you may carry a balance. It is less relevant to interest charges when a card’s statement balance is paid in full by its due date, subject to the card agreement.",
        ],
      },
      {
        key: "howItWorks",
        title: "How it works",
        body: [
          "Card agreements can list different APRs for purchases, balance transfers, and cash advances. They also explain the balance calculation method and grace period. Those details determine when and how interest is charged.",
        ],
      },
      {
        key: "importantConsiderations",
        title: "Important considerations",
        body: [
          "An APR is not the same as an annual fee. Promotional rates can end, and missed payments may have consequences under the card agreement. Check the current terms for your specific card.",
        ],
      },
    ],
    nextSteps: [
      {
        label: "Review your card details",
        href: "/cards",
        description: "Keep your balances and payment dates visible in one place.",
      },
    ],
    relatedSlugs: ["credit-utilization"],
  },
];

export function getPublishedLessons() {
  return lessons;
}

export function getLessonBySlug(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}
