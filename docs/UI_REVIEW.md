# Cardinal UI redesign review

## Status

This document records the v1 interface review. The current visual source of truth is [DESIGN.md](DESIGN.md), which describes Cardinal’s implemented tokens, components, accessibility expectations, and v2 navigation patterns. The earlier external automotive reference has been removed from product guidance.

The 4/8/16/24/32/48/64/96/128px spacing ladder is centralized in `globals.css`. Tailwind utilities use a `design-` prefix to avoid collisions with container widths such as `max-w-xl`. Small running text uses the readable muted token; validation text uses a lighter red for contrast. Card theme selections retain muted material finishes.

## Page and component coverage

| Area           | Implementation and checks                                                                                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation     | 64px horizontal navigation, active red underline, account menu, mobile hamburger dialog with focus containment, Escape and route-selection dismissal; legacy sidebar and bottom navigation removed |
| Overview       | Full-bleed photographic hero, large financial summary, wallet, payment dates, spending, recommendations, activity, benefits and bonus progress                                                     |
| Cards          | Editorial heading, shared responsive grid (one/two/three columns), issuer/category filters, sorting, no-match clearing                                                                             |
| Card details   | Account summary, reward rules, recent activity, benefits, welcome offers and edit/delete dialogs                                                                                                   |
| Transactions   | Responsive labeled filters, search, pagination, purchases/refunds, pending labels, deletion and empty results                                                                                      |
| Benefits       | Summary band, responsive benefit grid, progress, usage logging/reset and past/used states                                                                                                          |
| Optimizer      | Purchase form, initial state, disabled/loading button, ranked results, alternatives, errors and empty-wallet state                                                                                 |
| Authentication | Photographic layout on desktop and mobile, login/registration, validation, submission and logout                                                                                                   |
| Shared UI      | Sharp 48px buttons, 4px input corners, restrained 12px dialogs, uppercase actions, visible focus, reduced motion, loading skeletons, safe errors/retry and not-found pages                         |

## Verification

- Reviewed all six authenticated page types at 1440, 768, 390 and 320px, plus authentication and dialogs. No document-level horizontal overflow.
- Inspected desktop and mobile screenshots. Visual review caught and resolved a spacing-token collision that squeezed descriptions and desktop dialogs; browser checks now explicitly verify those widths.
- Automated axe WCAG 2 A/AA and 2.1 AA checks reported zero violations on audited pages, authentication, mobile navigation and forms after opening animations completed.
- Checked keyboard focus, dialog containment, Escape, menu navigation, hover, reduced motion, disabled controls, recommendation loading/errors, filter clearing, empty pages and missing-card navigation.
- Exercised registration, card create/edit/delete, reward rules, bonuses, benefits, purchases, refunds, benefit usage/reset, transaction removal and logout against an isolated SQLite snapshot. Failed submissions preserved entered values.
- Simulated a page database failure on that snapshot, confirmed the generic error screen, restored the fixture and verified retry recovered. The final attempt to capture the streaming page skeleton timed out because the transient state was not observed; its presentation was reviewed in code. Controlled optimizer loading and disabled states passed.
- Prettier check, ESLint, explicit `tsc --noEmit`, all 74 Vitest tests (including persistence integration tests), and the production build passed.

Browser checks used isolated headless Microsoft Edge (Chromium), with mobile viewport emulation. Physical devices, Safari and a manual screen-reader audit were not covered. Temporary browser tooling remains outside the repository; application dependencies were not changed.

## Hero asset

Displayed asset: `public/cardinal-cinema-hd.png`.

The hero is an optional visual treatment for the existing credit overview. It should not be copied onto every future finance surface; the v2 foundation favors simple reading and action-oriented layouts where they better support comprehension.

## Scope

The reviewed changes were confined to presentation, shared UI and client interaction states. API routes, service calculations, authentication implementation, Prisma schema and database behavior were unchanged. Mutation checks used a separate database snapshot.
