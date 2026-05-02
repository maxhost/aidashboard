"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { dashboardData } from "@/lib/mock-data";
import type { Insight } from "@/lib/types";
import { ActNowCard } from "@/components/dashboard/insights/act-now-card";
import { InsightDetailSheet } from "@/components/dashboard/insights/insight-detail-sheet";
import { SnoozeToast } from "@/components/dashboard/insights/snooze-toast";
import { InsightUniformCard } from "@/components/dashboard/insight-uniform-card";
import { TeamScorecardsTable } from "@/components/dashboard/team-scorecards-table";
import { WinCard } from "@/components/dashboard/win-card";
import { KpiChip } from "@/components/dashboard/kpi-chip";
import { PeriodSelector } from "@/components/dashboard/period-selector";

const TOP_INSIGHTS_LIMIT = 4;

export default function OverviewPage() {
  const { user, period, kpis, insights, agents } = dashboardData;
  const firstName = user.name.split(" ")[0];

  // ───── Local snooze state ─────
  const [snoozedIds, setSnoozedIds] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<Insight | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    undoId: string | null;
  } | null>(null);

  // Apply snooze overlay
  const visiblePending = useMemo(
    () =>
      insights
        .filter((i) => i.state === "pending")
        .filter((i) => !snoozedIds.has(i.id)),
    [insights, snoozedIds]
  );

  // ───── Section buckets ─────
  const critical = visiblePending.find((i) => i.type === "critical") ?? null;
  const wins = visiblePending
    .filter((i) => i.type === "opportunity")
    .slice(0, 2);

  // Top 4 non-critical insights, sorted by createdAt desc (newest first).
  // Filtering by category lives on /insights, not here.
  const byCategoryAll = visiblePending
    .filter((i) => i.type !== "critical")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  const topInsights = byCategoryAll.slice(0, TOP_INSIGHTS_LIMIT);
  const remainingInsights = byCategoryAll.length - topInsights.length;

  // ───── Handlers ─────
  function handleSnooze(id: string) {
    setSnoozedIds((prev) => new Set(prev).add(id));
    setToast({ message: "Snoozed for 7 days", undoId: id });
  }
  function handleUndoSnooze(id: string) {
    setSnoozedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setToast(null);
  }
  function handlePrimary(insight: Insight) {
    setToast({
      message: `Action queued: ${insight.primaryAction.label}`,
      undoId: null,
    });
  }

  return (
    <div className="px-4 sm:px-6 py-8 lg:px-8 lg:py-10 max-w-[1200px] mx-auto space-y-8">
      {/* ═══ 1. Welcome header ═══ */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
            Welcome back, {firstName}.
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            What Pulsor surfaced this week
          </p>
        </div>
        <PeriodSelector label={period.label} />
      </header>

      {/* ═══ 3. CRITICAL section ═══ */}
      {critical && (
        <section aria-label="Needs your attention">
          <SectionHeader title="Needs your attention" tone="critical" />
          <ActNowCard
            insight={critical}
            onPrimary={() => handlePrimary(critical)}
            onOpenDetail={() => setDetail(critical)}
          />
        </section>
      )}

      {/* ═══ 4. TOP INSIGHTS (top 4, no filters — filter by category lives on /insights) ═══ */}
      {topInsights.length > 0 && (
        <section aria-label="Top insights" className="space-y-3">
          <SectionHeader title="Top insights this week" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {topInsights.map((insight) => (
              <InsightUniformCard
                key={insight.id}
                insight={insight}
                onPrimary={() => handlePrimary(insight)}
                onOpenDetail={() => setDetail(insight)}
              />
            ))}
          </div>

          {remainingInsights > 0 && (
            <a
              href="/insights"
              className="inline-flex items-center justify-center w-full gap-1.5 rounded-lg border border-border/70 bg-card hover:bg-muted/50 hover:border-foreground/30 px-4 py-2.5 text-sm font-medium text-foreground transition-colors"
            >
              +{remainingInsights} more in Insights
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </a>
          )}
        </section>
      )}

      {/* ═══ 5. TEAM SCORECARDS (database-style table for scale) ═══ */}
      <section aria-label="Team adoption & performance" className="space-y-4">
        <SectionHeader
          title="Team adoption & performance"
          count={agents.length}
          link={{ label: "Open Team", href: "/team" }}
        />
        <TeamScorecardsTable agents={agents} />
      </section>

      {/* ═══ 6. WINS ═══ */}
      {wins.length > 0 && (
        <section aria-label="Wins this week" className="space-y-3">
          <SectionHeader title="Wins this week" tone="muted" count={wins.length} />
          <div className="space-y-2">
            {wins.map((insight) => (
              <WinCard
                key={insight.id}
                insight={insight}
                onPrimary={() => handlePrimary(insight)}
                onOpenDetail={() => setDetail(insight)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ═══ 7. QUICK METRICS ═══ */}
      <section aria-label="Quick metrics" className="pt-2">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Quick metrics
          </h2>
          <a
            href="/sales"
            className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            Open Sales
            <ArrowRight className="h-3 w-3" strokeWidth={2} />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpis.map((kpi) => (
            <KpiChip key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </section>

      {/* Detail sheet */}
      <InsightDetailSheet
        insight={detail}
        open={detail !== null}
        onOpenChange={(o) => !o && setDetail(null)}
        onPrimary={() => detail && handlePrimary(detail)}
        onSnooze={() => detail && handleSnooze(detail.id)}
      />

      {/* Snooze toast */}
      <SnoozeToast
        open={toast !== null}
        message={toast?.message ?? ""}
        onUndo={() => toast?.undoId && handleUndoSnooze(toast.undoId)}
        onDismiss={() => setToast(null)}
      />
    </div>
  );
}

function SectionHeader({
  title,
  count,
  tone,
  link,
}: {
  title: string;
  count?: number;
  tone?: "critical" | "muted";
  link?: { label: string; href: string };
}) {
  return (
    <div className="flex items-baseline justify-between mb-1">
      <div className="flex items-baseline gap-2.5">
        <h2
          className={
            tone === "critical"
              ? "text-[11px] font-bold uppercase tracking-[0.12em] text-rose-700"
              : tone === "muted"
                ? "text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                : "text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground"
          }
        >
          {title}
        </h2>
        {count !== undefined && (
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {count}
          </span>
        )}
      </div>
      {link && (
        <a
          href={link.href}
          className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          {link.label}
          <ArrowRight className="h-3 w-3" strokeWidth={2} />
        </a>
      )}
    </div>
  );
}
