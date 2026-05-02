import { dashboardData } from "@/lib/mock-data";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { AgentLeaderboard } from "@/components/dashboard/agent-leaderboard";
import { RecentLeads } from "@/components/dashboard/recent-leads";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { PipelineTrendChart } from "@/components/dashboard/pipeline-trend-chart";
import { LeadsBySourceChart } from "@/components/dashboard/leads-by-source-chart";
import { PipelineStageChart } from "@/components/dashboard/pipeline-stage-chart";
import type { KPI } from "@/lib/types";

export const metadata = {
  title: "Sales",
};

function formatCompactCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function SalesPage() {
  const {
    period,
    agents,
    leads,
    pipelineTrend,
    leadsBySource,
    pipelineByStage,
  } = dashboardData;

  // Sales-focused KPIs (computed from existing mock)
  const totalActive = agents.reduce((a, x) => a + x.metrics.activeDeals, 0);
  const totalPipeline = agents.reduce((a, x) => a + x.metrics.pipelineValue, 0);
  const totalClosedYTD = agents.reduce((a, x) => a + x.metrics.dealsClosedYTD, 0);
  const totalVolumeYTD = agents.reduce(
    (a, x) => a + x.metrics.volumeClosedYTD,
    0
  );
  const avgDealSize = totalClosedYTD > 0 ? totalVolumeYTD / totalClosedYTD : 0;
  const totalAppts = agents.reduce((a, x) => a + x.metrics.appointmentsSet, 0);
  const totalLeads = agents.reduce((a, x) => a + x.metrics.leadsThisMonth, 0);
  const winRate = totalLeads > 0 ? (totalClosedYTD / totalLeads) * 100 : 0;

  const kpis: KPI[] = [
    {
      id: "sales-pipeline",
      label: "Pipeline",
      value: formatCompactCurrency(totalPipeline),
      hint: `${totalActive} active deals`,
      iconKey: "deals",
      tone: "primary",
      delta: { value: 12.4, period: "vs last week" },
    },
    {
      id: "sales-closed-ytd",
      label: "Closed YTD",
      value: formatCompactCurrency(totalVolumeYTD),
      hint: `${totalClosedYTD} deals`,
      iconKey: "revenue",
      tone: "success",
      delta: { value: 18.4, period: "vs last quarter" },
    },
    {
      id: "sales-avg-deal",
      label: "Avg Deal",
      value: formatCompactCurrency(avgDealSize),
      hint: "rolling YTD",
      iconKey: "appointment",
      tone: "warning",
      delta: { value: 3.1, period: "vs last quarter" },
    },
    {
      id: "sales-win-rate",
      label: "Win Rate",
      value: `${winRate.toFixed(1)}%`,
      hint: `${totalAppts} appointments set`,
      iconKey: "conversion",
      tone: "danger",
      delta: { value: 1.4, period: "vs last month" },
    },
  ];

  return (
    <div className="px-4 sm:px-6 py-8 lg:px-8 lg:py-10 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
            Sales
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Pipeline, sources, stage breakdown, and deal flow.
          </p>
        </div>
        <PeriodSelector label={period.label} />
      </header>

      {/* KPI band */}
      <section aria-label="Sales metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </section>

      {/* Pipeline volume trend (full width) */}
      <section aria-label="Pipeline trend">
        <PipelineTrendChart data={pipelineTrend} />
      </section>

      {/* Two-column charts: source mix + stage mix */}
      <section
        aria-label="Pipeline breakdown"
        className="grid grid-cols-1 xl:grid-cols-2 gap-6"
      >
        <LeadsBySourceChart data={leadsBySource} />
        <PipelineStageChart data={pipelineByStage} />
      </section>

      {/* Two-column: leaderboard + recent leads */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AgentLeaderboard agents={agents} />
        <RecentLeads leads={leads} />
      </section>
    </div>
  );
}
