# FoodFlow Agent Instructions

Work only inside `/Users/kartic/SourceCode/fullStack/Food-Flow` for this project.

## Product Direction

FoodFlow is a multi-outlet restaurant POS and management platform. The MVP stack is:

- React + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase Auth, Postgres, RLS, Storage, Realtime
- Postgres RPC for transactional order/inventory logic
- Supabase Edge Functions only for privileged actions, webhooks, receipts, scheduled jobs, and server-only secrets

## Local Agent Skills

Use the project-local skills in `.agents/skills` when relevant:

- `supabase`
- `supabase-postgres-best-practices`
- `shadcn`
- `vercel-react-best-practices`
- `vercel-composition-patterns`
- `web-design-guidelines`
- `foodflow-ui-sources`

## MCP Setup

**GitHub Copilot**: MCP server configuration lives in `.vscode/mcp.json`. All servers are loaded automatically when you open this workspace.

Servers configured:

- `context7` — up-to-date library docs (optional `CONTEXT7_API_KEY`)
- `filesystem` — direct file access within this workspace
- `postgres` — direct Postgres queries (requires `SUPABASE_DB_URL` in env)
- `shadcn` — shadcn/ui component registry
- `supabase` — Supabase remote MCP for project `jzkwpypwtaoupxjuvdtg` (requires `SUPABASE_ACCESS_TOKEN` in env)

Before using Postgres or Supabase MCPs, copy `.env.mcp.example` to `.env` and fill the values locally. Never commit real secrets.

**Legacy (Codex only)**: `.mcp.json` at the project root and the global `codex mcp add supabase` registration — kept for reference.

## Engineering Defaults

- Keep the UI operational and dense enough for POS/admin workflows.
- Use shadcn/ui primitives before custom components.
- Use TanStack Query for server cache and Zustand only for local POS/cart/session UI state.
- Put financial, tax, order, inventory, audit, and tenant-isolation invariants in Postgres/RPC or privileged server code, not loose client logic.
- Treat RLS as mandatory for all tenant-owned tables.
- Prefer migrations over ad hoc database edits.
