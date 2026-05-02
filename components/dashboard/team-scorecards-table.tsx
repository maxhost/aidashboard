"use client";

import { ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
 * Database-style sortable table for team adoption scores. Designed to scale
 * to 40+ realtors without breaking scannability — single row per agent,
 * inline progress bar, click-anywhere row for detail.
 *
 * Default sort: AI Adoption Score descending (top performers first).
 */
export function TeamScorecardsTable({ agents }: { agents: Agent[] }) {
  const sorted = [...agents].sort(
    (a, b) => b.aiAdoptionScore - a.aiAdoptionScore
  );

  return (
    <div className="rounded-xl border border-border/70 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/60">
              <TableHead className="w-[260px] py-3">Agent</TableHead>
              <TableHead className="w-[160px]">Role</TableHead>
              <TableHead className="w-[60px] text-right">Score</TableHead>
              <TableHead className="min-w-[180px]">Adoption</TableHead>
              <TableHead className="w-[110px]">Tier</TableHead>
              <TableHead className="w-[40px] pr-5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((agent) => {
              const tier = scoreTier(agent.aiAdoptionScore);
              const meta = TIER_META[tier];
              const pct = Math.max(
                0,
                Math.min(100, agent.aiAdoptionScore)
              );
              return (
                <TableRow
                  key={agent.id}
                  className="cursor-pointer group border-border/40"
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-8 w-8 shrink-0">
                        {agent.avatarUrl && (
                          <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                        )}
                        <AvatarFallback
                          className={cn(
                            "text-white text-[11px] font-semibold",
                            agent.avatarColor
                          )}
                        >
                          {agent.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[13px] font-semibold text-foreground truncate">
                        {agent.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[12px] text-muted-foreground">
                      {agent.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono text-sm font-bold tabular-nums text-foreground">
                      {agent.aiAdoptionScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden max-w-[200px]">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          meta.bar
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold",
                        meta.chip,
                        meta.chipText
                      )}
                    >
                      {meta.label}
                    </span>
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <ArrowRight
                      className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground transition-colors inline-block"
                      strokeWidth={2}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
