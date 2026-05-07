import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@foodflow/types";

export type FoodFlowSupabaseClient = SupabaseClient<Database>;

export function createBrowserSupabaseClient(url: string, anonKey: string): FoodFlowSupabaseClient {
  return createClient<Database>(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });
}
