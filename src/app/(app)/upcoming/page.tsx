import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { forecastRows, latestLiquidBalanceDate } from "@/lib/seed-data";
import { formatDate, formatPHP } from "@/lib/utils";

export default function UpcomingPage() {
  const rows = forecastRows();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">What happens next</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Upcoming</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Income, bills, transfers, and planned spending in the order they affect your expected cash position.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming cashflow</CardTitle>
          <CardDescription>Expected position is based on balances last updated {formatDate(latestLiquidBalanceDate(), { month: "short", day: "numeric" })}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-0">
          {rows.map((row) => (
            <Link href={`/items/${row.id}/edit`} key={row.id} className="grid gap-3 border-t py-5 first:border-t-0 sm:grid-cols-[110px_1fr_auto] sm:items-center">
              <div className="text-sm text-muted-foreground">{formatDate(row.date, { month: "short", day: "numeric" })}</div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{row.title}</p>
                  <Badge className={row.state === "planned" ? "capitalize bg-muted text-muted-foreground" : "capitalize"}>{row.state}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {row.type === "transfer" ? "Transfer" : row.type === "income" ? "Income" : "Expense"}{row.recurring ? ` · ${row.recurring}` : ""}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-medium tabular-nums">{row.type === "income" ? "+" : "−"}{formatPHP(row.amount)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Expected after: {formatPHP(row.cashAfter)}</p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
