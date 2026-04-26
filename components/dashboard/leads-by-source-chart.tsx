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
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CategoryPoint } from "@/lib/types";

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: CategoryPoint }>;
  label?: string;
};

const BAR_COLORS = [
  "#7c3aed",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#ddd6fe",
  "#ede9fe",
];

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value ?? 0;
  return (
    <div className="rounded-lg border border-border bg-card shadow-md px-3 py-2">
      <div className="text-xs font-semibold text-foreground">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-bold tabular-nums text-violet-600">
        {value} leads
      </div>
    </div>
  );
}

export function LeadsBySourceChart({ data }: { data: CategoryPoint[] }) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const top = data[0];
  const topShare = total ? Math.round((top.value / total) * 100) : 0;

  return (
    <Card className="shadow-sm border-border/70 h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            Leads by source
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="font-mono font-semibold text-foreground">
              {top.label}
            </span>{" "}
            drove{" "}
            <span className="font-mono font-semibold text-foreground">
              {topShare}%
            </span>{" "}
            of new leads this week.
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-xl font-bold tabular-nums text-foreground leading-none">
            {total}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
            Total
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3 pb-4 pr-2">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
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
                interval={0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                stroke="#9CA3AF"
                fontSize={11}
                width={32}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "rgba(124, 58, 237, 0.06)" }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {data.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
