import { AppShell } from "@/components/app-shell";
import { PrototypeStoreProvider } from "@/components/prototype-store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrototypeStoreProvider>
      <AppShell>{children}</AppShell>
    </PrototypeStoreProvider>
  );
}
