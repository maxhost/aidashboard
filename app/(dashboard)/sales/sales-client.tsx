"use client";

import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  PeriodSelector,
  usePeriod,
} from "@/components/dashboard/period-selector";
import { EmptyState } from "@/components/dashboard/empty-state";
import { SectionTitle } from "@/components/dashboard/section-title";
import {
  ActionCard,
  type ActionCardData,
} from "@/components/dashboard/action-card";
import {
  ActionCardExpanded,
  type ActionCardExpandedData,
} from "@/components/dashboard/action-card-expanded";
import { cn } from "@/lib/utils";

type DealTab = "at-risk" | "stalled" | "hot" | "all-active";

export type SalesData = {
  /** Header line: "$X.XM pipeline · N leads · X.X% conversion · $X.XM on table". */
  snapshotLine: string;
  /** Top urgent deals (days_no_contact > 5). */
  urgentDeals: ActionCardData[];
  /** Free-text insight surfaced this week. */
  weeklyInsight: string | null;
  /** All deals split by tab. */
  dealsByTab: Record<DealTab, ActionCardExpandedData[]>;
  totalDeals: number;
  totalPipelineLabel: string;
  isEmpty: boolean;
};

export function SalesClient({ data }: { data: SalesData }) {
  const [activeTab, setActiveTab] = useState<DealTab>("at-risk");
  const period = usePeriod();
  const isEmptyRange = period >= 30;
  const showEmpty = data.isEmpty || isEmptyRange;

  const TABS: { key: DealTab; label: string; count: number }[] = [
    { key: "at-risk", label: "At Risk", count: data.dealsByTab["at-risk"].length },
    { key: "stalled", label: "Stalled", count: data.dealsByTab.stalled.length },
    { key: "hot", label: "Hot", count: data.dealsByTab.hot.length },
    {
      key: "all-active",
      label: "All Active",
      count: data.dealsByTab["all-active"].length,
    },
  ];
  const visibleDeals = data.dealsByTab[activeTab];

  return (
    <TooltipProvider delay={150}>
      <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
              Sales
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your pipeline, prioritized by what matters now.
            </p>
          </div>
          <PeriodSelector />
        </header>

        {/* ═══ 1 · PERFORMANCE SNAPSHOT ═══ */}
        <section aria-label="Performance snapshot" className="space-y-2">
          <SectionTitle
            title="Performance snapshot"
            tooltip="Where the pipeline stands today."
          />
          {showEmpty ? (
            <EmptyState
              title={
                data.isEmpty
                  ? "No data yet"
                  : `No data in last ${period} days`
              }
              hint={
                data.isEmpty
                  ? "Your Pulsor advisor will load this week's data shortly."
                  : "Try a shorter range."
              }
            />
          ) : (
            <div className="rounded-xl border border-border bg-card px-5 py-4">
              <p className="font-mono text-sm tabular-nums text-foreground">
                {data.snapshotLine}
              </p>
            </div>
          )}
        </section>

        {/* ═══ 2 · DEALS NEEDING ACTION ═══ */}
        <section aria-label="Deals needing action" className="space-y-2">
          <SectionTitle
            title="Deals needing action"
            tooltip="Deals at risk or needing your push today."
            right={
              !showEmpty &&
              data.urgentDeals.length > 0 && (
                <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                  {data.urgentDeals.length} pending
                </span>
              )
            }
          />
          {showEmpty ? (
            <EmptyState
              title="No urgent deals"
              hint={
                data.isEmpty
                  ? "Critical leads will surface here once data is loaded."
                  : "Switch to a shorter range to see urgent items."
              }
            />
          ) : data.urgentDeals.length === 0 ? (
            <EmptyState
              title="All clear"
              hint="No critical leads needing attention right now."
            />
          ) : (
            <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
              {data.urgentDeals.map((d) => (
                <ActionCard key={d.id} data={d} />
              ))}
            </ul>
          )}
        </section>

        {/* ═══ 3 · PULSOR INSIGHT (weekly_insight) ═══ */}
        {data.weeklyInsight && !showEmpty && (
          <section aria-label="Pulsor insight" className="space-y-2">
            <SectionTitle
              title="Pulsor insight"
              tooltip="What Pulsor learned about your pipeline this week."
            />
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {data.weeklyInsight}
              </p>
            </div>
          </section>
        )}

        {/* ═══ 4 · ACTIVE DEALS WITH TABS ═══ */}
        <section aria-label="Active deals" className="space-y-3">
          <SectionTitle
            title="Active deals"
            tooltip="Your full pipeline, organized by what needs you most."
            right={
              !data.isEmpty && (
                <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                  {data.totalDeals} deals · {data.totalPipelineLabel}
                </span>
              )
            }
          />

          {data.isEmpty ? (
            <EmptyState
              title="No deals tracked yet"
              hint="Your Pulsor advisor will load critical leads weekly."
            />
          ) : (
            <>
              <div className="flex flex-wrap gap-1.5">
                {TABS.map((tab) => {
                  const active = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium transition-colors border",
                        active
                          ? "bg-foreground text-background border-foreground"
                          : "bg-card text-foreground border-border hover:border-foreground/30"
                      )}
                    >
                      {tab.label}
                      <span
                        className={cn(
                          "font-mono tabular-nums text-[11px]",
                          active
                            ? "text-background/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
              {visibleDeals.length === 0 ? (
                <EmptyState
                  title={`Nothing in ${
                    TABS.find((t) => t.key === activeTab)?.label
                  }`}
                />
              ) : (
                <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
                  {visibleDeals.map((d) => (
                    <ActionCardExpanded key={d.id} data={d} />
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </TooltipProvider>
  );
}
