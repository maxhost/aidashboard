"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Insight } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TYPE_META } from "./insight-meta";

export function WorthKnowingItem({
  insight,
  onPrimary,
  onSnooze,
  onOpenDetail,
}: {
  insight: Insight;
  onPrimary: () => void;
  onSnooze: () => void;
  onOpenDetail: () => void;
}) {
  const meta = TYPE_META[insight.type];

  return (
    <article className="flex items-center gap-4 px-4 py-3 rounded-lg border border-border/40 bg-card hover:border-border/80 transition-colors">
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider shrink-0",
          meta.chipClass
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotClass)} />
        {meta.label}
      </span>

      <button
        type="button"
        onClick={onOpenDetail}
        className="flex-1 min-w-0 text-left group"
      >
        <span className="text-[14px] font-medium text-foreground leading-snug group-hover:text-primary transition-colors">
          {insight.title}
        </span>
        <span className="hidden md:inline text-[12px] text-muted-foreground font-mono tabular-nums ml-2">
          · {insight.impact}
        </span>
      </button>

      <div className="hidden md:block font-mono text-[11px] text-muted-foreground tabular-nums shrink-0">
        {insight.category}
      </div>

      <Button
        size="sm"
        onClick={onPrimary}
        variant="ghost"
        className="h-8 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground shrink-0"
      >
        {insight.primaryAction.label}
        <ArrowRight className="h-3 w-3" strokeWidth={2} />
      </Button>
      <button
        type="button"
        onClick={onSnooze}
        className="text-[11px] font-medium text-muted-foreground hover:text-foreground shrink-0"
      >
        Snooze
      </button>
    </article>
  );
}
