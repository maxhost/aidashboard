-- =============================================================
-- Pulsor — basic audit log
-- Captures admin/user actions for traceability.
-- =============================================================

create table if not exists public.audit_log (
  id            uuid primary key default gen_random_uuid(),
  actor_id     uuid references public.users(id) on delete set null,
  actor_email   text,                        -- snapshot in case the user is deleted later
  action        text not null,               -- e.g. "company.create", "user.delete"
  entity_type   text,                        -- "company" | "user" | "agent_data" | …
  entity_id     text,                        -- string so we can store anything (uuid, week_iso, etc.)
  payload       jsonb,                       -- optional context (e.g. before/after diff)
  ip_address    text,
  user_agent    text,
  created_at    timestamptz not null default now()
);

create index if not exists audit_log_created_at_idx on public.audit_log(created_at desc);
create index if not exists audit_log_actor_id_idx   on public.audit_log(actor_id);
create index if not exists audit_log_action_idx     on public.audit_log(action);

alter table public.audit_log enable row level security;

drop policy if exists "audit_log admin read" on public.audit_log;
drop policy if exists "audit_log admin all"  on public.audit_log;

-- Only admins read the log. Writes happen via service-role from server code.
create policy "audit_log admin read"
  on public.audit_log for select
  using (public.is_admin());

-- Self can read their own actions (useful for "your activity" later)
drop policy if exists "audit_log self read" on public.audit_log;
create policy "audit_log self read"
  on public.audit_log for select
  using (actor_id = auth.uid());
