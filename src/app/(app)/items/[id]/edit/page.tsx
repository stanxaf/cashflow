import { notFound, redirect } from "next/navigation";
import { events } from "@/lib/seed-data";

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = events.find((event) => event.id === id);
  if (!item) notFound();

  redirect(`/paydays?item=${id}`);
}
