import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Target,
  TrendingUp,
  UserPlus,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { KPI, KpiIconKey } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<KpiIconKey, LucideIcon> = {
  deals: Briefcase,
  leads: UserPlus,
  appointment: CalendarCheck,
  "response-time": Clock,
  revenue: DollarSign,
  conversion: Target,
  workflows: Zap,
  completion: CheckCircle2,
  roi: TrendingUp,
};

/**
 * Compact reference KPI chip for the bottom of /overview.
 * Used when the page already shows status / alerts above and the KPIs
 * are a quick numeric reference, not the headline.
 */
export function KpiChip({ kpi }: { kpi: KPI }) {
  const Icon = ICON_MAP[kpi.iconKey];

  let deltaTone: "positive" | "negative" | "neutral" = "neutral";
  let isUp: boolean | null = null;
  if (kpi.delta) {
    isUp = kpi.delta.value >= 0;
    const isImprovement = kpi.delta.inverted ? !isUp : isUp;
    deltaTone = isImprovement ? "positive" : "negative";
  }

  return (
    <div className="rounded-lg border border-border/70 bg-card px-4 py-3 flex items-center gap-3">
      <span className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <Icon
          className="h-4 w-4 text-muted-foreground"
          strokeWidth={1.75}
        />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {kpi.label}
        </div>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="font-mono text-base font-bold tabular-nums text-foreground leading-none">
            {kpi.value}
          </span>
          {kpi.delta && (
            <span
              className={cn(
                "inline-flex items-center font-mono text-[10px] font-semibold tabular-nums",
                deltaTone === "positive" && "text-emerald-700",
                deltaTone === "negative" && "text-rose-700",
                deltaTone === "neutral" && "text-muted-foreground"
              )}
            >
              {isUp ? (
                <ArrowUpRight className="h-2.5 w-2.5" strokeWidth={2.5} />
              ) : (
                <ArrowDownRight className="h-2.5 w-2.5" strokeWidth={2.5} />
              )}
              {Math.abs(kpi.delta.value).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
