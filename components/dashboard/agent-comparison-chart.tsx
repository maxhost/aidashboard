"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Agent } from "@/lib/types";

type Datum = {
  name: string;
  initials: string;
  value: number;
  color: string;
  status: Agent["status"];
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: Datum }>;
  label?: string;
};

const STATUS_COLOR: Record<Agent["status"], string> = {
  top: "#10b981",
  rising: "#7c3aed",
  steady: "#94a3b8",
  "needs-coaching": "#f59e0b",
};

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length || !payload[0].payload) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg bg-card ring-1 ring-foreground/10 shadow-md px-3 py-2">
      <div className="text-xs font-semibold text-foreground">{item.name}</div>
      <div className="mt-0.5 font-mono text-sm font-bold tabular-nums text-foreground">
        {item.value.toFixed(1)}% conversion
      </div>
    </div>
  );
}

export function AgentComparisonChart({ agents }: { agents: Agent[] }) {
  const data: Datum[] = [...agents]
    .sort((a, b) => b.metrics.conversionRate - a.metrics.conversionRate)
    .map((a) => ({
      name: a.name.split(" ")[0] + " " + a.name.split(" ")[1]?.[0] + ".",
      initials: a.initials,
      value: a.metrics.conversionRate,
      color: STATUS_COLOR[a.status],
      status: a.status,
    }));

  const teamAvg =
    data.reduce((acc, d) => acc + d.value, 0) / Math.max(data.length, 1);

  return (
    <Card className="shadow-sm border-border/70 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Conversion by agent
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Lead → appointment rate · team average{" "}
          <span className="font-mono font-semibold text-foreground">
            {teamAvg.toFixed(1)}%
          </span>
        </p>
      </CardHeader>
      <CardContent className="pt-2 pb-4 pr-2">
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 24, bottom: 0, left: 0 }}
            >
              <CartesianGrid
                stroke="#E5E7EB"
                strokeDasharray="3 3"
                horizontal={false}
              />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                stroke="#9CA3AF"
                fontSize={11}
                tickFormatter={(v: number) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                stroke="#0a0a0a"
                fontSize={11}
                width={86}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "rgba(124, 58, 237, 0.06)" }}
              />
              <ReferenceLine
                x={teamAvg}
                stroke="#9CA3AF"
                strokeDasharray="4 4"
                label={{
                  value: `avg ${teamAvg.toFixed(1)}%`,
                  position: "insideTopRight",
                  fill: "#6b7280",
                  fontSize: 10,
                }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
