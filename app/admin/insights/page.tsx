"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Inbox } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import { dashboardData } from "@/lib/mock-data";
import type {
  Insight,
  InsightCategory,
  InsightState,
  InsightType,
} from "@/lib/types";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import {
  ActionCard,
  type ActionCardData,
  type ActionTag,
} from "@/components/dashboard/action-card";
import { SectionTitle } from "@/components/dashboard/section-title";
import { InsightDetailSheet } from "@/components/dashboard/insights/insight-detail-sheet";
import { SnoozeToast } from "@/components/dashboard/insights/snooze-toast";
import { CATEGORY_META } from "@/components/dashboard/insights/insight-meta";
import { cn } from "@/lib/utils";

type ShowFilter = InsightState | "all";
type CategoryFilter = "all" | InsightCategory;

const CATEGORY_FILTERS: CategoryFilter[] = [
  "all",
  "Marketing",
  "Performance",
  "Workflow",
  "Lead Gen",
  "Tech Stack",
];

// Map insight type → ActionCard tag (urgency conveyed by tag color).
const TYPE_TO_TAG: Record<InsightType, ActionTag> = {
  critical: "URGENT",
  warning: "WARNING",
  opportunity: "OPPORTUNITY",
  info: "INSIGHT",
};

// Sort weight so critical floats to the top.
const TYPE_WEIGHT: Record<InsightType, number> = {
  critical: 0,
  warning: 1,
  opportunity: 2,
  info: 3,
};

export default function InsightsPage() {
  const { insights } = dashboardData;

  // ----- State
  const [show, setShow] = useState<ShowFilter>("pending");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [snoozedIds, setSnoozedIds] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<Insight | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    undoId: string | null;
  } | null>(null);

  // ----- Apply snooze overlay + state filter + category filter
  const visible = useMemo(() => {
    return insights
      .map<Insight>((i) =>
        snoozedIds.has(i.id) ? { ...i, state: "snoozed" } : i
      )
      .filter((i) => (show === "all" ? true : i.state === show))
      .filter((i) =>
        activeCategory === "all" ? true : i.category === activeCategory
      )
      .sort((a, b) => {
        const w = TYPE_WEIGHT[a.type] - TYPE_WEIGHT[b.type];
        if (w !== 0) return w;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [insights, snoozedIds, show, activeCategory]);

  // ----- Per-category counts (using current state filter, pre-category)
  const categoryCounts = useMemo(() => {
    const stateFiltered = insights
      .map<Insight>((i) =>
        snoozedIds.has(i.id) ? { ...i, state: "snoozed" } : i
      )
      .filter((i) => (show === "all" ? true : i.state === show));
    const counts: Record<CategoryFilter, number> = {
      all: stateFiltered.length,
      Marketing: 0,
      Performance: 0,
      Workflow: 0,
      "Lead Gen": 0,
      "Tech Stack": 0,
    };
    for (const i of stateFiltered) counts[i.category] += 1;
    return counts;
  }, [insights, snoozedIds, show]);

  // ----- Handlers
  function handleSnooze(id: string) {
    setSnoozedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setToast({ message: "Snoozed for 7 days", undoId: id });
  }

  function handleUndoSnooze(id: string) {
    setSnoozedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setToast(null);
  }

  function handlePrimary(insight: Insight) {
    setToast({
      message: `Action queued: ${insight.primaryAction.label}`,
      undoId: null,
    });
  }

  // Build ActionCard rows from visible insights.
  const cards: ActionCardData[] = visible.map((i) => ({
    id: i.id,
    tag: TYPE_TO_TAG[i.type],
    summary: `${CATEGORY_META[i.category].label} · ${i.title}`,
    onClick: () => setDetail(i),
  }));

  return (
    <TooltipProvider delay={150}>
      <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
              Insights
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {show === "pending" && visible.length > 0
                ? `${visible.length} ${visible.length === 1 ? "thing" : "things"} to act on.`
                : show === "pending" && visible.length === 0
                  ? "Nothing pending — you're caught up."
                  : `${visible.length} ${visible.length === 1 ? "insight" : "insights"} in this view.`}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <PeriodSelector />
            <Select value={show} onValueChange={(v) => setShow(v as ShowFilter)}>
              <SelectTrigger className="h-9 w-[150px] text-xs font-medium gap-1.5">
                <span className="text-muted-foreground">Show:</span>
                <SelectValue />
                <ChevronDown
                  className="h-3.5 w-3.5 text-muted-foreground"
                  strokeWidth={1.75}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="snoozed">Snoozed</SelectItem>
                <SelectItem value="implemented">Implemented</SelectItem>
                <SelectItem value="ignored">Ignored</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_FILTERS.map((cat) => {
            const active = activeCategory === cat;
            const count = categoryCounts[cat];
            const label = cat === "all" ? "All" : CATEGORY_META[cat].label;
            const disabled = cat !== "all" && count === 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                disabled={disabled}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium transition-colors border",
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-foreground border-border hover:border-foreground/30",
                  disabled && "opacity-40 cursor-not-allowed"
                )}
              >
                {label}
                <span
                  className={cn(
                    "font-mono tabular-nums text-[11px]",
                    active ? "text-background/70" : "text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* List */}
        {visible.length === 0 ? (
          <EmptyState filter={show} />
        ) : (
          <section aria-label="Insights" className="space-y-2">
            <SectionTitle
              title="Pulsor insights"
              tooltip="What Pulsor learned about your business this week."
              right={
                <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                  {visible.length}{" "}
                  {show === "pending"
                    ? "pending"
                    : show === "all"
                      ? "total"
                      : show}
                </span>
              }
            />
            <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
              {cards.map((c) => (
                <ActionCard key={c.id} data={c} />
              ))}
            </ul>
          </section>
        )}

        {/* Detail sheet (preserved — full insight + actions) */}
        <InsightDetailSheet
          insight={detail}
          open={detail !== null}
          onOpenChange={(o) => !o && setDetail(null)}
          onPrimary={() => detail && handlePrimary(detail)}
          onSnooze={() => detail && handleSnooze(detail.id)}
        />

        {/* Snooze toast */}
        <SnoozeToast
          open={toast !== null}
          message={toast?.message ?? ""}
          onUndo={() => toast?.undoId && handleUndoSnooze(toast.undoId)}
          onDismiss={() => setToast(null)}
        />
      </div>
    </TooltipProvider>
  );
}

function EmptyState({ filter }: { filter: ShowFilter }) {
  const messages: Record<ShowFilter, { title: string; hint: string }> = {
    pending: {
      title: "Nothing pending right now",
      hint: "You're caught up. Switch the dropdown to see history.",
    },
    snoozed: {
      title: "No snoozed insights",
      hint: "When you snooze a card, it'll show up here.",
    },
    implemented: {
      title: "No implemented insights yet",
      hint: "Wins logged here will track over time.",
    },
    ignored: {
      title: "No ignored insights",
      hint: "Dismissed insights will show up here.",
    },
    all: {
      title: "No insights at all",
      hint: "More will surface as your team's data flows.",
    },
  };
  const { title, hint } = messages[filter];
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl bg-card">
      <Inbox
        className="h-9 w-9 text-muted-foreground/40 mb-3"
        strokeWidth={1.5}
      />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </div>
  );
}
