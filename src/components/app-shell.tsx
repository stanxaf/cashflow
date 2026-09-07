"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarClock, Landmark, ListChecks, Plus, Settings2, WalletCards } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/paydays", label: "Paydays", icon: CalendarClock },
  { href: "/upcoming", label: "Upcoming", icon: ListChecks },
  { href: "/accounts", label: "Accounts", icon: Landmark },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/paydays" className="flex items-center gap-2 font-semibold">
            <WalletCards className="h-5 w-5" /> Cashflow
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground", active && "bg-accent text-accent-foreground font-medium")}>
                <Icon className="h-4 w-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3">
          <Link href="/settings" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            <Settings2 className="h-4 w-4" /> Settings
          </Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <Link href="/paydays" className="font-semibold lg:hidden">Cashflow</Link>
          <div className="hidden lg:block" />
          <Link href="/items/new" className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add item
          </Link>
        </header>
        <main className="mx-auto w-full max-w-5xl p-4 pb-24 sm:p-6 lg:p-8">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t bg-background lg:hidden">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={cn("flex min-h-16 flex-col items-center justify-center gap-1 text-xs text-muted-foreground", active && "text-foreground font-medium")}>
              <Icon className="h-5 w-5" /> {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
