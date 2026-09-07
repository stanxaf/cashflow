import Link from "next/link";
import { forecastRows, latestLiquidBalanceDate } from "@/lib/seed-data";
import { formatDate, formatPHP } from "@/lib/utils";

export default function UpcomingPage() {
  const rows = forecastRows();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Upcoming</h1>
        <p className="text-sm text-muted-foreground">
          Based on balances last updated {formatDate(latestLiquidBalanceDate(), { month: "short", day: "numeric" })}.
        </p>
      </header>

      <div className="divide-y border-y">
        {rows.map((row) => (
          <Link
            href={`/items/${row.id}/edit`}
            key={row.id}
            className="grid gap-2 py-4 sm:grid-cols-[88px_1fr_auto] sm:items-center sm:gap-4"
          >
            <div className="text-sm text-muted-foreground">{formatDate(row.date, { month: "short", day: "numeric" })}</div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{row.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {row.state === "planned" ? "Planned · " : ""}
                {row.recurring ?? (row.type === "income" ? "Income" : row.type === "transfer" ? "Transfer" : "Expense")}
              </p>
            </div>

            <div className="flex items-baseline justify-between gap-4 sm:block sm:text-right">
              <p className="text-sm font-medium tabular-nums">{row.type === "income" ? "+" : "−"}{formatPHP(row.amount)}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">After {formatPHP(row.cashAfter)}</p>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/items/new" className="inline-flex text-sm font-medium hover:underline">Add item</Link>
    </div>
  );
}
