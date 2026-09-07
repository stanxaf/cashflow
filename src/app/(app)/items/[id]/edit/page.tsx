import { notFound } from "next/navigation";
import { FinancialItemForm } from "@/components/financial-item-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { events } from "@/lib/seed-data";

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = events.find((event) => event.id === id);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div><p className="text-sm text-muted-foreground">Plan item</p><h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Edit {item.title}</h1></div>
      <Card><CardHeader><CardTitle>Financial item</CardTitle><CardDescription>Changes update the prototype forecast when persistence is added.</CardDescription></CardHeader><CardContent><FinancialItemForm item={item} /></CardContent></Card>
    </div>
  );
}
