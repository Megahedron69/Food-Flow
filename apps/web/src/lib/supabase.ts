import { createBrowserSupabaseClient } from "@foodflow/lib";
import { env } from "@/config/env";

export const supabase = createBrowserSupabaseClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY
);
