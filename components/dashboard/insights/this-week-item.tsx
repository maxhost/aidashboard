"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Insight } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TYPE_META } from "./insight-meta";

export function ThisWeekItem({
  insight,
  onPrimary,
  onOpenDetail,
}: {
  insight: Insight;
  onPrimary: () => void;
  onOpenDetail: () => void;
}) {
  const meta = TYPE_META[insight.type];

  return (
    <article
      className={cn(
        "rounded-xl bg-card border border-border/70 border-l-[3px] p-4 shadow-sm transition-all",
        meta.borderClass
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotClass)} />
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                meta.labelClass
              )}
            >
              {meta.label}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              · {insight.category}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenDetail}
            className="block text-left mt-1.5 group w-full"
          >
            <h3 className="text-[15px] font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
              {insight.title}
            </h3>
          </button>

          <p className="font-mono text-[12px] text-muted-foreground tabular-nums mt-1">
            {insight.impact}
          </p>
        </div>

        <Button
          size="icon"
          onClick={onPrimary}
          aria-label={insight.primaryAction.label}
          title={insight.primaryAction.label}
          className="h-8 w-8 rounded-full shrink-0"
        >
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </Button>
      </div>
    </article>
  );
}
