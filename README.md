# Cardinal

Cardinal is a dark-first credit card dashboard for tracking balances, utilization, transactions,
rewards, benefits, signup bonuses, and the best card to use for a purchase.

## Stack

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- Prisma with SQLite for local development
- Cookie-based email/password authentication
- Vitest for service-level business logic

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` if a local environment file is not present.

3. Apply the database migration and seed the demo account:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

The seeded demo login is:

- Email: `demo@cardinal.app`
- Password: `demo1234`

## Quality checks

```bash
npm run lint
npm test
npm run build
```

## Application structure

- `src/app/(app)`: authenticated product routes
- `src/app/(auth)`: login and registration
- `src/app/api`: authenticated API route handlers
- `src/components`: shared product UI and form dialogs
- `src/services`: dashboard aggregation and reward business logic
- `src/lib`: authentication, validation, formatting, and database helpers
- `prisma`: schema, migrations, local database, and demo seed

The dashboard uses a single aggregated service call. Resource ownership is enforced in backend
queries, and transaction balance/reward effects are committed atomically.
