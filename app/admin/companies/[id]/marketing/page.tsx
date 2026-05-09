import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCompany } from "@/lib/data/companies";
import { getCompanyMarketing } from "@/lib/data/company-content";
import { upsertCompanyMarketingAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/submit-button";

export default async function CompanyMarketingEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const company = await getCompany(params.id);
  if (!company) notFound();
  const marketing = await getCompanyMarketing(company.id);

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
          Marketing · {company.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Channel data shown on the team&apos;s /marketing page.
        </p>
      </header>

      <form
        action={upsertCompanyMarketingAction.bind(null, company.id)}
        className="space-y-6"
      >
        {/* KPI tiles */}
        <Section title="KPI tiles">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Total leads — value">
              <input
                name="total_leads_value"
                type="text"
                defaultValue={marketing?.total_leads_value ?? ""}
                placeholder="247"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
            </Field>
            <Field label="Total leads — delta line">
              <input
                name="total_leads_delta"
                type="text"
                defaultValue={marketing?.total_leads_delta ?? ""}
                placeholder="+23% vs last month"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Best channel — name">
              <input
                name="best_channel_name"
                type="text"
                defaultValue={marketing?.best_channel_name ?? ""}
                placeholder="Meta Ads"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Best channel — subtitle">
              <input
                name="best_channel_subtitle"
                type="text"
                defaultValue={marketing?.best_channel_subtitle ?? ""}
                placeholder="142 leads · 58% of total"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Cost per lead — value">
              <input
                name="cost_per_lead_value"
                type="text"
                defaultValue={marketing?.cost_per_lead_value ?? ""}
                placeholder="$18.50"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
            </Field>
            <Field label="Cost per lead — delta line">
              <input
                name="cost_per_lead_delta"
                type="text"
                defaultValue={marketing?.cost_per_lead_delta ?? ""}
                placeholder="−12% vs last month"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
          </div>
        </Section>

        {/* Channels */}
        <Section title="Channels (breakdown chart)">
          <Field
            label="Channels (JSON array)"
            hint='Array of { name, count, cpl, outlier?: boolean }'
          >
            <textarea
              name="channels"
              rows={8}
              spellCheck={false}
              defaultValue={JSON.stringify(
                marketing?.channels ?? [],
                null,
                2
              )}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono"
            />
          </Field>
        </Section>

        {/* Insights */}
        <Section title="Pulsor insights">
          <Field
            label="Insights (JSON array)"
            hint='Array of { id, tag, summary }. Tags: URGENT, DEADLINE, WARNING, PERFORMANCE, "HOT LEAD", OPPORTUNITY, WIN, INSIGHT, PATTERN, RECOMMENDATION'
          >
            <textarea
              name="insights"
              rows={8}
              spellCheck={false}
              defaultValue={JSON.stringify(
                marketing?.insights ?? [],
                null,
                2
              )}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono"
            />
          </Field>
        </Section>

        <div>
          <SubmitButton>Save marketing</SubmitButton>
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
