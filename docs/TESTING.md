# Testing

## Testing philosophy

Test financial behavior and user-visible guarantees, not implementation details. Rules should remain independently testable from React and Prisma. See [Architecture](ARCHITECTURE.md#request-flow-and-responsibilities).

## Current coverage

Vitest is configured for `src/**/*.test.ts`. The current suite covers pure services for:

- Utilization, overall utilization, reward-rule matching, active promotion precedence, spending caps, and reward math.
- Recommendation ranking and value comparison across points, miles, and cashback.
- Signup-bonus eligibility: posted-only spending, window boundaries, refunds, and progress.
- Benefit remaining value, reset periods, expiry, and status.
- Shared validation, UTC calendar boundaries, and cap-boundary splitting.

The persistence suite creates an isolated SQLite database under `.test-tmp`, applies the committed migration, and removes only that fixture directory afterward. It covers session behavior, ownership boundaries, route behavior, atomic transaction effects and rollback, reward reconciliation, benefit updates, signup-bonus upserts, and dashboard aggregation. The development database is never used by tests.

## Test priorities

- Unit-test utilization, reward precedence, promotion dates/caps, refunds, bonus eligibility, benefit expiration, and recommendation ranking.
- Add integration coverage for authentication, ownership boundaries, route contracts, transactional writes, and dashboard metrics.
- For every meaningful bug fix, add regression coverage reproducing the original failure when practical.

## Debugging process

```text
Understand → Reproduce → Trace → Isolate → Hypothesize → Verify → Fix → Test → Ship
```

Do not rewrite code on first sight of a failure. Confirm the failing layer and the hypothesis before applying the smallest root-cause fix.

## Commands

Available package scripts:

```bash
npm run lint        # ESLint
npm test            # Vitest, one run
npm run test:watch  # Vitest watch mode
npm run build       # production Next.js build
```

There is no `format`, `typecheck`, or integration-test script in `package.json` today. Do not claim those checks ran unless an explicit equivalent command was run. Database setup commands (`npm run db:migrate`, `npm run db:seed`) are not test commands.

## Practice scenarios

The existing tests and code comments preserve these debugging exercises: incorrect utilization, a matching reward rule being ignored, refunded purchases counting toward a signup bonus, and a temporary promotion losing to a lower permanent rate. Treat them as regression-sensitive business rules, not examples to weaken or remove.
