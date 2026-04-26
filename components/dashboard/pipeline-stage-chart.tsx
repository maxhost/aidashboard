"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
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
};

function formatCompactCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length || !payload[0].payload) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card shadow-md px-3 py-2">
      <div className="text-xs font-semibold text-foreground">{item.label}</div>
      <div className="mt-0.5 font-mono text-sm font-bold tabular-nums text-foreground">
        {item.value} deals
      </div>
      {item.secondary !== undefined && (
        <div className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {formatCompactCurrency(item.secondary)} value
        </div>
      )}
    </div>
  );
}

export function PipelineStageChart({ data }: { data: CategoryPoint[] }) {
  const totalDeals = data.reduce((acc, d) => acc + d.value, 0);
  const totalValue = data.reduce((acc, d) => acc + (d.secondary ?? 0), 0);

  return (
    <Card className="shadow-sm border-border/70 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Pipeline by stage
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          {totalDeals} active deals · {formatCompactCurrency(totalValue)}{" "}
          combined value
        </p>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-center">
          {/* Donut */}
          <div className="relative h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={56}
                  outerRadius={84}
                  paddingAngle={2}
                  stroke="#fff"
                  strokeWidth={2}
                  isAnimationActive={false}
                >
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.color ?? "#7c3aed"} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-2xl font-bold tabular-nums text-foreground leading-none">
                {totalDeals}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1.5">
                Active deals
              </span>
            </div>
          </div>

          {/* Legend */}
          <ul className="space-y-2">
            {data.map((d) => (
              <li
                key={d.label}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: d.color ?? "#7c3aed" }}
                  />
                  <span className="text-foreground font-medium truncate">
                    {d.label}
                  </span>
                </span>
                <span className="font-mono tabular-nums text-muted-foreground shrink-0">
                  {d.value}
                  {d.secondary !== undefined && (
                    <span className="text-muted-foreground/50 ml-1">
                      · {formatCompactCurrency(d.secondary)}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
