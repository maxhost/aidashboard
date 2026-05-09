import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCompany } from "@/lib/data/companies";
import { getCompanyStrategy } from "@/lib/data/company-content";
import { upsertCompanyStrategyAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/submit-button";

export default async function CompanyStrategyEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const company = await getCompany(params.id);
  if (!company) notFound();
  const strategy = await getCompanyStrategy(company.id);

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1000px] mx-auto space-y-6">
      <Link
        href={`/admin/companies/${company.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Back to {company.name}
      </Link>

      <header>
        <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
          Strategy · {company.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customer journey content shown on the team&apos;s /strategy page.
        </p>
      </header>

      <form
        action={upsertCompanyStrategyAction.bind(null, company.id)}
        className="space-y-6"
      >
        {/* Milestones */}
        <Section title="Journey timeline">
          <Field label="Milestones (JSON array)" hint='Array of { id, label, date, state: "done" | "current" | "future" }'>
            <textarea
              name="milestones"
              rows={8}
              spellCheck={false}
              defaultValue={JSON.stringify(
                strategy?.milestones ?? [],
                null,
                2
              )}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono"
            />
          </Field>
        </Section>

        {/* Current focus */}
        <Section title="Current focus">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Label">
              <input
                name="current_focus_label"
                type="text"
                defaultValue={strategy?.current_focus_label ?? ""}
                placeholder="Optimization"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Day of period">
              <input
                name="current_focus_day"
                type="number"
                min={1}
                defaultValue={strategy?.current_focus_day ?? 1}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
            </Field>
            <Field label="Period length (days)">
              <input
                name="current_focus_period_length"
                type="number"
                min={1}
                defaultValue={strategy?.current_focus_period_length ?? 28}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
            </Field>
            <Field label="Pipeline goal % (0-100)">
              <input
                name="pipeline_goal_pct"
                type="number"
                min={0}
                max={100}
                defaultValue={strategy?.pipeline_goal_pct ?? 0}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
            </Field>
          </div>
          <Field label="Initiatives (JSON array)" hint='Array of { id, label, state: "done" | "current" | "future" }'>
            <textarea
              name="initiatives"
              rows={6}
              spellCheck={false}
              defaultValue={JSON.stringify(
                strategy?.initiatives ?? [],
                null,
                2
              )}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono"
            />
          </Field>
        </Section>

        {/* Action items from last review */}
        <Section title="Action items from last review">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Last review date">
              <input
                name="last_review_date"
                type="text"
                defaultValue={strategy?.last_review_date ?? ""}
                placeholder="Apr 28"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
          </div>
          <Field label="Action items (JSON array)" hint='Same shape as initiatives'>
            <textarea
              name="action_items"
              rows={6}
              spellCheck={false}
              defaultValue={JSON.stringify(
                strategy?.action_items ?? [],
                null,
                2
              )}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono"
            />
          </Field>
        </Section>

        {/* Next milestone */}
        <Section title="Next milestone">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Label">
              <input
                name="next_milestone_label"
                type="text"
                defaultValue={strategy?.next_milestone_label ?? ""}
                placeholder="Mid-quarter review"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Date">
              <input
                name="next_milestone_date"
                type="text"
                defaultValue={strategy?.next_milestone_date ?? ""}
                placeholder="May 28"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Days away">
              <input
                name="next_milestone_days_away"
                type="number"
                min={0}
                defaultValue={strategy?.next_milestone_days_away ?? 0}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
            </Field>
          </div>
        </Section>

        <div>
          <SubmitButton>Save strategy</SubmitButton>
        </div>
      </form>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h2 className="text-sm font-medium text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
