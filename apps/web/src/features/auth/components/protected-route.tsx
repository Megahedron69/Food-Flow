import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/providers/auth-provider";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const location = useLocation();
  const { isLoading, session, profile } = useAuth();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Loading
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!profile) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Preparing workspace
      </div>
    );
  }

  return children;
}
