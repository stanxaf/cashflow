export type AccountType = "cash" | "bank" | "ewallet" | "credit_card";
export type EventType = "income" | "expense" | "transfer";
export type EventState = "actual" | "scheduled" | "planned";

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  balanceDate: string;
};

export type FinancialEvent = {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: EventType;
  state: EventState;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  recurring?: string;
};

export const accounts: Account[] = [
  { id: "bpi", name: "BPI", type: "bank", balance: 20_000_000, balanceDate: "2026-09-01" },
  { id: "maya", name: "Maya", type: "ewallet", balance: 2_000_000, balanceDate: "2026-09-01" },
  { id: "cash", name: "Cash", type: "cash", balance: 500_000, balanceDate: "2026-09-01" },
  { id: "credit-card", name: "Credit card", type: "credit_card", balance: -1_200_000, balanceDate: "2026-09-01" },
];

export const events: FinancialEvent[] = [
  { id: "coffee", title: "Coffee", date: "2026-09-03", amount: 150_000, type: "expense", state: "actual", accountId: "maya" },
  { id: "rent", title: "Rent", date: "2026-09-05", amount: 2_000_000, type: "expense", state: "scheduled", accountId: "bpi" },
  { id: "cc-payment", title: "Credit-card payment", date: "2026-09-10", amount: 1_200_000, type: "transfer", state: "scheduled", fromAccountId: "bpi", toAccountId: "credit-card" },
  { id: "salary-1", title: "Salary", date: "2026-09-15", amount: 10_000_000, type: "income", state: "scheduled", accountId: "bpi", recurring: "Twice monthly" },
  { id: "hanoi", title: "Hanoi trip", date: "2026-09-20", amount: 4_000_000, type: "expense", state: "planned", accountId: "bpi" },
  { id: "salary-2", title: "Salary", date: "2026-09-30", amount: 10_000_000, type: "income", state: "scheduled", accountId: "bpi", recurring: "Twice monthly" },
];

export const liquidAccountIds = new Set(accounts.filter((account) => account.type !== "credit_card").map((account) => account.id));

export function availableCash() {
  return accounts.filter((account) => liquidAccountIds.has(account.id)).reduce((total, account) => total + account.balance, 0);
}

export function eventCashEffect(event: FinancialEvent) {
  if (event.type === "income") return event.amount;
  if (event.type === "expense") return -event.amount;
  if (event.fromAccountId && liquidAccountIds.has(event.fromAccountId) && (!event.toAccountId || !liquidAccountIds.has(event.toAccountId))) return -event.amount;
  if (event.toAccountId && liquidAccountIds.has(event.toAccountId) && (!event.fromAccountId || !liquidAccountIds.has(event.fromAccountId))) return event.amount;
  return 0;
}

export function planRows() {
  let running = availableCash();
  return events.map((event) => {
    running += eventCashEffect(event);
    return { ...event, cashAfter: running };
  });
}
