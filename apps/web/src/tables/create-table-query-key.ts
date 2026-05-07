import type { TenantContext } from "@foodflow/api-contracts";
import { getTenantScopedQueryKey } from "@/services/tenant-data-access";

export function createTableQueryKey(
  scope: TenantContext,
  tableName: string,
  filters: Record<string, unknown>
) {
  return getTenantScopedQueryKey(scope, ["table", tableName, filters]);
}
