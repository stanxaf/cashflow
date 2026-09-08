import { notFound } from "next/navigation";
import { FinancialItemForm } from "@/components/financial-item-form";
import { events } from "@/lib/seed-data";

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = events.find((event) => event.id === id);
  if (!item) notFound();

  return (
    <div className="fixed inset-0 z-50 bg-black/20 sm:bg-black/25">
      <div className="absolute inset-x-0 bottom-0 h-[88dvh] overflow-hidden rounded-t-2xl bg-background shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:h-full sm:w-[460px] sm:rounded-none sm:border-l">
        <FinancialItemForm item={item} />
      </div>
    </div>
  );
}
