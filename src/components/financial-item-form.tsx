"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { accounts, type EventType, type FinancialEvent } from "@/lib/seed-data";
import { cn } from "@/lib/utils";

const rowClass = "grid min-h-14 grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-4 px-4";
const inputClass = "h-9 border-0 bg-transparent px-0 text-right shadow-none focus-visible:ring-0";

export type SelectionView = "account" | "from" | "to" | "frequency" | null;

const frequencies = [
  { value: "weekly", label: "Weekly" },
  { value: "twice-monthly", label: "Twice monthly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

function SelectionRow({ label, selected, onSelect, isLast }: { label: string; selected: boolean; onSelect: () => void; isLast: boolean }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex min-h-14 w-full items-center justify-between gap-4 px-4 text-left text-sm transition-colors hover:bg-muted/60",
        !isLast && "border-b border-border/50"
      )}
    >
      <span>{label}</span>
      {selected && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
    </button>
  );
}

function DrilldownRow({ label, value, onOpen, hasBorder = false }: { label: string; value: string; onOpen: () => void; hasBorder?: boolean }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "flex min-h-14 w-full items-center gap-4 px-4 text-left text-sm transition-colors hover:bg-muted/60",
        hasBorder && "border-b border-border/50"
      )}
    >
      <span>{label}</span>
      <span className="ml-auto text-muted-foreground">{value}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
    </button>
  );
}

export function FinancialItemForm({
  item,
  onDone,
  selectionView,
  onSelectionViewChange,
  submitLabel,
}: {
  item?: FinancialEvent;
  onDone?: () => void;
  selectionView: SelectionView;
  onSelectionViewChange: (view: SelectionView) => void;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [type, setType] = useState<EventType>(item?.type ?? "expense");
  const [repeat, setRepeat] = useState(Boolean(item?.recurring));
  const [accountId, setAccountId] = useState(item?.accountId ?? "bpi");
  const [fromAccountId, setFromAccountId] = useState(item?.fromAccountId ?? "bpi");
  const [toAccountId, setToAccountId] = useState(item?.toAccountId ?? "maya");
  const [frequency, setFrequency] = useState("monthly");
  const finish = onDone ?? (() => router.push("/paydays"));

  const accountName = (id: string) => accounts.find((account) => account.id === id)?.name ?? "Select";
  const frequencyName = frequencies.find((option) => option.value === frequency)?.label ?? "Select";

  if (selectionView) {
    const isFrequency = selectionView === "frequency";
    const selectedAccountId = selectionView === "from" ? fromAccountId : selectionView === "to" ? toAccountId : accountId;

    return (
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-4">
        <div className="mx-auto w-full max-w-lg">
          <section className="overflow-hidden rounded-xl bg-muted/45">
            {isFrequency
              ? frequencies.map((option, index) => (
                  <SelectionRow
                    key={option.value}
                    label={option.label}
                    selected={frequency === option.value}
                    isLast={index === frequencies.length - 1}
                    onSelect={() => {
                      setFrequency(option.value);
                      onSelectionViewChange(null);
                    }}
                  />
                ))
              : accounts.map((account, index) => (
                  <SelectionRow
                    key={account.id}
                    label={account.name}
                    selected={selectedAccountId === account.id}
                    isLast={index === accounts.length - 1}
                    onSelect={() => {
                      if (selectionView === "from") setFromAccountId(account.id);
                      else if (selectionView === "to") setToAccountId(account.id);
                      else setAccountId(account.id);
                      onSelectionViewChange(null);
                    }}
                  />
                ))}
          </section>
        </div>
      </div>
    );
  }

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        finish();
      }}
    >
      <input type="hidden" name="accountId" value={accountId} />
      <input type="hidden" name="fromAccountId" value={fromAccountId} />
      <input type="hidden" name="toAccountId" value={toAccountId} />
      <input type="hidden" name="frequency" value={frequency} />

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
              <span className="text-sm">Amount (₱)</span>
              <Input
                name="amount"
                inputMode="decimal"
                defaultValue={item ? item.amount / 100 : undefined}
                placeholder="0.00"
                required
                className={inputClass}
              />
            </label>

            <label className={rowClass}>
              <span className="text-sm">{type === "income" ? "Expected" : "Due"}</span>
              <Input name="date" type="date" defaultValue={item?.date ?? "2026-09-08"} required className={inputClass} />
            </label>
          </section>

          <section className="overflow-hidden rounded-xl bg-muted/45">
            {type === "transfer" ? (
              <>
                <DrilldownRow label="From" value={accountName(fromAccountId)} onOpen={() => onSelectionViewChange("from")} hasBorder />
                <DrilldownRow label="To" value={accountName(toAccountId)} onOpen={() => onSelectionViewChange("to")} />
              </>
            ) : (
              <DrilldownRow label="Account" value={accountName(accountId)} onOpen={() => onSelectionViewChange("account")} />
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
              <DrilldownRow label="Frequency" value={frequencyName} onOpen={() => onSelectionViewChange("frequency")} />
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
        <Button type="submit" size="default" className="w-full">{submitLabel ?? (item ? "Save changes" : "Add item")}</Button>
      </div>
    </form>
  );
}
