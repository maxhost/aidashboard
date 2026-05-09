-- =============================================================
-- Pulsor — per-company content for Strategy and Marketing pages
-- One row per company (upsert by company_id)
-- =============================================================

-- ─── company_strategy ─────────────────────────────────────────
create table if not exists public.company_strategy (
  id                          uuid primary key default gen_random_uuid(),
  company_id                  uuid not null unique
                              references public.companies(id) on delete cascade,

  -- Timeline of milestones — array of:
  --   { id, label, date, state: 'done' | 'current' | 'future' }
  milestones                  jsonb not null default '[]'::jsonb,

  -- "Current focus" card
  current_focus_label         text,
  current_focus_day           int default 1,
  current_focus_period_length int default 28,
  pipeline_goal_pct           int default 0,            -- 0-100

  -- Active initiatives — array of:
  --   { id, label, state: 'done' | 'current' | 'future' }
  initiatives                 jsonb not null default '[]'::jsonb,

  -- Action items from last review — same shape as initiatives
  action_items                jsonb not null default '[]'::jsonb,
  last_review_date            text,                     -- "Apr 28"

  -- Next session
  next_milestone_label        text,
  next_milestone_date         text,                     -- "May 28"
  next_milestone_days_away    int default 0,

  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

drop trigger if exists set_updated_at_company_strategy on public.company_strategy;
create trigger set_updated_at_company_strategy
  before update on public.company_strategy
  for each row execute function public.set_updated_at();

-- ─── company_marketing ────────────────────────────────────────
create table if not exists public.company_marketing (
  id                       uuid primary key default gen_random_uuid(),
  company_id               uuid not null unique
                           references public.companies(id) on delete cascade,

  -- 3 KPI tiles (free-text values + delta line)
  total_leads_value        text default '0',
  total_leads_delta        text,
  best_channel_name        text default '—',
  best_channel_subtitle    text,
  cost_per_lead_value      text default '$0',
  cost_per_lead_delta      text,

  -- Channels for the breakdown chart — array of:
  --   { name, count, cpl, outlier?: boolean }
  channels                 jsonb not null default '[]'::jsonb,

  -- Pulsor insights — array of ActionCardData:
  --   { id, tag, summary }
  insights                 jsonb not null default '[]'::jsonb,

  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

drop trigger if exists set_updated_at_company_marketing on public.company_marketing;
create trigger set_updated_at_company_marketing
  before update on public.company_marketing
  for each row execute function public.set_updated_at();

-- ─── RLS ──────────────────────────────────────────────────────

alter table public.company_strategy   enable row level security;
alter table public.company_marketing  enable row level security;

-- company_strategy
drop policy if exists "company_strategy admin all"    on public.company_strategy;
drop policy if exists "company_strategy members read" on public.company_strategy;

create policy "company_strategy admin all"
  on public.company_strategy for all
  using (public.is_admin()) with check (public.is_admin());

create policy "company_strategy members read"
  on public.company_strategy for select
  using (company_id = public.current_user_company_id());

-- company_marketing
drop policy if exists "company_marketing admin all"    on public.company_marketing;
drop policy if exists "company_marketing members read" on public.company_marketing;

create policy "company_marketing admin all"
  on public.company_marketing for all
  using (public.is_admin()) with check (public.is_admin());

create policy "company_marketing members read"
  on public.company_marketing for select
  using (company_id = public.current_user_company_id());
