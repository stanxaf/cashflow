import { FinancialItemForm } from "@/components/financial-item-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewItemPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div><p className="text-sm text-muted-foreground">Manual entry</p><h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Add item</h1></div>
      <Card><CardHeader><CardTitle>Financial item</CardTitle><CardDescription>Add an actual, scheduled, or planned event to your cashflow.</CardDescription></CardHeader><CardContent><FinancialItemForm /></CardContent></Card>
    </div>
  );
}
