"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Calendar,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import type { Agent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const STATUS_CONFIG: Record<
  Agent["status"],
  { label: string; dot: string; text: string; chartColor: string }
> = {
  top: {
    label: "Top performer",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    chartColor: "#10b981",
  },
  rising: {
    label: "Rising",
    dot: "bg-violet-500",
    text: "text-violet-700",
    chartColor: "#7c3aed",
  },
  steady: {
    label: "Steady",
    dot: "bg-slate-400",
    text: "text-slate-600",
    chartColor: "#94a3b8",
  },
  "needs-coaching": {
    label: "Needs coaching",
    dot: "bg-amber-500",
    text: "text-amber-700",
    chartColor: "#f59e0b",
  },
};

const WEEK_LABELS = [
  "W-7",
  "W-6",
  "W-5",
  "W-4",
  "W-3",
  "W-2",
  "W-1",
  "This",
];

function formatCompactCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export function AgentDetailSheet({
  agent,
  open,
  onOpenChange,
}: {
  agent: Agent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const status = STATUS_CONFIG[agent.status];
  const trendData = agent.trend.map((v, i) => ({
    label: WEEK_LABELS[i] ?? `W${i + 1}`,
    value: v,
  }));

  const tenure = format(new Date(agent.joinedAt), "MMM yyyy");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto"
      >
        <SheetHeader className="pr-8">
          <div className="flex items-start gap-3">
            <Avatar className="h-14 w-14 shrink-0">
              {agent.avatarUrl && (
                <AvatarImage src={agent.avatarUrl} alt={agent.name} />
              )}
              <AvatarFallback
                className={cn(
                  "text-white text-base font-semibold",
                  agent.avatarColor
                )}
              >
                {agent.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl text-foreground tracking-tight">
                {agent.name}
              </SheetTitle>
              <SheetDescription className="text-sm">
                {agent.role}
              </SheetDescription>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn("h-1.5 w-1.5 rounded-full", status.dot)}
                  />
                  <span
                    className={cn("text-[11px] font-semibold", status.text)}
                  >
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Calendar className="h-3 w-3" strokeWidth={1.75} />
                  Joined {tenure}
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Coaching note (if any) */}
          {agent.coachingNote && (
            <section className="flex gap-3 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3">
              <MessageCircle
                className="h-4 w-4 text-amber-600 shrink-0 mt-0.5"
                strokeWidth={2}
              />
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                  Coaching note
                </div>
                <p className="text-sm leading-relaxed text-amber-900 mt-1">
                  {agent.coachingNote}
                </p>
              </div>
            </section>
          )}

          {/* Key metrics grid */}
          <section className="grid grid-cols-2 gap-3">
            <MetricBox
              label="Volume YTD"
              value={formatCompactCurrency(agent.metrics.volumeClosedYTD)}
              hint={`${agent.metrics.dealsClosedYTD} deals closed`}
            />
            <MetricBox
              label="Active pipeline"
              value={formatCompactCurrency(agent.metrics.pipelineValue)}
              hint={`${agent.metrics.activeDeals} active deals`}
            />
            <MetricBox
              label="Conversion rate"
              value={`${agent.metrics.conversionRate.toFixed(1)}%`}
              hint={`${agent.metrics.appointmentsSet} appts this month`}
            />
            <MetricBox
              label="Response time"
              value={`${agent.metrics.avgResponseMinutes}m`}
              hint={
                agent.metrics.avgResponseMinutes <= 5
                  ? "ahead of team avg"
                  : "above team avg"
              }
            />
          </section>

          {/* Trend chart */}
          <section>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              8-week production
            </h3>
            <div className="h-[180px] w-full -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient
                      id={`agent-${agent.id}-fill`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={status.chartColor}
                        stopOpacity={0.22}
                      />
                      <stop
                        offset="100%"
                        stopColor={status.chartColor}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="#E5E7EB"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    stroke="#9CA3AF"
                    fontSize={10}
                    tickMargin={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    stroke="#9CA3AF"
                    fontSize={10}
                    width={28}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={status.chartColor}
                    strokeWidth={2}
                    fill={`url(#agent-${agent.id}-fill)`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Pipeline breakdown */}
          <section>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              This month at a glance
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <SnapshotBox
                label="New leads"
                value={agent.metrics.leadsThisMonth.toString()}
              />
              <SnapshotBox
                label="Appointments"
                value={agent.metrics.appointmentsSet.toString()}
              />
              <SnapshotBox
                label="Active deals"
                value={agent.metrics.activeDeals.toString()}
              />
            </div>
          </section>

          {/* Actions */}
          <section className="flex items-center gap-2 pt-2 border-t border-border/60 sticky bottom-0 bg-card -mx-6 px-6 pb-2">
            <Button size="sm" variant="outline" className="gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
              Send coaching note
            </Button>
            <Button size="sm" variant="ghost" className="gap-1.5 ml-auto">
              Open in CRM
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
            </Button>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MetricBox({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-card p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        {label}
      </div>
      <div className="font-mono text-xl font-bold tabular-nums text-foreground mt-1">
        {value}
      </div>
      {hint && (
        <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>
      )}
    </div>
  );
}

function SnapshotBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2.5 text-center">
      <div className="font-mono text-lg font-bold tabular-nums text-foreground">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-0.5">
        {label}
      </div>
    </div>
  );
}
