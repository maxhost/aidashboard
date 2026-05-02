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
 * Compact "win" card for the WINS section on /overview. Less visually
 * prominent than warnings — light gray background, icon-only action.
 */
export function WinCard({
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

  return (
    <article className="rounded-lg bg-muted/40 border border-border/30 px-4 py-3 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn("h-1.5 w-1.5 rounded-full", type.dotClass)} />
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider",
              type.labelClass
            )}
          >
            {type.label}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground truncate">
            {cat.label}
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenDetail}
          className="block text-left mt-1 group w-full"
        >
          <h3 className="text-[14px] font-medium text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {insight.title}
          </h3>
        </button>
        <p className="font-mono text-[11px] text-muted-foreground tabular-nums mt-0.5 line-clamp-1">
          {insight.impact}
        </p>
      </div>

      <Button
        size="icon"
        onClick={onPrimary}
        aria-label={insight.primaryAction.label}
        title={insight.primaryAction.label}
        className="h-8 w-8 rounded-full shrink-0"
        variant="outline"
      >
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
      </Button>
    </article>
  );
}
