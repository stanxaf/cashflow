"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const steps = ["Welcome", "Accounts", "Regular items", "Upcoming plan"];

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
          {step === 0 && <><CardHeader><CardTitle className="text-2xl">Know what your money will look like next.</CardTitle><CardDescription>Start with what you have today, then add the income, bills, and plans that are coming up.</CardDescription></CardHeader><CardContent><p className="mb-6 text-sm text-muted-foreground">You can add more later. No past transaction history is required.</p><Button onClick={() => setStep(1)}>Set up my plan</Button></CardContent></>}

          {step === 1 && <><CardHeader><CardTitle>Where is your money today?</CardTitle><CardDescription>Add the accounts you want included in your plan.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2"><span className="text-sm font-medium">Account name</span><Input defaultValue="BPI" /></label><label className="grid gap-2"><span className="text-sm font-medium">Current balance</span><Input defaultValue="200000" inputMode="decimal" /></label><label className="grid gap-2"><span className="text-sm font-medium">Type</span><select className="h-9 rounded-md border bg-background px-3 text-sm"><option>Bank</option><option>Cash</option><option>E-wallet</option><option>Credit card</option></select></label><label className="grid gap-2"><span className="text-sm font-medium">Balance date</span><Input type="date" defaultValue="2026-09-07" /></label></div><p className="text-sm text-muted-foreground">Use the balance you have right now. You do not need to enter past transactions.</p><div className="flex justify-between"><Button variant="outline" onClick={() => setStep(0)}>Back</Button><Button onClick={() => setStep(2)}>Continue</Button></div></CardContent></>}

          {step === 2 && <><CardHeader><CardTitle>What happens regularly?</CardTitle><CardDescription>Add your salary, bills, and recurring payments.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="rounded-lg border p-4"><p className="font-medium">Salary</p><p className="mt-1 text-sm text-muted-foreground">₱100,000 · BPI · twice monthly</p></div><Button variant="outline" className="w-full">+ Add regular item</Button><div className="flex justify-between"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><div className="flex gap-2"><Button variant="ghost" onClick={() => setStep(3)}>Skip for now</Button><Button onClick={() => setStep(3)}>Continue</Button></div></div></CardContent></>}

          {step === 3 && <><CardHeader><CardTitle>Anything coming up?</CardTitle><CardDescription>Add a trip, purchase, or other expense you are planning for.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="rounded-lg border p-4"><p className="font-medium">Hanoi trip</p><p className="mt-1 text-sm text-muted-foreground">₱40,000 · Sep 20 · Planned</p></div><Button variant="outline" className="w-full">+ Add planned item</Button><div className="flex justify-between"><Button variant="outline" onClick={() => setStep(2)}>Back</Button><div className="flex gap-2"><Button variant="ghost" onClick={() => router.push('/today')}>Skip for now</Button><Button onClick={() => router.push('/today')}>Finish setup</Button></div></div></CardContent></>}
        </Card>
      </div>
    </main>
  );
}
