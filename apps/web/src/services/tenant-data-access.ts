import type { TenantContext } from "@foodflow/api-contracts";
import { tenantContextSchema } from "@foodflow/api-contracts";

export function assertTenantContext(value: unknown): TenantContext {
  return tenantContextSchema.parse(value);
}

export function getTenantScopedQueryKey(scope: TenantContext, key: readonly unknown[]) {
  return ["tenant", scope.tenantId, scope.outletId ?? "all-outlets", ...key] as const;
}
