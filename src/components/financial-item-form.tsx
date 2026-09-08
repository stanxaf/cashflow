"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { accounts, type EventType, type FinancialEvent } from "@/lib/seed-data";
import { cn } from "@/lib/utils";

const rowClass = "grid min-h-14 grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-4 px-4";
const inputClass = "h-9 border-0 bg-transparent px-0 text-right shadow-none focus-visible:ring-0";
const selectRowClass = "h-14 w-full rounded-none border-0 bg-transparent px-4 shadow-none focus:ring-0";

function AccountSelect({ label, defaultValue, ariaLabel }: { label: string; defaultValue: string; ariaLabel: string }) {
  return (
    <Select defaultValue={defaultValue}>
      <SelectTrigger className={selectRowClass} aria-label={ariaLabel}>
        <span className="text-sm text-foreground">{label}</span>
        <span className="ml-auto text-sm text-muted-foreground">
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

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
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-2">
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
              <Input name="title" defaultValue={item?.title} placeholder="Required" required className={inputClass} />
            </label>

            <label className={cn(rowClass, "border-b border-border/50")}>
              <span className="text-sm">Amount</span>
              <div className="ml-auto flex items-center text-sm">
                <div className="relative w-28">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-muted-foreground">₱</span>
                  <Input
                    name="amount"
                    inputMode="decimal"
                    defaultValue={item ? item.amount / 100 : undefined}
                    placeholder="0.00"
                    required
                    className="h-9 w-full border-0 bg-transparent py-0 pl-3 pr-0 text-left shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>
            </label>

            <label className={rowClass}>
              <span className="text-sm">{type === "income" ? "Expected" : "Due"}</span>
              <Input name="date" type="date" defaultValue={item?.date ?? "2026-09-08"} required className={inputClass} />
            </label>
          </section>

          <section className="overflow-hidden rounded-xl bg-muted/45">
            {type === "transfer" ? (
              <>
                <div className="border-b border-border/50">
                  <AccountSelect label="From" defaultValue={item?.fromAccountId ?? "bpi"} ariaLabel="From account" />
                </div>
                <AccountSelect label="To" defaultValue={item?.toAccountId ?? "maya"} ariaLabel="To account" />
              </>
            ) : (
              <AccountSelect label="Account" defaultValue={item?.accountId ?? "bpi"} ariaLabel="Account" />
            )}
          </section>

          <section className="overflow-hidden rounded-xl bg-muted/45">
            <div className={cn(rowClass, repeat && "border-b border-border/50")}>
              <span className="text-sm">Repeats</span>
              <div className="flex justify-end">
                <Switch checked={repeat} onCheckedChange={setRepeat} aria-label="Repeats" />
              </div>
            </div>

            {repeat && (
              <Select defaultValue={item?.recurring ? "monthly" : "monthly"}>
                <SelectTrigger className={selectRowClass} aria-label="Frequency">
                  <span className="text-sm text-foreground">Frequency</span>
                  <span className="ml-auto text-sm text-muted-foreground">
                    <SelectValue />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="twice-monthly">Twice monthly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            )}
          </section>

          {item && (
            <AlertDialog>
              <section className="overflow-hidden rounded-xl bg-muted/45">
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="flex min-h-14 w-full items-center justify-center px-4 text-sm font-medium text-destructive transition-colors hover:bg-muted"
                  >
                    Delete item
                  </button>
                </AlertDialogTrigger>
              </section>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete item?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Delete {item.title}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={finish}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t bg-background p-4">
        <Button type="submit" className="w-full">{item ? "Save changes" : "Add item"}</Button>
      </div>
    </form>
  );
}
