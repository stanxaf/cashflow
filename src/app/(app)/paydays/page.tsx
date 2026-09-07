import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  estimatedPositionToday,
  latestLiquidBalanceDate,
  obligationsThrough,
  positionAt,
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

  return (
    <div className="space-y-10">
      <section className="space-y-3 border-b pb-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm font-medium">Next payday</p>
          {nextPayday && <p className="text-sm text-muted-foreground">{formatDate(nextPayday.date, { month: "short", day: "numeric" })}</p>}
        </div>

        <div>
          <p className="text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">{formatPHP(nextPosition)}</p>
          <p className="mt-2 text-sm text-muted-foreground">Expected position</p>
        </div>

        <p className="text-xs text-muted-foreground">
          Based on balances last updated {formatDate(latestLiquidBalanceDate(), { month: "short", day: "numeric" })} and the items you entered.
        </p>
      </section>

      {obligations.length > 0 && (
        <section className="space-y-3 border-b pb-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-medium">Included before payday</h2>
            <Link href="/upcoming" className="text-sm text-muted-foreground hover:text-foreground">See all</Link>
          </div>

          <div className="divide-y">
            {obligations.map((event) => (
              <Link
                href={`/items/${event.id}/edit`}
                key={event.id}
                className="grid grid-cols-[1fr_auto] gap-4 py-3 first:pt-1 hover:text-foreground"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{event.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDate(event.date, { month: "short", day: "numeric" })}{event.recurring ? ` · ${event.recurring}` : ""}
                  </p>
                </div>
                <p className="text-sm tabular-nums text-muted-foreground">−{formatPHP(event.amount)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {followingPayday && (
        <section className="space-y-2 border-b pb-8">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-sm font-medium">Following payday</p>
            <p className="text-sm text-muted-foreground">{formatDate(followingPayday.date, { month: "short", day: "numeric" })}</p>
          </div>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">{formatPHP(followingPosition)}</p>
          <p className="text-sm text-muted-foreground">Expected position</p>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <Link href="/upcoming" className="inline-flex items-center gap-1.5 font-medium hover:underline">
          Upcoming <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/accounts" className="text-muted-foreground hover:text-foreground">Update balances</Link>
      </div>
    </div>
  );
}
