"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const primaryNav = [
  { href: "/paydays", label: "Paydays" },
  { href: "/upcoming", label: "Upcoming" },
] as const;

function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav className="flex min-w-0 items-center gap-1 text-sm" aria-label="Primary navigation">
      {primaryNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-md px-2 py-2 transition-colors hover:bg-muted",
            pathname === item.href ? "font-medium text-foreground" : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4 sm:px-6">
          <Link href="/paydays" className="shrink-0 font-semibold">Cashflow</Link>

          <PrimaryNav />

          <Link
            href="/paydays?item=new"
            className={cn(buttonVariants({ size: "sm" }), "ml-auto shrink-0 gap-2")}
          >
            <Plus className="h-4 w-4" />
            <span>Add entry</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
    </div>
  );
}
