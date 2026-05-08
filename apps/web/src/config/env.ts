import { webEnvSchema } from "@foodflow/api-contracts";

function readViteEnv(key: string): string | undefined {
  const envRecord = import.meta.env as Record<string, unknown>;
  const value = envRecord[key];

  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
}

const parsedEnv = webEnvSchema.safeParse({
  VITE_SUPABASE_URL: readViteEnv("VITE_SUPABASE_URL"),
  VITE_SUPABASE_ANON_KEY: readViteEnv("VITE_SUPABASE_ANON_KEY"),
  VITE_SENTRY_DSN: readViteEnv("VITE_SENTRY_DSN")
});

if (!parsedEnv.success) {
  throw new Error(
    [
      "Invalid web environment configuration.",
      "Set required Vite variables in apps/web/.env:",
      "- VITE_SUPABASE_URL=https://<project-ref>.supabase.co",
      "- VITE_SUPABASE_ANON_KEY=<supabase-publishable-anon-key>",
      "",
      `Validation details: ${JSON.stringify(parsedEnv.error.issues)}`
    ].join("\n")
  );
}

export const env = parsedEnv.data;
