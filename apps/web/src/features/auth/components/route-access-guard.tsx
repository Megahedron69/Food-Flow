import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { AssignedMode, UserRole } from "@/features/auth/types";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { AuthLoadingScreen } from "@/features/auth/components/auth-loading-screen";

type RouteAccessGuardProps = PropsWithChildren<{
  roles?: readonly UserRole[];
  assignedMode?: AssignedMode;
  allowSessionTypes?: readonly ("supabase" | "staff")[];
}>;

export function RouteAccessGuard({
  children,
  roles,
  assignedMode,
  allowSessionTypes
}: RouteAccessGuardProps) {
  const location = useLocation();
  const { identity, isLoading, hasRole, hasAssignedMode } = useAuthSession();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!identity) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowSessionTypes && !allowSessionTypes.includes(identity.sessionType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (assignedMode && !hasAssignedMode(assignedMode)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
