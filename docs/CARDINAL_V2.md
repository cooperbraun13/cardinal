# Cardinal v2 foundation

## Purpose

Cardinal v2 expands the current credit-card optimizer into a simple, beginner-friendly personal-finance product. The intended journey is:

```text
Learn → Understand → Take action
```

The product should introduce one relevant idea or next step at a time. It should explain terms in plain language, show why a step is relevant, and point people to a concrete action without implying that Cardinal provides individualized investment, tax, legal, lending, or insurance advice.

Credit-card tracking and rewards optimization remain a first-class capability. They form the initial **Money / Credit** module rather than being replaced or rewritten.

## Current architecture audit

### Application and routing

Cardinal is a Next.js 16 App Router application. Authenticated routes are under `src/app/(app)` and the login/register routes are under `src/app/(auth)`. The root page sends authenticated people to the product home and unauthenticated people to login. The authenticated layout performs the server-side session check and owns the shared navigation and footer.

Existing credit routes are intentionally preserved:

```text
/dashboard        current credit overview
/cards             wallet and card list
/cards/[id]        card details, reward rules, benefits, and signup bonus
/transactions      transaction activity
/benefits          card benefits
/optimizer         best-card-for-purchase tool
```

The v2 shell adds these primary section routes:

```text
/home              broader product home
/money             money hub; today this leads to the credit tools
/invest            investing education entry point
/learn             lesson library
/learn/[slug]      data-driven lesson page
/plan              prioritized, profile-backed educational next steps
/profile           optional financial profile
```

The existing card routes remain canonical during the foundation phase. Moving them to `/money/credit/...` would add redirects, update deep links, and touch a working set of flows without current user value. A later, deliberate route migration can add the nested aliases once the Money domain has more than credit.

### Frontend and design system

Server pages fetch data after checking the session. Interactive forms and tools are client components and use `apiFetch`; successful mutations refresh the route. Shared product components currently live in `src/components`, forms in `src/components/forms`, and shadcn/base-ui primitives in `src/components/ui`.

The visual system is defined in `docs/DESIGN.md` and implemented through Tailwind 4 tokens and shared classes in `src/app/globals.css`. Reuse `PageHeader`, `SectionHeader`, `EmptyState`, `Button`, `panel`, and the spacing tokens before adding a new visual pattern.

### Backend, data, and auth

Route handlers use `handleApi`, Zod parsing, `requireUser`, and ownership-scoped lookups. The user is derived from a database-backed, HTTP-only session cookie. Credit resources never accept a client-supplied owner. Prisma uses SQLite locally; current credit writes that affect several records use transactions in `src/services`.

Financial rules are sensibly separated into testable services: rewards, bonuses, benefits, card recommendations, and transaction effects. `src/services/data.ts` assembles dashboard and optimizer data. Some server pages fetch Prisma directly, which is acceptable for current read paths but should not become the default for new, complex domains.

### State management

There is no global client state store. Route data is server-rendered; component-local state handles forms, filters, dialogs, and tool input. This is appropriate today. Add server-backed domain state and small local state before considering a global store.

## Risks and boundaries to preserve

- Money is currently stored as `Float`. New finance features must use integer minor units or a deliberate decimal strategy. Do not extend `Float` as a default merely because the credit MVP uses it.
- Credit page reads and several simple API writes query Prisma directly. Keep new domain logic in focused services/repositories rather than spreading cross-domain queries through pages.
- The top-level navigation has five credit-specific links. It will not scale as financial topics and tools grow; v2 uses six stable product sections and contextual links within each section.
- `User` contains only account identity. A financial profile must be separate, optional, versioned, and ownership-scoped; profile answers must never be inferred from credit-card data.
- The existing recommendation service explains deterministic card-reward results. Cardinal Plan should follow the same explainable approach, but must not reuse credit-reward logic as generic financial guidance.
- `StatementPeriod` exists in the schema without a user-facing flow. It is a v1 capability candidate, not a reason to broaden the v2 schema now.

## Target module structure

Use feature ownership for new work while leaving stable v1 code in place until a feature needs to move. Do not create empty folders for every future domain.

```text
src/
  app/
    (app)/                         authenticated route composition only
      home/ money/ invest/ learn/ plan/ profile/
    api/                            HTTP boundary, grouped by domain as added
  components/                       shared presentational product UI and ui primitives
  features/
    learn/                          lessons, lesson rendering, content sources
    credit/                         future home for migrated credit feature code
    plan/                           initial deterministic rules and explanations; later persistence
    profile/                        optional profile schema, service, API, and form
    investing/                      investing education and later domain workflows
    calculators/                    calculator definitions and pure calculation functions
  services/                         existing v1 financial services; migrate only with a feature change
  lib/                              cross-cutting auth, database, validation, formatting, HTTP helpers
```

Feature code can depend on `lib`, shared `components`, and its own files. A feature should not reach into another feature's persistence or private implementation. Cross-domain orchestration belongs in a focused service with an explicit input/output contract.

## Navigation and information architecture

| Section | Job | Foundation destination | Future role |
| --- | --- | --- | --- |
| Home | Show a small, relevant starting point | `/home` | personalized overview and one next step |
| Money | Organize cash, credit, debt, and savings | `/money` | credit workspace plus savings and debt |
| Invest | Make investing concepts approachable | `/invest` | education and account decision guidance |
| Learn | Browse concise, linked lessons | `/learn` | topic paths and progress |
| Plan | Prioritize what to do next | `/plan` | transparent, profile-backed plan |
| Profile | Control optional context Cardinal uses | `/profile` | onboarding, answers, privacy controls |

The primary nav contains only these sections. Credit workflows stay accessible from Money and from contextual links, keeping the first-level choice small.

## Education content system

Lessons begin as reviewed, version-controlled TypeScript content in `src/features/learn`. This is intentional: education content needs author review, predictable rendering, and no new operational system during the foundation phase. A later database or CMS source must adapt to the same lesson contract rather than changing page rendering per topic.

Each lesson uses a stable slug and supports:

- title, summary, topic, estimated reading time, and optional beginner-level label;
- **What it is**, **Why it matters**, **Who it is for**, **How it works**, and **Important considerations** sections;
- action-oriented **Next steps** with either an internal lesson or product link;
- **Related lessons** by slug;
- an explicit publication state, reviewed date, and content version when persistence is added.

Lesson prose should distinguish education from personalized recommendations. It should state assumptions, avoid guarantees, explain terms before using them, and link to a next action only when Cardinal can support it. A lesson is not a calculator and does not embed financial-profile rules.

The twenty currently published lessons cover APR, credit utilization, emergency funds, employer 401(k) matches, investing basics, Roth IRAs, Traditional IRAs, 401(k) plans, health savings accounts, brokerage accounts, ETFs, index funds, stocks, bonds, diversification, credit scores, mortgages, deductibles, insurance, and taxes. The remaining planned education work is deeper topic coverage and guided learning paths.

## Financial profile direction

The first profile migration is implemented. Profile information remains sensitive and optional: the current form stores only ranges and simple context, and an all-empty update removes the profile record. It does not collect account credentials, exact balances, employer identity, or investment holdings.

The implemented initial record is a separate one-to-one `FinancialProfile` owned by `User`. Future child tables should be added only where answers are truly repeating. Store ranges and simple enums when exact amounts are unnecessary for the intended guidance.

| Area | Minimal useful data | Avoid by default |
| --- | --- | --- |
| Work and income | employment/student status; optional income range | employer name, payroll data, exact salary |
| Cash safety | savings range; emergency-fund status | bank balances or account numbers |
| Debt | whether high-interest card debt exists; optional debt ranges by type | creditor account numbers and payment credentials |
| Workplace benefits | 401(k) availability; match availability/range | plan account number, holdings, employer identifiers |
| Investing | existing account types; experience; risk comfort | brokerage credentials, security identifiers |
| Goals | selected goals and rough time horizon | free-form sensitive life details unless clearly needed |

Suggested persisted shape (subject to Phase 2 validation design):

```text
User 1 ── 0..1 FinancialProfile
FinancialProfile 1 ── * FinancialGoal
FinancialProfile 1 ── * ProfileAnswerRevision (optional audit/history)
```

Use nullable fields for unanswered questions, a profile schema version, `createdAt`, and `updatedAt`. Do not interpret null as zero or as an answer. Every profile API must derive the user from the session, return only that user’s answers, validate enum/range values server-side, and allow a person to revise or clear answers.

## Cardinal Plan architecture

Cardinal Plan is a deterministic rules engine, not an opaque model. Its first implementation takes an optional profile snapshot and emits an ordered list of explainable, educational next-step cards. It does not offer brokerage execution, tax filing, lending, or individualized regulated advice. A later version can add an owned credit summary only when there is a specific rule that needs it.

```text
FinancialProfile + (later, relevant owned credit summary)
  → profile normalizer
  → deterministic eligibility and priority rules
  → ordered PlanRecommendation records
  → plan page with explanation, lesson, and action link
```

The current recommendation contract contains a stable rule ID, priority, title, action, rationale, `whySuggested`, an internal destination, `inputsUsed`, and assumptions. Current educational rules link directly to their matching published lesson. A future persisted-plan record should add a structured lesson slug and contain:

```text
id, ruleId, ruleVersion, priority, status,
title, action, rationale, whySuggested,
lessonSlug, productHref, inputsUsed, assumptions
```

Rules should be pure functions. Each has a stable ID/version, a narrow input contract, eligibility predicate, priority, and explanation template. Sort by safety/urgency before optimization. For example: high-interest revolving card debt → starter emergency savings → employer match availability → fuller emergency fund → retirement-account education → long-term investing education. The engine should surface uncertainty as a question to answer, not invent an answer.

Persisting a generated plan is optional at first. If later used for progress/history, store the rule ID/version and sanitized input snapshot needed to reproduce the explanation. Recalculate when a profile changes; do not silently preserve stale advice.

Tests must cover rule eligibility, priority ordering, missing information, explanation references, and profile ownership. A rule result must always identify why it appears and what information it used.

## Calculator architecture

Calculators are separate from lessons and plan rules. A calculator has a small input schema, a pure calculation function, explainable output fields, assumptions, and display metadata. Keep formulas in `src/features/calculators` and test them independently from the UI.

```text
CalculatorDefinition
  id, slug, title, description, inputFields,
  assumptions, relatedLessonSlugs, version

The current registry lives in `src/features/calculators/registry.ts`. Pure calculation functions remain separate from this metadata so UI forms can be added without moving financial logic.
```

Use integer minor units or a decimal-safe library/representation for new money calculations, explicit annual/monthly rate conversions, and clear rounding at presentation boundaries. The compound-growth calculator rounds its monetary result fields to cents at the output boundary. Each calculator must state what it does not model. Initial calculators can be added independently: compound growth, emergency fund, credit-card interest, employer match, mortgage payment, rent vs. buy, and Roth vs. Traditional comparison.

## Implementation roadmap

### Phase 1 — foundation (this change)

- Add the six-section navigation and authenticated foundation routes.
- Keep existing credit routes working and expose them from Money.
- Introduce a data-driven Learn contract, catalog, and lesson renderer.
- Document module boundaries, profile direction, Plan design, calculators, and delivery phases.

### Phase 2 — profile and Cardinal Plan (first slice complete)

- Implement privacy-focused profile onboarding with the minimum fields (complete).
- Build validated profile APIs/services and ownership coverage (complete).
- Add pure Plan rules, explanations, and ordering tests (complete for the first rule set).
- Present the first small set of transparent next steps (complete).

### Phase 3 — calculators and investing education

- Add calculator definitions and independently tested formulas. The registry and pure modules cover compound growth, emergency-fund, credit-card-interest, employer-match, mortgage-payment, and Roth-versus-Traditional comparisons; user-facing forms are now available for all six at `/calculators`. The remaining calculator forms will be added one at a time. The emergency-fund form currently presents a 0–24 month input range, the credit-card form presents 0–100% APR and 0–365 days, the employer-match form presents 0–100% percentage inputs, and the mortgage form presents 0–50% rates and 1–40 year terms. These are aligned with the pure-function validation for employer-match percentages; the other form ranges are presentation bounds while those pure functions remain reusable for finite, nonnegative values supplied by another context. The credit-card estimate assumes a constant balance, a 365-day year, and simple daily interest; issuer methods can differ. The employer-match estimate assumes one salary percentage cap and does not model plan-specific limits or vesting. Mortgage results cover principal and interest only; taxes, insurance, mortgage insurance, fees, and escrow are excluded. The Roth comparison uses the same pre-tax amount with illustrative marginal rates and excludes growth, deductions, contribution limits, and account-specific rules.
- Mortgage terms are converted to whole monthly payments by rounding years × 12, matching the compound-growth calculator's term conversion.
- Publish reviewed investing education in small, linked learning paths. The current catalog includes credit, savings, retirement accounts, investing products, diversification, credit scores, mortgages, deductibles, insurance, and taxes; guided learning paths and progress remain future work.
- Connect calculator results to relevant lessons without treating outputs as advice.

### Phase 4 — broader money domains

- Add savings/emergency funds, debt, credit education, mortgages/home buying, insurance, and taxes one domain at a time.
- Introduce nested Money routes only when each domain has meaningful workflows.

### Phase 5 — connected accounts and advanced personalization

- Define a provider, consent, security, data-retention, reconciliation, and failure-state design before integrating accounts.
- Add connections behind explicit user consent and clear data controls.
- Use connected data to improve transparency and completeness, never to hide the logic behind a recommendation.

## Review gates before the next phase

- Decide whether v2 navigation should become the product default for every existing user after product review.
- Establish a money representation and migration strategy before creating new monetary tables or calculators.
- Have financial education and compliance stakeholders review lesson language, plan rule scope, and calculator assumptions.
- Define profile retention, export, deletion, and consent requirements before storing onboarding answers.
- Decide whether lessons remain repository content or require an editorial publishing workflow before content volume makes version control impractical.
