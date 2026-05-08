import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@foodflow/ui";
import { Button } from "@foodflow/ui";
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useAuthStore } from "@/stores/auth-store";

export function PosPage() {
  const navigate = useNavigate();
  const { identity, isOnline } = useAuthSession();
  const setStaffSession = useAuthStore((state) => state.setStaffSession);

  const onLogout = () => {
    setStaffSession(null);
    void navigate("/staff-login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-semibold">POS Terminal</h1>
          <p className="text-sm text-muted-foreground">
            Welcome {identity?.displayName}. Outlet operations are ready.
          </p>
          <div>
            <Button type="button" variant="outline" className="mt-3" onClick={onLogout}>
              End Shift Session
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Operational Status</CardTitle>
            <CardDescription>
              Session mode: staff-pos · Connectivity: {isOnline ? "Online" : "Offline"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            POS billing modules can now be mounted in this protected operational shell.
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
