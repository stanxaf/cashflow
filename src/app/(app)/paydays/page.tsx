"use client";

import Link from "next/link";
import { useState } from "react";
import { payCycleSummaries, upcomingEvents } from "@/lib/seed-data";
import { formatDate, formatPHP } from "@/lib/utils";

function timingLabel(type: string, date: string) {
  const formatted = formatDate(date, { month: "short", day: "numeric" });
  return type === "income" ? `Expected ${formatted}` : `Due ${formatted}`;
}

function cycleResultLabel(result: number) {
  return result < 0 ? "Reserve needed" : "Surplus";
}

export default function PaydaysPage() {
  const [showAll, setShowAll] = useState(false);
  const cycles = payCycleSummaries();
  const nextCycle = cycles[0];
  const followingCycle = cycles[1];
  const upcoming = upcomingEvents();
  const visibleUpcoming = showAll ? upcoming : upcoming.slice(0, 6);

  return (
    <div className="space-y-6">
      <section className="grid gap-8 pb-2 sm:grid-cols-2 sm:gap-12">
        {nextCycle && (
          <div className="space-y-3">
            <p className="text-sm font-medium">
              Next payday · {formatDate(nextCycle.payday.date, { month: "short", day: "numeric" })}
            </p>
            <div>
              <p className="text-sm text-muted-foreground">{cycleResultLabel(nextCycle.result)}</p>
              <p className="mt-0.5 text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                {formatPHP(Math.abs(nextCycle.result))}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatPHP(nextCycle.income)} income · {formatPHP(nextCycle.needed)} needed
            </p>
          </div>
        )}

        {followingCycle && (
          <div className="space-y-3">
            <p className="text-sm font-medium">
              Following payday · {formatDate(followingCycle.payday.date, { month: "short", day: "numeric" })}
            </p>
            <div>
              <p className="text-sm text-muted-foreground">{cycleResultLabel(followingCycle.result)}</p>
              <p className="mt-0.5 text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                {formatPHP(Math.abs(followingCycle.result))}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatPHP(followingCycle.income)} income · {formatPHP(followingCycle.needed)} needed
            </p>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h1 className="text-sm font-medium">Upcoming</h1>

        <div className="divide-y border-y">
          {visibleUpcoming.map((event) => (
            <Link
              href={`/items/${event.id}/edit`}
              key={event.id}
              className="grid grid-cols-[1fr_auto] items-center gap-4 py-4 hover:bg-muted/20"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{event.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {timingLabel(event.type, event.date)}{event.state === "planned" ? " · Planned" : ""}
                </p>
              </div>
              <p className="text-sm tabular-nums">
                {event.type === "income" ? "+" : "−"}{formatPHP(event.amount)}
              </p>
            </Link>
          ))}
        </div>

        {upcoming.length > 6 && (
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            className="text-sm font-medium hover:underline"
          >
            {showAll ? "Show less" : "See all"}
          </button>
        )}
      </section>
    </div>
  );
}
