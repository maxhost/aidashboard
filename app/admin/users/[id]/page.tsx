import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getUser } from "@/lib/data/users";
import { listCompanies } from "@/lib/data/companies";
import { getAgentData, listAgentDataWeeks } from "@/lib/data/agent-data";
import { currentWeekIso } from "@/lib/data/types";
import {
  deleteUserAction,
  updateUserAction,
  upsertAgentDataAction,
} from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { CriticalLeadsEditor } from "@/components/admin/critical-leads-editor";

export default async function UserDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { week?: string };
}) {
  const user = await getUser(params.id);
  if (!user) notFound();

  const weekIso = searchParams.week || currentWeekIso();
  const [companies, agentData, weeks] = await Promise.all([
    listCompanies(),
    getAgentData(user.id, weekIso),
    listAgentDataWeeks(user.id),
  ]);

  // Backlink target — back to company or solo-agents
  const backHref = user.company_id
    ? `/admin/companies/${user.company_id}`
    : "/admin/solo-agents";

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1000px] mx-auto space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Back
      </Link>

      <header>
        <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
          {user.full_name || user.email}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {user.email} · {user.role.replace("_", " ")}
        </p>
      </header>

      {/* ── Profile editor ───────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-sm font-medium text-foreground">Profile</h2>
        <form
          action={updateUserAction.bind(null, user.id)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name" htmlFor="full_name">
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                defaultValue={user.full_name ?? ""}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Role" htmlFor="role">
              <select
                id="role"
                name="role"
                defaultValue={user.role}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="admin">Admin</option>
                <option value="team_leader">Team Leader</option>
                <option value="agent">Agent</option>
              </select>
            </Field>
            <Field label="Company" htmlFor="company_id">
              <select
                id="company_id"
                name="company_id"
                defaultValue={user.company_id ?? ""}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">— None (solo)</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ICP (solos only)" htmlFor="icp_type">
              <select
                id="icp_type"
                name="icp_type"
                defaultValue={user.icp_type ?? ""}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">— Inherits from company</option>
                <option value="top_producer_solo">Top Producer Solo</option>
                <option value="broker_boutique">Broker Boutique</option>
                <option value="team_leader">Team Leader</option>
              </select>
            </Field>
          </div>
          <SubmitButton>Save profile</SubmitButton>
        </form>
      </section>

      {/* ── Agent data editor ────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              Weekly agent data
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Snapshot for one ISO week. Editing an existing week overwrites it.
            </p>
          </div>
          {weeks.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {weeks.map((w) => (
                <Link
                  key={w.week_iso}
                  href={`/admin/users/${user.id}?week=${w.week_iso}`}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                    w.week_iso === weekIso
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card text-foreground border-border hover:border-foreground/30"
                  }`}
                >
                  {w.week_iso}
                </Link>
              ))}
            </div>
          )}
        </div>

        <form
          action={upsertAgentDataAction.bind(null, user.id)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Week (ISO)" htmlFor="week_iso">
              <input
                id="week_iso"
                name="week_iso"
                type="text"
                required
                defaultValue={weekIso}
                placeholder="2026-W18"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
            </Field>
            <Field label="Total leads" htmlFor="leads_total">
              <input
                id="leads_total"
                name="leads_total"
                type="number"
                min={0}
                defaultValue={agentData?.leads_total ?? 0}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
            </Field>
            <Field label="Pipeline value (USD)" htmlFor="pipeline_value">
              <input
                id="pipeline_value"
                name="pipeline_value"
                type="number"
                min={0}
                step="0.01"
                defaultValue={agentData?.pipeline_value ?? 0}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
            </Field>
            <Field label="Conversion rate (%)" htmlFor="conversion_rate">
              <input
                id="conversion_rate"
                name="conversion_rate"
                type="number"
                min={0}
                max={100}
                step="0.01"
                defaultValue={agentData?.conversion_rate ?? 0}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
            </Field>
            <Field label="Lead leak rate (%)" htmlFor="lead_leak_rate">
              <input
                id="lead_leak_rate"
                name="lead_leak_rate"
                type="number"
                min={0}
                max={100}
                step="0.01"
                defaultValue={agentData?.lead_leak_rate ?? 0}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
            </Field>
            <Field label="Money on table (USD)" htmlFor="money_on_table">
              <input
                id="money_on_table"
                name="money_on_table"
                type="number"
                min={0}
                step="0.01"
                defaultValue={agentData?.money_on_table ?? 0}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
            </Field>
          </div>

          <Field label="Weekly insight" htmlFor="weekly_insight">
            <textarea
              id="weekly_insight"
              name="weekly_insight"
              rows={2}
              defaultValue={agentData?.weekly_insight ?? ""}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="This week goal" htmlFor="this_week_goal">
            <textarea
              id="this_week_goal"
              name="this_week_goal"
              rows={2}
              defaultValue={agentData?.this_week_goal ?? ""}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Last week wins" htmlFor="last_week_wins">
            <textarea
              id="last_week_wins"
              name="last_week_wins"
              rows={2}
              defaultValue={agentData?.last_week_wins ?? ""}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </Field>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Critical leads
            </label>
            <CriticalLeadsEditor initial={agentData?.critical_leads ?? []} />
          </div>

          <SubmitButton>Save week</SubmitButton>
        </form>
      </section>

      {/* ── Danger zone ───────────────────────────────────────── */}
      <section className="rounded-xl border border-destructive/30 bg-card p-6">
        <h2 className="text-sm font-medium text-destructive">Danger zone</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Deleting removes the auth user and cascades to all agent data.
          Cannot be undone.
        </p>
        <form
          action={deleteUserAction.bind(null, user.id, backHref)}
          className="mt-3"
        >
          <SubmitButton variant="danger" pendingText="Deleting…">
            Delete user
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
