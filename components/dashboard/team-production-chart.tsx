"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TimeseriesPoint } from "@/lib/types";

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: TimeseriesPoint }>;
  label?: string;
};

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value ?? 0;
  return (
    <div className="rounded-lg bg-card ring-1 ring-foreground/10 shadow-md px-3 py-2">
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        Week of {label}
      </div>
      <div className="mt-1 font-mono text-sm font-bold tabular-nums text-foreground">
        {value} {value === 1 ? "deal" : "deals"} closed
      </div>
    </div>
  );
}

export function TeamProductionChart({ data }: { data: TimeseriesPoint[] }) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const last = data[data.length - 1]?.value ?? 0;
  const first = data[0]?.value ?? 0;
  const change = first > 0 ? ((last - first) / first) * 100 : 0;
  const isUp = change >= 0;

  return (
    <Card className="shadow-sm border-border/70">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">
              Team production
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Weekly closed deals across the team · 12 weeks
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-mono text-2xl font-bold tabular-nums text-foreground leading-none">
            {total}
          </span>
          <span className="text-xs text-muted-foreground">deals YTD</span>
          <span
            className={cn(
              "ml-auto font-mono text-xs font-semibold tabular-nums",
              isUp ? "text-emerald-700" : "text-rose-700"
            )}
          >
            {isUp ? "+" : ""}
            {change.toFixed(0)}% wk-over-wk
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-4 pr-2">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="teamProductionFill" x1="0" y1="0" x2="0" y2="1">
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
                width={28}
                allowDecimals={false}
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
                fill="url(#teamProductionFill)"
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
