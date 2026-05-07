import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/providers/auth-provider";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const location = useLocation();
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Loading
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return children;
}
