import {
  AlertCircle,
  Info,
  Sparkles,
  TriangleAlert,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Insight, InsightPriority } from "@/lib/types";
import { cn } from "@/lib/utils";

const PRIORITY_STYLES: Record<
  InsightPriority,
  {
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
    border: string;
    label: string;
    labelColor: string;
  }
> = {
  critical: {
    icon: AlertCircle,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-100",
    border: "border-l-rose-500",
    label: "Critical",
    labelColor: "text-rose-600",
  },
  warning: {
    icon: TriangleAlert,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
    border: "border-l-amber-500",
    label: "Warning",
    labelColor: "text-amber-600",
  },
  success: {
    icon: Sparkles,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
    border: "border-l-emerald-500",
    label: "Opportunity",
    labelColor: "text-emerald-600",
  },
  neutral: {
    icon: Info,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-100",
    border: "border-l-sky-500",
    label: "FYI",
    labelColor: "text-sky-600",
  },
};

export function InsightCard({ insight }: { insight: Insight }) {
  const styles = PRIORITY_STYLES[insight.priority];
  const Icon = styles.icon;

  return (
    <article
      className={cn(
        "group flex flex-col h-full rounded-xl border border-border/70 border-l-[3px] p-5 shadow-sm transition-all hover:shadow-md bg-card",
        styles.border
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            styles.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", styles.iconColor)} strokeWidth={2} />
        </span>
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "text-[10px] font-semibold uppercase tracking-wider mb-1",
              styles.labelColor
            )}
          >
            {styles.label} · {insight.category}
          </div>
          <h3 className="text-[15px] font-semibold leading-tight text-foreground">
            {insight.title}
          </h3>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {insight.description}
      </p>

      {insight.evidence && (
        <p className="mt-3 font-mono text-[11px] text-muted-foreground/80 tabular-nums bg-muted/40 px-2.5 py-1.5 rounded-md">
          {insight.evidence}
        </p>
      )}

      <div className="mt-auto pt-4 flex items-center gap-2">
        <Button size="sm" className="h-8 px-3 text-xs gap-1">
          {insight.primaryAction.label}
          <ArrowRight className="h-3 w-3" strokeWidth={2} />
        </Button>
        {insight.secondaryAction && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
          >
            {insight.secondaryAction.label}
          </Button>
        )}
      </div>
    </article>
  );
}
