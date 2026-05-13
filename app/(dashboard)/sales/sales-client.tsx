"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  PeriodSelector,
  usePeriod,
} from "@/components/dashboard/period-selector";
import { EmptyState } from "@/components/dashboard/empty-state";
import { SectionTitle } from "@/components/dashboard/section-title";
import { StatusTile } from "@/components/dashboard/status-tile";
import {
  ActionCard,
  type ActionCardData,
} from "@/components/dashboard/action-card";
import { ROLE_KEY, type Role } from "@/components/dashboard/role-switch";
import { cn } from "@/lib/utils";

// ─────────────────────────── Shared types ───────────────────────────

export type AttentionMetric = {
  id: string;
  label: string;
  value: string;
  tone?: "neutral" | "warning" | "critical";
};

export type SalesTeamRow = {
  id: string;
  fullName: string;
  initials: string;
  avatarUrl?: string;
  avatarColor?: string;
  primaryLine: string;
  secondaryLine: string;
  tone?: "neutral" | "success" | "warning" | "critical";
};

export type ThisWeekItem = {
  id: string;
  label: string;
  tone?: "neutral" | "warning" | "critical";
};

export type TeamLeaderSalesData = {
  todaysAttention: AttentionMetric[];
  dealsNeedingAction: ActionCardData[];
  pulsorInsight: string | null;
  topDealsToWatch: ActionCardData[];
  thisWeek: ThisWeekItem[];
  teamOverview: SalesTeamRow[];
  isEmpty: boolean;
};

export type PipelineSummaryRow = {
  id: string;
  label: string;
  count: number;
  tone?: "neutral" | "warning" | "critical";
};

export type MomentumRow = {
  id: string;
  label: string;
  tone?: "neutral" | "success" | "warning";
};

export type AgentSalesData = {
  hotLeadsCount: number;
  hotLeadsNote: string;
  followUpsDueCount: number;
  followUpsDueNote: string;
  dealsAtRiskCount: number;
  dealsAtRiskNote: string;
  priorityActions: ActionCardData[];
  pulsorSuggestion: string | null;
  myPipeline: PipelineSummaryRow[];
  momentum: MomentumRow[];
  isEmpty: boolean;
};

export type SalesData = {
  teamLeader: TeamLeaderSalesData;
  agent: AgentSalesData;
};

// ─────────────────────────── Root client ────────────────────────────

export function SalesClient({ data }: { data: SalesData }) {
  const [role, setRole] = useState<Role>("team-leader");

  useEffect(() => {
    const read = () => {
      const stored = localStorage.getItem(ROLE_KEY) as Role | null;
      if (stored === "team-leader" || stored === "agent") setRole(stored);
    };
    read();
    const onChange = () => read();
    window.addEventListener("pulsor:role-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("pulsor:role-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return (
    <TooltipProvider delay={150}>
      {role === "agent" ? (
        <AgentSales data={data.agent} />
      ) : (
        <TeamLeaderSales data={data.teamLeader} />
      )}
    </TooltipProvider>
  );
}

// ─────────────────────────── Team Leader ────────────────────────────

function TeamLeaderSales({ data }: { data: TeamLeaderSalesData }) {
  const period = usePeriod();
  const isEmptyRange = period >= 30;
  const showEmpty = data.isEmpty || isEmptyRange;

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
            Sales
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Where the operation is breaking today.
          </p>
        </div>
        <PeriodSelector />
      </header>

      {/* ═══ 1 · TODAY'S ATTENTION ═══ */}
      <section aria-label="Today's attention" className="space-y-2">
        <SectionTitle
          title="Today's attention"
          tooltip="What needs the team's focus right now."
        />
        {showEmpty || data.todaysAttention.length === 0 ? (
          <EmptyState
            title={data.isEmpty ? "No data yet" : `No signals in last ${period} days`}
            hint={
              data.isEmpty
                ? "Your Pulsor advisor will load this week's data shortly."
                : "Try a shorter range."
            }
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.todaysAttention.map((m) => (
              <li key={m.id} className="flex items-center gap-3 px-5 py-3">
                <span
                  className={cn(
                    "font-mono text-2xl tabular-nums shrink-0 w-12 text-right",
                    m.tone === "critical" && "text-destructive",
                    m.tone === "warning" && "text-warning",
                    (!m.tone || m.tone === "neutral") && "text-foreground"
                  )}
                >
                  {m.value}
                </span>
                <span className="text-sm text-foreground flex-1 truncate">
                  {m.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ═══ 2 · DEALS NEEDING ACTION ═══ */}
      <section aria-label="Deals needing action" className="space-y-2">
        <SectionTitle
          title="Deals needing action"
          tooltip="Deals stalled, missing steps, or losing momentum."
          right={
            !showEmpty &&
            data.dealsNeedingAction.length > 0 && (
              <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                {data.dealsNeedingAction.length} pending
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
        ) : data.dealsNeedingAction.length === 0 ? (
          <EmptyState
            title="All clear"
            hint="No deals needing action right now."
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.dealsNeedingAction.map((d) => (
              <ActionCard key={d.id} data={d} />
            ))}
          </ul>
        )}
      </section>

      {/* ═══ 3 · PULSOR INSIGHT (one only) ═══ */}
      {data.pulsorInsight && !showEmpty && (
        <section aria-label="Pulsor insight">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles
                className="h-3.5 w-3.5 text-foreground"
                strokeWidth={2}
                fill="currentColor"
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Pulsor insight
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {data.pulsorInsight}
            </p>
          </div>
        </section>
      )}

      {/* ═══ 4 · TOP DEALS TO WATCH ═══ */}
      <section aria-label="Top deals to watch" className="space-y-2">
        <SectionTitle
          title="Top deals to watch"
          tooltip="The 3 deals most likely to break or close this week."
        />
        {showEmpty || data.topDealsToWatch.length === 0 ? (
          <EmptyState
            title="No top deals yet"
            hint="Your highest-stakes deals will appear here."
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.topDealsToWatch.map((d) => (
              <ActionCard key={d.id} data={d} />
            ))}
          </ul>
        )}
      </section>

      {/* ═══ 5 · THIS WEEK ═══ */}
      <section aria-label="This week" className="space-y-2">
        <SectionTitle
          title="This week"
          tooltip="Compact view of what's drifting this week."
        />
        {data.thisWeek.length === 0 ? (
          <EmptyState
            title="Nothing flagged this week"
            hint="Operational drift will surface here."
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.thisWeek.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    item.tone === "critical" && "bg-destructive",
                    item.tone === "warning" && "bg-warning",
                    (!item.tone || item.tone === "neutral") &&
                      "bg-muted-foreground/40"
                  )}
                />
                <span className="text-sm text-foreground flex-1 truncate">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ═══ 6 · TEAM OVERVIEW ═══ */}
      {data.teamOverview.length > 0 && (
        <section aria-label="Team overview" className="space-y-2">
          <SectionTitle
            title="Team overview"
            tooltip="Operational behavior across the team."
            right={
              <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                {data.teamOverview.length}{" "}
                {data.teamOverview.length === 1 ? "agent" : "agents"}
              </span>
            }
          />
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.teamOverview.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                <Avatar className="h-7 w-7 shrink-0">
                  {m.avatarUrl && (
                    <AvatarImage src={m.avatarUrl} alt={m.fullName} />
                  )}
                  <AvatarFallback
                    className={cn(
                      "text-[11px] font-semibold text-white",
                      m.avatarColor ?? "bg-foreground text-background"
                    )}
                  >
                    {m.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground w-40 shrink-0 truncate">
                  {m.fullName}
                </span>
                <span className="font-mono text-xs tabular-nums text-foreground w-36 shrink-0 truncate">
                  {m.primaryLine}
                </span>
                <span
                  className={cn(
                    "text-xs truncate flex-1",
                    m.tone === "critical" && "text-destructive",
                    m.tone === "warning" && "text-warning",
                    m.tone === "success" && "text-success",
                    (!m.tone || m.tone === "neutral") &&
                      "text-muted-foreground"
                  )}
                >
                  {m.secondaryLine}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

// ─────────────────────────── Agent ──────────────────────────────────

function AgentSales({ data }: { data: AgentSalesData }) {
  const period = usePeriod();
  const isEmptyRange = period >= 30;
  const showEmpty = data.isEmpty || isEmptyRange;

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
            Today&apos;s focus
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your highest-priority actions for today.
          </p>
        </div>
        <PeriodSelector />
      </header>

      {/* ═══ 1 · TOP CARDS ═══ */}
      <section aria-label="Today" className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatusTile
            label="Hot leads"
            value={data.isEmpty ? "—" : `${data.hotLeadsCount}`}
            deltaText={data.hotLeadsNote}
            tone={
              data.isEmpty ? "neutral" : data.hotLeadsCount > 0 ? "warning" : "neutral"
            }
            tooltip="Leads showing strong intent — waiting on your response."
          />
          <StatusTile
            label="Follow-ups due"
            value={data.isEmpty ? "—" : `${data.followUpsDueCount}`}
            deltaText={data.followUpsDueNote}
            tone={
              data.isEmpty ? "neutral" : data.followUpsDueCount > 0 ? "warning" : "neutral"
            }
            tooltip="Touches overdue or high priority for today."
          />
          <StatusTile
            label="Deals at risk"
            value={data.isEmpty ? "—" : `${data.dealsAtRiskCount}`}
            deltaText={data.dealsAtRiskNote}
            tone={
              data.isEmpty ? "neutral" : data.dealsAtRiskCount > 0 ? "critical" : "neutral"
            }
            tooltip="Deals missing the next step or losing momentum."
          />
        </div>
      </section>

      {/* ═══ 2 · PRIORITY ACTIONS ═══ */}
      <section aria-label="Priority actions" className="space-y-2">
        <SectionTitle
          title="Priority actions"
          tooltip="Direct next moves, ordered by impact."
          right={
            !showEmpty &&
            data.priorityActions.length > 0 && (
              <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                {data.priorityActions.length} to do
              </span>
            )
          }
        />
        {showEmpty ? (
          <EmptyState
            title={
              data.isEmpty
                ? "Nothing loaded yet"
                : `No actions in last ${period} days`
            }
            hint={
              data.isEmpty
                ? "Your Pulsor advisor will load this week's data shortly."
                : "Try a shorter range."
            }
          />
        ) : data.priorityActions.length === 0 ? (
          <EmptyState
            title="All caught up"
            hint="No priority actions surfaced for today."
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.priorityActions.map((a) => (
              <ActionCard key={a.id} data={a} />
            ))}
          </ul>
        )}
      </section>

      {/* ═══ 3 · PULSOR SUGGESTION (one only) ═══ */}
      {data.pulsorSuggestion && !showEmpty && (
        <section aria-label="Pulsor suggestion">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles
                className="h-3.5 w-3.5 text-foreground"
                strokeWidth={2}
                fill="currentColor"
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Pulsor suggestion
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {data.pulsorSuggestion}
            </p>
          </div>
        </section>
      )}

      {/* ═══ 4 · MY PIPELINE ═══ */}
      <section aria-label="My pipeline" className="space-y-2">
        <SectionTitle
          title="My pipeline"
          tooltip="Compact snapshot of your active work."
        />
        {data.myPipeline.length === 0 ? (
          <EmptyState
            title="Pipeline view coming soon"
            hint="Your active deals by stage will appear here."
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.myPipeline.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                <span className="text-sm text-foreground flex-1 truncate">
                  {p.label}
                </span>
                <span
                  className={cn(
                    "font-mono text-sm tabular-nums shrink-0",
                    p.tone === "critical" && "text-destructive",
                    p.tone === "warning" && "text-warning",
                    (!p.tone || p.tone === "neutral") && "text-foreground"
                  )}
                >
                  {p.count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ═══ 5 · MOMENTUM / WINS ═══ */}
      {data.momentum.length > 0 && (
        <section aria-label="Momentum" className="space-y-2">
          <SectionTitle
            title="Momentum"
            tooltip="What you're doing well — keep going."
          />
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.momentum.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    m.tone === "success" && "bg-success",
                    m.tone === "warning" && "bg-warning",
                    (!m.tone || m.tone === "neutral") &&
                      "bg-muted-foreground/40"
                  )}
                />
                <span className="text-sm text-foreground flex-1 truncate">
                  {m.label}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
