"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/paydays", label: "Cashflow" },
  { href: "/accounts", label: "Accounts" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-6 px-4 sm:px-6">
          <Link href="/paydays" className="shrink-0 font-semibold">Cashflow</Link>

          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              href="/accounts"
              className={cn(
                "rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground",
                pathname.startsWith("/accounts") && "font-medium text-foreground"
              )}
            >
              Accounts
            </Link>
          </nav>

          <Link
            href="/items/new"
            className="ml-auto inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8 pb-24 sm:px-6 sm:py-12">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t bg-background sm:hidden">
        {navItems.map(({ href, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-14 items-center justify-center text-sm text-muted-foreground",
                active && "font-medium text-foreground"
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
