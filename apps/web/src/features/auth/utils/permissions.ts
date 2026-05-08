import type { AssignedMode, AuthIdentity, UserRole } from "@/features/auth/types";

export function hasRole(identity: AuthIdentity | null, roles: readonly UserRole[]) {
  if (!identity) {
    return false;
  }

  return roles.includes(identity.role);
}

export function hasAssignedMode(identity: AuthIdentity | null, mode: AssignedMode) {
  if (!identity) {
    return false;
  }

  return identity.assignedMode === mode;
}

export function defaultRedirectPath(identity: AuthIdentity | null) {
  if (!identity) {
    return "/login";
  }

  if (identity.sessionType === "staff") {
    return identity.assignedMode === "kds" ? "/kds" : "/pos";
  }

  if (identity.role === "platform_admin") {
    return "/platform";
  }

  return "/app";
}
