# Cashflow Planner V1: UX Flow Blueprint

This document defines the key user journeys before detailed visual design or implementation. It follows the V1 user goal:

> Feel confident making a money decision today because you can see its impact on future cash.

## Experience principles

- Start from **today**, not from a complete financial history.
- Make the future easy to read without charts, reports, or accounting language.
- Show the consequence of every new item immediately.
- Ask only for information that changes the forecast.
- Keep data entry short enough to use in everyday life.
- Treat planned spending as valid planning information, not an error or a warning.

## App structure

```text
Today
Plan
Accounts
Profile menu
  └─ Settings
```

On desktop, these are shown in a simple sidebar. On mobile, use a compact bottom navigation for Today, Plan, and Accounts, with a persistent add-item action.

There is intentionally no separate Transactions page. Plan is the complete event timeline; filtering to Actual provides transaction history when needed.

## Journey 1: Blank app to useful forecast

### User goal

"I want to set up the essentials quickly, without recreating my whole financial history."

### Flow

```text
Welcome
→ Add accounts and current balances
→ Add regular income and bills
→ Add an upcoming plan (optional)
→ Today
→ Check a future balance
```

### 1. Welcome

**Purpose:** Explain the payoff before asking for data.

```text
Know what your money will look like next.

Start with what you have today, then add the income,
bills, and plans that are coming up.

[ Set up my plan ]
```

Secondary reassurance: "You can add more later."

### 2. Add accounts

**Purpose:** Establish the starting position.

```text
Where is your money today?

Add the accounts you want included in your plan.

[ + Add account ]

                        [ Continue ]
```

The first account form asks for:

- Account name
- Type: Cash, Bank, E-wallet, Credit card
- Current balance
- Balance date, defaulting to today

Account cards appear as they are added. At least one liquid account is required to continue. Credit cards are optional and display their balance as an amount owed rather than as available money.

**Helpful guidance:** "Use the balance you have right now. You do not need to enter past transactions."

### 3. Add regular items

**Purpose:** Capture the predictable items that make a forecast useful.

```text
What happens regularly?

Add your salary, bills, and recurring payments.

[ + Add regular item ]

[ Skip for now ]                  [ Continue ]
```

This opens the shared item form with these defaults:

- State: Scheduled
- Repeat: required
- Date: next occurrence

Examples are optional suggestions, not prefilled data:

- Salary
- Rent
- Credit-card payment
- Internet
- Insurance

Skipping is allowed. The resulting Today page shows a subtle prompt that the forecast only includes items entered so far.

### 4. Add an upcoming plan

**Purpose:** Introduce the decision-making behavior immediately.

```text
Anything coming up?

Add a trip, purchase, or other expense you are planning for.

[ + Add planned item ]

[ Skip for now ]                  [ Finish setup ]
```

The shared item form defaults to:

- Type: Expense
- State: Planned
- Date: a future date
- Repeat: Does not repeat

When saved, show a concise confirmation before leaving setup:

```text
Hanoi trip added

Your projected Sep 30 balance is ₱351,500.
```

### 5. Land on Today

The first Today view should already contain real numbers from setup. Avoid a generic congratulations page.

If the user skipped regular items or a planned item, show one lightweight next step beneath the summary, for example:

```text
Your plan is just getting started.
Add regular income and bills for a more complete forecast.
[ Add regular item ]
```

## Journey 2: Understand today and check the future

### User goal

"Am I okay now, and what will I have on a specific date?"

### Today screen

The screen has three layers, in this order.

#### A. Current position

```text
Available now
₱225,000
Across 3 liquid accounts · As of Sep 1
```

This is a cash-position number. It excludes credit-card debt and is not presented as net worth.

#### B. Future-date answer

```text
What will I have on?
[ Sep 30, 2026 ▼ ]

Projected balance
₱351,500
```

The date control defaults to 30 days from today. Choosing a date updates the answer without leaving Today.

#### C. What needs attention

Show only a few signals, in priority order:

```text
Next in
Salary · Sep 15 · +₱100,000

Next out
Rent · Sep 5 · −₱20,000

Lowest upcoming balance
₱191,500 · Sep 10
After your credit-card payment
```

Then show the next three to five upcoming items and a clear **View full plan** action.

### Empty and calm states

- With no future events, show: "Add income, bills, or plans to see what is ahead."
- When there is no concerning low point, use neutral language such as: "Your balance stays above ₱X in this range."
- Do not invent a "safe to spend" number in V1. It requires reserve and budget rules that do not exist yet.

## Journey 3: Explore and maintain the Plan

### User goal

"Show me what changes my balance, and let me keep it accurate."

### Plan screen

```text
Plan                                  [ Add item ]

[ 30 days ] [ 3 months ] [ 6 months ] [ 1 year ]

September 2026

Sep 5
Rent · BPI · Scheduled                 −₱20,000
End of day                              ₱203,500

Sep 10
Credit-card payment · Scheduled        −₱12,000
End of day                              ₱191,500

Sep 15
Salary · BPI · Scheduled              +₱100,000
End of day                              ₱291,500
```

The timeline groups items by date and shows the end-of-day projected cash position after that date's items have been applied.

Controls:

- Range selection: 30 days, 3 months, 6 months, 1 year, custom.
- Optional filters: account, income/expense, state.
- Add item.

Actual items use the standard text treatment. Scheduled items use a subtle neutral label. Planned items use a distinct but quiet label so users can see that they are assumptions rather than commitments.

Selecting an item opens its detail sheet. It includes Edit and Delete actions. Deleting a future item requires confirmation and shows the changed forecast immediately after confirmation.

## Journey 4: Add or change a financial item

### User goal

"I want to record something quickly and know its effect."

### Shared item sheet

The same component opens from Today, Plan, setup, and an account detail. On desktop it is a dialog; on mobile it is a bottom sheet or full-screen form.

```text
Add item

[ Expense | Income | Transfer ]

Title
Amount
Account
Date

[ Actual | Scheduled | Planned ]

Repeat
[ Does not repeat ▼ ]

Optional
Category
Notes

[ Save item ]
```

### Smart defaults

| Entry point | Default type | Default state | Default date |
|---|---|---|---|
| Today: Add item | Expense | Actual | Today |
| Plan: Add item | Expense | Planned | Currently viewed date, or tomorrow |
| Setup: regular item | User chooses | Scheduled | Next occurrence |
| Setup: planned item | Expense | Planned | User chooses future date |
| Account detail | Expense | Actual | Today, preselected account |

For a transfer, replace Account with **From account** and **To account**. The form prevents the same account being selected twice.

### After save

Remain in the current context and show a short confirmation, for example:

```text
Hanoi trip added
Your projected Sep 30 balance is now ₱351,500.
```

An actual event updates both current available cash and future projections. A scheduled or planned event updates only the forward projection.

## Journey 5: Manage accounts

### User goal

"I want to know where my money is and keep those balances credible."

### Accounts screen

```text
Accounts                              [ Add account ]

Liquid money
BPI                                  ₱200,000
Maya                                  ₱20,000
Cash                                   ₱5,000
────────────────────────────────────────────
Available now                        ₱225,000

Credit cards
UnionBank Platinum                  ₱12,000 owed
```

Selecting an account opens its detail view with:

- Balance and balance-as-of date
- Related actual and upcoming items
- Edit account
- Archive account
- Add item for this account

Archiving requires confirmation when future items are linked to the account. The user must move, delete, or resolve those items first.

## Important states and safeguards

### Validation

- Amount must be greater than zero.
- An expense, income, or transfer requires an account.
- Transfer source and destination cannot be the same.
- Actual items cannot be dated in the future.
- A scheduled or planned item dated in the past prompts the user to change the date or mark it Actual.
- A recurring item requires a recurrence frequency and next occurrence.

### Destructive actions

- Deleting an item asks for confirmation only when it is a future scheduled/planned item or a recurring series.
- Archiving an account is blocked while active future items remain linked to it.
- Soft-deleted items do not affect future forecasts.

### Forecast completeness

The app should never imply that a forecast is exhaustive. Where useful, say "Based on the items in your plan" rather than “You will have.”

## V1 UX acceptance scenarios

1. A new user with no history can reach a useful forecast after entering only balances, regular items, and one upcoming plan.
2. A user can answer a future-balance question from Today in one interaction.
3. A user can understand what affects the answer from Plan without a chart.
4. Adding an actual expense, planned expense, or transfer is quick and visibly updates the relevant numbers.
5. A user can tell planned assumptions apart from scheduled commitments.
6. The primary tasks work comfortably on a phone.

## Deferred UX

- Budgets and category breakdowns
- Savings goals
- Reports and charts
- Dedicated decision-scenario workspaces
- Bank-import and reconciliation workflows
- Shared-account collaboration
