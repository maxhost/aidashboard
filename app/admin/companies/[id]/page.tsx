import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { getCompany } from "@/lib/data/companies";
import { listUsers } from "@/lib/data/users";
import { getTeamData } from "@/lib/data/team-data";
import { currentWeekIso } from "@/lib/data/types";
import {
  createUserAction,
  deleteCompanyAction,
  updateCompanyAction,
  upsertTeamDataAction,
} from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/submit-button";

export default async function CompanyDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { week?: string };
}) {
  const company = await getCompany(params.id);
  if (!company) notFound();

  const users = await listUsers({ companyId: company.id });
  const weekIso = searchParams.week || currentWeekIso();
  const teamData = await getTeamData(company.id, weekIso);

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1000px] mx-auto space-y-6">
      <Link
        href="/admin/companies"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Back to companies
      </Link>

      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
            {company.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {company.icp_type.replace(/_/g, " ")} · {users.length}{" "}
            {users.length === 1 ? "user" : "users"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/admin/companies/${company.id}/strategy`}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
          >
            Edit Strategy
          </Link>
          <Link
            href={`/admin/companies/${company.id}/marketing`}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
          >
            Edit Marketing
          </Link>
        </div>
      </header>

      {/* ── Edit company ─────────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-sm font-medium text-foreground">Edit company</h2>
        <form
          action={updateCompanyAction.bind(null, company.id)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name" htmlFor="name">
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={company.name}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </Field>
            <Field label="ICP type" htmlFor="icp_type">
              <select
                id="icp_type"
                name="icp_type"
                defaultValue={company.icp_type}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                <option value="team_leader">Team Leader</option>
                <option value="top_producer_solo">Top Producer Solo</option>
                <option value="broker_boutique">Broker Boutique</option>
              </select>
            </Field>
          </div>
          <div className="flex gap-2">
            <SubmitButton>Save changes</SubmitButton>
          </div>
        </form>
      </section>

      {/* ── Users in this company ────────────────────────────── */}
      <section className="space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-lg font-medium text-foreground tracking-tight">
            Members
          </h2>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {users.length}
          </span>
        </div>
        {users.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            No users yet — use the form below to add the first one.
          </p>
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {users.map((u) => (
              <li key={u.id}>
                <Link
                  href={`/admin/users/${u.id}`}
                  className="grid grid-cols-[1fr_120px_180px_auto] items-center gap-4 px-4 py-2.5 hover:bg-muted/40 transition-colors group"
                >
                  <span className="text-sm font-medium text-foreground truncate">
                    {u.full_name || u.email}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-semibold">
                    {u.role.replace("_", " ")}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {u.email}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground transition-colors"
                    strokeWidth={1.75}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Add user form ─────────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-sm font-medium text-foreground inline-flex items-center gap-2">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add user to {company.name}
        </h2>
        <form action={createUserAction} className="space-y-4">
          <input type="hidden" name="company_id" value={company.id} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name" htmlFor="full_name">
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                placeholder="Sarah Mitchell"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Email" htmlFor="email">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="sarah@team.com"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Password" htmlFor="password">
              <input
                id="password"
                name="password"
                type="text"
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
            </Field>
            <Field label="Role" htmlFor="role">
              <select
                id="role"
                name="role"
                defaultValue="agent"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="team_leader">Team Leader</option>
                <option value="agent">Agent</option>
              </select>
            </Field>
          </div>
          <SubmitButton pendingText="Creating user…">Create user</SubmitButton>
        </form>
      </section>

      {/* ── Team weekly data ─────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              Team weekly data
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Aggregated team snapshot — feeds team-leader dashboards.
            </p>
          </div>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {weekIso}
          </span>
        </div>

        <form
          action={upsertTeamDataAction.bind(null, company.id)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Week (ISO)" htmlFor="td_week_iso">
              <input
                id="td_week_iso"
                name="week_iso"
                type="text"
                required
                defaultValue={weekIso}
                placeholder="2026-W18"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
            </Field>
            <Field label="Team pipeline value (USD)" htmlFor="td_team_pipeline_value">
              <input
                id="td_team_pipeline_value"
                name="team_pipeline_value"
                type="number"
                min={0}
                step="0.01"
                defaultValue={teamData?.team_pipeline_value ?? 0}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
            </Field>
            <div />
            <Field label="Top performer" htmlFor="td_top_performer">
              <select
                id="td_top_performer"
                name="top_performer_id"
                defaultValue={teamData?.top_performer_id ?? ""}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">— None</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name || u.email}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Bottom performer" htmlFor="td_bottom_performer">
              <select
                id="td_bottom_performer"
                name="bottom_performer_id"
                defaultValue={teamData?.bottom_performer_id ?? ""}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">— None</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name || u.email}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Insights (JSON array)" htmlFor="td_insights">
            <textarea
              id="td_insights"
              name="insights"
              rows={4}
              spellCheck={false}
              defaultValue={JSON.stringify(teamData?.insights ?? [], null, 2)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono"
            />
            <p className="text-[11px] text-muted-foreground">
              Array of <code>{`{ id, text }`}</code>
            </p>
          </Field>

          <SubmitButton>Save team data</SubmitButton>
        </form>
      </section>

      {/* ── Danger zone ───────────────────────────────────────── */}
      <section className="rounded-xl border border-destructive/30 bg-card p-6">
        <h2 className="text-sm font-medium text-destructive">Danger zone</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Deleting this company will unassign all its users (they become solo
          agents, not deleted).
        </p>
        <form
          action={deleteCompanyAction.bind(null, company.id)}
          className="mt-3"
        >
          <SubmitButton variant="danger" pendingText="Deleting…">
            Delete company
          </SubmitButton>
        </form>
      </section>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-xs font-semibold text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
