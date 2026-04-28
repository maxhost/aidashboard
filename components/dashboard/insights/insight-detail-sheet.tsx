"use client";

import { ArrowRight, Clock } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatDistanceToNowStrict } from "date-fns";
import type { Insight } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TYPE_META } from "./insight-meta";

export function InsightDetailSheet({
  insight,
  open,
  onOpenChange,
  onPrimary,
  onSnooze,
}: {
  insight: Insight | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrimary: () => void;
  onSnooze: () => void;
}) {
  if (!insight) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg" />
      </Sheet>
    );
  }

  const meta = TYPE_META[insight.type];
  const Icon = meta.icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto"
      >
        <SheetHeader className="pr-8">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotClass)} />
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                meta.labelClass
              )}
            >
              {meta.label}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-[11px] font-medium text-muted-foreground">
              {insight.category}
            </span>
          </div>
          <SheetTitle className="text-xl text-foreground tracking-tight leading-snug">
            {insight.title}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Impact box */}
          <div
            className={cn(
              "rounded-xl border p-4 flex items-start gap-3",
              meta.chipClass
            )}
          >
            <Icon
              className={cn("h-5 w-5 shrink-0 mt-0.5", meta.labelClass)}
              strokeWidth={2}
            />
            <div className="font-mono text-sm font-semibold tabular-nums leading-relaxed">
              {insight.impact}
            </div>
          </div>

          {/* Detail */}
          {insight.detail && (
            <section>
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Why this matters
              </h3>
              <p className="text-sm leading-relaxed text-foreground/85">
                {insight.detail}
              </p>
            </section>
          )}

          {/* Meta */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono tabular-nums pt-2 border-t border-border/40">
            <Clock className="h-3 w-3" strokeWidth={2} />
            Created{" "}
            {formatDistanceToNowStrict(new Date(insight.createdAt))} ago
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3">
            <Button
              size="sm"
              onClick={() => {
                onPrimary();
                onOpenChange(false);
              }}
              className="gap-1.5 font-semibold"
            >
              {insight.primaryAction.label}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Button>
            <button
              type="button"
              onClick={() => {
                onSnooze();
                onOpenChange(false);
              }}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Snooze for 7 days
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
