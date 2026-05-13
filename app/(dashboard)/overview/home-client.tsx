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
import { StatusTile } from "@/components/dashboard/status-tile";
import { SectionTitle } from "@/components/dashboard/section-title";
import {
  ActionCard,
  type ActionCardData,
} from "@/components/dashboard/action-card";
import { ROLE_KEY, type Role } from "@/components/dashboard/role-switch";
import { cn } from "@/lib/utils";

// ─────────────────────────── Shared types ───────────────────────────

export type HomeTeamMember = {
  id: string;
  fullName: string;
  initials: string;
  /** Optional profile photo URL. Falls back to initials when missing. */
  avatarUrl?: string;
  /** Background color class for the initials fallback. */
  avatarColor?: string;
  /** Primary line: e.g. "18m avg response" or "$3.9M pipeline". */
  primaryLine: string;
  /** Operational secondary line: e.g. "0 stalled deals". */
  secondaryLine: string;
  /** Color hint for the secondary line. */
  tone?: "success" | "warning" | "critical" | "neutral";
};

export type WorkflowStageState = "stable" | "delayed" | "at-risk";
export type WorkflowStage = {
  id: string;
  label: string;
  state: WorkflowStageState;
};

export type TeamLeaderHomeData = {
  firstName: string;
  pipelineAtRisk: string;
  pipelineAtRiskNote: string;
  leadsAtRiskCount: number;
  leadsAtRiskNote: string;
  teamHealthScore: number | null;
  teamHealthNote: string;
  operationalLeaks: ActionCardData[];
  workflowBottlenecks: WorkflowStage[];
  team: HomeTeamMember[] | null;
  weeklyInsight: string | null;
  thisWeekGoal: string | null;
  lastWeekWins: string | null;
  isEmpty: boolean;
};

export type AgentSignal = {
  id: string;
  label: string;
  value?: string;
  tone?: "neutral" | "success" | "warning" | "critical";
};

export type AgentPipelineStage = {
  id: string;
  label: string;
  count: number;
  tone?: "neutral" | "warning" | "critical";
};

export type AgentHomeData = {
  firstName: string;
  todayPrioritiesCount: number;
  hotLeadsCount: number;
  dealsAtRiskCount: number;
  todaysActions: ActionCardData[];
  recommendedFocus: string | null;
  performanceSignals: AgentSignal[];
  pipeline: AgentPipelineStage[];
  isEmpty: boolean;
};

export type HomeData = {
  teamLeader: TeamLeaderHomeData;
  agent: AgentHomeData;
};

// ─────────────────────────── Root client ────────────────────────────

export function HomeClient({ data }: { data: HomeData }) {
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
        <AgentHome data={data.agent} />
      ) : (
        <TeamLeaderHome data={data.teamLeader} />
      )}
    </TooltipProvider>
  );
}

// ─────────────────────────── Team Leader ────────────────────────────

function TeamLeaderHome({ data }: { data: TeamLeaderHomeData }) {
  const period = usePeriod();
  const isEmptyRange = period >= 30;
  const showEmpty = data.isEmpty || isEmptyRange;

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
            Good morning, {data.firstName}.
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Where the operation is breaking today.
          </p>
        </div>
        <PeriodSelector />
      </header>

      {/* ═══ 1 · ATTENTION REQUIRED ═══ */}
      <section aria-label="Attention required" className="space-y-2">
        <SectionTitle
          title="Attention required"
          tooltip="Operational risk surfaced for you to act on today."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatusTile
            label="Pipeline at risk"
            value={data.isEmpty ? "—" : data.pipelineAtRisk}
            deltaText={data.pipelineAtRiskNote}
            tone={data.isEmpty ? "neutral" : "critical"}
            tooltip="Active deals with no response in 72h+. Conversion drops fast after this point."
          />
          <StatusTile
            label="Leads at risk"
            value={data.isEmpty ? "—" : `${data.leadsAtRiskCount}`}
            deltaText={data.leadsAtRiskNote}
            tone={
              data.isEmpty ? "neutral" : data.leadsAtRiskCount > 0 ? "warning" : "neutral"
            }
            tooltip="Active leads without follow-up in 48h+."
          />
          <StatusTile
            label="Team health"
            value={
              data.teamHealthScore !== null
                ? `${data.teamHealthScore} / 100`
                : "—"
            }
            deltaText={
              data.teamHealthScore !== null ? data.teamHealthNote : ""
            }
            tone={
              data.teamHealthScore === null
                ? "neutral"
                : data.teamHealthScore >= 75
                ? "success"
                : data.teamHealthScore >= 50
                ? "warning"
                : "critical"
            }
            tooltip="Composite operational health: response times, follow-through, stalled deals, SLA compliance."
          />
        </div>
      </section>

      {/* ═══ 2 · OPERATIONAL LEAKS ═══ */}
      <section aria-label="Operational leaks" className="space-y-2">
        <SectionTitle
          title="Operational leaks"
          tooltip="Where the team is losing pipeline, time, or follow-through."
          right={
            !showEmpty &&
            data.operationalLeaks.length > 0 && (
              <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                {data.operationalLeaks.length} pending
              </span>
            )
          }
        />
        {showEmpty ? (
          <EmptyState
            title={
              data.isEmpty
                ? "Your dashboard hasn't been updated yet"
                : `No leaks in last ${period} days`
            }
            hint={
              data.isEmpty
                ? "Your Pulsor advisor will load this week's data shortly."
                : "Try a shorter range or wait for new signals."
            }
          />
        ) : data.operationalLeaks.length === 0 ? (
          <EmptyState
            title="No leaks this week"
            hint="No deals or workflows at risk surfaced today."
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.operationalLeaks.map((a) => (
              <ActionCard key={a.id} data={a} />
            ))}
          </ul>
        )}
      </section>

      {/* ═══ 3 · WORKFLOW BOTTLENECKS ═══ */}
      <section aria-label="Workflow bottlenecks" className="space-y-2">
        <SectionTitle
          title="Workflow bottlenecks"
          tooltip="Operational state of each stage across the team."
        />
        {data.workflowBottlenecks.length === 0 ? (
          <EmptyState
            title="Workflow monitoring coming soon"
            hint="Stage-by-stage operational health will appear here."
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.workflowBottlenecks.map((s) => (
              <WorkflowRow key={s.id} stage={s} />
            ))}
          </ul>
        )}
      </section>

      {/* ═══ 4 · Contextual text cards ═══ */}
      {(data.thisWeekGoal || data.lastWeekWins || data.weeklyInsight) &&
        !data.isEmpty && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.thisWeekGoal && (
              <TextCard title="This week's focus" body={data.thisWeekGoal} />
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

      {/* ═══ 5 · MY TEAM THIS WEEK ═══ */}
      {data.team && data.team.length > 0 && (
        <section aria-label="My team this week" className="space-y-2">
          <SectionTitle
            title="My team this week"
            tooltip="Operational behavior connected to risk and SLA."
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

function AgentHome({ data }: { data: AgentHomeData }) {
  const period = usePeriod();
  const isEmptyRange = period >= 30;
  const showEmpty = data.isEmpty || isEmptyRange;

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
            Good morning, {data.firstName}.
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s what needs your attention today.
          </p>
        </div>
        <PeriodSelector />
      </header>

      {/* ═══ 1 · TOP CARDS ═══ */}
      <section aria-label="Today" className="space-y-2">
        <SectionTitle
          title="Today"
          tooltip="What to execute now to close more this week."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatusTile
            label="Today's priorities"
            value={data.isEmpty ? "—" : `${data.todayPrioritiesCount}`}
            deltaText="Calls, follow-ups, and deal tasks"
            tone="neutral"
            tooltip="Action items surfaced for you today."
          />
          <StatusTile
            label="Hot leads"
            value={data.isEmpty ? "—" : `${data.hotLeadsCount}`}
            deltaText="High intent, waiting response"
            tone={
              data.isEmpty ? "neutral" : data.hotLeadsCount > 0 ? "warning" : "neutral"
            }
            tooltip="Leads showing strong signals — likely to close if engaged fast."
          />
          <StatusTile
            label="Deals at risk"
            value={data.isEmpty ? "—" : `${data.dealsAtRiskCount}`}
            deltaText="Stalled or missing next step"
            tone={
              data.isEmpty ? "neutral" : data.dealsAtRiskCount > 0 ? "critical" : "neutral"
            }
            tooltip="Deals where momentum is breaking or a step is overdue."
          />
        </div>
      </section>

      {/* ═══ 2 · TODAY'S ACTIONS ═══ */}
      <section aria-label="Today's actions" className="space-y-2">
        <SectionTitle
          title="Today's actions"
          tooltip="Concrete next moves, ordered by impact."
          right={
            !showEmpty &&
            data.todaysActions.length > 0 && (
              <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                {data.todaysActions.length} to do
              </span>
            )
          }
        />
        {showEmpty ? (
          <EmptyState
            title={
              data.isEmpty
                ? "Your dashboard hasn't been updated yet"
                : `No actions in last ${period} days`
            }
            hint={
              data.isEmpty
                ? "Your Pulsor advisor will load this week's data shortly."
                : "Try a shorter range or wait for new signals."
            }
          />
        ) : data.todaysActions.length === 0 ? (
          <EmptyState
            title="Nothing pressing right now"
            hint="No actions surfaced for today. Keep working your pipeline."
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.todaysActions.map((a) => (
              <ActionCard key={a.id} data={a} />
            ))}
          </ul>
        )}
      </section>

      {/* ═══ 3 · RECOMMENDED FOCUS ═══ */}
      {data.recommendedFocus && (
        <section aria-label="Recommended focus">
          <TextCard
            title="Recommended focus"
            body={data.recommendedFocus}
            icon
          />
        </section>
      )}

      {/* ═══ 4 · PERSONAL PERFORMANCE SIGNALS ═══ */}
      <section aria-label="Personal performance signals" className="space-y-2">
        <SectionTitle
          title="Personal performance signals"
          tooltip="Behavior patterns tied to your conversion."
        />
        {data.performanceSignals.length === 0 ? (
          <EmptyState
            title="Signals coming soon"
            hint="Your personal performance patterns will appear here."
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.performanceSignals.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    s.tone === "critical" && "bg-destructive",
                    s.tone === "warning" && "bg-warning",
                    s.tone === "success" && "bg-success",
                    (!s.tone || s.tone === "neutral") && "bg-muted-foreground/40"
                  )}
                />
                <span className="text-sm text-foreground flex-1 min-w-0 truncate">
                  {s.label}
                </span>
                {s.value && (
                  <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                    {s.value}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ═══ 5 · MY PIPELINE ═══ */}
      <section aria-label="My pipeline" className="space-y-2">
        <SectionTitle
          title="My pipeline"
          tooltip="Snapshot of your active deals by stage."
        />
        {data.pipeline.length === 0 ? (
          <EmptyState
            title="Pipeline view coming soon"
            hint="Your active deals by stage will appear here."
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.pipeline.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                <span className="text-sm text-foreground flex-1 truncate">
                  {p.label}
                </span>
                <span
                  className={cn(
                    "font-mono text-sm tabular-nums tabular-nums shrink-0",
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
    </div>
  );
}

// ─────────────────────────── Shared bits ────────────────────────────

const WORKFLOW_STATE_LABEL: Record<WorkflowStageState, string> = {
  stable: "Stable",
  delayed: "Delayed",
  "at-risk": "At risk",
};

const WORKFLOW_STATE_DOT: Record<WorkflowStageState, string> = {
  stable: "bg-success",
  delayed: "bg-warning",
  "at-risk": "bg-destructive",
};

const WORKFLOW_STATE_TEXT: Record<WorkflowStageState, string> = {
  stable: "text-success",
  delayed: "text-warning",
  "at-risk": "text-destructive",
};

function WorkflowRow({ stage }: { stage: WorkflowStage }) {
  return (
    <li className="flex items-center gap-3 px-4 py-2.5">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full shrink-0",
          WORKFLOW_STATE_DOT[stage.state]
        )}
      />
      <span className="text-sm text-foreground flex-1 truncate">
        {stage.label}
      </span>
      <span
        className={cn(
          "font-mono text-[11px] font-semibold uppercase tracking-[0.08em] shrink-0",
          WORKFLOW_STATE_TEXT[stage.state]
        )}
      >
        {WORKFLOW_STATE_LABEL[stage.state]}
      </span>
    </li>
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
