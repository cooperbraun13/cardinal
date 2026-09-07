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
  {
    slug: "emergency-fund",
    title: "Emergency funds",
    summary: "Understand how a cash cushion can help with unexpected expenses.",
    topic: "Savings",
    estimatedMinutes: 5,
    sections: [
      {
        key: "whatItIs",
        title: "What it is",
        body: [
          "An emergency fund is money set aside for an unplanned expense or loss of income. It is usually kept somewhere accessible, so it is available when it is needed.",
        ],
      },
      {
        key: "whyItMatters",
        title: "Why it matters",
        body: [
          "A cash cushion can give you more options when a repair, medical bill, or income interruption happens. It may reduce the need to put a surprise expense on a high-interest credit card.",
        ],
      },
      {
        key: "whoItIsFor",
        title: "Who it is for",
        body: [
          "This idea can be useful for anyone whose expenses or income could change unexpectedly. The amount that feels useful depends on a person's household, obligations, income stability, and other resources.",
        ],
      },
      {
        key: "howItWorks",
        title: "How it works",
        body: [
          "People often begin with a small, separate cash goal and add to it over time. Before choosing a target, it can help to list the expenses you would need to cover and decide what access to the money you need.",
        ],
      },
      {
        key: "importantConsiderations",
        title: "Important considerations",
        body: [
          "Emergency savings are different from money earmarked for a planned purchase or long-term investment. A target that works for someone else may not fit your situation, and Cardinal does not calculate a target in this lesson.",
        ],
      },
    ],
    nextSteps: [
      {
        label: "Review your Plan",
        href: "/plan",
        description: "See how your saved emergency-savings status affects your next steps.",
      },
    ],
    relatedSlugs: ["apr", "credit-utilization"],
  },
  {
    slug: "employer-match",
    title: "Employer retirement matches",
    summary: "Learn the questions to ask about a workplace retirement contribution match.",
    topic: "Investing",
    estimatedMinutes: 5,
    sections: [
      {
        key: "whatItIs",
        title: "What it is",
        body: [
          "Some workplace retirement plans include an employer contribution that depends on an employee's contribution. The details are set by the employer's plan, not by a universal rule.",
        ],
      },
      {
        key: "whyItMatters",
        title: "Why it matters",
        body: [
          "A match can be an important part of understanding a workplace retirement benefit. Reading the terms helps you see what contribution, timing, and eligibility rules apply to your specific plan.",
        ],
      },
      {
        key: "whoItIsFor",
        title: "Who it is for",
        body: [
          "This lesson is for people who have access to a workplace retirement plan, such as a 401(k), 403(b), or similar plan. It is also useful if you are not sure whether a match is offered.",
        ],
      },
      {
        key: "howItWorks",
        title: "How it works",
        body: [
          "Plan materials usually describe the contribution formula, any limits, when contributions begin, and whether employer contributions vest over time. Your benefits or plan administrator can explain the terms that apply to you.",
        ],
      },
      {
        key: "importantConsiderations",
        title: "Important considerations",
        body: [
          "Contribution options, investment choices, tax treatment, and withdrawal rules can vary. This lesson explains the concept and does not tell you how much to contribute or which investments to select.",
        ],
      },
    ],
    nextSteps: [
      {
        label: "Review your Plan",
        href: "/plan",
        description: "Keep the availability of your workplace plan and match up to date.",
      },
    ],
    relatedSlugs: ["investing-basics", "401k"],
  },
  {
    slug: "investing-basics",
    title: "Investing basics",
    summary: "Build a simple vocabulary for long-term investing before making decisions.",
    topic: "Investing",
    estimatedMinutes: 5,
    sections: [
      {
        key: "whatItIs",
        title: "What it is",
        body: [
          "Investing means putting money into assets with the expectation that they may grow or produce income over time. Common examples include stocks, bonds, and funds that hold many investments.",
        ],
      },
      {
        key: "whyItMatters",
        title: "Why it matters",
        body: [
          "Investing involves tradeoffs between potential return, time, risk, taxes, and access to money. Learning the vocabulary first can make account options and investment choices less overwhelming.",
        ],
      },
      {
        key: "whoItIsFor",
        title: "Who it is for",
        body: [
          "This is a starting point for people who are new to investing or want a clearer foundation. It can also help someone prepare questions for an employer plan, brokerage, or qualified professional.",
        ],
      },
      {
        key: "howItWorks",
        title: "How it works",
        body: [
          "An account is the container that holds investments, while an investment is what is held inside it. Different account types and investments have different rules, costs, risks, and tax treatment.",
        ],
      },
      {
        key: "importantConsiderations",
        title: "Important considerations",
        body: [
          "Investment values can go up or down, and past performance does not guarantee future results. This lesson is education only; it does not recommend a particular account or investment.",
        ],
      },
    ],
    nextSteps: [
      {
        label: "Explore Invest",
        href: "/invest",
        description: "Continue with Cardinal's investing education entry point.",
      },
    ],
    relatedSlugs: ["employer-match", "roth-ira", "traditional-ira"],
  },
  {
    slug: "roth-ira",
    title: "Roth IRAs",
    summary: "Learn the basic rules and questions to consider before opening a Roth IRA.",
    topic: "Investing",
    estimatedMinutes: 6,
    sections: [
      {
        key: "whatItIs",
        title: "What it is",
        body: [
          "A Roth IRA is an individual retirement account. Contributions are generally made with money that has already been taxed, and qualified distributions can receive different tax treatment under federal tax rules.",
          "The account is a container. It can hold investments, and the account's tax rules are separate from the risks and costs of the investments inside it.",
        ],
      },
      {
        key: "whyItMatters",
        title: "Why it matters",
        body: [
          "A Roth IRA is one of several account types people may encounter while planning for retirement. Knowing how its contribution and withdrawal rules work can help you ask clearer questions before you make a decision.",
        ],
      },
      {
        key: "whoItIsFor",
        title: "Who it is for",
        body: [
          "This lesson is for people who are learning about retirement accounts or comparing the account types available to them. Whether someone can contribute, and how much, can depend on income, tax filing status, compensation, and current tax rules.",
        ],
      },
      {
        key: "howItWorks",
        title: "How it works",
        body: [
          "A person opens a Roth IRA with an eligible provider and chooses contributions within the rules that apply to them. Contribution limits and eligibility can change, so current provider materials and IRS guidance matter when checking a specific situation.",
          "Once money is in the account, the account owner is still responsible for understanding the investments, fees, and risk involved. An account type does not by itself choose investments or guarantee a result.",
        ],
      },
      {
        key: "importantConsiderations",
        title: "Important considerations",
        body: [
          "A Roth IRA is different from a Roth option in a workplace plan, such as a Roth 401(k). Contribution rules, withdrawal rules, and tax consequences can be complex, especially for conversions or early withdrawals.",
          "This lesson is educational and does not determine eligibility, recommend an account, or provide tax advice. Check current official guidance and consider qualified help for a decision specific to you.",
        ],
      },
    ],
    nextSteps: [
      {
        label: "Learn investing basics",
        href: "/learn/investing-basics",
        description: "See the difference between an investment account and the investments it holds.",
      },
      {
        label: "Explore Invest",
        href: "/invest",
        description: "Continue with Cardinal's introductory investing education.",
      },
    ],
    relatedSlugs: ["investing-basics", "employer-match", "traditional-ira"],
  },
  {
    slug: "traditional-ira",
    title: "Traditional IRAs",
    summary: "Learn the basic tax and withdrawal questions behind a Traditional IRA.",
    topic: "Investing",
    estimatedMinutes: 6,
    sections: [
      {
        key: "whatItIs",
        title: "What it is",
        body: [
          "A Traditional IRA is an individual retirement account. Depending on a person's circumstances, contributions may be fully, partly, or not deductible, and amounts in the account are generally not taxed until they are distributed.",
          "The account is a container for investments. Its tax rules are separate from the investments, fees, and risk of what is held inside it.",
        ],
      },
      {
        key: "whyItMatters",
        title: "Why it matters",
        body: [
          "A Traditional IRA is one of several retirement account types people may compare. Understanding the timing of possible deductions and taxes can help you prepare questions before choosing how to save for retirement.",
        ],
      },
      {
        key: "whoItIsFor",
        title: "Who it is for",
        body: [
          "This lesson is for people learning about retirement accounts, including people who have a workplace retirement plan. Contribution eligibility, limits, and whether a contribution is deductible can depend on taxable compensation, income, filing status, and workplace-plan coverage.",
        ],
      },
      {
        key: "howItWorks",
        title: "How it works",
        body: [
          "A person opens a Traditional IRA with an eligible provider and contributes within the rules that apply to them. Provider materials and current IRS guidance can help confirm contribution and deduction rules for a particular tax year.",
          "When a distribution is taken, its tax treatment can depend on the account's history, including whether any nondeductible contributions were made. Keeping records matters when an account has after-tax contributions or certain rollovers.",
        ],
      },
      {
        key: "importantConsiderations",
        title: "Important considerations",
        body: [
          "Traditional IRA and Roth IRA rules differ, and contributions to both types can share an annual limit. Early withdrawals, rollovers, conversions, and required distributions can have additional rules and tax consequences.",
          "This lesson is educational and does not determine a deduction, recommend an account, or provide tax advice. Check current official guidance and consider qualified help for a decision specific to you.",
        ],
      },
    ],
    nextSteps: [
      {
        label: "Compare Roth IRA basics",
        href: "/learn/roth-ira",
        description: "Learn how Roth IRA rules differ at a high level.",
      },
      {
        label: "Learn investing basics",
        href: "/learn/investing-basics",
        description: "See how an account differs from the investments it holds.",
      },
    ],
    relatedSlugs: ["roth-ira", "investing-basics", "employer-match"],
  },
  {
    slug: "401k",
    title: "401(k) plans",
    summary: "Understand the workplace retirement plan that may be part of your benefits.",
    topic: "Investing",
    estimatedMinutes: 6,
    sections: [
      {
        key: "whatItIs",
        title: "What it is",
        body: [
          "A 401(k) is a workplace retirement plan that can let eligible employees contribute part of their pay to an individual account. The plan's rules, available contribution options, and investment menu are set by the employer's plan documents.",
        ],
      },
      {
        key: "whyItMatters",
        title: "Why it matters",
        body: [
          "A workplace plan can be an important benefit to understand because it may offer payroll contributions and, in some plans, employer contributions. Knowing the rules helps you see which questions apply to your benefits.",
        ],
      },
      {
        key: "whoItIsFor",
        title: "Who it is for",
        body: [
          "This lesson is for people who have access to a 401(k), are becoming eligible for one, or want to understand a plan named in their benefits materials.",
        ],
      },
      {
        key: "howItWorks",
        title: "How it works",
        body: [
          "Many plans let employees choose a payroll contribution amount. A plan may also offer a traditional pre-tax option, a Roth option, or both. Contribution limits, eligibility, withdrawals, and investment choices follow the plan and current tax rules.",
          "Some plans include employer matching or other employer contributions. Those contributions can have their own eligibility and vesting rules, so the summary plan description is a useful place to check the details.",
        ],
      },
      {
        key: "importantConsiderations",
        title: "Important considerations",
        body: [
          "Not every employer offers the same features, match, fees, or investment choices. A 401(k) is different from an IRA, and a Roth 401(k) is different from a Roth IRA even though both use the word Roth.",
          "This lesson is educational. It does not recommend a contribution amount, investment, or withdrawal. Read your current plan materials and consider qualified help for choices specific to you.",
        ],
      },
    ],
    nextSteps: [
      {
        label: "Understand employer matches",
        href: "/learn/employer-match",
        description: "Learn which match details to find in your workplace plan materials.",
      },
      {
        label: "Review your Plan",
        href: "/plan",
        description: "Keep your workplace-plan context current in Cardinal.",
      },
    ],
    relatedSlugs: ["employer-match", "roth-ira", "traditional-ira"],
  },
  {
    slug: "hsa",
    title: "Health savings accounts",
    summary: "Learn when an HSA may be available and how its health-expense rules work.",
    topic: "Investing",
    estimatedMinutes: 6,
    sections: [
      {
        key: "whatItIs",
        title: "What it is",
        body: [
          "A health savings account, or HSA, is a tax-advantaged account for qualified medical expenses. It is separate from a health plan, although eligibility to contribute is tied to health coverage and other rules.",
        ],
      },
      {
        key: "whyItMatters",
        title: "Why it matters",
        body: [
          "An HSA can appear in benefits materials alongside a high-deductible health plan. Understanding the account can help you recognize which details to check before deciding how to use an employer benefit.",
        ],
      },
      {
        key: "whoItIsFor",
        title: "Who it is for",
        body: [
          "This lesson is for people whose benefits mention an HSA or high-deductible health plan. Eligibility to contribute can depend on coverage, other health coverage, Medicare enrollment, dependent status, and current rules.",
        ],
      },
      {
        key: "howItWorks",
        title: "How it works",
        body: [
          "Eligible people can open an HSA with a qualified trustee, and contributions may come from the account holder, an employer, or another person. Funds remain in the account until they are used, even if the account holder changes jobs.",
          "Distributions used for qualified medical expenses can receive favorable tax treatment. Contribution limits and qualified-expense rules can change, so current plan and IRS materials matter for a specific decision.",
        ],
      },
      {
        key: "importantConsiderations",
        title: "Important considerations",
        body: [
          "An HSA is different from a flexible spending account or health reimbursement arrangement, and having other coverage can affect contribution eligibility. A distribution used for something other than a qualified medical expense can have tax consequences.",
          "This lesson is educational and does not determine eligibility, qualified expenses, or a contribution amount. Check current official guidance and consider qualified help for your situation.",
        ],
      },
    ],
    nextSteps: [
      {
        label: "Review your benefits materials",
        href: "/profile",
        description: "Keep only the workplace-benefit context you choose to share up to date.",
      },
      {
        label: "Learn investing basics",
        href: "/learn/investing-basics",
        description: "See how an account differs from the investments it may hold.",
      },
    ],
    relatedSlugs: ["employer-match", "investing-basics"],
  },
  {
    slug: "brokerage-accounts",
    title: "Brokerage accounts",
    summary: "Understand the account used to buy and hold many kinds of investments.",
    topic: "Investing",
    estimatedMinutes: 6,
    sections: [
      { key: "whatItIs", title: "What it is", body: ["A brokerage account is an investment account at a brokerage firm. It can be used to buy, sell, and hold investments such as stocks, bonds, mutual funds, and exchange-traded funds."] },
      { key: "whyItMatters", title: "Why it matters", body: ["A brokerage firm can offer taxable brokerage accounts and retirement accounts such as IRAs. The account type determines its tax rules, while the account holds and trades investments. Understanding that distinction makes account choices easier to compare."] },
      { key: "whoItIsFor", title: "Who it is for", body: ["This lesson is for people who are new to investing or see brokerage accounts mentioned alongside IRAs and workplace plans."] },
      { key: "howItWorks", title: "How it works", body: ["A person opens an account with a brokerage firm, adds cash, and chooses whether to buy investments. In a cash account, purchases must be paid in full by settlement; a margin account can involve borrowing from the broker and adds distinct risks.", "Brokerage firms can offer different products, services, and fee schedules. Account, transaction, transfer, and investment-level costs can all affect an account."] },
      { key: "importantConsiderations", title: "Important considerations", body: ["Opening an account does not choose investments or guarantee returns. Investments can lose value, and fees, services, conflicts of interest, and account agreements vary by firm.", "This lesson is educational and does not recommend a brokerage, account type, or investment. Review current firm disclosures and consider qualified help for a decision specific to you."] },
    ],
    nextSteps: [
      { label: "Learn investing basics", href: "/learn/investing-basics", description: "See the difference between an account and the investments inside it." },
      { label: "Explore Invest", href: "/invest", description: "Continue with Cardinal's introductory investing education." },
    ],
    relatedSlugs: ["investing-basics", "roth-ira", "traditional-ira"],
  },
  {
    slug: "etfs",
    title: "ETFs",
    summary: "Learn how exchange-traded funds pool investments and trade on an exchange.",
    topic: "Investing",
    estimatedMinutes: 5,
    sections: [
      { key: "whatItIs", title: "What it is", body: ["An exchange-traded fund, or ETF, is an investment fund whose shares trade on an exchange. An ETF can hold a collection of assets, such as stocks or bonds, rather than representing one company."] },
      { key: "whyItMatters", title: "Why it matters", body: ["ETFs are a common investment type in brokerage and retirement accounts. Learning what a fund holds, how it trades, and what it costs helps make the term less confusing."] },
      { key: "whoItIsFor", title: "Who it is for", body: ["This lesson is for people who are new to investment funds or see ETFs in a workplace-plan or brokerage-account menu."] },
      { key: "howItWorks", title: "How it works", body: ["An ETF pools investor money into a portfolio managed according to its stated objective. Shares are bought and sold during market hours through an exchange, usually using a brokerage account.", "An ETF's market price can be higher or lower than the value of its underlying assets. Its prospectus and shareholder materials describe the fund's objective, holdings, risks, and expenses."] },
      { key: "importantConsiderations", title: "Important considerations", body: ["An ETF can offer exposure to many assets, but it does not automatically make an investment diversified or low risk. Funds can have different strategies, holdings, expenses, and risks.", "This lesson is educational and does not recommend a fund or trade. Review current fund disclosures and consider qualified help for decisions specific to you."] },
    ],
    nextSteps: [{ label: "Learn brokerage-account basics", href: "/learn/brokerage-accounts", description: "See how a brokerage account can hold investments such as ETFs." }],
    relatedSlugs: ["brokerage-accounts", "investing-basics"],
  },
  {
    slug: "index-funds",
    title: "Index funds",
    summary: "Learn how a fund can aim to track a market index instead of selecting investments actively.",
    topic: "Investing",
    estimatedMinutes: 5,
    sections: [
      { key: "whatItIs", title: "What it is", body: ["An index fund is a mutual fund or ETF that seeks to track the returns of a market index. A market index measures the performance of a group of securities, and an index fund provides an indirect way to invest in that group."] },
      { key: "whyItMatters", title: "Why it matters", body: ["Index funds are a common term in workplace plans, retirement accounts, and brokerage accounts. Understanding the fund's stated index and holdings helps explain what the fund is designed to follow."] },
      { key: "whoItIsFor", title: "Who it is for", body: ["This lesson is for people who are learning about fund choices and want to understand the difference between an index-tracking and actively managed approach."] },
      { key: "howItWorks", title: "How it works", body: ["An index fund follows rules intended to track a particular index. Some funds hold every security in an index; others hold a sample. Index funds are often described as passive, but they still have a specific objective, holdings, and management process.", "An index fund can be structured as an ETF or mutual fund. Its prospectus describes the index, strategy, holdings, expenses, and risks."] },
      { key: "importantConsiderations", title: "Important considerations", body: ["Not all index funds track the same index or have the same costs. An index fund can lag its index because of fees, trading costs, or tracking error, and it is exposed to the risks of the securities it holds.", "This lesson is educational and does not recommend a fund or strategy. Review current fund disclosures and consider qualified help for decisions specific to you."] },
    ],
    nextSteps: [{ label: "Learn about ETFs", href: "/learn/etfs", description: "See how some index funds trade on an exchange." }],
    relatedSlugs: ["etfs", "brokerage-accounts", "investing-basics"],
  },
];

export function getPublishedLessons() {
  return lessons;
}

export function getLessonBySlug(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}
