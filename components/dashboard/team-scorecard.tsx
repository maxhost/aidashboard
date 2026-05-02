"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Agent } from "@/lib/types";

type ScoreTier = "excellent" | "good" | "needs-work" | "critical";

function scoreTier(score: number): ScoreTier {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "needs-work";
  return "critical";
}

const TIER_META: Record<
  ScoreTier,
  { label: string; bar: string; chip: string; chipText: string }
> = {
  excellent: {
    label: "Excellent",
    bar: "bg-emerald-500",
    chip: "bg-emerald-50",
    chipText: "text-emerald-700",
  },
  good: {
    label: "Good",
    bar: "bg-amber-500",
    chip: "bg-amber-50",
    chipText: "text-amber-700",
  },
  "needs-work": {
    label: "Needs work",
    bar: "bg-orange-500",
    chip: "bg-orange-50",
    chipText: "text-orange-700",
  },
  critical: {
    label: "Critical",
    bar: "bg-rose-500",
    chip: "bg-rose-50",
    chipText: "text-rose-700",
  },
};

/**
 * Compact team adoption scorecard. Single AI Adoption Score (0–100)
 * with an inline progress bar and tier chip. Designed to scan quickly
 * across a 3-column grid.
 */
export function TeamScorecard({ agent }: { agent: Agent }) {
  const tier = scoreTier(agent.aiAdoptionScore);
  const meta = TIER_META[tier];
  const pct = Math.max(0, Math.min(100, agent.aiAdoptionScore));

  return (
    <article className="rounded-xl bg-card border border-border/70 px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback
            className={cn("text-white text-xs font-semibold", agent.avatarColor)}
          >
            {agent.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-foreground truncate leading-tight">
            {agent.name}
          </div>
          <div className="text-[11px] text-muted-foreground truncate">
            {agent.role}
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider shrink-0",
            meta.chip,
            meta.chipText
          )}
        >
          {meta.label}
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-2.5">
        <span className="font-mono text-sm font-bold tabular-nums text-foreground leading-none shrink-0 w-9">
          {agent.aiAdoptionScore}
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", meta.bar)}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </article>
  );
}
