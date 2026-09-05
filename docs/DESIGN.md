# Design

## Design philosophy

Cardinal should feel like a calm, polished consumer-finance product, not a generic CRUD or admin dashboard. Surface the next useful decision, give financial values hierarchy, and keep the interface quiet enough that users can scan it confidently.

## Visual direction

The current UI is dark-first: warm charcoal surfaces, off-white text, muted gray secondary copy, and a restrained cardinal-red accent. Shared tokens and layout primitives live in [`src/app/globals.css`](../src/app/globals.css). Panels use subtle borders and medium radii; tabular numerals are used for financial values.

Gradients are reserved for `CreditCardTile` card identities. The application UI itself should not accumulate decorative gradients, glows, or competing accent colors.

## Layout principles

- Use `page-shell`, `page-stack`, `PageHeader`, and `SectionHeader` to establish consistent spacing and hierarchy.
- Make balances, due dates, utilization, remaining benefit value, and recommendation outcomes quick to scan.
- Prefer responsive grids and horizontal card scrolling on small screens; card tiles become a grid at larger breakpoints.
- Use panels only for meaningful groups of information, not as nested decoration.

## Shared component patterns

Important existing reusable components include:

- `CreditCardTile`, `CardGrid`, and `CardsView` for card identity, card browsing, filtering, and sorting.
- `Metric`, `UtilizationBar`, `SpendingCategoryChart`, and `BestCardWidget` for dashboard decisions.
- `BenefitProgress` and `SignupBonusProgress` for time-bound value tracking.
- `TransactionTable` and `TransactionFilters` for transaction history.
- `PageHeader`, `SectionHeader`, `EmptyState`, `ErrorBanner`, form dialogs, and `ui/` primitives for consistent interaction.

Reuse these before creating visually similar one-off components. See [Architecture](ARCHITECTURE.md#repository-structure) for ownership of UI code.

## Financial data presentation

- Format monetary values with the shared format helpers and use tabular figures for comparisons.
- Pair utilization with a progress bar; it turns red at 30% or higher.
- Use badges and concise status labels for benefits, promotions, caps, refunds, and pending transactions.
- Explain optimizer recommendations with rate, estimated value, and a short rationale.
- Treat negative/exception states distinctly: refunds, expired benefits, validation errors, and empty results should not look like ordinary data.

## Interaction and accessibility

Interactive panels have restrained hover/focus treatment. Forms validate before submission, show an `ErrorBanner` for failures, disable their submit action while pending, and refresh server data after successful mutations. Empty states should explain what is missing and, when useful, offer the next action.

Keep keyboard focus visible, label inputs, expose progress semantics, use `aria-live` for recommendation results, and respect `prefers-reduced-motion`. Layouts must remain usable on a 20rem-wide viewport and scale progressively.

## Anti-patterns

- Generic AI-dashboard clutter, dense metric walls, and giant tables when a short list or chart is clearer.
- Cards inside cards without a real grouping purpose.
- Excessive animation, decorative gradients, glows, or attention-grabbing color.
- Inconsistent spacing, unlabeled values, or aesthetics that obscure a financial action.
- New visual patterns that duplicate an existing shared component.
