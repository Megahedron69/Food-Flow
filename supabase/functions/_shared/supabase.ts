import { createClient } from "npm:@supabase/supabase-js@2.49.8";
import { getEdgeFunctionEnv } from "./env.ts";

export function createServiceClient() {
  const env = getEdgeFunctionEnv();

  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export function createAuthedClient(accessToken: string) {
  const env = getEdgeFunctionEnv();

  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}
