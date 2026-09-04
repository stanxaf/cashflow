# Cashflow Planner V1: Data Model and Forecast Contract

This document turns the V1 product spec into a stable database and calculation model. It intentionally supports only the personal, single-user cashflow-planning experience described in `docs/v1-spec.md`.

## Design principles

- One user owns all of their data.
- Financial dates are plain calendar dates, not timestamps.
- Amounts are always stored as positive integer centavos; direction comes from the event type and account posting.
- Account snapshots establish the starting point. Actual events after the snapshot move the balance forward.
- Scheduled and planned events are future inputs. The forecast is calculated from them; it is never stored as a separate transaction.
- Transfers are one financial event with two account postings.

## Data relationships

```text
auth.users
  └─ profiles
       └─ accounts
       └─ financial_events
            └─ recurrence_rules
                 └─ recurrence_exceptions
```

## Tables

### `profiles`

One row per authenticated user. `id` matches the Supabase `auth.users.id` UUID.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID, primary key | References `auth.users.id` |
| `currency_code` | text | Fixed to `PHP` in V1 |
| `timezone` | text | Display preference only; default `Asia/Manila` |
| `created_at` | timestamptz | Audit field |
| `updated_at` | timestamptz | Audit field |

### `accounts`

An account is where money is held or owed. The balance snapshot represents the account's balance as of a particular date.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID, primary key | |
| `user_id` | UUID | References `profiles.id` |
| `name` | text | e.g. BPI, Maya, Cash |
| `account_type` | enum | `cash`, `bank`, `ewallet`, `credit_card` |
| `balance_amount` | bigint | Signed snapshot amount in centavos |
| `balance_as_of_date` | date | Date the snapshot is accurate for |
| `archived_at` | timestamptz, nullable | Archived accounts are read-only |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

Balance convention:

- Cash, bank, and e-wallet balances are positive when money is available.
- A credit-card balance is negative when money is owed. A card with ₱12,000 outstanding stores `-1200000`.
- The user interface can display a credit-card balance as “₱12,000 owed,” while the forecast engine continues to use the signed value.

An initial V1 setup normally sets every account snapshot **as of today**. This avoids asking the user to reconstruct prior history.

### `financial_events`

A financial event causes one or two account movements. Events are never stored as signed amounts.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID, primary key | |
| `user_id` | UUID | References `profiles.id` |
| `event_type` | enum | `income`, `expense`, `transfer` |
| `state` | enum | `actual`, `scheduled`, `planned` |
| `title` | text | Required, e.g. Salary or Hanoi hotel |
| `amount` | bigint | Positive centavos; must be greater than zero |
| `event_date` | date | Effective cashflow date or recurrence start date |
| `account_id` | UUID, nullable | Required for income and expense |
| `from_account_id` | UUID, nullable | Required for transfer |
| `to_account_id` | UUID, nullable | Required for transfer |
| `category` | text, nullable | Free text in V1; no category table yet |
| `notes` | text, nullable | |
| `deleted_at` | timestamptz, nullable | Soft delete; never included in forecasts |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

Event validation:

- Income and expense have exactly one `account_id` and no transfer account fields.
- Transfer has a `from_account_id` and `to_account_id`, with no `account_id`.
- Transfer source and destination must be different accounts owned by the same user.
- New events cannot target archived accounts.
- An `actual` event cannot have a future date. This is enforced by the application because it depends on the user's current date.

### `recurrence_rules`

One optional rule belongs to one event. The parent event is the first occurrence and the template for later occurrences.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID, primary key | |
| `event_id` | UUID, unique | References `financial_events.id` |
| `frequency_unit` | enum | `day`, `week`, `month`, `year` |
| `interval_count` | integer | Every N units; minimum 1 |
| `start_date` | date | Normally matches the parent event date |
| `end_date` | date, nullable | No end means active indefinitely |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

Examples:

- Monthly salary: `month`, `1`
- Quarterly insurance payment: `month`, `3`
- Weekly allowance: `week`, `1`
- Annual car insurance: `year`, `1`

For a monthly recurrence anchored on the 29th, 30th, or 31st, an occurrence in a shorter month uses its last calendar day.

### `recurrence_exceptions`

Exceptions keep a recurring series simple without pre-generating future rows.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID, primary key | |
| `recurrence_rule_id` | UUID | References `recurrence_rules.id` |
| `occurrence_date` | date | The generated occurrence being changed |
| `exception_type` | enum | `skip`, `replace` |
| `replacement_event_id` | UUID, nullable | Required only for `replace` |
| `created_at` | timestamptz | |

V1 may initially expose only “skip this occurrence.” The table exists so a later edit-to-one-occurrence flow does not require a schema rewrite.

## Account postings

The forecast engine derives postings; they do not need a separate `postings` table in V1.

| Event | Posting |
|---|---|
| Income | `+amount` to `account_id` |
| Expense | `-amount` to `account_id` |
| Transfer | `-amount` to `from_account_id`, `+amount` to `to_account_id` |

Examples:

- A cash coffee purchase reduces the cash account.
- A credit-card purchase reduces the credit-card account further into negative territory; it does not reduce cash until the card is paid.
- Paying the card is a transfer from a bank account to the credit-card account. This reduces liquid cash and brings the card balance toward zero.

## Forecast engine contract

The forecast engine is a pure TypeScript function. It does not read the database, mutate records, or contain UI logic.

```ts
type ForecastRequest = {
  accounts: AccountSnapshot[]
  events: FinancialEvent[]
  recurrenceRules: RecurrenceRule[]
  recurrenceExceptions: RecurrenceException[]
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  includePlanned: boolean
}

type ForecastDay = {
  date: string
  entries: ForecastEntry[]
  accountBalances: Record<string, number> // integer centavos
  cashPosition: number                    // liquid accounts only
}

type ForecastResult = {
  days: ForecastDay[]
  balanceOnEndDate: number
  lowestCashPosition: { amount: number; date: string } | null
}
```

### Calculation rules

1. Start from every active account's signed `balance_amount` at its `balance_as_of_date`.
2. Apply actual events that occur after the relevant snapshot date and on or before the forecast start date to establish the opening position.
3. Generate one-time scheduled and planned events in the requested range.
4. Expand recurrence rules only within the requested range. Apply skips and replacements before creating postings.
5. Exclude soft-deleted events and archived accounts from new forecast calculations.
6. If `includePlanned` is false, exclude planned events and planned recurrences; scheduled events always remain included.
7. Group postings by date and calculate the end-of-day account balances after all postings on that date.
8. `cashPosition` is the sum of cash, bank, and e-wallet account balances. It excludes credit-card liabilities.
9. `lowestCashPosition` is the lowest end-of-day cash position in the selected range.

The V1 Plan view begins at today and moves forward. It does not attempt to reconstruct a historical balance before a user's account snapshots.

## Data access and security

- Supabase Auth owns authentication.
- Every application table has a `user_id` or is reached through a user-owned event.
- Row Level Security restricts reads and writes to rows where `user_id = auth.uid()`.
- The server validates account ownership before creating an event, transfer, recurrence, or exception.
- The client never receives a service-role key.

## Indexes

Create these first:

- `accounts (user_id, archived_at)`
- `financial_events (user_id, event_date)` where `deleted_at is null`
- `financial_events (account_id, event_date)` where `deleted_at is null`
- `recurrence_rules (event_id)`
- `recurrence_exceptions (recurrence_rule_id, occurrence_date)` unique

## Required forecast tests

- One-time income and expense update a running balance correctly.
- A planned item is included by default and can be excluded.
- A transfer changes account balances but not total cash position.
- A credit-card charge does not lower liquid cash until the card payment occurs.
- A monthly event on the 31st resolves to the final day of February.
- Leap-year annual recurrence works on February 29.
- A skipped recurrence is not included.
- A soft-deleted event is not included.
- The lowest projected cash position and date are calculated correctly.

## Next implementation document

Create `docs/build-plan.md` with the ordered implementation milestones, definitions of done, and the first seed-data scenario.
