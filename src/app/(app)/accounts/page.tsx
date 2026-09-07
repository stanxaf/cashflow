import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { accounts, availableCash } from "@/lib/seed-data";
import { formatDate, formatPHP } from "@/lib/utils";

export default function AccountsPage() {
  const liquid = accounts.filter((account) => account.type !== "credit_card");
  const creditCards = accounts.filter((account) => account.type === "credit_card");

  return (
    <div className="space-y-6">
      <div><p className="text-sm text-muted-foreground">Where your money is</p><h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Accounts</h1></div>

      <Card>
        <CardHeader><CardTitle>Liquid money</CardTitle><CardDescription>Cash available for your plan</CardDescription></CardHeader>
        <CardContent className="divide-y">
          {liquid.map((account) => (
            <div key={account.id} className="flex items-center justify-between py-4 first:pt-0">
              <div><p className="font-medium">{account.name}</p><p className="text-sm capitalize text-muted-foreground">{account.type.replace('_','-')} · as of {formatDate(account.balanceDate, { month: 'short', day: 'numeric' })}</p></div>
              <p className="font-medium tabular-nums">{formatPHP(account.balance)}</p>
            </div>
          ))}
          <div className="flex items-center justify-between pt-4"><p className="font-medium">Available now</p><p className="text-lg font-semibold tabular-nums">{formatPHP(availableCash())}</p></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Credit cards</CardTitle><CardDescription>Amounts owed are shown separately from available cash</CardDescription></CardHeader>
        <CardContent>
          {creditCards.map((account) => (
            <div key={account.id} className="flex items-center justify-between">
              <div><p className="font-medium">{account.name}</p><p className="text-sm text-muted-foreground">As of {formatDate(account.balanceDate, { month: 'short', day: 'numeric' })}</p></div>
              <p className="font-medium tabular-nums">{formatPHP(Math.abs(account.balance))} owed</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
