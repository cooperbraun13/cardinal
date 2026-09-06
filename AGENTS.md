# Cardinal — Agent Engineering Guide

Cardinal is a personal-finance application currently focused on credit-card tracking, rewards optimization, benefits, transactions, and utilization.

This file defines **how agents should work in this repository**.

For detailed product and technical context, read the relevant documentation in `/docs` before making significant changes.

## Read Before Changing Code

Relevant documentation:

- `docs/PRODUCT.md` — product requirements, scope, roadmap
- `docs/ARCHITECTURE.md` — system architecture and code boundaries
- `docs/DATA_MODEL.md` — database entities and relationships
- `docs/DESIGN.md` — visual system, reusable UI, layout guidance
- `docs/TESTING.md` — testing standards and debugging exercises

Do not assume documentation is correct if the actual code clearly differs. Investigate the implementation and call out discrepancies.

---

# Core Working Rules

Before making meaningful changes:

1. Understand the requirement.
2. Inspect the existing implementation.
3. Trace the relevant execution/data flow.
4. Identify existing patterns that should be reused.
5. Form an implementation plan.
6. Then modify code.

Do not immediately rewrite code after seeing a bug or feature request.

Prefer the **smallest cohesive change** that fully solves the problem.

Do not perform unrelated refactors unless they are necessary for correctness.

Do not introduce abstractions, services, factories, patterns, or dependencies without a concrete reason.

Prefer composition and simple functions/modules over unnecessary inheritance or framework-like abstractions.

Follow existing conventions unless there is a clear reason to improve them.

---

# Current Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- SQLite locally, with schemas kept reasonably PostgreSQL-compatible
- Session-cookie authentication

Do not introduce major technologies or architectural changes without explicit justification.

---

# Architecture

Maintain clear responsibility boundaries.

Preferred request flow:

Frontend / UI
↓
Route Handler / API
↓
Service / Business Logic
↓
Repository / Prisma
↓
Database

## UI

UI components are responsible for:

- rendering
- user interaction
- local presentation state

Avoid putting substantial business logic in React components or pages.

## Route Handlers

Route handlers are responsible for:

- authentication
- request parsing
- validation
- calling application services
- mapping results to HTTP responses

Keep route handlers thin.

## Services

Services contain:

- financial/business rules
- application behavior
- orchestration
- calculations

Examples include:

- reward calculation
- utilization
- signup bonus eligibility
- card recommendation
- benefit status

Business rules should be testable independently of the UI.

## Data Access

Database access belongs in the server/data layer.

Do not:

- access Prisma from client components
- trust IDs/user IDs supplied by clients for authorization
- spread complex database queries throughout unrelated code

Reuse existing data-access patterns.

---

# Financial Data Rules

Treat financial calculations carefully.

- Never silently lose precision.
- Avoid floating-point arithmetic for stored monetary values when precision matters.
- Prefer integer minor units (such as cents) or appropriate decimal types for money.
- Clearly distinguish money, percentages, multipliers, and reward points.
- Handle zero credit limits safely.
- Handle refunds and reversals explicitly.
- Consider transaction status when calculating balances, rewards, and bonuses.
- Be deliberate about date and timezone behavior.

Do not change calculation semantics without corresponding tests.

---

# Authentication and Authorization

All personal financial data is private to its owner.

Every server-side resource lookup must enforce ownership.

Never trust:

- `userId`
- ownership information
- card ownership
- transaction ownership

from client input alone.

Derive the authenticated user from the server-side session.

Changing a URL or request ID must never allow one user to access another user's:

- cards
- transactions
- benefits
- rewards
- bonuses
- statement periods
- other financial records

Add authorization regression tests when modifying protected resource flows.

---

# Validation and Errors

Validate on:

- frontend for user experience
- backend for correctness and security

Backend validation is authoritative.

Use consistent API errors.

Do not expose:

- raw Prisma errors
- SQL/database internals
- secrets
- stack traces
- sensitive user data

Use appropriate HTTP status codes.

---

# Database

When changing data access:

- avoid N+1 query patterns
- paginate potentially large collections
- use database aggregation when appropriate
- consider indexes for common lookup/filter paths
- preserve foreign-key/data-integrity guarantees
- consider transaction boundaries for multi-step writes

Do not add indexes blindly. Add them for actual query patterns.

Do not introduce sharding, event systems, caches, or distributed infrastructure without requirements that justify them.

---

# Clean Code

Optimize primarily for:

1. correctness
2. clarity
3. maintainability
4. testability
5. performance where it matters

Use meaningful names.

Functions/modules should have cohesive responsibilities.

Comments should normally explain **why**, constraints, or non-obvious behavior rather than narrating obvious code.

Avoid:

- premature abstractions
- giant multipurpose functions
- deep nesting where simpler control flow works
- boolean-flag-heavy generic APIs
- duplicated business rules
- unnecessary design patterns
- speculative architecture

Follow DRY when duplication represents the **same concept**, not merely similar-looking code.

Follow YAGNI: do not build hypothetical future systems without a current requirement or clear architectural need.

---

# Testing

Every meaningful business rule should be testable independently.

Prioritize tests for:

- utilization
- reward calculation
- reward-rule precedence
- signup bonus eligibility
- refunds/reversals
- card recommendation
- benefit expiration
- authentication
- authorization
- data integrity

Every bug fix should include a regression test when practical.

Do not:

- weaken assertions just to make tests pass
- delete failing tests without understanding them
- mock away the behavior being tested
- change expected behavior merely to match the implementation

When a test fails:

1. reproduce
2. trace
3. isolate
4. form a hypothesis
5. verify the hypothesis
6. fix the root cause
7. rerun targeted tests
8. run broader affected tests

---

# Verification

Before considering a meaningful change complete, run the project's applicable:

- formatter
- lint
- TypeScript typecheck
- unit tests
- integration tests
- production build

Do not claim verification succeeded unless the commands were actually run successfully.

If verification cannot be run, clearly state why.

---

# Review

After meaningful implementation work, review the final diff.

Look specifically for:

- missing requirements
- incorrect calculations
- authorization failures
- data-integrity problems
- race conditions / duplicate actions
- edge cases
- weak tests
- unintended changes
- unnecessary complexity

Passing tests does not prove the implementation is correct.

---

# Git

- Work on feature/fix branches.
- Never intentionally push directly to `main`.
- Keep commits focused.
- Do not commit `.env` files, credentials, tokens, API keys, or secrets.
- Do not discard unrelated user changes.
- Inspect the final diff before committing.

Commit messages should describe the behavior changed, for example:

`fix: exclude refunded purchases from signup bonus progress`

rather than:

`changes`

---

# Definition of Done

A change is complete when:

- the requirement is satisfied
- the implementation follows repository architecture
- authorization and validation are correct
- relevant tests exist
- applicable tests pass
- typechecking passes
- lint passes
- the build succeeds
- the final diff contains no unintended changes
- meaningful review findings are resolved

---

# Agent Decision Rule

When choosing between:

- a simple solution that fits the current architecture
- a more generic solution designed for hypothetical future requirements

prefer the simple solution unless the more general abstraction solves a concrete current problem.

When unsure about existing behavior, **investigate before guessing**.
