---
name: foodflow-ui-sources
description: Use when designing FoodFlow POS, admin dashboards, analytics, KDS, auth, pricing, onboarding, or polished React/Tailwind/shadcn UI. Guides use of v0, shadcn/ui, Magic UI, and Aceternity UI as references without turning operational POS screens into decorative marketing pages.
---

# FoodFlow UI Sources

Use these references selectively:

- v0 by Vercel: useful for dashboard layout ideas, admin tables, analytics panels, POS screen scaffolds, and shadcn/Tailwind component drafts.
- shadcn/ui: default component system. Prefer registry components and local `components/ui` ownership once the frontend exists.
- Magic UI: use sparingly for polished microinteractions, onboarding, empty states, loading states, and premium dashboard touches.
- Aceternity UI: use mostly for landing, pricing, auth, and marketing-facing surfaces.

FoodFlow's product UI should feel fast, reliable, and operational. Avoid decorative effects on billing, KDS, inventory, reporting, and shift workflows where clarity and repeated use matter more than flair.

For dense admin screens, prefer:

- shadcn tables/forms/dialogs/dropdowns/tabs
- TanStack Table for large datasets
- Recharts for business charts
- Lucide icons for tool buttons and status affordances
- Tight but readable spacing, stable layout dimensions, clear status colors, and strong empty/error/loading states

For POS/KDS screens, prioritize:

- large touch targets
- stable grids
- high contrast status states
- no layout shift during live updates
- offline/sync indicators that are visible but calm
