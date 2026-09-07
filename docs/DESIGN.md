# Cardinal design system

## Purpose

Cardinal helps people understand personal finance without making the product feel clinical, dense, or intimidating. The interface should feel calm, direct, and considered. It should put the next useful decision ahead of visual novelty.

This document describes the design system currently implemented in the application. `src/app/globals.css` is the executable source for tokens and responsive values; shared components are the source for interaction details. When this document and implementation differ, update the document or make an intentional implementation change rather than assuming either is correct.

## Principles

- **Make the next step obvious.** A page should foreground the most useful action or decision, particularly for people who are new to the subject.
- **Explain before asking.** Labels, empty states, and supporting copy should define a concept in plain language before asking someone to supply financial information.
- **Use hierarchy, not decoration.** Typography, spacing, and borders organize information. Red is reserved for primary actions and time-sensitive emphasis.
- **Keep financial information legible.** Amounts, dates, rates, and progress must be easy to scan and should use tabular numerals where appropriate.
- **Preserve calm.** Avoid dashboards full of competing colors, promotional treatments, or dense card grids. Empty space is useful when it clarifies a decision.

## Foundations

### Typography

Cardinal uses Inter, loaded in `src/app/layout.tsx`, for interface and display text. Use the existing roles instead of introducing a separate display family.

| Role           | Current implementation                            | Intended use                                 |
| -------------- | ------------------------------------------------- | -------------------------------------------- |
| Page title     | `.page-title`; 32px small screens, 56px from `sm` | A page’s main question or purpose            |
| Section title  | `.section-title`; 26px, 36px from `lg`            | Major content sections                       |
| Display number | `.display-number`; 48px to 80px                   | One important financial value                |
| Body           | 14px with 1.5–1.75 line height                    | Explanations and supporting information      |
| Eyebrow        | `.eyebrow`; 11px uppercase with tracking          | Short category labels, never primary content |
| Action         | `.text-link` and `Button`; uppercase, tracked     | Clear, concise calls to action               |

Use sentence case for headings and labels. A title may be editorial, but should still say what a person can do or understand. Do not use all caps for paragraphs, financial values, or long headings.

### Color

The current product is dark by default. These values come from `src/app/globals.css`.

| Token                    | Value                 | Use                                             |
| ------------------------ | --------------------- | ----------------------------------------------- |
| Background               | `#181818`             | Application canvas                              |
| Foreground               | `#ffffff`             | Primary text and high-emphasis borders          |
| Card / secondary / muted | `#303030`             | Panels, quiet fills, hover surfaces             |
| Popover                  | `#242424`             | Menus and dialogs                               |
| Muted foreground         | `#969696`             | Supporting copy and secondary labels            |
| Border                   | `#303030`             | Structure between related content               |
| Primary                  | `#da291c`             | Primary actions and active navigation indicator |
| Primary hover / active   | `#9d2211` / `#b01e0a` | Interactive states only                         |
| Destructive              | `#ff8b81`             | Errors and destructive controls                 |

Do not introduce a new semantic color just to distinguish cards or lesson categories. Credit-card themes use restrained neutral material finishes so they do not compete with the product hierarchy. Do not rely on color alone for status; pair it with clear text, icons, or a visible label.

### Spacing and layout

The spacing ladder is 4, 8, 16, 24, 32, 48, 64, 96, and 128px. It is exposed as Tailwind `design-*` spacing utilities, such as `gap-design-sm` and `mt-design-lg`.

- `.page-shell` keeps standard pages within a 1280px content width and supplies responsive horizontal and vertical padding.
- `.page-stack` provides the default vertical rhythm between major page sections.
- Use `panel` for a bordered surface and `panel panel-body` when it needs standard inner padding.
- Use `section-divider` or a simple border to separate major sections. Avoid nesting panels solely to create visual weight.
- Prefer one or two columns at small sizes. Existing responsive grids expand at `md` or `lg` after content has room to breathe.

## Components and patterns

### Navigation

The primary nav has six product sections: Home, Money, Invest, Learn, Plan, and Profile. It is the product’s stable top-level structure. Credit-specific routes appear under Money and keep Money active so people understand where the existing tools belong.

Do not add every feature to primary navigation. Use contextual links within Money, Learn, or Plan instead. The mobile navigation is a dialog; preserve its accessible trigger, focus behavior, and route-selection dismissal.

### Headers and content sections

Use `PageHeader` for standard pages. It supports an optional eyebrow, title, description, and actions. Use `SectionHeader` inside a page when a section needs a title, explanation, or a link to a fuller view.

The Home page may use a more editorial welcome, and the existing credit overview may use `CinematicHero`. A cinematic image is an optional existing product treatment, not a requirement for every page or future domain. Learn, Plan, Profile, and calculators should favor simple reading layouts unless imagery materially improves comprehension.

### Actions and links

Use the shared `Button` component for primary actions, form submits, destructive actions, and dialogs. The default button is the only filled red action in a local group. Use `outline`, `secondary`, `ghost`, or a `text-link` for lower-priority actions.

`text-link` is an uppercase, tracked inline action with a 48px minimum target. Keep labels action-oriented: “Review your cards,” “Read lesson,” or “Open Money.” Avoid vague labels such as “Learn more” when the destination can be named.

### Forms, feedback, and empty states

Forms use `Field`, the shared input primitives, Zod-backed client validation, and authoritative server validation. Explain unfamiliar inputs next to the question. Do not display raw API or database errors.

Use `EmptyState` when there is no user data or a domain is intentionally not available yet. The copy should state what is available now and offer one meaningful action. Loading states use `skeleton`; respect the existing reduced-motion rule.

### Financial values

Use helpers from `src/lib/format.ts` for currency, dates, and numbers. Use `tabular-nums` for monetary values, percentages, rates, and dates that people compare vertically. A number without context is not enough: pair it with a label and, when useful, a short explanation of what affects it.

## Accessibility

- Preserve visible focus styles and at least 48px interactive targets where the current component provides them.
- Use semantic headings in order, labelled sections, and descriptive links.
- Do not use the muted text token for content that must meet body-text contrast requirements. The existing UI uses it for secondary copy; new critical instructions should use primary foreground text or a verified accessible color.
- Keep keyboard access, Escape-to-dismiss behavior, and focus containment when changing menus or dialogs.
- Respect `prefers-reduced-motion`; do not add looping or essential animation.
- Test at narrow widths before adding columns, fixed controls, or long financial labels.

## Adding a new v2 surface

1. Start with `PageHeader`, `page-shell`, and `page-stack`.
2. Reuse shared UI primitives and the established spacing tokens.
3. Use a focused empty or foundation state when data and workflows do not exist yet; do not fabricate financial progress or recommendations.
4. Keep a beginner’s next action visible and explain any financial term that is new on the page.
5. Verify keyboard behavior, loading/error states, and mobile layout before treating the surface as complete.

## Design review checklist

- Is the page’s main action apparent without reading every panel?
- Does copy explain a financial term before it expects action?
- Are values, rates, dates, and statuses labelled and easy to scan?
- Does the page reuse existing component and spacing patterns?
- Are red, borders, and panels serving hierarchy rather than decoration?
- Does the page work at a narrow viewport and with keyboard navigation?

## Recognizable section layouts

The shared type, color, spacing, and control system stays consistent; each section uses a structure suited to its task:

- **Home** is a welcome overview. A prominent next step comes from the existing Plan rules, followed by three compact section shortcuts. It does not invent progress or financial data.
- **Money** leads with actual active-card balances and utilization, followed by recent recorded activity and a compact tool directory. New users see a first-card action instead of fabricated figures. Data comes from the existing owner-scoped dashboard service.
- **Learn** is a reading library, with a topic index, a featured starting lesson, and grouped lesson rows. Topic links are ordinary anchors and remain usable without client JavaScript.
- **Plan** is a numbered timeline. The first suggestion receives emphasis; expandable reasoning preserves the rationale, source context, and all assumptions. Numbers describe order, not completion.
- **Invest** retains its educational entry points; **Profile** retains its account and optional-answer form layout.

Primary navigation combines section icons, a filled selected state, and an underline. Mobile headers show the current section when space permits; the navigation dialog retains selection and keyboard behavior. Money and its child routes also show a horizontally scrollable section navigation, including calculators. Child routes keep their parent section selected.

Use these differences in hierarchy and structure before introducing additional decorative images or section colors.
