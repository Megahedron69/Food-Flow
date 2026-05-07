# FoodFlow

FoodFlow is a cloud-native restaurant POS SaaS foundation built for multi-outlet operators, offline-first counter workflows, and Supabase-first development.

## Architecture

```txt
apps/
  web/                  React + Vite admin/POS app
  docs/                 Documentation workspace placeholder

packages/
  api-contracts/        Zod schemas and shared contracts
  config/               Shared TypeScript config package
  lib/                  Shared utilities and Supabase helpers
  types/                Shared TypeScript and generated Supabase types
  ui/                   Shared shadcn-style UI components

supabase/
  migrations/           SQL migrations
  functions/            Supabase Edge Functions
  seed.sql              Local seed entrypoint
  config.toml           Local Supabase config
```

## Stack

- React, Vite, TypeScript
- Tailwind CSS and shadcn/ui conventions
- Zustand for local operational state
- TanStack Query and TanStack Table
- React Hook Form and Zod
- Recharts
- Supabase Auth, Postgres, Realtime, Storage, Edge Functions
- TurboRepo and pnpm workspaces
- ESLint, Prettier, Husky, lint-staged, Vitest

## Setup

```bash
pnpm install
cp .env.example .env
cp apps/web/.env.example apps/web/.env
cp supabase/functions/.env.example supabase/functions/.env
pnpm dev
```

The web app expects:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Supabase

Start local Supabase:

```bash
supabase start
```

Create a migration:

```bash
supabase migration new <descriptive_name>
```

Apply local migrations from a clean database:

```bash
supabase db reset
```

Create an Edge Function:

```bash
supabase functions new <function-name>
```

Generate TypeScript database types:

```bash
supabase gen types typescript --local > packages/types/src/database.generated.ts
```

For the hosted project:

```bash
supabase link --project-ref jzkwpypwtaoupxjuvdtg
supabase gen types typescript --linked > packages/types/src/database.generated.ts
```

## Environment Variables

Root `.env` is for local tooling and deploy automation:

```bash
SUPABASE_ACCESS_TOKEN=
SUPABASE_PROJECT_REF=
DATABASE_URL=
DIRECT_URL=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
SENTRY_AUTH_TOKEN=
SENTRY_DSN=
RESEND_API_KEY=
REDIS_URL=
VERCEL_TOKEN=
CLOUDFLARE_API_TOKEN=
```

Frontend variables must be safe to expose to the browser and use the `VITE_` prefix.

Edge Function secrets stay in Supabase and local function env files. Never expose service role keys to the frontend.

## Development Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm format
```

## Deployment

Frontend:

```bash
pnpm --filter @foodflow/web build
```

Deploy `apps/web` to Vercel or Cloudflare Pages. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the hosting provider.

Supabase:

```bash
supabase link --project-ref jzkwpypwtaoupxjuvdtg
supabase db push
supabase functions deploy <function-name>
```

## Coding Standards

- TypeScript strict mode is mandatory.
- Shared data contracts live in `packages/api-contracts`.
- Generated database types live in `packages/types`.
- Supabase client helpers live in `packages/lib`.
- UI primitives live in `packages/ui`.
- Feature code in `apps/web/src/features/<feature>`.
- Tenant isolation should be enforced in Postgres RLS and reflected in query keys.
- Financial, inventory, audit, and authorization invariants belong in Postgres RPC or privileged Edge Functions.
- Do not use `user_metadata` for authorization decisions.

## Branch Strategy

- `main` is always deployable.
- Use short-lived feature branches: `feature/<scope>`, `fix/<scope>`, `chore/<scope>`.
- Conventional commits are enforced through commitlint.
- Pull requests must pass typecheck, lint, tests, and build.

## Notes

This scaffold intentionally avoids demo business logic. Product modules should be added as real requirements become explicit.
