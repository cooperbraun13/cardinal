# Data model

The Prisma schema is the source of truth: [`prisma/schema.prisma`](../prisma/schema.prisma). SQLite is used locally; all IDs are CUID strings.

## Relationships

```text
User
├── Session
├── FinancialProfile
├── Card
│   ├── RewardCategory
│   ├── Benefit
│   ├── SignupBonus
│   ├── StatementPeriod
│   ├── Transaction
│   └── Reward
└── Transaction
    └── Reward
```

`Transaction` belongs to both its owner (`User`) and the charged `Card`. `Reward` also records both its source transaction and card.

## FinancialProfile

`FinancialProfile` is an optional one-to-one record owned by `User`. The first version stores only optional ranges and simple context: employment status, income and savings ranges, emergency-fund and debt status, employer retirement-plan/match availability, investing experience, and risk comfort. An all-empty update removes the record instead of representing unanswered fields as zero values.

The profile does not store account credentials, exact balances, employer identity, investment holdings, or inferred information from a user's cards. Each field is nullable because a missing answer is distinct from a negative answer. The `profileVersion` field supports deliberate future changes to the question set. Goals and profile-answer history have not been added yet; see [Cardinal v2 foundation](CARDINAL_V2.md#financial-profile-direction) for the privacy constraints and future direction.

## Models

### User

Owns cards, transactions, sessions, and an optional financial profile. `email` is unique; `passwordHash` is never returned to the client. Deleting a user cascades to its related records through the schema's foreign keys.

### Session

Stores a unique random token, owner, expiry, and creation time. It has an index on `userId` and is the server-side source of authentication.

### FinancialProfile

Stores optional, owner-scoped context for future transparent education and Plan rules. `userId` is unique and cascades on user deletion. The profile API derives the user from the session; it never accepts an owner ID from the client.

### Card

The owner-scoped credit-card record: identity fields, optional network/last four/open date, credit limit, current balance, annual fee, statement/due day, theme, and active flag. It owns reward categories, benefits, bonuses, transactions, rewards, and statement periods. `userId` is indexed.

### RewardCategory

Defines a card's reward rule: category, multiplier, optional active window, optional spending cap, and notes. Rules cascade with the card and have a `cardId` index. Rule selection chooses the highest active matching category or `everything` rule, skipping exhausted caps; otherwise the base rate is 1x.

### Benefit

Tracks a card-linked credit or perk: type, total and used value, reset frequency, start date, optional expiration date, and active flag. It cascades with its card and indexes `cardId`. Status and effective expiry are computed in the benefits service, not stored.

### SignupBonus

Stores a card-linked spend requirement, reward amount/type, deadline, and manual completion flag. Eligible spend and progress are calculated from transactions at read time; there is no persisted `currentEligibleSpend` field. It cascades with the card and indexes `cardId`.

### Transaction

Stores the user and card owner references, merchant, positive amount, category, date, pending/posted status, refund flag, optional external ID, and creation time. It cascades with both owner and card; reward records cascade with it. The `(cardId, externalId)` pair is unique for future imports, while nullable external IDs remain allowed. `userId`, `cardId`, `transactionDate`, and `category` are indexed.

### Reward

Records the multiplier, calculated reward amount/type, source transaction, card, and creation time. It cascades with transaction and card; `cardId` and `transactionId` are indexed.

### StatementPeriod

Represents a card statement's start/end dates, balance, optional minimum payment, due date, and paid status. It cascades with its card and indexes `cardId`. The model is not currently exposed through UI or API routes.

## Ownership and integrity

Financial records are private to the authenticated `User`. Route handlers obtain the user from the server session and use ownership-scoped lookups for cards, transactions, and benefits. Cross-user resources return 404 so their existence is not disclosed.

Transaction create/update/delete services use Prisma transactions to keep the transaction record, reward, and card balance consistent. Reward-rule writes reconcile affected reward snapshots in the same transaction. Treat changes to transaction status, refund state, amount, category, date, or reward rules as changes to downstream balance/reward behavior.

## Financial and date rules

- **Money:** the current MVP stores monetary values as Prisma `Float` fields. Services round selected calculated values to two decimals. This does not meet the preferred integer-minor-unit/decimal guidance in `AGENTS.md`; preserve behavior carefully and plan any representation migration explicitly.
- **Utilization:** `balance / creditLimit * 100`; zero or invalid limits return 0.
- **Multipliers:** points/miles use units per dollar. Cashback is stored from `amount * rate` and interpreted as percentage-units for display/value conversion (for example, 2% on $100 stores 200 and displays as $2). Optimizer responses calculate cashback estimates directly in dollars.
- **Refunds and status:** transaction amounts are positive; `isRefund` determines the negative balance/reward effect. Signup-bonus spend includes only posted transactions and subtracts refunds. Pending transactions do not count toward bonus progress.
- **Dates:** database fields are `DateTime`. Financial calendar days and inclusive validity windows are normalized to UTC; session expiry remains an exact timestamp.

For calculation behavior and coverage, see [Testing](TESTING.md).
