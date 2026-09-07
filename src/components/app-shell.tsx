"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center px-4 sm:px-6">
          <Link href="/paydays" className="shrink-0 font-semibold">Cashflow</Link>

          <Link
            href="/items/new"
            className="ml-auto inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
    </div>
  );
}
