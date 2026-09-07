import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  estimatedPositionToday,
  latestLiquidBalanceDate,
  obligationsThrough,
  positionAt,
  upcomingEvents,
  upcomingPaydays,
} from "@/lib/seed-data";
import { formatDate, formatPHP } from "@/lib/utils";

export default function PaydaysPage() {
  const paydays = upcomingPaydays();
  const nextPayday = paydays[0];
  const followingPayday = paydays[1];
  const nextPosition = nextPayday ? positionAt(nextPayday.date) : estimatedPositionToday();
  const followingPosition = followingPayday ? positionAt(followingPayday.date) : nextPosition;
  const obligations = nextPayday ? obligationsThrough(nextPayday.date) : [];
  const upcoming = upcomingEvents().slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Based on what you entered</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Paydays</h1>
      </div>

      {nextPayday && (
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardDescription>Next payday</CardDescription>
                <CardTitle className="mt-1 text-2xl">{formatDate(nextPayday.date, { month: "long", day: "numeric" })}</CardTitle>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{nextPayday.title}</p>
                <p className="text-lg font-semibold tabular-nums">+{formatPHP(nextPayday.amount)}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">Expected position after payday</p>
              <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">{formatPHP(nextPosition)}</p>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Estimate based on balances last updated {formatDate(latestLiquidBalanceDate(), { month: "short", day: "numeric" })} and the items you have recorded.
              </p>
            </div>

            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="text-sm font-medium">Before this payday</p>
              <div className="mt-3 space-y-3">
                {obligations.map((event) => (
                  <div key={event.id} className="flex items-center justify-between gap-4 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(event.date, { month: "short", day: "numeric" })}{event.recurring ? ` · ${event.recurring}` : ""}</p>
                    </div>
                    <span className="font-medium tabular-nums">−{formatPHP(event.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Starting estimate today</CardDescription>
            <CardTitle className="text-2xl tabular-nums">{formatPHP(estimatedPositionToday())}</CardTitle>
            <CardDescription>Not a live bank balance. This is derived from the balances and actual items you entered.</CardDescription>
          </CardHeader>
        </Card>

        {followingPayday && (
          <Card>
            <CardHeader>
              <CardDescription>Following payday · {formatDate(followingPayday.date, { month: "short", day: "numeric" })}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{formatPHP(followingPosition)}</CardTitle>
              <CardDescription>Expected position after the next two pay cycles, with planned items included.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Upcoming</h2>
            <p className="text-sm text-muted-foreground">Bills, income, and plans coming next.</p>
          </div>
          <Link href="/upcoming" className="text-sm font-medium">See all</Link>
        </div>

        <Card>
          <CardContent className="divide-y p-0">
            {upcoming.map((event) => (
              <Link href={`/items/${event.id}/edit`} key={event.id} className="flex items-center gap-3 px-5 py-4 hover:bg-muted/30">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                  <CalendarClock className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium">{event.title}</p>
                    {event.state === "planned" && <Badge variant="secondary">Planned</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(event.date, { month: "short", day: "numeric" })}{event.recurring ? ` · ${event.recurring}` : ""}</p>
                </div>
                <span className="text-sm font-medium tabular-nums">{event.type === "income" ? "+" : "−"}{formatPHP(event.amount)}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild><Link href="/items/new">Add upcoming item</Link></Button>
        <Button asChild variant="outline"><Link href="/accounts">Update starting balances</Link></Button>
      </div>
    </div>
  );
}
