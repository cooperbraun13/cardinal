# Product

## Product overview

Cardinal is a personal-finance application currently focused on making credit-card decisions understandable: balances, utilization, rewards, benefits, signup bonuses, and the best card for a purchase. It is evolving from a credit-card tracker and rewards optimizer toward a beginner-friendly personal-finance product, starting with a clear, focused credit-card experience.

## Current product scope

The implemented application supports:

- Account registration, login, logout, and private session-scoped data.
- Card creation, editing, removal, active status, issuer/network details, balance, limit, payment dates, annual fee, themes, and reward rules.
- A dashboard with card summaries, aggregate utilization, monthly spending/reward summaries, recent transactions, due dates, benefits, and signup-bonus progress.
- Manual transactions with category, date, pending/posted status, refund flag, search/filtering, and pagination. Creating or removing a transaction updates its card balance and reward record.
- Benefits with used/remaining value, reset frequency, status, and expiration handling.
- Signup-bonus progress computed from eligible posted spend in the card-opened-to-deadline window.
- An optimizer that ranks active cards by reward value for a category and amount, with alternatives and explanations. The optional merchant input is accepted but does not currently affect ranking.

`StatementPeriod` is stored in the database schema but has no user-facing page or API flow yet. See [Data model](DATA_MODEL.md#statementperiod).

## Product principles

- Be beginner-friendly: explain the decision, not just the number.
- Prefer useful, trustworthy financial information over feature density.
- Keep important numbers and time-sensitive actions easy to scan.
- Treat personal financial data as private and calculations as correctness-critical.
- Deliver a polished consumer-finance experience, not an administrative dashboard.

## Current version

The current version is a manual-entry credit-card product. Its core journey is: create an account, add cards and reward rules, record transactions, understand balances and benefits, and choose a card before spending.

## Future direction

Broader personal-finance expansion is a direction, not an implemented feature set. Keep future ideas separate from current behavior until product requirements, data design, and security constraints are defined.

## Scope guardrails

No external financial-provider integrations are implemented. Do not imply bank connections, payments, credit scoring, or automated account imports exist. Manual entry and accurate core calculations take precedence over expansion. See [Architecture](ARCHITECTURE.md#technology-stack).
