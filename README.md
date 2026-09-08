# Cashflow Planner

Know where your money is today, and where it is going.

Cashflow Planner is a forward-looking personal finance tool for answering one question: **What will my financial position be on a selected future date?**

## Current prototype

The current phase is deliberately UI-first and uses deterministic local seed data. It focuses on the complete core flow before authentication, database work, or backend persistence are introduced.

Implemented prototype areas:

- First-time setup
- Today summary
- Plan timeline with running future balances and no chart
- Accounts
- Shared add/edit flow for actual, scheduled, and planned financial items
- Recurring-item controls
- Responsive desktop and mobile navigation

## MVP scope

- PHP only
- Manual entry
- Cash, bank, e-wallet, and credit-card accounts
- Income, expenses, and transfers
- Actual, scheduled, and planned events
- One-time and recurring items
- Future cash-balance forecasting

Deferred for now: Supabase, authentication, backend persistence, budgets, goals, bank sync, imports, charts, and AI features.

## Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- default shadcn/ui foundation using preset `b1oVxsfb`

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful prototype routes:

- `/setup`
- `/today`
- `/plan`
- `/accounts`
- `/items/new`

See `/docs` for the product, UX, data-model, and longer-term build specifications.
