import type { FinancialEvent } from "@/lib/seed-data";

export type ExpandedFinancialEvent = FinancialEvent & {
  preview?: boolean;
  sourceId?: string;
};

function addDays(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return next.toISOString().slice(0, 10);
}

function addMonths(date: string, months: number) {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1 + months, day));
  return next.toISOString().slice(0, 10);
}

function addYears(date: string, years: number) {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year + years, month - 1, day));
  return next.toISOString().slice(0, 10);
}

function nextOccurrence(date: string, recurring: string) {
  switch (recurring.toLowerCase()) {
    case "weekly":
      return addDays(date, 7);
    case "biweekly":
      return addDays(date, 14);
    case "twice monthly":
      return addDays(date, 15);
    case "monthly":
      return addMonths(date, 1);
    case "yearly":
      return addYears(date, 1);
    default:
      return null;
  }
}

export function expandRecurringEvents(input: FinancialEvent[], horizonEnd: string) {
  const expanded: ExpandedFinancialEvent[] = [...input];

  for (const event of input) {
    if (!event.recurring) continue;

    let date = event.date;
    let occurrence = 0;

    while (true) {
      const nextDate = nextOccurrence(date, event.recurring);
      if (!nextDate || nextDate > horizonEnd) break;

      occurrence += 1;
      expanded.push({
        ...event,
        id: `${event.id}-preview-${occurrence}`,
        date: nextDate,
        state: "scheduled",
        preview: true,
        sourceId: event.id,
      });
      date = nextDate;
    }
  }

  return expanded.sort((a, b) => a.date.localeCompare(b.date));
}
