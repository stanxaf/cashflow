import Link from "next/link";
import {
  estimatedPositionToday,
  latestLiquidBalanceDate,
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
  const upcoming = upcomingEvents().slice(0, 6);

  return (
    <div className="space-y-10">
      <section className="grid gap-8 border-b pb-8 sm:grid-cols-2 sm:gap-12">
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Next payday{nextPayday ? ` · ${formatDate(nextPayday.date, { month: "short", day: "numeric" })}` : ""}
          </p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">{formatPHP(nextPosition)}</p>
          <p className="text-sm text-muted-foreground">Expected position</p>
        </div>

        {followingPayday && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Following payday · {formatDate(followingPayday.date, { month: "short", day: "numeric" })}
            </p>
            <p className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">{formatPHP(followingPosition)}</p>
            <p className="text-sm text-muted-foreground">Expected position</p>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h1 className="text-sm font-medium">Upcoming</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on balances last updated {formatDate(latestLiquidBalanceDate(), { month: "short", day: "numeric" })}.
          </p>
        </div>

        <div className="divide-y border-y">
          {upcoming.map((event) => (
            <Link
              href={`/items/${event.id}/edit`}
              key={event.id}
              className="grid grid-cols-[76px_1fr_auto] items-center gap-4 py-4 hover:bg-muted/20"
            >
              <p className="text-sm text-muted-foreground">
                {formatDate(event.date, { month: "short", day: "numeric" })}
              </p>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{event.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {event.state === "planned" ? "Planned" : event.recurring ?? (event.type === "income" ? "Income" : event.type === "transfer" ? "Transfer" : "Expense")}
                </p>
              </div>
              <p className="text-sm tabular-nums">
                {event.type === "income" ? "+" : "−"}{formatPHP(event.amount)}
              </p>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <Link href="/upcoming" className="font-medium hover:underline">See all</Link>
          <Link href="/items/new" className="text-muted-foreground hover:text-foreground">Add item</Link>
        </div>
      </section>
    </div>
  );
}
