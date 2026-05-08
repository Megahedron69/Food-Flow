import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@foodflow/ui";

export function PlatformPage() {
  return (
    <main className="min-h-screen bg-muted/20 p-4 sm:p-6">
      <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-semibold">Platform Admin Console</h1>
          <p className="text-sm text-muted-foreground">Restricted global operations workspace.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Global Control Plane</CardTitle>
            <CardDescription>
              Tenant lifecycle, compliance, and support workflows can be mounted here.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This route is only available to platform admins.
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
