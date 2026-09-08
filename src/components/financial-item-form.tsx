"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { accounts, type EventType, type FinancialEvent } from "@/lib/seed-data";
import { cn } from "@/lib/utils";

const rowClass = "grid min-h-14 grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-4 px-4";
const controlClass = "w-full bg-transparent text-right text-sm outline-none placeholder:text-muted-foreground/70";
const selectClass = `${controlClass} appearance-none`;

export function FinancialItemForm({ item, onDone }: { item?: FinancialEvent; onDone?: () => void }) {
  const router = useRouter();
  const [type, setType] = useState<EventType>(item?.type ?? "expense");
  const [repeat, setRepeat] = useState(Boolean(item?.recurring));
  const finish = onDone ?? (() => router.push("/paydays"));

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        finish();
      }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-2">
        <div className="mx-auto w-full max-w-lg space-y-5">
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
            {(["expense", "income", "transfer"] as EventType[]).map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => setType(value)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors",
                  type === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                {value}
              </button>
            ))}
          </div>

          <section className="overflow-hidden rounded-xl bg-muted/45">
            <label className={cn(rowClass, "border-b border-border/50")}>
              <span className="text-sm">Title</span>
              <input name="title" defaultValue={item?.title} placeholder="Required" required className={controlClass} />
            </label>
            <label className={cn(rowClass, "border-b border-border/50")}>
              <span className="text-sm">Amount</span>
              <div className="flex items-center justify-end gap-1 text-sm">
                <span className="text-muted-foreground">₱</span>
                <input
                  name="amount"
                  inputMode="decimal"
                  defaultValue={item ? item.amount / 100 : undefined}
                  placeholder="0.00"
                  required
                  className="min-w-0 flex-1 bg-transparent text-right outline-none placeholder:text-muted-foreground/70"
                />
              </div>
            </label>
            <label className={rowClass}>
              <span className="text-sm">{type === "income" ? "Expected" : "Due"}</span>
              <input name="date" type="date" defaultValue={item?.date ?? "2026-09-08"} required className={controlClass} />
            </label>
          </section>

          <section className="overflow-hidden rounded-xl bg-muted/45">
            {type === "transfer" ? (
              <>
                <label className={cn(rowClass, "border-b border-border/50")}>
                  <span className="text-sm">From</span>
                  <div className="flex items-center justify-end gap-1">
                    <select className={selectClass} defaultValue={item?.fromAccountId ?? "bpi"}>
                      {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
                    </select>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                </label>
                <label className={rowClass}>
                  <span className="text-sm">To</span>
                  <div className="flex items-center justify-end gap-1">
                    <select className={selectClass} defaultValue={item?.toAccountId ?? "maya"}>
                      {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
                    </select>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                </label>
              </>
            ) : (
              <label className={rowClass}>
                <span className="text-sm">Account</span>
                <div className="flex items-center justify-end gap-1">
                  <select className={selectClass} defaultValue={item?.accountId ?? "bpi"}>
                    {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
                  </select>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </label>
            )}
          </section>

          <section className="overflow-hidden rounded-xl bg-muted/45">
            <label className={cn(rowClass, repeat && "border-b border-border/50")}>
              <span className="text-sm">Repeats</span>
              <span className="flex justify-end">
                <input type="checkbox" checked={repeat} onChange={(event) => setRepeat(event.target.checked)} className="h-5 w-5 accent-foreground" />
              </span>
            </label>
            {repeat && (
              <label className={rowClass}>
                <span className="text-sm">Frequency</span>
                <div className="flex items-center justify-end gap-1">
                  <select className={selectClass} defaultValue={item?.recurring ? "monthly" : "monthly"}>
                    <option value="weekly">Weekly</option>
                    <option value="twice-monthly">Twice monthly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </label>
            )}
          </section>

          {item && (
            <Button type="button" variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
              Delete item
            </Button>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t bg-background p-4">
        <Button type="submit" className="w-full">{item ? "Save changes" : "Add item"}</Button>
      </div>
    </form>
  );
}
