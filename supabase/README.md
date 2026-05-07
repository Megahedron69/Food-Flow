# Supabase Workspace

This directory owns FoodFlow database migrations, local Supabase configuration, edge functions, and seed files.

## Common Commands

```bash
supabase start
supabase migration new <descriptive_name>
supabase db reset
supabase functions new <function-name>
supabase gen types typescript --local > packages/types/src/database.generated.ts
```

Keep tenant isolation, financial invariants, inventory adjustments, and audit behavior in migrations or Postgres RPC functions. Edge Functions are reserved for privileged actions, webhooks, scheduled jobs, and server-only secrets.
