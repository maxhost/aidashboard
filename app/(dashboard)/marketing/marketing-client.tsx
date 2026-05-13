"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { StatusTile } from "@/components/dashboard/status-tile";
import { SectionTitle } from "@/components/dashboard/section-title";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  ActionCard,
  type ActionCardData,
} from "@/components/dashboard/action-card";
import { ROLE_KEY, type Role } from "@/components/dashboard/role-switch";
import { cn } from "@/lib/utils";

// ─────────────────────────── Shared types ───────────────────────────

export type LeadSourceRow = {
  id: string;
  name: string;
  signal: string;
  tone?: "neutral" | "success" | "warning" | "critical";
};

export type OpportunityRow = {
  id: string;
  label: string;
  tone?: "neutral" | "success" | "warning";
};

export type CampaignRow = {
  id: string;
  name: string;
  signal: string;
  tone?: "neutral" | "success" | "warning" | "critical";
};

export type TileTrend = {
  direction: "up" | "down" | "flat";
  label: string;
};

export type TeamLeaderMarketingData = {
  highIntentCount: number;
  highIntentNote: string;
  highIntentTrend?: TileTrend | null;
  strongestSourceName: string;
  strongestSourceNote: string;
  strongestSourceTrend?: TileTrend | null;
  weakestSourceName: string;
  weakestSourceNote: string;
  weakestSourceTrend?: TileTrend | null;
  leadSources: LeadSourceRow[];
  activeCampaigns: CampaignRow[];
  pulsorInsights: ActionCardData[];
  suggestedFocus: string | null;
  isEmpty: boolean;
};

export type AgentMarketingData = {
  bestSourceName: string;
  bestSourceNote: string;
  fastestSourceName: string;
  fastestSourceNote: string;
  buyersWaitingCount: number;
  buyersWaitingNote: string;
  whatsWorking: LeadSourceRow[];
  pulsorSuggestion: string | null;
  followUpPriority: OpportunityRow[];
  isEmpty: boolean;
};

export type MarketingData = {
  teamLeader: TeamLeaderMarketingData;
  agent: AgentMarketingData;
};

// ─────────────────────────── Root client ────────────────────────────

export function MarketingClient({ data }: { data: MarketingData }) {
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
        <AgentMarketing data={data.agent} />
      ) : (
        <TeamLeaderMarketing data={data.teamLeader} />
      )}
    </TooltipProvider>
  );
}

// ─────────────────────────── Source row ─────────────────────────────

function SourceRow({ row }: { row: LeadSourceRow }) {
  return (
    <li className="flex items-center gap-3 px-4 py-2.5">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full shrink-0",
          row.tone === "critical" && "bg-destructive",
          row.tone === "warning" && "bg-warning",
          row.tone === "success" && "bg-success",
          (!row.tone || row.tone === "neutral") && "bg-muted-foreground/40"
        )}
      />
      <span className="text-sm font-medium text-foreground w-36 shrink-0 truncate">
        {row.name}
      </span>
      <span
        className={cn(
          "text-xs truncate flex-1",
          row.tone === "critical" && "text-destructive",
          row.tone === "warning" && "text-warning",
          row.tone === "success" && "text-success",
          (!row.tone || row.tone === "neutral") && "text-muted-foreground"
        )}
      >
        {row.signal}
      </span>
    </li>
  );
}

// ─────────────────────────── Team Leader ────────────────────────────

function TeamLeaderMarketing({ data }: { data: TeamLeaderMarketingData }) {
  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
            Marketing
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Which lead sources are producing quality business.
          </p>
        </div>
        <PeriodSelector />
      </header>

      {/* ═══ 1 · TOP CARDS ═══ */}
      <section aria-label="Lead signals" className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatusTile
            label="High intent leads"
            value={data.isEmpty ? "—" : `${data.highIntentCount}`}
            deltaText={data.highIntentNote}
            trend={data.highIntentTrend ?? null}
            tone="neutral"
            tooltip="Leads showing strong buying signals — likely to convert."
          />
          <StatusTile
            label="Strongest source"
            value={data.isEmpty ? "—" : data.strongestSourceName}
            deltaText={data.strongestSourceNote}
            trend={data.strongestSourceTrend ?? null}
            tone="success"
            tooltip="Source producing the highest close quality this month."
          />
          <StatusTile
            label="Weakest source"
            value={data.isEmpty ? "—" : data.weakestSourceName}
            deltaText={data.weakestSourceNote}
            trend={data.weakestSourceTrend ?? null}
            tone="critical"
            tooltip="Source with poor downstream conversion or high cost."
          />
        </div>
      </section>

      {/* ═══ 2 · LEAD SOURCE HEALTH ═══ */}
      <section aria-label="Lead source health" className="space-y-2">
        <SectionTitle
          title="Lead source health"
          tooltip="Operational signal per source — quality, intent, conversion tendency."
        />
        {data.leadSources.length === 0 ? (
          <EmptyState
            title="No source data yet"
            hint="Connect your channels to see source health here."
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.leadSources.map((s) => (
              <SourceRow key={s.id} row={s} />
            ))}
          </ul>
        )}
      </section>

      {/* ═══ 2b · ACTIVE CAMPAIGNS ═══ */}
      <section aria-label="Active campaigns" className="space-y-2">
        <SectionTitle
          title="Active campaigns"
          tooltip="Initiatives currently running and how they're performing."
        />
        {data.activeCampaigns.length === 0 ? (
          <EmptyState
            title="No active campaigns"
            hint="Live initiatives will appear here once running."
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.activeCampaigns.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    c.tone === "critical" && "bg-destructive",
                    c.tone === "warning" && "bg-warning",
                    c.tone === "success" && "bg-success",
                    (!c.tone || c.tone === "neutral") &&
                      "bg-muted-foreground/40"
                  )}
                />
                <span className="text-sm font-medium text-foreground w-44 shrink-0 truncate">
                  {c.name}
                </span>
                <span
                  className={cn(
                    "text-xs truncate flex-1",
                    c.tone === "critical" && "text-destructive",
                    c.tone === "warning" && "text-warning",
                    c.tone === "success" && "text-success",
                    (!c.tone || c.tone === "neutral") &&
                      "text-muted-foreground"
                  )}
                >
                  {c.signal}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ═══ 3 · PULSOR INSIGHTS (max 3) ═══ */}
      <section aria-label="Pulsor insights" className="space-y-2">
        <SectionTitle
          title="Pulsor insights"
          tooltip="Strategic patterns Pulsor surfaced this week."
        />
        {data.pulsorInsights.length === 0 ? (
          <EmptyState
            title="No insights yet"
            hint="Patterns will surface here once data is loaded."
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.pulsorInsights.slice(0, 3).map((i) => (
              <ActionCard key={i.id} data={i} />
            ))}
          </ul>
        )}
      </section>

      {/* ═══ 4 · SUGGESTED FOCUS ═══ */}
      {data.suggestedFocus && (
        <section aria-label="Suggested focus">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles
                className="h-3.5 w-3.5 text-foreground"
                strokeWidth={2}
                fill="currentColor"
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Suggested focus
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {data.suggestedFocus}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

// ─────────────────────────── Agent ──────────────────────────────────

function AgentMarketing({ data }: { data: AgentMarketingData }) {
  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
            Lead opportunities
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            What&apos;s working for you and where to respond first.
          </p>
        </div>
        <PeriodSelector />
      </header>

      {/* ═══ 1 · TOP CARDS (personal) ═══ */}
      <section aria-label="Personal lead signals" className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatusTile
            label="Your best source"
            value={data.isEmpty ? "—" : data.bestSourceName}
            deltaText={data.bestSourceNote}
            tone="success"
            tooltip="Source where your conversions are strongest."
          />
          <StatusTile
            label="Fastest channel"
            value={data.isEmpty ? "—" : data.fastestSourceName}
            deltaText={data.fastestSourceNote}
            tone="success"
            tooltip="Channel where your buyers reply the quickest."
          />
          <StatusTile
            label="Buyers waiting"
            value={data.isEmpty ? "—" : `${data.buyersWaitingCount}`}
            deltaText={data.buyersWaitingNote}
            tone={
              data.isEmpty
                ? "neutral"
                : data.buyersWaitingCount > 0
                ? "warning"
                : "neutral"
            }
            tooltip="High-intent buyers still waiting on a reply from you."
          />
        </div>
      </section>

      {/* ═══ 2 · WHAT'S WORKING FOR YOU ═══ */}
      <section aria-label="What's working for you" className="space-y-2">
        <SectionTitle
          title="What's working for you"
          tooltip="Personal angle on which channels are paying off."
        />
        {data.whatsWorking.length === 0 ? (
          <EmptyState
            title="No source data yet"
            hint="Channels will appear here once leads start flowing."
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.whatsWorking.map((s) => (
              <SourceRow key={s.id} row={s} />
            ))}
          </ul>
        )}
      </section>

      {/* ═══ 3 · PULSOR SUGGESTION (one) ═══ */}
      {data.pulsorSuggestion && (
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

      {/* ═══ 4 · SUGGESTED FOLLOW-UP PRIORITY ═══ */}
      <section aria-label="Suggested follow-up priority" className="space-y-2">
        <SectionTitle
          title="Suggested follow-up priority"
          tooltip="Whom to call or message first today."
        />
        {data.followUpPriority.length === 0 ? (
          <EmptyState
            title="No priorities surfaced yet"
            hint="Pulsor will rank your follow-ups here."
          />
        ) : (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {data.followUpPriority.map((o) => (
              <li
                key={o.id}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    o.tone === "success" && "bg-success",
                    o.tone === "warning" && "bg-warning",
                    (!o.tone || o.tone === "neutral") &&
                      "bg-muted-foreground/40"
                  )}
                />
                <span className="text-sm text-foreground flex-1 truncate">
                  {o.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
