import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div><p className="text-sm text-muted-foreground">Prototype preferences</p><h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Settings</h1></div>
      <Card>
        <CardHeader><CardTitle>Money and dates</CardTitle><CardDescription>These are fixed for the local prototype.</CardDescription></CardHeader>
        <CardContent className="divide-y">
          <div className="flex items-center justify-between py-4 first:pt-0"><span className="text-sm font-medium">Currency</span><span className="text-sm text-muted-foreground">PHP (₱)</span></div>
          <div className="flex items-center justify-between pt-4"><span className="text-sm font-medium">Timezone</span><span className="text-sm text-muted-foreground">Asia/Manila</span></div>
        </CardContent>
      </Card>
    </div>
  );
}
