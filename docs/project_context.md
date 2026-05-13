# Pulsor — Project context

Concise reference for anyone (human or AI) picking up the codebase. Update as the project evolves.

---

## Product in one line

AI operational layer for US real estate teams — connects their stack, surfaces priorities, automates execution. Admin-provisioned, no public signup.

## Production

- **Public landing**: https://pulsor.co
- **App**: same apex (`pulsor.co/login`, `/overview`, `/admin`, …)
- **Repo**: https://github.com/graysvc/aidashboard
- **Supabase project ref**: `pevbwnevoafwmqamxebj`
- **Vercel project**: `pulsorai`

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript strict |
| UI | Tailwind v4, shadcn/ui base-nova, Inter from rsms.me |
| Auth + DB | Supabase (`@supabase/ssr` + `@supabase/supabase-js`) |
| Email | Resend (transactional only) |
| Hosting | Vercel (auto-deploy on push to `main`) |

---

## Architecture

```
app/
  (dashboard)/         ← authenticated user pages
    overview/          home — reads agent_data
    sales/             pipeline view — bucketed critical_leads
    marketing/         per-company company_marketing data
    strategy/          per-company company_strategy data
    usage/             token usage placeholder
  admin/               ← admin-only (middleware enforces)
    companies/[id]/
      strategy/        per-client journey editor
      marketing/       per-client marketing editor
    users/[id]/        weekly agent_data + critical_leads editor
    audit/             audit log viewer
    workflows/         library — admin only
    insights/          library — admin only
    tools/             library — admin only
  api/
    onboarding/        setup wizard → Resend
    access-request/    landing form → Resend
  login/               Supabase signInWithPassword
  setup/               public onboarding wizard (lead capture)
public/
  landing/index.html   ← STATIC public homepage (served at "/" via rewrite)
middleware.ts          ← session refresh + role enforcement + subdomain rewrite
lib/
  supabase/{client,server,middleware,admin}.ts   four client variants
  data/                domain queries, mappers, audit, demo
  auth.ts              signOut wrapper
components/
  brand/pulsor.tsx     logo + wordmark + lockup
  dashboard/           ActionCard, ActionCardExpanded, StatusTile, etc.
  admin/               AdminSidebar, SubmitButton, CriticalLeadsEditor
  ui/                  shadcn primitives
supabase/migrations/
  0001_init.sql            base schema + RLS
  0002_company_content.sql strategy + marketing tables
  0003_audit_log.sql       audit table
```

### Routing model

- `/` → rewritten to `/landing/index.html` (Next config) — public landing, no React
- `/(dashboard)/*` → wrapped by AuthGate (passthrough; middleware enforces session)
- `/admin/*` → server-checks `role === 'admin'` in `app/admin/layout.tsx` (defense in depth)
- Middleware also has subdomain detection (`admin.pulsor.co` → rewrites to `/admin/*`) — code is ready but subdomains are not yet configured in Vercel; everything on the apex for now

---

## Data model (Supabase)

Seven tables, all under public schema with strict RLS. Helpers `is_admin()` / `current_user_role()` / `current_user_company_id()` are SECURITY DEFINER (bypass RLS to avoid recursion).

- **companies** — id, name, icp_type
- **users** — extends `auth.users` via insert trigger; role enum, company_id (nullable for solo agents), icp_type
- **agent_data** — weekly snapshot per user (unique on `user_id`+`week_iso`). Fields: leads_total, pipeline_value, conversion_rate, lead_leak_rate, money_on_table, weekly_insight, this_week_goal, last_week_wins, **critical_leads jsonb** (array of `{id, name, value_usd, days_no_contact, agent_assigned_id?, status}`)
- **team_data** — weekly aggregate per company (unique on `company_id`+`week_iso`)
- **company_strategy** — 1:1 per company. Journey timeline, current focus, initiatives, action items, next milestone
- **company_marketing** — 1:1 per company. KPI text values, channels jsonb, insights jsonb
- **audit_log** — actor + action + entity + payload jsonb. Admins read all; users read their own

`week_iso` format: `"2026-W18"` (ISO week).

### RLS at a glance

- Admin → everything
- Team leader → their company row + users with same `company_id` + their `agent_data` + their `team_data`
- Agent → own row + own `agent_data` + their company's `team_data`
- Sensitive user columns (`role`, `company_id`, `icp_type`) revoked from `authenticated` — only admin (via service-role) can change

---

## Critical business logic

### Demo account
`test@test.com` returns rich hardcoded data on Home / Sales / Marketing — bypasses DB queries. Owned by `lib/data/demo.ts`. **Don't delete that file** without first removing the email override in:
- `app/(dashboard)/overview/page.tsx`
- `app/(dashboard)/sales/page.tsx`
- `app/(dashboard)/marketing/page.tsx`

### Critical leads → Pulsor insights tag mapping
In `lib/data/dashboard.ts::criticalLeadToCard()`:
- `days_no_contact > 5` → URGENT
- `days_no_contact > 2` → WARNING
- otherwise → HOT LEAD

Sales page buckets by the same thresholds into At Risk / Stalled / Hot tabs.

### Password policy
Admin-side enforcement in `app/admin/actions.ts::createUserAction`: ≥10 chars, ≥1 uppercase, ≥1 digit. Bumped from Supabase default of 6.

### Audit logging
All admin mutations call `logAction()` (best-effort, never throws). Captures actor + IP + user-agent. View at `/admin/audit`.

### Form submissions
- `/api/onboarding` — setup wizard data → guido@grays.vc via Resend
- `/api/access-request` — landing email capture → same recipient

---

## Conventions

- **Server Components by default**. Use `"use client"` only where state/effects/event handlers needed.
- **Server Actions** for mutations (no separate API endpoints). All in `app/admin/actions.ts`.
- **Tailwind v4** with CSS vars in `globals.css`. Brand colors as `--bg`, `--text`, `--accent` (mint), etc.
- **Inter only** as webfont. No serif fonts — was tried and rejected.
- **Component naming**: `kebab-case.tsx` files, `PascalCase` exports.
- **Imports**: absolute via `@/` alias.
- **Currency**: stored as numeric in DB, formatted with `formatCompactCurrency()` in `lib/data/dashboard.ts`.
- **Dates / weeks**: `currentWeekIso()` from `lib/data/types.ts` produces `"2026-W18"`.

---

## Key decisions

1. **No public signup** — admin creates accounts via `/admin/users/new`. Email + password set manually.
2. **Apex-only domain for now** — `admin.pulsor.co` / `app.pulsor.co` deferred until there's a real need (cookie scoping, IP whitelisting). Middleware already has the subdomain logic prepared.
3. **Landing is static HTML, not React** — `public/landing/index.html` served via Next rewrite. CSS + JS execute as-is. Trade-off: no shared React state with the app, but zero JSX maintenance overhead.
4. **Mint accent sparingly** — per brand v1.0, `#00D9A3` is UI accent, never logo. Use for eyebrow dots, check icons, hover states. Don't tint big surfaces.
5. **Brand book v1.0** lives at `~/Documents/Pulsor/Branding/Pulsor_Brand_System.html` (not in repo). Treat as source of truth for palette + logo geometry.
6. **Strategy / Marketing JSON in admin editors** — `critical_leads` has a field-by-field editor (`components/admin/critical-leads-editor.tsx`). Other JSON fields (milestones, initiatives, channels, insights) are raw textareas for now. Form-based editors are next on the polish list.

---

## Current priorities

When picking up work, ask which of these:

1. **Quick actions on users**: "Duplicate last week → this week" for `agent_data`; "Reset password" via service-role; "Impersonate" for viewing as user.
2. **Form-based JSON editors** for milestones / initiatives / action_items / marketing channels / insights (replace remaining textareas).
3. **Subdomain split** (`app.pulsor.co` / `admin.pulsor.co`) — code ready, needs Vercel UI work.
4. **Marketing real integrations** (Google Ads, Meta) — currently placeholder for non-demo users.
5. **2FA / rate limiting** for login — overkill until customer count grows.

---

## Known technical debt

- `app/(dashboard)/usage/page.tsx` — entirely mock; not wired to real billing/usage.
- `lib/mock-data.ts` — still imported by some legacy components in `components/dashboard/` (agent-card, insight-card, etc.) that aren't currently routed. Could be deleted along with those components.
- `components/dashboard/{agent-comparison,team-production,workflow-status-mix,completion-rate}-chart.tsx` and other unused chart components — leftovers from earlier design iterations.
- Landing form does *not* dedupe submissions; same email can spam the inbox.
- No CI yet — relies on `npx next build` locally before push.

---

## Critical files / folders — handle with care

- `middleware.ts` — auth + role enforcement. Breaking it locks everyone out.
- `supabase/migrations/*.sql` — applied in numeric order to the live DB. Never rewrite history; add new migrations.
- `lib/supabase/admin.ts` — uses service-role key. Never import from a client component.
- `lib/data/demo.ts` — demo-account override. Removing without coordination breaks the showcase user.
- `app/admin/layout.tsx` — second layer of admin role check. Don't loosen.
- `public/landing/index.html` — public homepage. Don't convert to React without a plan.
- `next.config.mjs` rewrite from `/` to `/landing/index.html` — without it, root 404s.

## Things that should NOT be modified without a real reason

- Brand palette (`globals.css` CSS vars) — sourced from external brand book v1.0
- Inter as sole webfont — serif fonts were trialed and rejected
- The Pulsor logo SVG geometry in `components/brand/pulsor.tsx` — defined in brand book pixel-exact
- The static-HTML approach for the landing — converting to JSX has been explicitly deferred
- The Subdomain-aware middleware logic — keep it; it's the future split that's deferred, not the code

---

## Env vars

In `.env.local` (local) and Vercel Environment Variables (prod):

```
NEXT_PUBLIC_SUPABASE_URL=https://pevbwnevoafwmqamxebj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_…
SUPABASE_SERVICE_ROLE_KEY=sb_secret_…       (Sensitive in Vercel)
RESEND_API_KEY=re_…
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only — never import into a client component.

---

## Migrations workflow

1. Add new file `supabase/migrations/000N_description.sql`
2. Apply via Supabase SQL Editor (paste contents → Run) OR via Management API with a personal access token
3. Verify with `select table_name from information_schema.tables where table_schema='public';`
4. Commit the migration file

Don't run via Supabase CLI yet — no remote-DB password setup; we use SQL Editor paste.

---

## Local dev

```
npm run dev          # next dev on :3000
npx next build       # always run before pushing
```

Hard refresh (Cmd+Shift+R) after CSS / HTML changes when the static landing is involved.

## Deploy

Push to `main` → Vercel auto-deploys. Don't force-push, don't bypass hooks. The user gates all deploys — confirm before pushing.

---

_Last reviewed: 2026-05-13_
