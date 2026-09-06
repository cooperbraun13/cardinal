# Architecture

Cardinal is a single Next.js application. See [Product](PRODUCT.md), [Data model](DATA_MODEL.md), [Testing](TESTING.md), and the [Cardinal v2 foundation](CARDINAL_V2.md) for the corresponding product, persistence, verification, and expansion guidance.

## High-level flow

```text
Browser
  ├─ Server-rendered page ──> session check ──> Prisma and/or service ──> SQLite
  └─ Client mutation ───────> Route handler ──> validation/ownership ──> service or Prisma ──> SQLite
```

`src/app/(app)` contains authenticated pages; `src/app/(auth)` contains login and registration. Client forms use `apiFetch`, then refresh the route after a successful mutation.

## Technology stack

- Next.js 16 App Router, React 19, and TypeScript.
- Tailwind CSS 4, shadcn-generated primitives backed by `@base-ui/react`, Lucide icons, and `tw-animate-css`.
- Prisma with SQLite locally (`prisma/schema.prisma`); the schema aims to stay portable where practical.
- Email/password authentication using `bcryptjs` and database-backed, HTTP-only session cookies.
- Zod for shared client/server validation and Vitest for service-level tests.

There are no external product integrations in the repository.

## Repository structure

```text
src/app/          routes, layouts, server pages, and API route handlers
src/components/   shared product UI, forms, and UI primitives
src/features/     feature-owned code; Learn is the first v2 feature module
src/services/     pure financial rules plus dashboard/transaction orchestration
src/lib/          auth, Prisma singleton, validation, ownership, formatting, client fetch helper
prisma/           schema, migration history, and deterministic demo seed
docs/             product and engineering context
.claude/agents/   review and debugging agent instructions
```

## Request flow and responsibilities

Route handlers in `src/app/api` use `handleApi` for consistent JSON errors, call `requireUser`, parse Zod input, and enforce ownership before mutations. Transaction routes delegate balance/reward effects to `src/services/transactions.ts`; reward-rule and signup-bonus writes have focused services as well. Recommendation and dashboard endpoints delegate to `src/services/data.ts`.

Pure rules live in `src/services/rewards.ts`, `bonuses.ts`, `benefits.ts`, and `recommend.ts`. Keep calculations there so they can be tested without React or Prisma. `src/services/data.ts` assembles dashboard and optimizer data efficiently; write services own multi-record transaction boundaries. The financial-profile API is the first v2 domain API: `src/app/api/profile` authenticates and validates requests, then delegates profile persistence to `src/features/profile/service.ts`. The initial Cardinal Plan rules are pure functions in `src/features/plan/rules.ts`; its page reads the authenticated user's profile server-side.

`src/lib/db.ts` owns the server Prisma singleton. `src/lib/ownership.ts` scopes card, transaction, and benefit lookups to the authenticated user and returns 404 for non-owned resources. Client components must not access Prisma.

### Current implementation note

The intended boundary is UI → route handler → service → Prisma. Today, several server-rendered pages also query Prisma directly for their page data (`cards`, `card details`, `benefits`, and `transactions`). This is server-side and ownership-scoped, but it bypasses the service layer. Preserve the existing pattern unless a change has a concrete reason to consolidate it; do not describe it as if every page already uses a repository layer.

## Authentication and authorization

`src/lib/auth.ts` hashes passwords with bcrypt, creates a random 30-day session token, stores it in `Session`, and places it in an HTTP-only, same-site cookie. The server derives the current user from that cookie.

Every financial-resource lookup must enforce ownership on the server. Never trust a client-provided user ID, card ownership claim, or resource ID alone. See [Data model](DATA_MODEL.md#ownership-and-integrity).

## Errors and validation

Frontend forms reuse Zod schemas for immediate feedback; route handlers validate again authoritatively. API failures use `{ "error": "CODE", "message": "..." }`. Expected domain and validation errors become 4xx responses; unknown errors are logged server-side and returned as a generic 500 response.

## Performance considerations

The schema indexes common ownership and filtering fields. The transactions API paginates at 25 records. Dashboard and optimizer data use aggregates, grouped queries, and batched card queries to avoid per-card lookup loops. When adding a large collection or dashboard metric, check query counts and use pagination or aggregation before adding infrastructure.

## Architecture rules

- Keep route handlers thin: authenticate, validate, authorize, delegate, and map HTTP responses.
- Keep financial rules out of React components and centralize them in testable services.
- Do not access Prisma from client components or trust ownership information from the client.
- Prefer existing server/page patterns over new layers or abstractions without a concrete need.
- Avoid N+1 queries, raw database errors, and distributed systems or integrations without requirements.
