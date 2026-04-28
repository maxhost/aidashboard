import { dashboardData } from "@/lib/mock-data";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { CompletionRateChart } from "@/components/dashboard/completion-rate-chart";
import { WorkflowStatusMix } from "@/components/dashboard/workflow-status-mix";
import { WorkflowCard } from "@/components/dashboard/workflow-card";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import {
  formatHours,
  totalTimeSavedHours,
} from "@/lib/workflows/manual-time";
import type { KPI, Workflow, WorkflowCategory } from "@/lib/types";

function formatCompactCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const CATEGORY_ORDER: WorkflowCategory[] = [
  "Follow-up",
  "Lead Nurture",
  "Listing",
  "Re-engagement",
  "Sphere",
];

const CATEGORY_DESC: Record<WorkflowCategory, string> = {
  "Follow-up": "Speed-to-lead and immediate response automations.",
  "Lead Nurture": "Long-tail education and saved-search drip.",
  Listing: "Marketing automations triggered by new MLS activity.",
  "Re-engagement": "Bringing dormant leads and stalled deals back to life.",
  Sphere: "Past-client retention and referral-generating touchpoints.",
};

export default function WorkflowsPage() {
  const { workflows, period, completionRateTrend } = dashboardData;

  // Aggregate KPIs
  const totalTriggered = workflows.reduce(
    (acc, w) => acc + w.metrics.triggered,
    0
  );
  const totalCompleted = workflows.reduce(
    (acc, w) => acc + w.metrics.completed,
    0
  );
  const avgCompletion =
    totalTriggered > 0 ? (totalCompleted / totalTriggered) * 100 : 0;
  const totalRevenue = workflows.reduce(
    (acc, w) => acc + w.metrics.revenueAttributed,
    0
  );
  const activeWorkflows = workflows.filter((w) => w.metrics.triggered > 0);
  const avgRoi =
    activeWorkflows.length > 0
      ? activeWorkflows.reduce((acc, w) => acc + w.metrics.roi, 0) /
        activeWorkflows.length
      : 0;

  const kpis: KPI[] = [
    {
      id: "wf-triggered",
      label: "Total Triggered",
      value: totalTriggered.toLocaleString(),
      hint: `${workflows.length} workflows`,
      iconKey: "workflows",
      tone: "primary",
      delta: { value: 6.2, period: "vs last week" },
    },
    {
      id: "wf-completion",
      label: "Avg Completion",
      value: `${avgCompletion.toFixed(1)}%`,
      hint: `${totalCompleted} of ${totalTriggered}`,
      iconKey: "completion",
      tone: "success",
      delta: { value: -8.4, period: "vs last week" },
    },
    {
      id: "wf-revenue",
      label: "Attributed Revenue",
      value: formatCompactCurrency(totalRevenue),
      hint: "30-day rolling",
      iconKey: "revenue",
      tone: "warning",
      delta: { value: 12.1, period: "vs last month" },
    },
    {
      id: "wf-roi",
      label: "Avg ROI",
      value: `${avgRoi.toFixed(1)}x`,
      hint: `${activeWorkflows.length} active workflows`,
      iconKey: "roi",
      tone: "danger",
      delta: { value: 3.8, period: "vs last month" },
    },
  ];

  // Group by category, with broken-first inside each group, then by ROI
  const grouped = CATEGORY_ORDER.map((cat) => {
    const items = workflows
      .filter((w) => w.category === cat)
      .sort((a, b) => {
        if (a.status === "broken" && b.status !== "broken") return -1;
        if (b.status === "broken" && a.status !== "broken") return 1;
        return b.metrics.roi - a.metrics.roi;
      });
    return { category: cat, items };
  }).filter((g) => g.items.length > 0);

  return (
    <div className="px-4 sm:px-6 py-8 lg:px-8 lg:py-10 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
            Workflows
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            ROI and efficiency of every automation across your stack.
          </p>
        </div>
        <PeriodSelector label={period.label} />
      </header>

      {/* KPI band */}
      <section aria-label="Workflow metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </section>

      {/* Charts row */}
      <section
        aria-label="Workflow trends"
        className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6"
      >
        <CompletionRateChart data={completionRateTrend} />
        <WorkflowStatusMix workflows={workflows} />
      </section>

      {/* Grouped by category */}
      <section aria-label="Workflows by category" className="space-y-10">
        {grouped.map(({ category, items }) => (
          <CategorySection key={category} category={category} items={items} />
        ))}
      </section>
    </div>
  );
}

function CategorySection({
  category,
  items,
}: {
  category: WorkflowCategory;
  items: Workflow[];
}) {
  const revenue = items.reduce((a, w) => a + w.metrics.revenueAttributed, 0);
  const hoursSaved = totalTimeSavedHours(items);
  const broken = items.filter((w) => w.status === "broken").length;

  // Build a narrative line. If everything is broken / zero, swap copy.
  const valueParts: string[] = [];
  if (hoursSaved > 0) valueParts.push(`saved ${formatHours(hoursSaved)}`);
  if (revenue > 0) valueParts.push(`drove ${formatCompactCurrency(revenue)} pipeline`);
  const narrative =
    valueParts.length > 0
      ? valueParts.join(" · ") + " this month"
      : "no value generated this month — needs attention.";

  return (
    <div>
      {/* Section header — narrative, not technical */}
      <div className="mb-4 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-lg font-semibold text-foreground">{category}</h2>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "workflow" : "workflows"}
          </span>
          {broken > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {broken} broken
            </span>
          )}
        </div>
        <p className="text-sm text-foreground/70 mt-1.5 leading-snug">
          {CATEGORY_DESC[category]}{" "}
          <span className="font-medium text-foreground">{narrative}</span>
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {items.map((w) => (
          <WorkflowCard key={w.id} workflow={w} />
        ))}
      </div>
    </div>
  );
}
