import { redirect } from "next/navigation";
import { Megaphone } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { SectionTitle } from "@/components/dashboard/section-title";
import { getMyDashboard } from "@/lib/data/dashboard";
import { getCompanyMarketing } from "@/lib/data/company-content";
import { DEMO_EMAIL } from "@/lib/data/demo";
import {
  MarketingDemoClient,
  type MarketingPageData,
} from "./marketing-demo-client";

export default async function MarketingPage() {
  const dashboard = await getMyDashboard();
  if (!dashboard) redirect("/login");

  // Demo account: rich preset data
  if (dashboard.user.email === DEMO_EMAIL) {
    return <MarketingDemoClient />;
  }

  // Real user: load company_marketing
  const m = dashboard.user.company_id
    ? await getCompanyMarketing(dashboard.user.company_id)
    : null;

  if (m && (m.channels.length > 0 || m.insights.length > 0 || m.total_leads_value !== "0")) {
    const data: MarketingPageData = {
      totalLeadsValue: m.total_leads_value,
      totalLeadsDelta: m.total_leads_delta,
      bestChannelName: m.best_channel_name,
      bestChannelSubtitle: m.best_channel_subtitle,
      costPerLeadValue: m.cost_per_lead_value,
      costPerLeadDelta: m.cost_per_lead_delta,
      channels: m.channels,
      insights: m.insights,
    };
    return <MarketingDemoClient data={data} />;
  }

  // No data yet — placeholder
  return (
    <TooltipProvider delay={150}>
      <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
              Marketing
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Where your leads come from and what&apos;s working.
            </p>
          </div>
          <PeriodSelector />
        </header>

        <SectionTitle
          title="Channel performance"
          tooltip="Connect your ad accounts to see CPL, lead volume, and ROI by channel."
        />

        <section className="rounded-xl border border-border bg-card p-12 flex flex-col items-center text-center">
          <span className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Megaphone
              className="h-6 w-6 text-muted-foreground"
              strokeWidth={1.75}
            />
          </span>
          <h2 className="text-lg font-medium text-foreground">
            Marketing data coming soon
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
            Once your Google Ads, Meta, and lead-portal accounts are connected,
            this view will surface channel ROI, CPL by source, paid-vs-organic
            mix, and ad-spend trends.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Talk to your Pulsor advisor to wire integrations.
          </p>
        </section>
      </div>
    </TooltipProvider>
  );
}
