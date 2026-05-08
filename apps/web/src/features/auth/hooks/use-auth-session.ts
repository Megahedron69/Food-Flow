import { useMemo } from "react";
import { useAuthStore } from "@/stores/auth-store";
import type { AuthIdentity } from "@/features/auth/types";
import { defaultRedirectPath, hasAssignedMode, hasRole } from "@/features/auth/utils/permissions";

export function useAuthSession() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isOnline = useAuthStore((state) => state.isOnline);
  const profile = useAuthStore((state) => state.profile);
  const staffSession = useAuthStore((state) => state.staffSession);
  const supabaseSession = useAuthStore((state) => state.supabaseSession);

  const identity = useMemo<AuthIdentity | null>(() => {
    if (staffSession) {
      return {
        sessionType: "staff",
        role: "staff",
        assignedMode: staffSession.assignedMode,
        tenantId: staffSession.tenantId,
        outletId: staffSession.outletId,
        displayName: staffSession.fullName
      };
    }

    if (supabaseSession && profile) {
      return {
        sessionType: "supabase",
        role: profile.role,
        assignedMode: profile.assigned_mode,
        tenantId: profile.tenant_id,
        outletId: profile.outlet_id,
        displayName: profile.full_name
      };
    }

    return null;
  }, [profile, staffSession, supabaseSession]);

  return {
    isLoading,
    isOnline,
    isAuthenticated: Boolean(identity),
    identity,
    defaultRedirectPath: defaultRedirectPath(identity),
    hasRole: (roles: Parameters<typeof hasRole>[1]) => hasRole(identity, roles),
    hasAssignedMode: (mode: Parameters<typeof hasAssignedMode>[1]) =>
      hasAssignedMode(identity, mode)
  };
}
