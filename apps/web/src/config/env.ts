import { webEnvSchema } from "@foodflow/api-contracts";

function readViteEnv(key: string): string | undefined {
  const envRecord = import.meta.env as Record<string, unknown>;
  const value = envRecord[key];

  return typeof value === "string" ? value : undefined;
}

export const env = webEnvSchema.parse({
  VITE_SUPABASE_URL: readViteEnv("VITE_SUPABASE_URL"),
  VITE_SUPABASE_ANON_KEY: readViteEnv("VITE_SUPABASE_ANON_KEY"),
  VITE_SENTRY_DSN: readViteEnv("VITE_SENTRY_DSN")
});
