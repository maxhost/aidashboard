"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts";
import type { Agent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AgentDetailSheet } from "./agent-detail-sheet";

const STATUS_CONFIG: Record<
  Agent["status"],
  { label: string; dot: string; text: string; sparkline: string }
> = {
  top: {
    label: "Top performer",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    sparkline: "#10b981",
  },
  rising: {
    label: "Rising",
    dot: "bg-violet-500",
    text: "text-violet-700",
    sparkline: "#7c3aed",
  },
  steady: {
    label: "Steady",
    dot: "bg-slate-400",
    text: "text-slate-600",
    sparkline: "#94a3b8",
  },
  "needs-coaching": {
    label: "Needs coaching",
    dot: "bg-amber-500",
    text: "text-amber-700",
    sparkline: "#f59e0b",
  },
};

function formatCompactCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export function AgentCard({ agent }: { agent: Agent }) {
  const [open, setOpen] = useState(false);
  const status = STATUS_CONFIG[agent.status];
  const sparklineData = agent.trend.map((v, i) => ({ x: i, y: v }));

  return (
    <>
      <Card className="p-5 shadow-sm border-border/70 hover:shadow-md transition-shadow flex flex-col gap-4">
        {/* Header: avatar + name + status */}
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 shrink-0">
            {agent.avatarUrl && (
              <AvatarImage src={agent.avatarUrl} alt={agent.name} />
            )}
            <AvatarFallback
              className={cn("text-white text-sm font-semibold", agent.avatarColor)}
            >
              {agent.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold leading-tight text-foreground truncate">
              {agent.name}
            </h3>
            <div className="text-xs text-muted-foreground mt-0.5 truncate">
              {agent.role}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", status.dot)} />
              <span className={cn("text-[11px] font-medium", status.text)}>
                {status.label}
              </span>
            </div>
          </div>
          <div className="h-8 w-16 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <YAxis hide domain={["dataMin", "dataMax"]} />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke={status.sparkline}
                  strokeWidth={1.75}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-4 gap-3 pt-1">
          <Metric
            label="Volume YTD"
            value={formatCompactCurrency(agent.metrics.volumeClosedYTD)}
          />
          <Metric label="Closed" value={agent.metrics.dealsClosedYTD.toString()} />
          <Metric
            label="Pipeline"
            value={formatCompactCurrency(agent.metrics.pipelineValue)}
          />
          <Metric
            label="Conv."
            value={`${agent.metrics.conversionRate.toFixed(1)}%`}
          />
        </div>

        {/* Coaching note (if any) */}
        {agent.coachingNote && (
          <div className="flex gap-2 rounded-md bg-amber-50 border border-amber-100 px-3 py-2">
            <MessageCircle
              className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5"
              strokeWidth={2}
            />
            <p className="text-[11px] leading-relaxed text-amber-900">
              {agent.coachingNote}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center pt-1 border-t border-border/60 -mx-5 -mb-5 px-5 py-3 mt-auto">
          <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
            {agent.metrics.activeDeals} active · {agent.metrics.leadsThisMonth} leads
            this mo.
          </span>
          <Button
            size="sm"
            className="h-8 px-3 text-xs gap-1 ml-auto"
            onClick={() => setOpen(true)}
          >
            View profile
            <ArrowRight className="h-3 w-3" strokeWidth={2} />
          </Button>
        </div>
      </Card>

      <AgentDetailSheet agent={agent} open={open} onOpenChange={setOpen} />
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        {label}
      </div>
      <div className="font-mono text-sm font-bold tabular-nums text-foreground mt-0.5">
        {value}
      </div>
    </div>
  );
}
