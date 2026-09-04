# Cashflow Planner V1

## Purpose

Cashflow Planner is a personal finance tool for understanding where money is today and where it is going.

Its core question is:

> What will my financial position be on a selected future date?

V1 is a private, single-user web app. It is deliberately focused on manual planning and cashflow forecasting rather than full personal-finance management.

## V1 outcome

A user can add their account balances, regular income and bills, and planned spending, then see a clear running balance for any future date.

The first successful experience is:

1. Add current account balances.
2. Add recurring income, such as salary.
3. Add recurring bills and payments.
4. Add a planned expense, such as a trip.
5. See the projected balance after each upcoming item and on a chosen future date.

## Scope

### Included

- Email sign-in for one private user account.
- PHP as the initial currency.
- Accounts: cash, bank, e-wallet, and credit card.
- Opening/current account balances with an effective date.
- Income, expense, and transfer events.
- Event states: actual, scheduled, and planned.
- One-time and recurring events.
- A chronological Plan timeline with a running projected balance.
- A Today summary with immediate financial signals.
- Manual data entry, editing, and deletion.

### Not included

- Bank connections or bank-data sync.
- CSV import.
- Budgets, spending limits, or category reports.
- Savings goals.
- Investment tracking.
- Shared household accounts.
- Multiple currencies.
- Receipt scanning.
- AI advice or chat.
- Charts.
- Scenario workspaces. A planned event provides the first lightweight version of a what-if decision.

## Information architecture

```text
Today
Plan
Accounts
Settings
```

There is no separate Transactions page in V1. Plan is the unified financial-event list; filtering it to actual events provides transaction history.

## Core areas

### Today

Answers: "Where do I stand right now?"

- Available cash across applicable accounts.
- Next upcoming income.
- Next upcoming bill or expense.
- Amount due in the next 30 days.
- Lowest projected balance in the next 30 days and its date.
- Projected balance on a user-selected future date.
- Shortcut to add an event.

### Plan

Answers: "What happens next?"

- A chronological list of financial events, grouped by date.
- Running projected balance after each date.
- Default date range: next 30 days; options for 3 months, 6 months, 1 year, and custom range.
- Filters for account, income/expense, and actual/scheduled/planned state.
- Add, edit, and delete events.
- Scheduled and planned items are visually distinct; planned items remain part of the default forecast.

There is intentionally no chart in V1. The timeline and running balance are the primary forecast interface.

### Accounts

Answers: "Where is my money?"

- Account list with name, type, and balance.
- Account types: cash, bank, e-wallet, credit card.
- Add, edit, archive, and view an account.
- Set an opening balance and the date it applies from.
- Create transfers between accounts.

### Settings

- Profile and sign-in settings.
- Currency display preferences; PHP is the only supported stored currency in V1.
- Timezone preference for display. Financial due dates remain date-based rather than time-based.

## Financial model

### Account

An account represents a place money is held or owed.

Required fields:

- Name
- Type
- Opening balance
- Opening-balance effective date
- Active or archived state

### Financial event

An event is a change to one or more account balances.

Required fields:

- Type: income, expense, or transfer
- Title
- Amount
- Account
- Effective date
- State: actual, scheduled, or planned

Optional fields:

- Category
- Notes
- Recurrence rule

Event states:

- **Actual:** money has already moved. It is part of transaction history.
- **Scheduled:** a future item that is expected or committed, such as salary, rent, or a credit-card payment.
- **Planned:** a future item the user is considering or has set aside, such as a trip or a new laptop.
- **Projected:** never a saved event state. It is the calculated balance produced by the forecast.

### Transfer

A transfer creates an equal withdrawal from one account and deposit into another account. It changes account-level balances but not the total cash position.

### Recurrence

V1 supports monthly, yearly, weekly, and custom-interval events. The system expands only the occurrences needed for the selected forecast range; it does not pre-create years of future records.

For a monthly item on a date not present in a month, use that month's final calendar day. For example, an item set for the 31st occurs on February 28 or 29.

## Forecast rules

1. The forecast starts from each active account's opening balance as of its effective date, plus actual events after that date.
2. Scheduled and planned future events are included by default.
3. A selected date shows the end-of-day projected balance after all events dated that day.
4. The timeline recalculates immediately when an account, event, or recurrence changes.
5. Actual events cannot be created with a future effective date in V1.
6. Archived accounts and deleted events are excluded from future forecasts but remain available in history where appropriate.
7. All money values are stored as integer centavos, never floating-point values.
8. Cashflow dates are stored as plain dates (`YYYY-MM-DD`), not timestamps, so bill dates do not shift across timezones.

## UI foundation

- Next.js and TypeScript.
- Default shadcn/ui from the selected preset: `https://ui.shadcn.com/create?preset=b1oVxsfb`.
- Tailwind CSS and standard shadcn components.
- This is a personal app, separate from the DTN Eco design system and registry.
- Use standard components first; create bespoke UI only where the financial timeline requires it.

## Technical direction

- Next.js App Router for the web application.
- Supabase for PostgreSQL and authentication.
- Drizzle ORM for schema and migrations.
- Zod and React Hook Form for data validation and forms.
- A standalone, pure TypeScript forecast engine with unit tests.
- Vercel for deployment.

## Acceptance criteria for the first usable release

1. A signed-in user can create at least two accounts and set their balances.
2. The user can add an actual expense, a scheduled recurring salary, a scheduled recurring bill, and a planned one-time expense.
3. Plan shows the events in date order with a running balance.
4. Selecting a future date returns the correct projected end-of-day balance.
5. Editing or removing an event updates the forecast immediately.
6. Transfers update the involved accounts without changing the total cash position.
7. The essential experience works on a phone-width screen.

## Next planning document

Create `docs/data-model.md` with the database tables, relationships, constraints, and forecast-engine input/output contract.
