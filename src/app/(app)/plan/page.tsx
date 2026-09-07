import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { planRows } from "@/lib/seed-data";
import { formatDate, formatPHP } from "@/lib/utils";

export default function PlanPage() {
  const rows = planRows();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm text-muted-foreground">Future cashflow</p><h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Plan</h1></div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['30 days','3 months','6 months','1 year'].map((range, index) => <button key={range} className={`h-9 rounded-md border px-3 text-sm whitespace-nowrap ${index===0?'bg-primary text-primary-foreground':'bg-background'}`}>{range}</button>)}
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>September 2026</CardTitle><CardDescription>Running liquid cash balance · planned items included</CardDescription></CardHeader>
        <CardContent className="space-y-0">
          {rows.map((row) => (
            <Link href={`/items/${row.id}/edit`} key={row.id} className="grid gap-3 border-t py-5 first:border-t-0 sm:grid-cols-[110px_1fr_auto] sm:items-center">
              <div className="text-sm text-muted-foreground">{formatDate(row.date, { month: 'short', day: 'numeric' })}</div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2"><p className="font-medium">{row.title}</p><Badge className="capitalize">{row.state}</Badge></div>
                <p className="mt-1 text-sm text-muted-foreground">{row.type === 'transfer' ? 'Transfer' : row.type === 'income' ? 'Income' : 'Expense'}{row.recurring ? ` · ${row.recurring}` : ''}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-medium tabular-nums">{row.type === 'income' ? '+' : row.type === 'transfer' ? '−' : '−'}{formatPHP(row.amount)}</p>
                <p className="mt-1 text-xs text-muted-foreground">End of day {formatPHP(row.cashAfter)}</p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
