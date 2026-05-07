import { z } from "zod";

export const tenantContextSchema = z.object({
  tenantId: z.uuid(),
  outletId: z.uuid().optional()
});

export type TenantContext = z.infer<typeof tenantContextSchema>;
