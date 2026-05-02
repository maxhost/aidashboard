"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Insight } from "@/lib/types";
import {
  CATEGORY_META,
  TYPE_META,
} from "@/components/dashboard/insights/insight-meta";

/**
 * Uniform insight card used in the "Top insights" grid on /overview and
 * everywhere on /insights. Identical structure across categories.
 *
 * Layout:
 *   [● TYPE]  CATEGORY                       [Category icon]
 *   Title (1 line)
 *   Metric · Metric · Metric (1 line, mono)
 *                                            [→]  ← icon-only primary
 */
export function InsightUniformCard({
  insight,
  onPrimary,
  onOpenDetail,
}: {
  insight: Insight;
  onPrimary: () => void;
  onOpenDetail: () => void;
}) {
  const type = TYPE_META[insight.type];
  const cat = CATEGORY_META[insight.category];
  const CatIcon = cat.icon;

  return (
    <article
      className={cn(
        "flex flex-col h-full rounded-xl bg-card border border-border/70 border-l-[3px] p-4 shadow-sm hover:shadow-md transition-shadow",
        type.borderClass
      )}
    >
      {/* Top row: type + category + icon */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", type.dotClass)} />
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider",
              type.labelClass
            )}
          >
            {type.label}
          </span>
          <span className="text-muted-foreground/40 shrink-0">·</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground truncate">
            {cat.label}
          </span>
        </div>
        <span
          className={cn(
            "h-7 w-7 rounded-lg flex items-center justify-center shrink-0",
            cat.iconBg
          )}
          aria-hidden
        >
          <CatIcon className={cn("h-3.5 w-3.5", cat.iconColor)} strokeWidth={2} />
        </span>
      </div>

      {/* Title (1 line, clickable → detail sheet) */}
      <button
        type="button"
        onClick={onOpenDetail}
        className="block text-left mt-3 group"
      >
        <h3 className="text-[14px] font-semibold leading-snug text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {insight.title}
        </h3>
      </button>

      {/* Metrics (1 line, mono) */}
      <p className="font-mono text-[12px] text-muted-foreground tabular-nums mt-1.5 line-clamp-1">
        {insight.impact}
      </p>

      {/* Footer: icon-only primary action (right-aligned) */}
      <div className="flex items-center justify-end mt-4 pt-3 border-t border-border/40">
        <Button
          size="icon"
          onClick={onPrimary}
          aria-label={insight.primaryAction.label}
          title={insight.primaryAction.label}
          className="h-8 w-8 rounded-full"
        >
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </Button>
      </div>
    </article>
  );
}
