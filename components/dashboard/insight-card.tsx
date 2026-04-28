import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Insight } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TYPE_META } from "./insights/insight-meta";

/**
 * Compact insight card used in the Overview page's "What needs your attention"
 * row. Designed for at-a-glance scanning — single primary action, no
 * description (full detail lives in /insights side sheet).
 */
export function InsightCard({ insight }: { insight: Insight }) {
  const meta = TYPE_META[insight.type];
  const Icon = meta.icon;

  return (
    <article
      className={cn(
        "group flex flex-col h-full rounded-xl border border-border/70 border-l-[3px] p-5 shadow-sm transition-all hover:shadow-md bg-card",
        meta.borderClass
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            meta.chipClass
          )}
        >
          <Icon className={cn("h-5 w-5", meta.labelClass)} strokeWidth={2} />
        </span>
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "text-[10px] font-semibold uppercase tracking-wider mb-1",
              meta.labelClass
            )}
          >
            {meta.label} · {insight.category}
          </div>
          <h3 className="text-[15px] font-semibold leading-tight text-foreground">
            {insight.title}
          </h3>
        </div>
      </div>

      <p className="mt-3 font-mono text-[11px] text-muted-foreground/90 tabular-nums bg-muted/40 px-2.5 py-1.5 rounded-md">
        {insight.impact}
      </p>

      <div className="mt-auto pt-4">
        <Button size="sm" className="h-8 px-3 text-xs gap-1">
          {insight.primaryAction.label}
          <ArrowRight className="h-3 w-3" strokeWidth={2} />
        </Button>
      </div>
    </article>
  );
}
