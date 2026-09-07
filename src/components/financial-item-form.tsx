"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { accounts, type EventState, type EventType, type FinancialEvent } from "@/lib/seed-data";

export function FinancialItemForm({ item }: { item?: FinancialEvent }) {
  const router = useRouter();
  const [type, setType] = useState<EventType>(item?.type ?? "expense");
  const [state, setState] = useState<EventState>(item?.state ?? "planned");
  const [repeat, setRepeat] = useState(Boolean(item?.recurring));

  const fieldClass = "grid gap-2";
  const selectClass = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); router.push("/plan"); }}>
      <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
        {(["expense", "income", "transfer"] as EventType[]).map((value) => (
          <button type="button" key={value} onClick={() => setType(value)} className={`rounded-md px-3 py-2 text-sm font-medium capitalize ${type === value ? "bg-background shadow-sm" : "text-muted-foreground"}`}>{value}</button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${fieldClass} sm:col-span-2`}><span className="text-sm font-medium">Title</span><Input name="title" defaultValue={item?.title} placeholder="e.g. Hanoi trip" required /></label>
        <label className={fieldClass}><span className="text-sm font-medium">Amount</span><Input name="amount" inputMode="decimal" defaultValue={item ? item.amount / 100 : undefined} placeholder="0.00" required /></label>
        <label className={fieldClass}><span className="text-sm font-medium">Date</span><Input name="date" type="date" defaultValue={item?.date ?? "2026-09-08"} required /></label>

        {type === "transfer" ? (
          <>
            <label className={fieldClass}><span className="text-sm font-medium">From account</span><select className={selectClass} defaultValue={item?.fromAccountId ?? "bpi"}>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label>
            <label className={fieldClass}><span className="text-sm font-medium">To account</span><select className={selectClass} defaultValue={item?.toAccountId ?? "maya"}>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label>
          </>
        ) : (
          <label className={`${fieldClass} sm:col-span-2`}><span className="text-sm font-medium">Account</span><select className={selectClass} defaultValue={item?.accountId ?? "bpi"}>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label>
        )}
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">Status</span>
        <div className="grid grid-cols-3 gap-2">
          {(["actual", "scheduled", "planned"] as EventState[]).map((value) => (
            <button type="button" key={value} onClick={() => setState(value)} className={`h-9 rounded-md border px-3 text-sm capitalize ${state === value ? "bg-primary text-primary-foreground" : "bg-background"}`}>{value}</button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Actual has already happened. Scheduled is expected. Planned is an assumption you can change.</p>
      </div>

      <label className="flex items-center justify-between gap-4 rounded-lg border p-4">
        <span><span className="block text-sm font-medium">Repeats</span><span className="block text-xs text-muted-foreground">Use for salary, rent, bills, and other regular items.</span></span>
        <input type="checkbox" checked={repeat} onChange={(event) => setRepeat(event.target.checked)} className="h-4 w-4" />
      </label>

      {repeat && <label className={fieldClass}><span className="text-sm font-medium">Frequency</span><select className={selectClass} defaultValue={item?.recurring ? "monthly" : "monthly"}><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></label>}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={fieldClass}><span className="text-sm font-medium">Category <span className="text-muted-foreground">optional</span></span><Input name="category" placeholder="Travel" /></label>
        <label className={fieldClass}><span className="text-sm font-medium">Notes <span className="text-muted-foreground">optional</span></span><Input name="notes" placeholder="Add a note" /></label>
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit">{item ? "Save changes" : "Add item"}</Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">Prototype only — changes are not persisted yet.</p>
    </form>
  );
}
