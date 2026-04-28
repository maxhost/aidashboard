"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Insight } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TYPE_META } from "./insight-meta";

export function ActNowCard({
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
  const Icon = meta.icon;

  return (
    <article
      className={cn(
        "relative rounded-2xl bg-card border border-border/70 border-l-[4px] p-6 shadow-sm overflow-hidden",
        meta.borderClass,
        "animate-pulse-soft"
      )}
    >
      <div className="flex items-start gap-4">
        <span
          className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "rgba(220, 38, 38, 0.10)" }}
        >
          <Icon
            className={cn("h-6 w-6", meta.labelClass)}
            strokeWidth={2}
          />
        </span>

        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider",
              meta.labelClass
            )}
          >
            {meta.label} · Act now · {insight.category}
          </div>

          <button
            type="button"
            onClick={onOpenDetail}
            className="block text-left mt-2 group"
          >
            <h2 className="text-xl font-bold tracking-tight text-foreground leading-snug group-hover:text-primary transition-colors">
              {insight.title}
            </h2>
          </button>

          <p className="font-mono text-sm text-foreground/75 tabular-nums mt-2 leading-relaxed">
            {insight.impact}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <Button
              size="sm"
              onClick={onPrimary}
              className="h-9 px-4 text-sm gap-1.5 font-semibold"
            >
              {insight.primaryAction.label}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Button>
            <button
              type="button"
              onClick={onSnooze}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Snooze
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
