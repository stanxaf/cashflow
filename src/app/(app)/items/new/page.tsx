import { redirect } from "next/navigation";

export default function NewItemPage() {
  redirect("/paydays?item=new");
}
