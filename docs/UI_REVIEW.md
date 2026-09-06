# Cardinal UI redesign review

## Design implemented

The saved `docs/DESIGN.md` (Ferrari-design-analysis) is the visual source of truth. Cardinal now uses its near-black `#181818` canvas, white display type, restrained Rosso Corsa `#da291c` primary actions, cinematic photography, sharp component edges, and generous editorial spacing. Inter is the documented substitute for the unavailable licensed FerrariSans font; headings use weight 500 and body copy uses 400.

The 4/8/16/24/32/48/64/96/128px spacing ladder is centralized in `globals.css`. Tailwind utilities use a `design-` prefix to avoid collisions with container widths such as `max-w-xl`. Small running text uses the readable body-gray token; validation text uses a lighter red for contrast. Card theme selections retain muted material finishes.

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

Saved asset: `public/cardinal-cinema.webp` (about 90 KB). Mode: new generation with the built-in image tool; optimized to WebP for delivery.

Prompt: A photoreal, cinematic wide landscape studio photograph for Cardinal, adapting luxury automotive editorial art direction to personal finance. One unbranded matte graphite titanium credit card, engraved metallic EMV chip, dramatic diagonal on a dark architectural slab, tactile brushed-metal grooves and restrained racing-red edge reflections. Near-black background, low-key lighting, dark negative space on the left for white headlines. No text, numbers, logos, watermarks, UI, charts, coins, people, or competing blue/purple accents.

## Scope

Changes are confined to presentation, shared UI and client interaction states. API routes, service calculations, authentication implementation, Prisma schema and database behavior are unchanged. Mutation checks used a separate database snapshot. The user's saved design document and designer-agent instructions were preserved.
