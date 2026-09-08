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

export type PayCycleSummary = {
  payday: FinancialEvent;
  income: number;
  needed: number;
  result: number;
  items: FinancialEvent[];
};

export const prototypeToday = "2026-09-07";

export const accounts: Account[] = [
  { id: "bpi", name: "BPI", type: "bank", balance: 20_000_000, balanceDate: "2026-09-01" },
  { id: "maya", name: "Maya", type: "ewallet", balance: 2_000_000, balanceDate: "2026-09-01" },
  { id: "cash", name: "Cash", type: "cash", balance: 500_000, balanceDate: "2026-09-01" },
  { id: "credit-card", name: "Credit card", type: "credit_card", balance: -1_200_000, balanceDate: "2026-09-01" },
];

export const events: FinancialEvent[] = [
  { id: "coffee", title: "Coffee", date: "2026-09-03", amount: 150_000, type: "expense", state: "actual", accountId: "maya" },
  { id: "mortgage", title: "Mortgage", date: "2026-09-09", amount: 2_000_000, type: "expense", state: "scheduled", accountId: "bpi", recurring: "Monthly" },
  { id: "cc-payment", title: "Credit-card payment", date: "2026-09-10", amount: 1_200_000, type: "transfer", state: "scheduled", fromAccountId: "bpi", toAccountId: "credit-card", recurring: "Monthly" },
  { id: "internet", title: "Internet", date: "2026-09-12", amount: 249_900, type: "expense", state: "scheduled", accountId: "bpi", recurring: "Monthly" },
  { id: "electricity", title: "Electricity", date: "2026-09-14", amount: 350_000, type: "expense", state: "scheduled", accountId: "bpi", recurring: "Monthly" },
  { id: "salary-1", title: "Salary", date: "2026-09-15", amount: 10_000_000, type: "income", state: "scheduled", accountId: "bpi", recurring: "Twice monthly" },
  { id: "hanoi", title: "Hanoi trip", date: "2026-09-20", amount: 4_000_000, type: "expense", state: "planned", accountId: "bpi" },
  { id: "groceries", title: "Groceries", date: "2026-09-24", amount: 800_000, type: "expense", state: "scheduled", accountId: "bpi", recurring: "Monthly" },
  { id: "salary-2", title: "Salary", date: "2026-09-30", amount: 10_000_000, type: "income", state: "scheduled", accountId: "bpi", recurring: "Twice monthly" },
];

export const liquidAccountIds = new Set(accounts.filter((account) => account.type !== "credit_card").map((account) => account.id));

export function enteredLiquidBalance() {
  return accounts.filter((account) => liquidAccountIds.has(account.id)).reduce((total, account) => total + account.balance, 0);
}

export function latestLiquidBalanceDate() {
  return accounts
    .filter((account) => liquidAccountIds.has(account.id))
    .map((account) => account.balanceDate)
    .sort()
    .at(-1) ?? prototypeToday;
}

export function eventCashEffect(event: FinancialEvent) {
  if (event.type === "income") return event.amount;
  if (event.type === "expense") return -event.amount;
  if (event.fromAccountId && liquidAccountIds.has(event.fromAccountId) && (!event.toAccountId || !liquidAccountIds.has(event.toAccountId))) return -event.amount;
  if (event.toAccountId && liquidAccountIds.has(event.toAccountId) && (!event.fromAccountId || !liquidAccountIds.has(event.fromAccountId))) return event.amount;
  return 0;
}

export function estimatedPositionToday() {
  const balanceDate = latestLiquidBalanceDate();
  return events
    .filter((event) => event.state === "actual" && event.date > balanceDate && event.date <= prototypeToday)
    .reduce((total, event) => total + eventCashEffect(event), enteredLiquidBalance());
}

export function upcomingEvents() {
  return events
    .filter((event) => event.state !== "actual" && event.date > prototypeToday)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function forecastRows() {
  let running = estimatedPositionToday();
  return upcomingEvents().map((event) => {
    running += eventCashEffect(event);
    return { ...event, cashAfter: running };
  });
}

export function planRows() {
  return forecastRows();
}

export function upcomingPaydays() {
  return upcomingEvents().filter((event) => event.type === "income");
}

export function positionAt(date: string) {
  const row = forecastRows().filter((item) => item.date <= date).at(-1);
  return row?.cashAfter ?? estimatedPositionToday();
}

export function obligationsThrough(date: string) {
  return upcomingEvents().filter((event) => event.date <= date && event.type !== "income");
}

export function payCycleSummaries(): PayCycleSummary[] {
  const paydays = upcomingPaydays();

  return paydays.map((payday, index) => {
    const previousBoundary = index === 0 ? prototypeToday : paydays[index - 1].date;
    const items = upcomingEvents().filter(
      (event) => event.date > previousBoundary && event.date <= payday.date
    );
    const income = items
      .filter((event) => event.type === "income")
      .reduce((total, event) => total + event.amount, 0);
    const needed = items
      .filter((event) => event.type !== "income")
      .reduce((total, event) => total + event.amount, 0);

    return {
      payday,
      income,
      needed,
      result: income - needed,
      items,
    };
  });
}
