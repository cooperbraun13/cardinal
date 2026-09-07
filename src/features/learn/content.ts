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
  {
    slug: "stocks",
    title: "Stocks",
    summary: "Learn what owning stock means and why a stock's value can change.",
    topic: "Investing",
    estimatedMinutes: 5,
    sections: [
      { key: "whatItIs", title: "What it is", body: ["A stock is a security that represents an ownership share in a company. Stockholders can have a claim on a proportional share of the company's assets and profits, and common stock can include voting rights."] },
      { key: "whyItMatters", title: "Why it matters", body: ["Stocks appear directly in brokerage accounts and indirectly inside many funds. Knowing that a stock represents ownership helps explain both its potential returns and its risks."] },
      { key: "whoItIsFor", title: "Who it is for", body: ["This lesson is for people who are new to investing or want a clearer definition of a stock before learning about funds and diversification."] },
      { key: "howItWorks", title: "How it works", body: ["Companies can issue stock to raise money. A stock's price can change with company performance, investor expectations, market conditions, and events outside the company.", "Stockholders may receive dividends if a company chooses to distribute earnings, but dividends are not guaranteed. Shares are commonly bought and sold through a brokerage account."] },
      { key: "importantConsiderations", title: "Important considerations", body: ["Stock prices can go down as well as up, and an investor can lose money. If a company fails, common stockholders are generally behind creditors and preferred stockholders in a liquidation.", "This lesson is educational and does not recommend a company or trade. An individual stock has company-specific risk; review disclosures and consider qualified help for decisions specific to you."] },
    ],
    nextSteps: [{ label: "Learn about index funds", href: "/learn/index-funds", description: "See how a fund can hold many securities." }],
    relatedSlugs: ["index-funds", "etfs", "investing-basics"],
  },
  {
    slug: "bonds",
    title: "Bonds",
    summary: "Learn how bonds work as loans to governments, municipalities, or companies.",
    topic: "Investing",
    estimatedMinutes: 5,
    sections: [
      { key: "whatItIs", title: "What it is", body: ["A bond is a debt security, similar to an IOU. When someone buys a bond, they lend money to an issuer, such as a government, municipality, or company."] },
      { key: "whyItMatters", title: "Why it matters", body: ["Bonds are a common investment type and can appear directly or inside a fund. Understanding the loan relationship helps distinguish bonds from ownership investments such as stocks."] },
      { key: "whoItIsFor", title: "Who it is for", body: ["This lesson is for people learning basic investment vocabulary or comparing the kinds of assets held by a fund."] },
      { key: "howItWorks", title: "How it works", body: ["An issuer may promise periodic interest payments and repayment of principal depending on the bond's terms and the issuer's ability to make those payments. Bonds can have different issuers, interest structures, and maturity dates.", "A bond may be sold before maturity. Its market value can be more or less than its face value, and changing interest rates can affect that value."] },
      { key: "importantConsiderations", title: "Important considerations", body: ["Bonds carry credit, interest-rate, inflation, liquidity, and sometimes call risk. A bond issuer can default, so a stated interest payment is not a guarantee.", "This lesson is educational and does not recommend a bond or fund. Review current disclosures and consider qualified help for decisions specific to you."] },
    ],
    nextSteps: [{ label: "Learn about stocks", href: "/learn/stocks", description: "Compare lending to an issuer with owning part of a company." }],
    relatedSlugs: ["stocks", "index-funds", "etfs"],
  },
  {
    slug: "diversification",
    title: "Diversification",
    summary: "Learn how spreading investments can reduce concentration risk without removing all risk.",
    topic: "Investing",
    estimatedMinutes: 5,
    sections: [
      { key: "whatItIs", title: "What it is", body: ["Diversification means spreading money across different investments, asset types, companies, industries, or regions so that one holding has less influence on the whole portfolio."] },
      { key: "whyItMatters", title: "Why it matters", body: ["If one investment performs poorly, other holdings may offset some of the effect. Diversification can reduce concentration risk, but it cannot guarantee that a portfolio will not lose value when markets fall."] },
      { key: "whoItIsFor", title: "Who it is for", body: ["This lesson is for anyone learning how portfolios are structured, including people reviewing workplace plans, IRAs, brokerage accounts, or funds."] },
      { key: "howItWorks", title: "How it works", body: ["People can diversify across asset types such as stocks, bonds, and cash, and within an asset type by holding different companies or sectors. Mutual funds and ETFs can make it easier to own portions of many investments, but a narrowly focused fund may still be concentrated.", "A portfolio's mix is sometimes called asset allocation. Time horizon and risk comfort are among the personal factors people consider when thinking about that mix."] },
      { key: "importantConsiderations", title: "Important considerations", body: ["Owning several funds does not automatically create diversification if their holdings overlap. Diversification also does not prevent losses, remove fees, or ensure a particular return.", "This lesson is educational and does not recommend an allocation or investment. Review actual holdings and current disclosures for decisions specific to you."] },
    ],
    nextSteps: [{ label: "Review index funds", href: "/learn/index-funds", description: "See how a fund can provide exposure to a group of securities." }],
    relatedSlugs: ["index-funds", "stocks", "bonds"],
  },
  {
    slug: "credit-scores",
    title: "Credit scores",
    summary: "Understand what a credit score represents and why scores can differ.",
    topic: "Credit",
    estimatedMinutes: 5,
    sections: [
      { key: "whatItIs", title: "What it is", body: ["A credit score is a number generated by a scoring model from information in a credit report. It is designed to help predict credit behavior, such as the likelihood of repaying borrowed money on time."] },
      { key: "whyItMatters", title: "Why it matters", body: ["Lenders and other businesses may use scores when reviewing credit, housing, insurance, or other applications. A score can affect whether you qualify and the terms you are offered."] },
      { key: "whoItIsFor", title: "Who it is for", body: ["Anyone with credit activity can learn about scores and reports. This lesson is also useful before reviewing a credit application or checking a report for errors."] },
      { key: "howItWorks", title: "How it works", body: ["Models may consider payment history, unpaid debt, account age and types, credit use, new applications, and other report information. There is no single score: results can vary by model, report source, product, and date.", "A credit report contains the underlying account history. Checking it can help identify information that is incomplete, outdated, or not yours."] },
      { key: "importantConsiderations", title: "Important considerations", body: ["A score is not a complete measure of financial health, and no one action guarantees a specific score change. Paying on time and keeping debt manageable are useful habits, but scores respond to the information and model being used.", "This lesson is educational and does not predict an approval or recommend borrowing. Review current reports and official consumer guidance for your situation."] },
    ],
    nextSteps: [{ label: "Learn credit utilization", href: "/learn/credit-utilization", description: "See how reported balances compare with available credit." }],
    relatedSlugs: ["credit-utilization", "apr", "diversification"],
  },
  {
    slug: "mortgages",
    title: "Mortgages",
    summary: "Understand the main parts of a mortgage payment before comparing home loans.",
    topic: "Home buying",
    estimatedMinutes: 6,
    sections: [
      { key: "whatItIs", title: "What it is", body: ["A mortgage is a loan secured by a home. The borrower repays principal, the amount borrowed, and interest, the lender's charge for providing the loan."] },
      { key: "whyItMatters", title: "Why it matters", body: ["A mortgage is a long-term commitment with costs beyond the advertised principal-and-interest payment. Understanding the full payment makes home-buying comparisons clearer."] },
      { key: "whoItIsFor", title: "Who it is for", body: ["This lesson is for people learning home-buying vocabulary or preparing to read a Loan Estimate. It is education, not a determination of whether someone should buy a home or borrow."] },
      { key: "howItWorks", title: "How it works", body: ["A total monthly payment may include principal, interest, property taxes, homeowners insurance, and mortgage insurance. Taxes and insurance may be collected through an escrow account, depending on the loan.", "A loan's rate, term, amount, down payment, fees, and other features affect its cost. Homeowners may also have association dues and maintenance costs outside the mortgage payment."] },
      { key: "importantConsiderations", title: "Important considerations", body: ["A lower monthly principal-and-interest payment does not necessarily mean a lower total cost. Adjustable rates, points, prepayment penalties, balloon features, closing costs, and insurance requirements can change the tradeoffs.", "This lesson is educational and does not estimate affordability, recommend a loan, or provide lending advice. Review current loan documents and consider qualified help for a decision specific to you."] },
    ],
    nextSteps: [{ label: "Review credit scores", href: "/learn/credit-scores", description: "Understand one type of information lenders may consider." }],
    relatedSlugs: ["credit-scores", "emergency-fund", "diversification"],
  },
  {
    slug: "deductibles",
    title: "Insurance deductibles",
    summary: "Understand what a deductible means and how it fits with other health-plan costs.",
    topic: "Insurance",
    estimatedMinutes: 5,
    sections: [
      { key: "whatItIs", title: "What it is", body: ["A deductible is the amount a person pays for covered health care services before an insurance plan begins paying its share, subject to the plan's rules. Some services may be covered before the deductible."] },
      { key: "whyItMatters", title: "Why it matters", body: ["A deductible affects how much cash you may need when care happens. Looking at the deductible alone can be misleading because premiums, copayments, coinsurance, and the out-of-pocket maximum also affect total costs."] },
      { key: "whoItIsFor", title: "Who it is for", body: ["This lesson is for anyone comparing health-plan benefits or reading an insurance summary. Deductibles can differ by plan, service, network, person, or family."] },
      { key: "howItWorks", title: "How it works", body: ["After covered in-network spending reaches the deductible, the plan may begin sharing costs through copayments or coinsurance. The plan's allowed amounts and coverage rules determine what counts.", "An out-of-pocket maximum is a separate limit for certain covered in-network costs during a plan year. Premiums and non-covered care generally do not count toward it."] },
      { key: "importantConsiderations", title: "Important considerations", body: ["A lower deductible often comes with a higher premium, but the tradeoff varies by plan. Separate prescription or family deductibles and out-of-network rules can change the picture.", "This lesson is educational and does not compare plans or predict health costs. Read current plan documents and ask the insurer or benefits administrator about unclear terms."] },
    ],
    nextSteps: [{ label: "Learn about HSAs", href: "/learn/hsa", description: "Understand an account sometimes paired with eligible high-deductible plans." }],
    relatedSlugs: ["hsa", "mortgages", "emergency-fund"],
  },
  {
    slug: "insurance",
    title: "Insurance basics",
    summary: "Learn how policies trade premiums for protection against covered risks.",
    topic: "Insurance",
    estimatedMinutes: 6,
    sections: [
      { key: "whatItIs", title: "What it is", body: ["Insurance is a contract that helps manage financial risk. You pay a premium to an insurer, and the policy describes what the insurer may pay when a covered loss or event happens."] },
      { key: "whyItMatters", title: "Why it matters", body: ["Insurance can help keep one unexpected event from becoming an unaffordable bill. Understanding coverage, exclusions, deductibles, limits, and claims makes a policy easier to evaluate."] },
      { key: "whoItIsFor", title: "Who it is for", body: ["This lesson is for people learning about health, auto, renters, homeowners, life, or other insurance policies. Each type has different rules and risks."] },
      { key: "howItWorks", title: "How it works", body: ["A policy lists the people or property protected, covered events, exclusions, coverage limits, deductibles, and the premium. If a covered event happens, the policy and claims process determine what the insurer pays and what remains the policyholder's responsibility.", "Premiums can reflect the insurer's assessment of risk and the amount of coverage selected. A higher deductible may lower a premium in some policies, but it also means paying more out of pocket when a covered claim occurs."] },
      { key: "importantConsiderations", title: "Important considerations", body: ["A policy does not cover every loss. Limits, exclusions, waiting periods, network rules, policy renewal terms, and non-covered costs can matter as much as the premium.", "This lesson is educational and does not recommend coverage or an insurer. Read the policy and ask the insurer, agent, or state regulator about terms you do not understand."] },
    ],
    nextSteps: [{ label: "Learn about deductibles", href: "/learn/deductibles", description: "See how one common cost-sharing term works." }],
    relatedSlugs: ["deductibles", "hsa", "mortgages"],
  },
];

export function getPublishedLessons() {
  return lessons;
}

export function getLessonBySlug(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}
