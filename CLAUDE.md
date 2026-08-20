# CardPilot — Credit Card Tracker & Rewards Optimizer

A polished full-stack web app for tracking credit cards: balances, utilization, statement/due dates, rewards, benefits, signup bonuses, transactions, and best-card-for-a-purchase recommendations. Should feel like a premium personal-finance product, not a CRUD dashboard — prioritize clean architecture, strong UX, reusable components, and realistic business logic.

## Stack (decided)

- **App**: Next.js (App Router) + TypeScript, single app with API route handlers
- **UI**: Tailwind CSS, shadcn/ui, Framer Motion (subtle), Recharts, Lucide icons
- **Data**: Prisma ORM + SQLite locally (schema kept Postgres-compatible for later)
- **Auth**: email/password with hashed passwords + session cookies

## Visual Direction

Premium modern finance aesthetic: dark-first; charcoal/near-black background; off-white text with muted secondary text; minimal accent colors; large border radii; soft shadows; subtle glassmorphism where appropriate; strong spacing/hierarchy; smooth hover/transition states; no visual clutter.

Principles: cards are the visual centerpiece; dashboard useful at a glance; charts simple and readable; prefer progress bars/badges/small indicators over giant tables; feel responsive and alive without excessive animation.

## `CreditCardTile` Component

Reusable card visual rendered in pure CSS (no official card images) so the UI stays consistent.

- **Shows**: card name, issuer, optional network (Visa/MC/Amex), `•••• 1234`, balance, credit limit, utilization %, due date, statement close date, top reward categories
- **Treatment**: real-card proportions, per-card gradient/theme (customizable per issuer/card), small chip graphic, soft shadow, hover lift, selected state, smooth transitions

## Pages

1. **Dashboard `/dashboard`** — total limit, total balance, overall utilization, rewards this month, upcoming due dates, expiring benefits, signup bonus progress, best-card widget, spending-by-category chart, horizontal card carousel
2. **Cards `/cards`** — grid/carousel of all cards; add/edit; filter by issuer and reward type; sort by utilization, due date, annual fee, etc.
3. **Card Details `/cards/:id`** — large card visual, balance, limit, utilization, statement/due dates, annual fee, recent transactions, reward categories, benefits, signup bonus status, reward history, utilization history
4. **Benefits `/benefits`** — dining/travel/streaming/hotel/airline credits, free-night certificates, lounge passes; show used/remaining amounts, reset frequency, expiration, status badge
5. **Optimizer `/optimizer`** — input category + amount (+ optional merchant) → recommended card, multiplier, estimated rewards, top-3 alternatives, short explanation of why it wins
6. **Transactions `/transactions`** — manual entry, search, category/card/date-range filters, refund flag, pending/posted status. *Later*: CSV import, duplicate detection

## Data Model

- **users**: id, name, email, password_hash, created_at
- **cards**: id, user_id, name, issuer, network, last_four, credit_limit, current_balance, annual_fee, statement_day, due_day, opened_at, card_theme, active, created_at, updated_at
- **reward_categories**: id, card_id, category, multiplier, start_date?, end_date?, spending_cap?, notes?
- **benefits**: id, card_id, name, description, benefit_type, total_value, used_value, reset_frequency, start_date, expiration_date?, active
- **signup_bonuses**: id, card_id, spend_requirement, current_eligible_spend, reward_amount, reward_type, deadline, completed
- **transactions**: id, user_id, card_id, merchant, amount, category, transaction_date, status, is_refund, external_id?, created_at
- **rewards**: id, transaction_id, card_id, multiplier, reward_amount, reward_type, created_at
- **statement_periods**: id, card_id, start_date, end_date, statement_balance, minimum_payment?, due_date, paid

## Business Logic

- **Utilization**: per-card `balance / limit * 100`; overall `sum(balances) / sum(limits) * 100`. Handle zero limits safely.
- **Signup bonus progress**: count only eligible *posted* purchases — exclude refunds, reversals, and transactions outside the bonus window.
- **Rewards calculation**: apply card reward rules by purchase category, respecting active date ranges, spending caps, and promotional multipliers.
- **Best-card recommendation**: for each active card, determine applicable multiplier → check promo active dates → check spending cap → estimate rewards → rank; return winner + alternatives. Keep this in a backend service layer, not frontend-only.

## API

```http
GET/POST        /api/cards           GET/PATCH/DELETE /api/cards/:id
GET/POST        /api/transactions    PATCH/DELETE     /api/transactions/:id
GET             /api/benefits        POST             /api/cards/:id/benefits
PATCH           /api/benefits/:id
POST            /api/recommend-card
GET             /api/dashboard       (single aggregated payload — avoid many frontend requests)
```

Optimizer contract example: request `{ "category": "dining", "amount": 120 }` → response `{ "recommendedCard": "Card A", "rewardRate": 3, "estimatedRewards": 360, "alternatives": [] }`.

## Engineering Standards

- **Frontend state**: loading/empty/error states everywhere; optimistic updates only where safe; refetch/sync after mutations; disable submit buttons while in flight. Keep logic in reusable components/services, not page components.
- **Validation** (frontend for UX *and* backend for correctness/security): positive credit limits, valid numeric balances/amounts, last-four exactly 4 digits if provided, valid due/statement days, valid bonus deadlines.
- **Authorization**: users can only access their own cards/transactions/benefits/bonuses/statements. Never trust user IDs from the client; every resource lookup enforces ownership server-side (return 404 or 403 consistently). Prevent: changing `/cards/123` → `/cards/124` to view another user's card.
- **Errors**: consistent JSON shape `{ "error": "CARD_NOT_FOUND", "message": "..." }`; sensible status codes (200/201/204/400/401/403/404/409/500); never expose raw DB errors.
- **Performance**: indexes on cards.user_id; transactions.user_id/card_id/transaction_date/category; benefits.card_id; reward_categories.card_id. Avoid N+1 queries; paginate large transaction histories; use aggregates for dashboard instead of fetching full records.

## Testing

- **Unit**: utilization, reward multiplier selection, signup-bonus eligible spend, best-card recommendation, benefit expiration
- **Integration**: card creation, transaction add, benefit update, dashboard metrics, authorization boundaries
- **Regression**: every bug fix adds a test covering the original failure

## Git Workflow

Branch per feature/bug from up-to-date `main` (`feature/card-optimizer`, `fix/signup-refunds`); focused commits with descriptive messages (e.g. "Exclude refunded purchases from signup bonus progress"). PRs describe: what changed, why, how tested, tradeoffs.

## Development Phases

1. **Foundation** — project/DB setup, basic auth, cards CRUD, responsive layout, `CreditCardTile`
2. **Transactions** — CRUD, categories, filters, balances, utilization
3. **Rewards** — reward categories, calculation service, history, charts
4. **Benefits & Bonuses** — trackers, progress bars, expiration states
5. **Optimizer** — inputs, recommendation service, top-3 comparison, explanations
6. **Polish** — animations, skeletons, empty states, mobile, accessibility, error handling
7. **Hardening** — unit/integration tests, authz review, query optimization, indexes, bug-ticket exercises

## Suggested Reusable Components

`CreditCardTile`, `StatCard`, `UtilizationBar`, `BenefitProgress`, `SignupBonusProgress`, `RewardBadge`, `TransactionTable`, `TransactionRow`, `CardCarousel`, `BestCardWidget`, `DueDateTimeline`, `SpendingCategoryChart`, `EmptyState`, `LoadingSkeleton`, `ErrorBanner`

## Dashboard Layout

Header (app name, nav, Add Card, user menu) → horizontal card carousel → 4 stat cards (Total Balance, Total Available Credit, Overall Utilization, Rewards This Month) → main content (left: category chart + recent transactions; right: best-card widget + upcoming due dates + expiring benefits) → lower section (signup bonus progress, benefits summary, utilization history).

## Practice Tickets (post-V1 exercises — intentional debugging drills)

1. $5,000 limit / $1,000 balance shows 25% utilization — fix calc + regression test
2. Dining earns 1x despite an active 3x rule — trace frontend → API → service → rules → result
3. Refunds still count toward signup bonus — fix logic + tests
4. Importing the same file twice duplicates transactions — external IDs, unique constraints, idempotency
5. Category change doesn't update dashboard rewards until refresh — frontend state sync
6. User can view another user's card via URL ID — backend authorization
7. Dashboard runs dozens of queries for five cards — N+1, redesign fetching
8. Benefit disappears hours early in some time zones — date storage/TZ conversion
9. Optimizer picks 3x grocery card over an active temporary 5x promo — rule precedence + date ranges
10. Rapid double-submit duplicates a manual transaction — disable button, idempotency, DB constraints
11. Deleting a card orphans benefits/reward rules — foreign keys, cascades
12. Dashboard degrades at 500k transactions — indexes, pagination, aggregation, query plans, precomputed summaries

Debugging process: Understand → Reproduce → Trace → Isolate → Hypothesize → Verify → Fix → Test → Ship. Don't rewrite code on sight of a bug — gather evidence and isolate the failing layer first.

## Scope Guardrails (V1)

No bank connections, Plaid, real payments, card application links, credit score features, or complex AI features. Manual data entry first — spend the time on architecture and engineering reasoning. Integrations come after the core is solid.

## Definition of Done — V1

A user can: (1) create an account and log in, (2) add multiple cards, (3) view polished card visuals, (4) record balances/limits, (5) see utilization, (6) add transactions, (7) view transaction history, (8) configure reward categories, (9) track benefits, (10) track signup bonus progress, (11) ask which card is best for a purchase, (12) view a polished dashboard, (13) use it comfortably on desktop and mobile, (14) get useful validation/error feedback, (15) only access their own data. Core business logic has unit + integration tests.

## Product Quality Bar

The project should demonstrate: React state and component architecture, API/HTTP design, authn/authz, backend service layers, validation, SQL (joins, aggregations, FKs, indexes, transactions), error handling, testing, git workflow, performance reasoning, security fundamentals, and full-stack debugging.
