"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";
import {
  Megaphone,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Pause,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { dashboardData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function MarketingPage() {
  const { period } = dashboardData;

  // ---- Simulated marketing numbers
  const totalSpend = 48_320;
  const totalLeads = 612;
  const cpl = totalSpend / totalLeads;
  const paidClosed = 14;
  const paidConvRate = (paidClosed / totalLeads) * 100;

  const kpis = [
    {
      label: "Total Ad Spend",
      value: `$${(totalSpend / 1000).toFixed(1)}K`,
      delta: 8.2,
    },
    {
      label: "Cost per Lead",
      value: `$${cpl.toFixed(0)}`,
      delta: -4.6,
      inverted: true,
    },
    {
      label: "Paid Lead Volume",
      value: totalLeads.toLocaleString(),
      delta: 12.1,
    },
    {
      label: "Paid → Closed",
      value: `${paidConvRate.toFixed(1)}%`,
      delta: 0.3,
    },
  ];

  const channelSpend = [
    { label: "Google Ads", value: 18_400 },
    { label: "Meta", value: 14_200 },
    { label: "Zillow", value: 9_800 },
    { label: "Realtor", value: 5_920 },
  ];

  const channelRoi = [
    { label: "Google Ads", value: 4.2 },
    { label: "Meta", value: 3.1 },
    { label: "Zillow", value: 2.4 },
    { label: "Realtor", value: 1.6 },
  ];

  const pastAdjustments: Adjustment[] = [
    {
      id: "adj-1",
      date: "Apr 28",
      title: "Paused Realtor.com campaign — CPL above threshold",
      detail: "CPL hit $106 (target $80). Reallocated $2.4K to Google Ads.",
      kind: "paused",
      impact: "+18 leads recovered",
    },
    {
      id: "adj-2",
      date: "Apr 22",
      title: "Increased Google Ads daily budget by 20%",
      detail: "ROI sustained at 4.2× for 14 consecutive days.",
      kind: "scaled",
      impact: "+$3.1K spend / +52 leads",
    },
    {
      id: "adj-3",
      date: "Apr 15",
      title: "Launched Meta retargeting for past site visitors",
      detail: "Audience: 8.2K cookied visitors over last 30 days.",
      kind: "launched",
      impact: "$24 CPL (vs $71 cold)",
    },
    {
      id: "adj-4",
      date: "Apr 9",
      title: "Cut underperforming Meta creative set",
      detail: "Set B (carousel) had 0.8% CTR vs 2.1% for Set A.",
      kind: "optimized",
      impact: "-$1.8K wasted spend",
    },
    {
      id: "adj-5",
      date: "Apr 2",
      title: "Switched Zillow to Premier Agent ZIP bundle",
      detail: "Consolidated 6 zips into top-3 by closed-deal density.",
      kind: "optimized",
      impact: "CPL $87 → $62",
    },
    {
      id: "adj-6",
      date: "Mar 26",
      title: "Resumed Google Ads brand campaign",
      detail: "Branded queries up 34% after press mention.",
      kind: "resumed",
      impact: "+22 high-intent leads",
    },
  ];

  return (
    <div className="px-4 sm:px-6 py-8 lg:px-8 lg:py-10 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
            Marketing
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Channel performance, paid spend, and acquisition cost.
          </p>
        </div>
        <PeriodSelector label={period.label} />
      </header>

      {/* Original layout — now populated with simulated data */}
      <section className="rounded-xl border border-border/70 bg-card p-12 flex flex-col items-center text-center">
        <span className="h-12 w-12 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
          <Megaphone className="h-6 w-6 text-violet-600" strokeWidth={1.75} />
        </span>
        <h2 className="text-lg font-semibold text-foreground">
          Paid acquisition this month
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
          Channel ROI, CAC by source, paid-vs-organic mix, and ad-spend trends —
          across Google Ads, Meta, Zillow, and Realtor.com.
        </p>

        {/* KPI tiles — same shape as placeholder, filled */}
        <div className="mt-8 w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpis.map((k) => {
            const isUp = k.delta >= 0;
            const isImprovement = k.inverted ? !isUp : isUp;
            return (
              <div
                key={k.label}
                className="rounded-lg border border-border/60 bg-card px-4 py-3 text-left"
              >
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {k.label}
                </div>
                <div className="flex items-baseline justify-between gap-2 mt-1">
                  <div className="font-mono text-base font-bold tabular-nums text-foreground">
                    {k.value}
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 font-mono text-[10px] font-semibold tabular-nums",
                      isImprovement ? "text-emerald-700" : "text-rose-700"
                    )}
                  >
                    {isUp ? (
                      <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" strokeWidth={2.5} />
                    )}
                    {Math.abs(k.delta).toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two charts — same shape as placeholder, filled */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
          <MiniChart
            title="Spend by channel"
            data={channelSpend}
            format={(v) => `$${(v / 1000).toFixed(1)}K`}
            colors={["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd"]}
          />
          <MiniChart
            title="ROI by channel"
            data={channelRoi}
            format={(v) => `${v.toFixed(1)}×`}
            colors={["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"]}
          />
        </div>
      </section>

      {/* Past adjustments / acted-on insights */}
      <section
        aria-label="Past adjustments"
        className="rounded-xl border border-border/70 bg-card p-6 sm:p-8"
      >
        <div className="flex items-start justify-between gap-2 mb-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Insights acted on
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Adjustments you've made — and what they moved.
            </p>
          </div>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {pastAdjustments.length} this quarter
          </span>
        </div>
        <ul className="divide-y divide-border/60">
          {pastAdjustments.map((a) => (
            <AdjustmentRow key={a.id} adjustment={a} />
          ))}
        </ul>
      </section>
    </div>
  );
}

// ---------- Mini chart (fits inside 120px placeholder zone) ----------

function MiniChart({
  title,
  data,
  format,
  colors,
}: {
  title: string;
  data: { label: string; value: number }[];
  format: (v: number) => string;
  colors: string[];
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-4 min-h-[120px] text-left">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
        {title}
      </div>
      <div className="h-[110px] mt-2 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              stroke="#9CA3AF"
              fontSize={9}
              tickMargin={4}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              stroke="#9CA3AF"
              fontSize={9}
              width={36}
              tickFormatter={format}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 11,
              }}
              formatter={(v: number) => [format(v), title]}
              cursor={{ fill: "rgba(124, 58, 237, 0.06)" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ---------- Adjustments list ----------

type Adjustment = {
  id: string;
  date: string;
  title: string;
  detail: string;
  kind: "paused" | "scaled" | "launched" | "optimized" | "resumed";
  impact: string;
};

const KIND_META: Record<
  Adjustment["kind"],
  { label: string; icon: typeof CheckCircle2; iconBg: string; iconColor: string }
> = {
  paused: { label: "Paused", icon: Pause, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  scaled: { label: "Scaled", icon: TrendingUp, iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
  launched: { label: "Launched", icon: Sparkles, iconBg: "bg-violet-100", iconColor: "text-violet-600" },
  optimized: { label: "Optimized", icon: CheckCircle2, iconBg: "bg-sky-100", iconColor: "text-sky-600" },
  resumed: { label: "Resumed", icon: TrendingDown, iconBg: "bg-rose-100", iconColor: "text-rose-600" },
};

function AdjustmentRow({ adjustment: a }: { adjustment: Adjustment }) {
  const meta = KIND_META[a.kind];
  const Icon = meta.icon;
  return (
    <li className="flex items-start gap-3 py-3">
      <span
        className={cn(
          "h-8 w-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5",
          meta.iconBg
        )}
      >
        <Icon className={cn("h-4 w-4", meta.iconColor)} strokeWidth={2} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {meta.label}
          </span>
          <span className="text-[11px] font-mono tabular-nums text-muted-foreground/70">
            {a.date}
          </span>
        </div>
        <p className="text-sm font-medium text-foreground mt-0.5 leading-snug">
          {a.title}
        </p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {a.detail}
        </p>
      </div>
      <span className="font-mono text-[11px] tabular-nums text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md shrink-0 mt-0.5">
        {a.impact}
      </span>
    </li>
  );
}
