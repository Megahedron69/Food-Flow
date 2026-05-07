import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@foodflow/ui";

export function DashboardPage() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-normal">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Operational workspace shell for tenant-aware modules.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Foundation Ready</CardTitle>
          <CardDescription>
            Feature modules can now add tables, charts, realtime channels, and offline workflows
            without changing the app shell.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No demo business data is rendered in this scaffold.
        </CardContent>
      </Card>
    </section>
  );
}
