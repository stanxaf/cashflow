"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronLeft, Pencil, X } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { FinancialItemForm, type SelectionView } from "@/components/financial-item-form";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { FinancialEvent } from "@/lib/seed-data";
import { events, payCycleSummaries } from "@/lib/seed-data";
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

function selectionTitle(view: SelectionView) {
  if (view === "frequency") return "Frequency";
  if (view === "from") return "From account";
  if (view === "to") return "To account";
  if (view === "account") return "Account";
  return null;
}

function UpcomingRow({ event, completed, onToggle, isLast }: { event: FinancialEvent; completed: boolean; onToggle: () => void; isLast: boolean }) {
  return (
    <div className={cn("grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-2 py-1.5 sm:px-3", !isLast && "border-b border-border/50", completed && "text-muted-foreground")}>
      <button type="button" aria-label={completed ? `Mark ${event.title} as upcoming` : `Mark ${event.title} as complete`} aria-pressed={completed} onClick={onToggle} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-background/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border transition-colors", completed ? "border-foreground bg-foreground text-background" : "border-muted-foreground/50")}>
          {completed && <Check className="h-3.5 w-3.5" />}
        </span>
      </button>

      <div className="min-w-0 py-2">
        <p className={cn("truncate text-sm font-medium", completed && "line-through")}>{event.title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {completed ? completedTimingLabel(event.type, event.date) : `${timingLabel(event.type, event.date)}${event.state === "planned" ? " · Planned" : ""}`}
        </p>
      </div>

      <p className={cn("text-sm tabular-nums", completed && "text-muted-foreground")}>
        {event.type === "income" ? "+" : "−"}{formatPHP(event.amount)}
      </p>

      <Link href={`/paydays?item=${event.id}`} aria-label={`Edit ${event.title}`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Pencil className="h-4 w-4" />
      </Link>
    </div>
  );
}

function PaydaysContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [isTablet, setIsTablet] = useState(false);
  const [selectionView, setSelectionView] = useState<SelectionView>(null);
  const cycles = payCycleSummaries();
  const nextCycle = cycles[0];
  const followingCycle = cycles[1];
  const itemParam = searchParams.get("item");
  const isPlanMode = itemParam === "new" && searchParams.get("mode") === "plan";
  const editingItem = itemParam && itemParam !== "new" ? events.find((event) => event.id === itemParam) : undefined;
  const editorOpen = itemParam === "new" || Boolean(editingItem);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateViewport = () => setIsTablet(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  function closeEditor() {
    setSelectionView(null);
    router.replace(isPlanMode ? "/upcoming" : "/paydays");
  }

  function toggleCompleted(id: string) {
    setCompletedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const editorTitle = editingItem ? `Edit ${editingItem.title}` : isPlanMode ? "Make a plan" : "Add item";
  const drilldownTitle = selectionTitle(selectionView);
  const currentTitle = drilldownTitle ?? editorTitle;

  const editorForm = (
    <FinancialItemForm
      item={editingItem}
      onDone={closeEditor}
      selectionView={selectionView}
      onSelectionViewChange={setSelectionView}
      submitLabel={isPlanMode ? "Add plan" : undefined}
    />
  );

  return (
    <>
      <div className="space-y-6">
        <section className="grid gap-8 pb-2 sm:grid-cols-2 sm:gap-12">
          {nextCycle && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Next payday · {formatDate(nextCycle.payday.date, { month: "short", day: "numeric" })}</p>
              <div>
                <p className="text-sm text-muted-foreground">{cycleResultLabel(nextCycle.result)}</p>
                <p className="mt-0.5 text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">{formatPHP(Math.abs(nextCycle.result))}</p>
              </div>
              <p className="text-sm text-muted-foreground">{formatPHP(nextCycle.income)} income · {formatPHP(nextCycle.needed)} needed</p>
            </div>
          )}

          {followingCycle && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Following payday · {formatDate(followingCycle.payday.date, { month: "short", day: "numeric" })}</p>
              <div>
                <p className="text-sm text-muted-foreground">{cycleResultLabel(followingCycle.result)}</p>
                <p className="mt-0.5 text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">{formatPHP(Math.abs(followingCycle.result))}</p>
              </div>
              <p className="text-sm text-muted-foreground">{formatPHP(followingCycle.income)} income · {formatPHP(followingCycle.needed)} needed</p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          {cycles.map((cycle) => (
            <div key={cycle.payday.id} className="space-y-2">
              <p className="text-sm font-medium">Payday · {formatDate(cycle.payday.date, { month: "short", day: "numeric" })}</p>
              <div className="overflow-hidden rounded-xl bg-muted/45">
                {cycle.items.map((event, eventIndex) => (
                  <UpcomingRow key={event.id} event={event} completed={completedIds.has(event.id)} onToggle={() => toggleCompleted(event.id)} isLast={eventIndex === cycle.items.length - 1} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      {isTablet ? (
        <Drawer open={editorOpen} onOpenChange={(open) => { if (!open) closeEditor(); }} direction="right">
          <DrawerContent>
            <DrawerHeader className="border-b pr-12 text-left">
              <div className="flex items-center gap-2">
                {selectionView && (
                  <Button type="button" variant="ghost" size="icon" aria-label="Back" onClick={() => setSelectionView(null)} className="-ml-2 shrink-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
                <DrawerTitle>{currentTitle}</DrawerTitle>
              </div>
            </DrawerHeader>
            <DrawerClose asChild>
              <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2" aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
            {editorForm}
          </DrawerContent>
        </Drawer>
      ) : (
        <Sheet open={editorOpen} onOpenChange={(open) => { if (!open) closeEditor(); }}>
          <SheetContent side="bottom" className="h-[85dvh] p-0">
            <SheetHeader className="border-b px-4 py-4 pr-12 text-left">
              <div className="flex items-center gap-2">
                {selectionView && (
                  <Button type="button" variant="ghost" size="icon" aria-label="Back" onClick={() => setSelectionView(null)} className="-ml-2 shrink-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
                <SheetTitle>{currentTitle}</SheetTitle>
              </div>
            </SheetHeader>
            {editorForm}
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

export default function PaydaysPage() {
  return (
    <Suspense fallback={null}>
      <PaydaysContent />
    </Suspense>
  );
}
