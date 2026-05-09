"use client";

import { useState } from "react";
import { dashboardData } from "@/lib/mock-data";
import { WorkflowCard } from "@/components/dashboard/workflow-card";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import {
  formatHours,
  totalTimeSavedHours,
} from "@/lib/workflows/manual-time";
import type { Workflow, WorkflowCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | WorkflowCategory;

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
  const { workflows } = dashboardData;
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  // Per-category counts (always derived from full set so chips don't disappear)
  const counts: Record<CategoryFilter, number> = {
    all: workflows.length,
    "Follow-up": 0,
    "Lead Nurture": 0,
    Listing: 0,
    "Re-engagement": 0,
    Sphere: 0,
  };
  for (const w of workflows) counts[w.category] += 1;

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
  })
    .filter((g) => g.items.length > 0)
    .filter((g) => activeCategory === "all" || g.category === activeCategory);

  const filterChips: CategoryFilter[] = ["all", ...CATEGORY_ORDER];

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
        <PeriodSelector />
      </header>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-1.5">
        {filterChips.map((cat) => {
          const active = activeCategory === cat;
          const label = cat === "all" ? "All" : cat;
          const count = counts[cat];
          const disabled = cat !== "all" && count === 0;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              disabled={disabled}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium transition-colors border",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-foreground/30",
                disabled && "opacity-40 cursor-not-allowed"
              )}
            >
              {label}
              <span
                className={cn(
                  "font-mono tabular-nums text-[11px]",
                  active
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

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
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
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
