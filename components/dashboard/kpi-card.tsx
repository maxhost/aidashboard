"use client";

import { Card } from "@/components/ui/card";
import {
  Briefcase,
  Clock,
  CalendarCheck,
  UserPlus,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  type LucideIcon,
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts";
import type { KPI, KpiIconKey, KpiTone } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<KpiIconKey, LucideIcon> = {
  deals: Briefcase,
  leads: UserPlus,
  appointment: CalendarCheck,
  "response-time": Clock,
  revenue: DollarSign,
  conversion: Target,
};

const TONE_STYLES: Record<
  KpiTone,
  { iconBg: string; iconColor: string; sparkline: string }
> = {
  primary: {
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    sparkline: "#7c3aed",
  },
  success: {
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    sparkline: "#10b981",
  },
  warning: {
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    sparkline: "#f59e0b",
  },
  danger: {
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    sparkline: "#f43f5e",
  },
  info: {
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    sparkline: "#0ea5e9",
  },
};

export function KpiCard({ kpi }: { kpi: KPI }) {
  const Icon = ICON_MAP[kpi.iconKey];
  const styles = TONE_STYLES[kpi.tone];

  let deltaTone: "positive" | "negative" | "neutral" = "neutral";
  let isUp: boolean | null = null;
  if (kpi.delta) {
    isUp = kpi.delta.value >= 0;
    const isImprovement = kpi.delta.inverted ? !isUp : isUp;
    deltaTone = isImprovement ? "positive" : "negative";
  }

  const sparklineData =
    kpi.trend?.map((v, i) => ({ x: i, y: v })) ?? [];

  return (
    <Card className="p-5 shadow-sm border-border/70 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "h-12 w-12 rounded-2xl shrink-0 flex items-center justify-center",
            styles.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", styles.iconColor)} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {kpi.label}
          </div>
          <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-[26px] font-bold text-foreground tabular-nums leading-none">
              {kpi.value}
            </span>
            {kpi.delta && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-mono text-[11px] font-semibold tabular-nums",
                  deltaTone === "positive" &&
                    "bg-emerald-50 text-emerald-700",
                  deltaTone === "negative" && "bg-rose-50 text-rose-700"
                )}
              >
                {isUp ? (
                  <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
                ) : (
                  <ArrowDownRight className="h-3 w-3" strokeWidth={2.5} />
                )}
                {Math.abs(kpi.delta.value).toFixed(1)}%
              </span>
            )}
          </div>
          {(kpi.hint || kpi.delta?.period) && (
            <div className="text-xs text-muted-foreground mt-1">
              {kpi.hint && <span>{kpi.hint}</span>}
              {kpi.hint && kpi.delta?.period && (
                <span className="text-muted-foreground/50"> · </span>
              )}
              {kpi.delta?.period}
            </div>
          )}
        </div>
      </div>

      {sparklineData.length > 0 && (
        <div className="mt-4 -mx-1 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <YAxis hide domain={["dataMin", "dataMax"]} />
              <Line
                type="monotone"
                dataKey="y"
                stroke={styles.sparkline}
                strokeWidth={1.75}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
