import { Link } from "react-router-dom";
import { Button } from "@foodflow/ui";

export function UnauthorizedPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/20 px-4">
      <section className="w-full max-w-md rounded-xl border bg-card p-8 text-center">
        <h1 className="font-display text-2xl font-semibold">Unauthorized</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account does not have access to this workspace.
        </p>
        <Button asChild className="mt-6 w-full">
          <Link to="/login">Back to login</Link>
        </Button>
      </section>
    </main>
  );
}
