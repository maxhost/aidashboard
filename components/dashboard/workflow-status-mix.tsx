"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Workflow, WorkflowStatus } from "@/lib/types";

type StatusItem = { label: string; value: number; color: string; status: WorkflowStatus };

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: StatusItem }>;
};

const STATUS_META: Record<
  WorkflowStatus,
  { label: string; color: string }
> = {
  performing: { label: "Performing", color: "#10b981" },
  healthy: { label: "Healthy", color: "#0ea5e9" },
  underperforming: { label: "Underperforming", color: "#f59e0b" },
  broken: { label: "Broken", color: "#dc2626" },
};

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length || !payload[0].payload) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg bg-card ring-1 ring-foreground/10 shadow-md px-3 py-2">
      <div className="text-xs font-semibold text-foreground">{item.label}</div>
      <div className="mt-0.5 font-mono text-sm font-bold tabular-nums text-foreground">
        {item.value} {item.value === 1 ? "workflow" : "workflows"}
      </div>
    </div>
  );
}

export function WorkflowStatusMix({ workflows }: { workflows: Workflow[] }) {
  const counts = workflows.reduce(
    (acc, wf) => {
      acc[wf.status] = (acc[wf.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<WorkflowStatus, number>
  );

  const data: StatusItem[] = (Object.keys(STATUS_META) as WorkflowStatus[])
    .map((s) => ({
      status: s,
      label: STATUS_META[s].label,
      color: STATUS_META[s].color,
      value: counts[s] ?? 0,
    }))
    .filter((d) => d.value > 0);

  const total = workflows.length;

  return (
    <Card className="shadow-sm border-border/70 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Workflow health
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Status mix across {total} {total === 1 ? "workflow" : "workflows"}
        </p>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-center">
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
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-2xl font-bold tabular-nums text-foreground leading-none">
                {total}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1.5">
                Total
              </span>
            </div>
          </div>
          <ul className="space-y-2">
            {data.map((d) => (
              <li
                key={d.label}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-foreground font-medium truncate">
                    {d.label}
                  </span>
                </span>
                <span className="font-mono tabular-nums text-muted-foreground shrink-0">
                  {d.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
