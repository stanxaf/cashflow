# Cashflow Planner V1: Build Plan

This plan implements the V1 spec in small, testable milestones. Each milestone should be complete and usable on its own before the next one begins.

## Build principles

- Build the forecast engine before building dashboard polish.
- Keep the app private, single-user, and manual-entry only.
- Use the selected default shadcn/ui preset. Do not build a custom design system first.
- Keep Plan as the unified event list. Do not add a separate Transactions page or chart.
- Do not start a later-scope feature while a current milestone has known correctness gaps.

## Milestone 0: Application baseline

### Goal

Convert the starter into the agreed Next.js and default shadcn/ui foundation.

### Work

- Install the chosen shadcn/ui preset and its default theme.
- Add Tailwind CSS, the standard `components/ui` structure, and shared utility helpers.
- Add basic app layout and responsive navigation: Today, Plan, Accounts, Settings.
- Add formatting helpers for PHP currency and date-only values.
- Add environment-variable validation and example environment file without secrets.
- Set up linting, formatting, and the test runner.

### Done when

- The app runs locally without console errors.
- The default shadcn components render correctly in light and dark mode if the preset supports both.
- Navigation works on phone and desktop widths.
- No data is yet persisted; placeholder content is acceptable.

## Milestone 1: Authentication and database foundation

### Goal

Make the app private and establish the schema without building feature UI first.

### Work

- Create the Supabase project and configure local environment variables.
- Add email sign-in and sign-out through Supabase Auth.
- Add Drizzle schema, migrations, and Row Level Security for `profiles`, `accounts`, `financial_events`, `recurrence_rules`, and `recurrence_exceptions`.
- Create profile records on first sign-in.
- Add a development-only seed script.

### Done when

- An authenticated user can reach the app; an anonymous user cannot reach app data.
- One user cannot read or mutate another user's records.
- Migrations can build a fresh database from zero.
- The seed scenario below can be loaded in development.

## Milestone 2: Accounts

### Goal

Allow a user to establish their financial starting point.

### Work

- Build the Accounts list and add-account form.
- Support cash, bank, e-wallet, and credit-card account types.
- Capture signed balance snapshots and balance-as-of dates.
- Edit and archive accounts.
- Prevent new events against archived accounts.

### Done when

- A user can create and edit two liquid accounts and one credit-card account.
- Liquid balances and credit-card amounts display in user-friendly language.
- The account model follows the sign convention in `docs/data-model.md`.
- The mobile layout remains usable.

## Milestone 3: Financial-event management

### Goal

Capture the data needed for a forecast.

### Work

- Build one shared event form for income, expense, and transfer.
- Add actual, scheduled, and planned state selection.
- Support a one-time date and optional recurrence.
- Add form validation, edit, soft delete, and event filters.
- Add skip-one-occurrence support in the data layer; the UI can initially be minimal.

### Done when

- A user can add an actual expense, scheduled salary, scheduled bill, planned expense, and transfer.
- Transfers create the correct two-account effect.
- Actual events cannot be dated in the future.
- Changes persist and survive refresh.

## Milestone 4: Forecast engine

### Goal

Produce a correct forward cashflow result independent of UI.

### Work

- Implement the pure TypeScript forecast function from `docs/data-model.md`.
- Generate recurring occurrences within a requested date range.
- Apply event states, archived accounts, soft deletes, transfers, and recurrence exceptions.
- Return daily running balances, end-date balance, and lowest cash position.
- Add unit-test fixtures for the required forecast tests.

### Done when

- All required forecast tests pass.
- A seed-data forecast exactly matches the expected amounts below.
- The engine has no database or React dependency.
- Changing an event input produces a predictable recalculated result.

## Milestone 5: Plan

### Goal

Make the forecast understandable and editable.

### Work

- Build the chronological Plan timeline from the forecast-engine result.
- Group entries by date and show an end-of-day running cash balance.
- Add date-range choices: 30 days, 3 months, 6 months, 1 year, and custom.
- Add account, event-type, and state filters.
- Add event creation and editing from Plan.
- Clearly distinguish actual, scheduled, and planned items.

### Done when

- The timeline answers the balance question for any selected future date.
- Adding, editing, or deleting an item immediately updates the displayed forecast.
- Planned items are included by default and can be hidden from the forecast.
- There is no chart and no separate Transactions page.

## Milestone 6: Today

### Goal

Give the user a calm, useful summary without duplicating the Plan screen.

### Work

- Show available cash, next income, next expense, and due amount in the next 30 days.
- Show lowest projected balance and its date.
- Add a future-date balance lookup.
- Show a short upcoming-events list with a link to Plan.
- Add empty states that direct a new user to add accounts and regular items.

### Done when

- The screen is entirely powered by the same account and forecast data as Plan.
- A user can tell whether a future cash problem is approaching without reading the full timeline.
- The screen stays simple: summary cards and a short list, not dashboard reporting.

## Milestone 7: Release readiness

### Goal

Make the personal app safe and pleasant to use daily.

### Work

- Review loading, error, empty, and confirmation states.
- Add confirmation for destructive actions and sensible undo where practical.
- Test phone-width layouts and keyboard use.
- Add database backups/export guidance and a manual data-export path if low effort.
- Configure Vercel production deployment and production environment variables.
- Run a final private-data and Row Level Security review.

### Done when

- The deployed app can be used privately from phone and desktop.
- Core flows have no known data-loss or calculation bugs.
- The V1 acceptance criteria in `docs/v1-spec.md` pass.

## First seed-data scenario

Use this deterministic scenario in development and in forecast tests.

### Account snapshots as of September 1, 2026

| Account | Type | Balance |
|---|---|---:|
| BPI | Bank | ₱200,000.00 |
| Maya | E-wallet | ₱20,000.00 |
| Cash | Cash | ₱5,000.00 |
| Credit card | Credit card | −₱12,000.00 |

Opening liquid cash position: **₱225,000.00**.

### Events

| Date | Title | Type and state | Amount | Expected liquid cash after date |
|---|---|---|---:|---:|
| Sep 3 | Coffee | Actual expense from Maya | ₱1,500.00 | ₱223,500.00 |
| Sep 5 | Rent | Scheduled expense from BPI | ₱20,000.00 | ₱203,500.00 |
| Sep 10 | Credit-card payment | Scheduled transfer from BPI to credit card | ₱12,000.00 | ₱191,500.00 |
| Sep 15 | Salary | Scheduled recurring income to BPI | ₱100,000.00 | ₱291,500.00 |
| Sep 20 | Hanoi trip | Planned expense from BPI | ₱40,000.00 | ₱251,500.00 |
| Sep 30 | Salary | Generated monthly recurrence | ₱100,000.00 | ₱351,500.00 |

Expected September 30 end-of-day liquid cash position: **₱351,500.00**.

The credit-card payment brings the credit-card balance from −₱12,000.00 to ₱0.00 without changing the calculation of its original purchase; it only reduces liquid cash when paid.

## Deferred work queue

Do not pull these into V1 without intentionally revising the scope document:

- Budgets and category reporting
- Savings goals
- Scenario workspace
- CSV import
- Bank sync
- Investments
- Multiple currencies
- Charts
- AI insights

## First implementation ticket

Start with **Milestone 0: Application baseline**. Its final output is a clean default-shadcn app shell with the four agreed destinations and no finance behavior yet.
