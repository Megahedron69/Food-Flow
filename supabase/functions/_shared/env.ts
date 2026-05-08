type EdgeFunctionEnv = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  DATABASE_URL?: string;
  DIRECT_URL?: string;
  STRIPE_SECRET_KEY?: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  RESEND_API_KEY?: string;
  REDIS_URL?: string;
};

function required(name: keyof EdgeFunctionEnv): string {
  const value = Deno.env.get(name);
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function requiredSupabaseAnonKey(): string {
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_ACCESS_TOKEN");
  if (!anonKey || anonKey.trim().length === 0) {
    throw new Error(
      "Missing required environment variable: SUPABASE_ANON_KEY or SUPABASE_ACCESS_TOKEN"
    );
  }

  return anonKey;
}

export function getEdgeFunctionEnv(): EdgeFunctionEnv {
  const env: EdgeFunctionEnv = {
    SUPABASE_URL: required("SUPABASE_URL"),
    SUPABASE_ANON_KEY: requiredSupabaseAnonKey(),
    SUPABASE_SERVICE_ROLE_KEY: required("SUPABASE_SERVICE_ROLE_KEY"),
    DATABASE_URL: Deno.env.get("DATABASE_URL") ?? undefined,
    DIRECT_URL: Deno.env.get("DIRECT_URL") ?? undefined,
    STRIPE_SECRET_KEY: Deno.env.get("STRIPE_SECRET_KEY") ?? undefined,
    RAZORPAY_KEY_ID: Deno.env.get("RAZORPAY_KEY_ID") ?? undefined,
    RAZORPAY_KEY_SECRET: Deno.env.get("RAZORPAY_KEY_SECRET") ?? undefined,
    RESEND_API_KEY: Deno.env.get("RESEND_API_KEY") ?? undefined,
    REDIS_URL: Deno.env.get("REDIS_URL") ?? undefined
  };

  new URL(env.SUPABASE_URL);
  return env;
}
