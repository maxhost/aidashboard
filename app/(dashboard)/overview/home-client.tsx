"use client";

import { Sparkles } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  PeriodSelector,
  usePeriod,
} from "@/components/dashboard/period-selector";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusTile } from "@/components/dashboard/status-tile";
import { SectionTitle } from "@/components/dashboard/section-title";
import {
  ActionCard,
  type ActionCardData,
} from "@/components/dashboard/action-card";

export type HomeTeamMember = {
  id: string;
  fullName: string;
  initials: string;
  pipelineLabel: string;
  noteText: string;
  hasData: boolean;
};

export type HomeData = {
  firstName: string;
  /** Pre-formatted strings for the 3 KPI tiles. */
  pipelineValue: string;
  leadsAtRiskCount: number;
  closesLine: string | null;
  /** Pulsor insights derived from critical_leads. */
  pulsorInsights: ActionCardData[];
  /** Free-text contextual fields from the weekly snapshot. */
  weeklyInsight: string | null;
  thisWeekGoal: string | null;
  lastWeekWins: string | null;
  /** Populated only for team leaders. */
  team: HomeTeamMember[] | null;
  /** True when admin hasn't loaded any agent_data yet for this week. */
  isEmpty: boolean;
};

export function HomeClient({ data }: { data: HomeData }) {
  const period = usePeriod();
  const isEmptyRange = period >= 30;
  const showEmpty = data.isEmpty || isEmptyRange;

  return (
    <TooltipProvider delay={150}>
      <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
              Good morning, {data.firstName}.
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              What needs your attention today.
            </p>
          </div>
          <PeriodSelector />
        </header>

        {/* ═══ 1 · STATUS TILES ═══ */}
        <section aria-label="Status" className="space-y-2">
          <SectionTitle
            title="Status"
            tooltip="How your business is doing today at a glance."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatusTile
              label="Active pipeline"
              value={data.isEmpty ? "—" : data.pipelineValue}
              deltaText="Total in negotiation"
              tone="neutral"
              tooltip="Sum of estimated value of active deals from first contact through close. Excludes closed and lost deals."
            />
            <StatusTile
              label="Leads at risk"
              value={data.isEmpty ? "—" : `${data.leadsAtRiskCount}`}
              deltaText="No contact > 48h"
              tone={data.leadsAtRiskCount > 0 ? "critical" : "neutral"}
              tooltip="Active leads without follow-up in 48h+. Conversion drops 50% after 72h of silence."
            />
            <StatusTile
              label="Closes this month"
              value={data.closesLine ?? "—"}
              deltaText={data.closesLine ? "Goal vs actual" : ""}
              tone="neutral"
              tooltip="Deals closed this month versus your monthly target."
            />
          </div>
        </section>

        {/* ═══ 2 · PULSOR INSIGHTS ═══ */}
        <section aria-label="Pulsor insights" className="space-y-2">
          <SectionTitle
            title="Pulsor insights"
            tooltip="What Pulsor surfaced for you to act on today."
            right={
              !showEmpty &&
              data.pulsorInsights.length > 0 && (
                <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                  {data.pulsorInsights.length} pending
                </span>
              )
            }
          />
          {showEmpty ? (
            <EmptyState
              title={
                data.isEmpty
                  ? "Your dashboard hasn't been updated yet"
                  : `No insights in last ${period} days`
              }
              hint={
                data.isEmpty
                  ? "Your Pulsor advisor will load this week's data shortly."
                  : "Try a shorter range or wait for new signals."
              }
            />
          ) : data.pulsorInsights.length === 0 ? (
            <EmptyState
              title="Nothing critical this week"
              hint="No leads at risk surfaced for action today."
            />
          ) : (
            <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
              {data.pulsorInsights.map((a) => (
                <ActionCard key={a.id} data={a} />
              ))}
            </ul>
          )}
        </section>

        {/* ═══ 3 · This week's focus + Last week's wins (text cards) ═══ */}
        {(data.thisWeekGoal || data.lastWeekWins || data.weeklyInsight) &&
          !data.isEmpty && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.thisWeekGoal && (
                <TextCard
                  title="This week's focus"
                  body={data.thisWeekGoal}
                />
              )}
              {data.lastWeekWins && (
                <TextCard
                  title="Last week's wins"
                  body={data.lastWeekWins}
                  tone="success"
                />
              )}
              {data.weeklyInsight && !data.thisWeekGoal && (
                <TextCard
                  title="What Pulsor learned"
                  body={data.weeklyInsight}
                  icon
                />
              )}
            </section>
          )}

        {/* ═══ 4 · MY TEAM (team leaders only) ═══ */}
        {data.team && data.team.length > 0 && (
          <section aria-label="My team this week" className="space-y-2">
            <SectionTitle
              title="My team this week"
              tooltip="Quick agent status from this week's snapshot."
              right={
                <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                  {data.team.length}{" "}
                  {data.team.length === 1 ? "agent" : "agents"}
                </span>
              }
            />
            <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
              {data.team.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <span className="h-7 w-7 rounded-full bg-foreground text-background text-[11px] font-semibold inline-flex items-center justify-center shrink-0">
                    {m.initials}
                  </span>
                  <span className="text-sm font-medium text-foreground w-40 shrink-0 truncate">
                    {m.fullName}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-foreground w-24 shrink-0">
                    {m.pipelineLabel}
                  </span>
                  <span className="text-xs text-muted-foreground truncate flex-1">
                    {m.noteText}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </TooltipProvider>
  );
}

function TextCard({
  title,
  body,
  icon,
  tone = "neutral",
}: {
  title: string;
  body: string;
  icon?: boolean;
  tone?: "neutral" | "success";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-1.5 mb-2">
        {icon && (
          <Sparkles
            className="h-3.5 w-3.5 text-foreground"
            strokeWidth={2}
            fill="currentColor"
          />
        )}
        <span
          className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${
            tone === "success" ? "text-success" : "text-muted-foreground"
          }`}
        >
          {title}
        </span>
      </div>
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
        {body}
      </p>
    </div>
  );
}
