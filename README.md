# Cashflow Planner

Know where your money is today, and where it is going.

## Product direction

Cashflow Planner is a forward-looking personal finance tool. It combines current account balances, actual transactions, recurring income and expenses, scheduled obligations, and planned spending into one financial timeline.

The central question is: **What will my financial position be on any given date?**

## V1

- Overview with current cash, upcoming obligations, projected balance, and warnings
- Plan with timeline, calendar, and forecast views
- Actual, scheduled, planned, and projected financial events
- Transactions and expense tracking
- Recurring income and bills
- Monthly and project budgets
- Accounts and savings goals
- Scenario-ready forecast model

## Stack

- Next.js App Router
- React and TypeScript
- shadcn/ui and Tailwind CSS (next setup step)
- PostgreSQL with an ORM (decision pending)

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Next milestone

Define the financial event domain model and implement the first deterministic forecast engine before expanding the dashboard surface area.
