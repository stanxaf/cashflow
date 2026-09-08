"use client";

import Link from "next/link";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";
import type { FinancialEvent } from "@/lib/seed-data";
import { payCycleSummaries, upcomingEvents } from "@/lib/seed-data";
import { cn, formatDate, formatPHP } from "@/lib/utils";

function timingLabel(type: string, date: string) {
  const formatted = formatDate(date, { month: "short", day: "numeric" });
  return type === "income" ? `Expected ${formatted}` : `Due ${formatted}`;
}

function completedTimingLabel(type: string, date: string) {
  const formatted = formatDate(date, { month: "short", day: "numeric" });
  if (type === "income") return `Received ${formatted}`;
  if (type === "transfer") return `Transferred ${formatted}`;
  return `Paid ${formatted}`;
}

function cycleResultLabel(result: number) {
  return result < 0 ? "Reserve needed" : "Surplus";
}

function UpcomingRow({
  event,
  completed,
  onToggle,
  isLast,
}: {
  event: FinancialEvent;
  completed: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-2 py-1.5 sm:px-3",
        !isLast && "border-b border-border/50",
        completed && "text-muted-foreground"
      )}
    >
      <button
        type="button"
        aria-label={completed ? `Mark ${event.title} as upcoming` : `Mark ${event.title} as complete`}
        aria-pressed={completed}
        onClick={onToggle}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-background/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
            completed ? "border-foreground bg-foreground text-background" : "border-muted-foreground/50"
          )}
        >
          {completed && <Check className="h-3.5 w-3.5" />}
        </span>
      </button>

      <div className="min-w-0 py-2">
        <p className={cn("truncate text-sm font-medium", completed && "line-through")}>{event.title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {completed
            ? completedTimingLabel(event.type, event.date)
            : `${timingLabel(event.type, event.date)}${event.state === "planned" ? " · Planned" : ""}`}
        </p>
      </div>

      <p className={cn("text-sm tabular-nums", completed && "text-muted-foreground")}>
        {event.type === "income" ? "+" : "−"}{formatPHP(event.amount)}
      </p>

      <Link
        href={`/items/${event.id}/edit`}
        aria-label={`Edit ${event.title}`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Pencil className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function PaydaysPage() {
  const [showAll, setShowAll] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const cycles = payCycleSummaries();
  const nextCycle = cycles[0];
  const followingCycle = cycles[1];
  const upcoming = upcomingEvents();
  const visibleIds = new Set((showAll ? upcoming : upcoming.slice(0, 6)).map((event) => event.id));
  const visibleCycles = cycles
    .map((cycle) => ({ ...cycle, items: cycle.items.filter((event) => visibleIds.has(event.id)) }))
    .filter((cycle) => cycle.items.length > 0);

  function toggleCompleted(id: string) {
    setCompletedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

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

      <section className="space-y-4">
        {visibleCycles.map((cycle, cycleIndex) => (
          <div key={cycle.payday.id} className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <h1 className={cn("text-sm font-medium", cycleIndex > 0 && "invisible")}>Upcoming</h1>
              <p className="text-sm text-muted-foreground">
                {formatDate(cycle.payday.date, { month: "short", day: "numeric" })} pay cycle
              </p>
            </div>

            <div className="overflow-hidden rounded-xl bg-muted/45">
              {cycle.items.map((event, eventIndex) => (
                <UpcomingRow
                  key={event.id}
                  event={event}
                  completed={completedIds.has(event.id)}
                  onToggle={() => toggleCompleted(event.id)}
                  isLast={eventIndex === cycle.items.length - 1}
                />
              ))}
            </div>
          </div>
        ))}

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
