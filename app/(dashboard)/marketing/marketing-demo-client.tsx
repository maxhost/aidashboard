"use client";

import { AlertTriangle } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { StatusTile } from "@/components/dashboard/status-tile";
import { SectionTitle } from "@/components/dashboard/section-title";
import {
  ActionCard,
  type ActionCardData,
} from "@/components/dashboard/action-card";
import { cn } from "@/lib/utils";

export type MarketingPageData = {
  totalLeadsValue: string;
  totalLeadsDelta: string | null;
  bestChannelName: string;
  bestChannelSubtitle: string | null;
  costPerLeadValue: string;
  costPerLeadDelta: string | null;
  channels: { name: string; count: number; cpl: number; outlier?: boolean }[];
  insights: ActionCardData[];
};

const DEMO_DATA: MarketingPageData = {
  totalLeadsValue: "247",
  totalLeadsDelta: "+23% vs last month",
  bestChannelName: "Meta Ads",
  bestChannelSubtitle: "142 leads · 58% of total",
  costPerLeadValue: "$18.50",
  costPerLeadDelta: "−12% vs last month",
  channels: [
    { name: "Meta Ads", count: 142, cpl: 14 },
    { name: "LaHouse AI", count: 68, cpl: 22 },
    { name: "Organic Web", count: 23, cpl: 0 },
    { name: "YouTube Channel", count: 9, cpl: 0 },
    { name: "Google Ads", count: 5, cpl: 89, outlier: true },
  ],
  insights: [
    { id: "mi-1", tag: "INSIGHT", summary: "Bolivia leads convert 3× better than average" },
    { id: "mi-2", tag: "PATTERN", summary: "Meta CPL dropped 23% this week — capitalize" },
    { id: "mi-3", tag: "WARNING", summary: "Google Ads CPL is 6× higher than Meta" },
    { id: "mi-4", tag: "OPPORTUNITY", summary: "YouTube generates premium leads — $2.4M avg" },
    {
      id: "mi-5",
      tag: "RECOMMENDATION",
      summary: "LaHouse converts 2× better with internationals",
    },
  ],
};

export function MarketingDemoClient({
  data = DEMO_DATA,
}: {
  data?: MarketingPageData;
}) {
  const totalLeads = data.channels.reduce((a, c) => a + c.count, 0) || 1;
  const maxCount = Math.max(1, ...data.channels.map((c) => c.count));

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

        {/* Channel performance KPIs */}
        <section aria-label="Channel performance" className="space-y-2">
          <SectionTitle
            title="Channel performance"
            tooltip="How your acquisition channels are performing this month."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatusTile
              label="Total leads this month"
              value={data.totalLeadsValue}
              deltaText={data.totalLeadsDelta ?? ""}
              tone="neutral"
              tooltip="All leads captured across all channels in the current month."
            />
            <StatusTile
              label="Best channel"
              value={data.bestChannelName}
              deltaText={data.bestChannelSubtitle ?? ""}
              tone="success"
              tooltip="Channel generating the most qualified leads this month."
            />
            <StatusTile
              label="Cost per lead"
              value={data.costPerLeadValue}
              deltaText={data.costPerLeadDelta ?? ""}
              tone="success"
              tooltip="Total ad spend divided by leads generated this month."
            />
          </div>
        </section>

        {/* Channel breakdown */}
        <section aria-label="Channel breakdown" className="space-y-2">
          <SectionTitle
            title="Channel breakdown"
            tooltip="Where your leads are coming from in the last 30 days."
          />
          <div className="rounded-xl border border-border bg-card p-5">
            <ul className="space-y-4">
              {data.channels.map((c) => {
                const pct = Math.round((c.count / totalLeads) * 100);
                const barWidth = (c.count / maxCount) * 100;
                return (
                  <li key={c.name}>
                    <a
                      href="#"
                      className="grid grid-cols-[140px_1fr_auto_auto_auto] items-center gap-4 -mx-2 px-2 py-1 rounded-md hover:bg-muted/40 transition-colors"
                    >
                      <span className="text-sm text-foreground truncate">
                        {c.name}
                      </span>
                      <div className="h-2 rounded-sm bg-muted overflow-hidden">
                        <div
                          className="h-full bg-foreground/85"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <span className="font-mono text-sm tabular-nums text-foreground w-10 text-right">
                        {c.count}
                      </span>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground w-10 text-right">
                        {pct}%
                      </span>
                      <span
                        className={cn(
                          "font-mono text-xs tabular-nums w-24 text-right inline-flex items-center justify-end gap-1",
                          c.outlier ? "text-warning" : "text-muted-foreground"
                        )}
                      >
                        {c.cpl === 0 ? "$0/lead" : `$${c.cpl}/lead`}
                        {c.outlier && (
                          <AlertTriangle className="h-3 w-3" strokeWidth={2} />
                        )}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Pulsor insights */}
        <section aria-label="Pulsor insights" className="space-y-2">
          <SectionTitle
            title="Pulsor insights"
            tooltip="What Pulsor learned from your marketing this week."
            right={
              data.insights.length > 0 ? (
                <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                  {data.insights.length} insights
                </span>
              ) : null
            }
          />
          {data.insights.length > 0 ? (
            <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
              {data.insights.map((i) => (
                <ActionCard key={i.id} data={i} />
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </TooltipProvider>
  );
}
