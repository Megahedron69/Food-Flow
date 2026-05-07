import { z } from "zod";

export const appRoleSchema = z.enum([
  "platform_admin",
  "owner",
  "outlet_manager",
  "cashier",
  "kitchen_staff"
]);

export const sessionProfileSchema = z.object({
  userId: z.uuid(),
  tenantId: z.uuid().nullable(),
  outletId: z.uuid().nullable(),
  role: appRoleSchema
});

export type AppRole = z.infer<typeof appRoleSchema>;
export type SessionProfile = z.infer<typeof sessionProfileSchema>;
