import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { accounts, enteredLiquidBalance, latestLiquidBalanceDate } from "@/lib/seed-data";
import { formatDate, formatPHP } from "@/lib/utils";

export default function AccountsPage() {
  const liquid = accounts.filter((account) => account.type !== "credit_card");
  const creditCards = accounts.filter((account) => account.type === "credit_card");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">The starting point for your estimates</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Accounts</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          These are manually entered balances, not live bank data. Update them when you want a fresher forecast.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Starting balances</CardTitle>
          <CardDescription>Last updated {formatDate(latestLiquidBalanceDate(), { month: "long", day: "numeric" })}</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          {liquid.map((account) => (
            <div key={account.id} className="flex items-center justify-between gap-4 py-4 first:pt-0">
              <div>
                <p className="font-medium">{account.name}</p>
                <p className="text-sm capitalize text-muted-foreground">{account.type.replace("_", "-")} · entered {formatDate(account.balanceDate, { month: "short", day: "numeric" })}</p>
              </div>
              <p className="font-medium tabular-nums">{formatPHP(account.balance)}</p>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 pt-4">
            <div>
              <p className="font-medium">Entered liquid balance</p>
              <p className="text-xs text-muted-foreground">Used as the base for your expected positions.</p>
            </div>
            <p className="text-lg font-semibold tabular-nums">{formatPHP(enteredLiquidBalance())}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credit cards</CardTitle>
          <CardDescription>Debt is tracked separately; scheduled card payments affect your cash forecast.</CardDescription>
        </CardHeader>
        <CardContent>
          {creditCards.map((account) => (
            <div key={account.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{account.name}</p>
                <p className="text-sm text-muted-foreground">Entered {formatDate(account.balanceDate, { month: "short", day: "numeric" })}</p>
              </div>
              <p className="font-medium tabular-nums">{formatPHP(Math.abs(account.balance))} owed</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
