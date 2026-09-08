import { accounts, enteredLiquidBalance, latestLiquidBalanceDate } from "@/lib/seed-data";
import { formatDate, formatPHP } from "@/lib/utils";

export default function AccountsPage() {
  const liquid = accounts.filter((account) => account.type !== "credit_card");
  const creditCards = accounts.filter((account) => account.type === "credit_card");

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Accounts</h1>
        <p className="text-sm text-muted-foreground">Balances you entered for the forecast.</p>
      </header>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-medium">Liquid accounts</h2>
          <p className="text-xs text-muted-foreground">Updated {formatDate(latestLiquidBalanceDate(), { month: "short", day: "numeric" })}</p>
        </div>

        <div className="divide-y border-y">
          {liquid.map((account) => (
            <div key={account.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium">{account.name}</p>
                <p className="mt-0.5 text-xs capitalize text-muted-foreground">{account.type.replace("_", "-")}</p>
              </div>
              <p className="text-sm font-medium tabular-nums">{formatPHP(account.balance)}</p>
            </div>
          ))}
        </div>

        <div className="flex items-baseline justify-between gap-4 pt-1">
          <p className="text-sm text-muted-foreground">Entered total</p>
          <p className="text-lg font-semibold tabular-nums">{formatPHP(enteredLiquidBalance())}</p>
        </div>
      </section>

      {creditCards.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium">Credit cards</h2>
          <div className="divide-y border-y">
            {creditCards.map((account) => (
              <div key={account.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-medium">{account.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Balance entered {formatDate(account.balanceDate, { month: "short", day: "numeric" })}</p>
                </div>
                <p className="text-sm font-medium tabular-nums">{formatPHP(Math.abs(account.balance))} owed</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
