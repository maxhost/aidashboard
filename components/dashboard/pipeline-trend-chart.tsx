"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TimeseriesPoint } from "@/lib/types";

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: TimeseriesPoint }>;
  label?: string;
};

const RANGES = ["12W", "YTD", "1Y"] as const;
type Range = (typeof RANGES)[number];

function formatCompactCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value ?? 0;
  return (
    <div className="rounded-lg border border-border bg-card shadow-md px-3 py-2">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
        Week of {label}
      </div>
      <div className="mt-1 font-mono text-sm font-bold tabular-nums text-foreground">
        {formatCompactCurrency(value)}
      </div>
    </div>
  );
}

export function PipelineTrendChart({ data }: { data: TimeseriesPoint[] }) {
  const [range, setRange] = useState<Range>("12W");
  const last = data[data.length - 1]?.value ?? 0;
  const first = data[0]?.value ?? 0;
  const change = first ? ((last - first) / first) * 100 : 0;
  const isUp = change >= 0;

  return (
    <Card className="shadow-sm border-border/70">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Pipeline volume
          </h2>
          <div className="mt-1.5 flex items-baseline gap-3">
            <span className="font-mono text-[28px] font-bold tabular-nums text-foreground leading-none">
              {formatCompactCurrency(last)}
            </span>
            <span
              className={cn(
                "font-mono text-xs font-semibold tabular-nums",
                isUp ? "text-emerald-700" : "text-rose-700"
              )}
            >
              {isUp ? "+" : ""}
              {change.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">
              over the last 12 weeks
            </span>
          </div>
        </div>
        <div className="inline-flex p-1 rounded-lg bg-muted/60 shrink-0">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-mono font-semibold transition-colors",
                range === r
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-4 pr-2">
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="pipelineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
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
                fontSize={11}
                tickMargin={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                stroke="#9CA3AF"
                fontSize={11}
                width={48}
                tickFormatter={(v: number) => formatCompactCurrency(v)}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "#7c3aed", strokeDasharray: "3 3" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#7c3aed"
                strokeWidth={2.25}
                fill="url(#pipelineFill)"
                activeDot={{
                  r: 4,
                  fill: "#7c3aed",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
