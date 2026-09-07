"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const steps = ["Welcome", "Accounts", "Regular items", "Upcoming"];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Cashflow setup</span>
          <span>{step + 1} of {steps.length}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {steps.map((label, index) => <div key={label} className={`h-1 rounded-full ${index <= step ? "bg-primary" : "bg-border"}`} />)}
        </div>

        <Card>
          {step === 0 && <><CardHeader><CardTitle className="text-2xl">See what your money should look like by payday.</CardTitle><CardDescription>Start with the balances you know, then add the income and bills that usually happen between paydays.</CardDescription></CardHeader><CardContent><p className="mb-6 text-sm text-muted-foreground">This is a planning estimate, not a live bank balance. You can refresh your starting balances whenever you want a more current forecast.</p><Button onClick={() => setStep(1)}>Set up my cashflow</Button></CardContent></>}

          {step === 1 && <><CardHeader><CardTitle>What balances are you starting from?</CardTitle><CardDescription>Enter the accounts you want the estimate to use.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2"><span className="text-sm font-medium">Account name</span><Input defaultValue="BPI" /></label><label className="grid gap-2"><span className="text-sm font-medium">Entered balance</span><Input defaultValue="200000" inputMode="decimal" /></label><label className="grid gap-2"><span className="text-sm font-medium">Type</span><select className="h-9 rounded-md border bg-background px-3 text-sm"><option>Bank</option><option>Cash</option><option>E-wallet</option><option>Credit card</option></select></label><label className="grid gap-2"><span className="text-sm font-medium">Balance date</span><Input type="date" defaultValue="2026-09-01" /></label></div><p className="text-sm text-muted-foreground">You do not need to enter past transaction history.</p><div className="flex justify-between"><Button variant="outline" onClick={() => setStep(0)}>Back</Button><Button onClick={() => setStep(2)}>Continue</Button></div></CardContent></>}

          {step === 2 && <><CardHeader><CardTitle>What happens every pay cycle?</CardTitle><CardDescription>Regular income and bills are what make the payday estimate useful.</CardDescription></CardHeader><CardContent className="space-y-3"><div className="rounded-lg border p-4"><p className="font-medium">Salary</p><p className="mt-1 text-sm text-muted-foreground">₱100,000 · twice monthly</p></div><div className="rounded-lg border p-4"><p className="font-medium">Mortgage</p><p className="mt-1 text-sm text-muted-foreground">₱20,000 · monthly</p></div><div className="rounded-lg border p-4"><p className="font-medium">Credit-card payment</p><p className="mt-1 text-sm text-muted-foreground">₱12,000 · monthly</p></div><p className="text-xs text-muted-foreground">Seeded examples for this prototype. Editing and persistence come in the next functional pass.</p><div className="flex justify-between pt-2"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button onClick={() => setStep(3)}>Continue</Button></div></CardContent></>}

          {step === 3 && <><CardHeader><CardTitle>Anything else coming up?</CardTitle><CardDescription>Planned spending can be included so you can see its effect across the next paydays.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="rounded-lg border p-4"><p className="font-medium">Hanoi trip</p><p className="mt-1 text-sm text-muted-foreground">₱40,000 · Sep 20 · Planned</p></div><p className="text-sm text-muted-foreground">You can review this alongside your bills and income in Upcoming.</p><div className="flex justify-between"><Button variant="outline" onClick={() => setStep(2)}>Back</Button><Button onClick={() => router.push('/paydays')}>See my paydays</Button></div></CardContent></>}
        </Card>
      </div>
    </main>
  );
}
