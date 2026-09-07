import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { availableCash, events, planRows } from "@/lib/seed-data";
import { formatDate, formatPHP } from "@/lib/utils";

export default function TodayPage() {
  const rows = planRows();
  const future = events.filter((event) => event.state !== "actual");
  const nextIn = future.find((event) => event.type === "income");
  const nextOut = future.find((event) => event.type !== "income");
  const lowest = rows.reduce((min, row) => row.cashAfter < min.cashAfter ? row : min, rows[0]);
  const projected = rows.at(-1)?.cashAfter ?? availableCash();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Monday, Sep 7</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Today</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Available now</CardDescription>
            <CardTitle className="text-3xl">{formatPHP(availableCash())}</CardTitle>
            <CardDescription>Across 3 liquid accounts · As of Sep 1</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Projected Sep 30</CardDescription>
            <CardTitle className="text-3xl">{formatPHP(projected)}</CardTitle>
            <CardDescription>Based on the items in your plan</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/plan" className="text-sm font-medium underline underline-offset-4">See how this changes</Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3"><CardDescription>Next in</CardDescription></CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center gap-2 font-medium"><ArrowUpRight className="h-4 w-4" /> {nextIn?.title}</div>
            <p className="text-sm text-muted-foreground">{nextIn && formatDate(nextIn.date, { month: "short", day: "numeric" })} · {nextIn && formatPHP(nextIn.amount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardDescription>Next out</CardDescription></CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center gap-2 font-medium"><ArrowDownRight className="h-4 w-4" /> {nextOut?.title}</div>
            <p className="text-sm text-muted-foreground">{nextOut && formatDate(nextOut.date, { month: "short", day: "numeric" })} · {nextOut && formatPHP(nextOut.amount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardDescription>Lowest upcoming balance</CardDescription></CardHeader>
          <CardContent className="space-y-1">
            <div className="font-medium">{formatPHP(lowest.cashAfter)}</div>
            <p className="text-sm text-muted-foreground">{formatDate(lowest.date, { month: "short", day: "numeric" })} · after {lowest.title.toLowerCase()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div><CardTitle>Coming up</CardTitle><CardDescription>Next items affecting your cash</CardDescription></div>
          <Link href="/plan" className="text-sm font-medium">View full plan</Link>
        </CardHeader>
        <CardContent className="divide-y">
          {future.slice(0, 4).map((event) => (
            <div key={event.id} className="flex items-center gap-3 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted"><CalendarDays className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{event.title}</p><p className="text-xs text-muted-foreground">{formatDate(event.date, { month: "short", day: "numeric" })}</p></div>
              <Badge className="capitalize">{event.state}</Badge>
              <span className="text-sm font-medium tabular-nums">{event.type === "income" ? "+" : "−"}{formatPHP(event.amount)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
