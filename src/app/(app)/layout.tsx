import { AppShell } from "@/components/app-shell";
import { PrototypeStoreProvider } from "@/components/prototype-store";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrototypeStoreProvider>
      <AppShell>{children}</AppShell>
      <Toaster />
    </PrototypeStoreProvider>
  );
}
