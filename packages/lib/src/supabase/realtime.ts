import type { RealtimeChannel } from "@supabase/supabase-js";
import type { FoodFlowSupabaseClient } from "./client";

export function createOutletChannel(
  client: FoodFlowSupabaseClient,
  tenantId: string,
  outletId: string
): RealtimeChannel {
  return client.channel(`tenant:${tenantId}:outlet:${outletId}`, {
    config: {
      broadcast: { self: false },
      presence: { key: outletId }
    }
  });
}
