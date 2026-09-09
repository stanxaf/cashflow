"use client";

import Link from "next/link";
import { Check, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { usePrototypeStore } from "@/components/prototype-store";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { prototypeToday, type FinancialEvent } from "@/lib/seed-data";
import { cn, formatDate, formatPHP } from "@/lib/utils";

type Horizon = "30d" | "3m";
type TimelineEvent = FinancialEvent & { preview?: boolean; cashAfter?: number };

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

function monthKey(date: string) {
  return date.slice(0, 7);
}

function amountPrefix(event: TimelineEvent) {
  return event.type === "income" ? "+" : "−";
}

function stateLabel(event: TimelineEvent, completed: boolean) {
  if (completed) return "Completed";
  if (event.preview) return "Recurring preview";
  if (event.state === "planned") return "Planned";
  return "Scheduled";
}

export default function UpcomingPage() {
  const {
    upcomingEvents,
    completedIds,
    toggleCompleted,
    forecastFor,
  } = usePrototypeStore();
  const [horizon, setHorizon] = useState<Horizon>("30d");

  const timeline = useMemo(() => {
    const horizonEnd = horizon === "30d" ? addDays(prototypeToday, 30) : addMonths(prototypeToday, 3);
    const generated: TimelineEvent[] = [];

    if (horizon === "3m") {
      for (const event of upcomingEvents.filter((item) => item.recurring)) {
        for (let offset = 1; offset <= 3; offset += 1) {
          const date = addMonths(event.date, offset);
          if (date > horizonEnd) continue;
          generated.push({ ...event, id: `${event.id}-preview-${offset}`, date, state: "scheduled", preview: true });
        }
      }
    }

    const visible = [...upcomingEvents, ...generated]
      .filter((event) => event.date <= horizonEnd)
      .sort((a, b) => a.date.localeCompare(b.date));

    return forecastFor(visible).map((event) => ({
      ...event,
      preview: generated.some((preview) => preview.id === event.id),
    }));
  }, [forecastFor, horizon, upcomingEvents]);

  const groups = useMemo(() => {
    const grouped = new Map<string, TimelineEvent[]>();
    for (const event of timeline) {
      const key = monthKey(event.date);
      grouped.set(key, [...(grouped.get(key) ?? []), event]);
    }
    return [...grouped.entries()];
  }, [timeline]);

  const paydays = useMemo(
    () => timeline.filter((event) => event.type === "income").map((event) => event.date),
    [timeline]
  );

  function paydayContext(event: TimelineEvent) {
    if (event.type === "income") return null;
    const payday = paydays.find((date) => date >= event.date);
    return payday ? `${formatDate(payday, { month: "short", day: "numeric" })} payday` : null;
  }

  const isEmpty = upcomingEvents.length === 0;

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Upcoming</h1>
            <p className="text-sm text-muted-foreground">A forward view of what is coming and what you are planning.</p>
          </div>

          {!isEmpty && (
            <Link href="/paydays?item=new&mode=plan" className={buttonVariants({ variant: "outline" })}>
              Make a plan
            </Link>
          )}
        </div>

        {!isEmpty && (
          <div className="inline-grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => setHorizon("30d")}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                horizon === "30d" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              30 days
            </button>
            <button
              type="button"
              onClick={() => setHorizon("3m")}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                horizon === "3m" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              3 months
            </button>
          </div>
        )}
      </header>

      {isEmpty ? (
        <Empty className="min-h-[320px] py-12">
          <EmptyHeader>
            <EmptyTitle>Nothing coming up yet</EmptyTitle>
            <EmptyDescription>
              Add something you expect to happen or make a plan for a future expense or income.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/paydays?item=new&mode=plan" className={buttonVariants()}>
                Make a plan
              </Link>
              <Link href="/paydays?item=new&from=upcoming" className={buttonVariants({ variant: "outline" })}>
                Add item
              </Link>
            </div>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <div className="space-y-7">
            {groups.map(([month, items]) => (
              <section key={month} className="space-y-2">
                <h2 className="px-1 text-sm font-medium">
                  {formatDate(`${month}-01`, { month: "long", year: "numeric" })}
                </h2>

                <div className="overflow-hidden rounded-xl bg-muted/45">
                  {items.map((event, index) => {
                    const completed = completedIds.has(event.id);
                    const checkpointCashAfter = event.type === "income" ? event.cashAfter : undefined;
                    const checkpoint = typeof checkpointCashAfter === "number";
                    const isLastEvent = index === items.length - 1;
                    const payday = paydayContext(event);

                    return (
                      <div key={event.id}>
                        <div className={cn("grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-2 py-1.5 sm:px-3", !isLastEvent || checkpoint ? "border-b border-border/50" : undefined)}>
                          <button
                            type="button"
                            disabled={event.preview}
                            aria-label={completed ? `Mark ${event.title} as upcoming` : `Mark ${event.title} as complete`}
                            aria-pressed={completed}
                            onClick={() => toggleCompleted(event.id)}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-background/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default"
                          >
                            <span className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                              completed ? "border-foreground bg-foreground text-background" : "border-muted-foreground/50",
                              event.preview && "opacity-40"
                            )}>
                              {completed && <Check className="h-3.5 w-3.5" />}
                            </span>
                          </button>

                          <div className="min-w-0 py-2">
                            <p className={cn("truncate text-sm font-medium", completed && "text-muted-foreground line-through")}>{event.title}</p>
                            <p className="mt-0.5 truncate text-sm text-muted-foreground">
                              {formatDate(event.date, { month: "short", day: "numeric" })} · {stateLabel(event, completed)}
                              {payday ? ` · ${payday}` : ""}
                            </p>
                          </div>

                          <p className={cn("text-sm tabular-nums", completed && "text-muted-foreground")}>{amountPrefix(event)}{formatPHP(event.amount)}</p>

                          {event.preview ? (
                            <span className="h-11 w-11" aria-hidden="true" />
                          ) : (
                            <Link
                              href={`/paydays?item=${event.id}&from=upcoming`}
                              aria-label={`Edit ${event.title}`}
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          )}
                        </div>

                        {checkpoint && (
                          <div className={cn("grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-2 py-2 sm:px-3", !isLastEvent && "border-b border-border/50")}>
                            <span className="h-11 w-11" aria-hidden="true" />
                            <p className="text-sm text-muted-foreground">Projected position after payday</p>
                            <p className="text-sm tabular-nums text-muted-foreground">{formatPHP(checkpointCashAfter)}</p>
                            <span className="h-11 w-11" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {horizon === "3m" && (
            <p className="px-1 text-xs text-muted-foreground">Later recurring rows are previews only. Editing the source item updates future previews.</p>
          )}
        </>
      )}
    </div>
  );
}
