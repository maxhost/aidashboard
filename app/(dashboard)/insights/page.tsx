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
import { dashboardData } from "@/lib/mock-data";
import type { Insight, InsightState } from "@/lib/types";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { ActNowCard } from "@/components/dashboard/insights/act-now-card";
import { ThisWeekItem } from "@/components/dashboard/insights/this-week-item";
import { WorthKnowingItem } from "@/components/dashboard/insights/worth-knowing-item";
import { InsightDetailSheet } from "@/components/dashboard/insights/insight-detail-sheet";
import { SnoozeToast } from "@/components/dashboard/insights/snooze-toast";

type ShowFilter = InsightState | "all";

export default function InsightsPage() {
  const { insights, period } = dashboardData;

  // ----- State
  const [show, setShow] = useState<ShowFilter>("pending");
  const [snoozedIds, setSnoozedIds] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<Insight | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    undoId: string | null;
  } | null>(null);

  // ----- Filtered, with state-overlay for snooze
  const visible = useMemo(() => {
    return insights
      .map<Insight>((i) =>
        snoozedIds.has(i.id) ? { ...i, state: "snoozed" } : i
      )
      .filter((i) => (show === "all" ? true : i.state === show));
  }, [insights, snoozedIds, show]);

  // ----- Bucket into zones (only meaningful when show === "pending")
  const critical = visible.find((i) => i.type === "critical") ?? null;
  const thisWeek = visible.filter(
    (i) => i.type === "warning" && i.id !== critical?.id
  );
  const worthKnowing = visible.filter(
    (i) =>
      (i.type === "opportunity" || i.type === "info") && i.id !== critical?.id
  );
  // For non-pending views, we lay everything out as a flat "worth-knowing" list
  const showFlatList = show !== "pending";
  const flat = visible;

  const totalToActOn = visible.length;

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
    // Stub — primary action is the user's go-to flow.
    setToast({
      message: `Action queued: ${insight.primaryAction.label}`,
      undoId: null,
    });
  }

  return (
    <div className="px-4 sm:px-6 py-8 lg:px-8 lg:py-10 max-w-[1200px] mx-auto space-y-8">
      {/* Header — simplified: title + count + period + show filter */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
            Insights
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {show === "pending" && totalToActOn > 0
              ? `${totalToActOn} ${totalToActOn === 1 ? "thing" : "things"} to act on`
              : show === "pending" && totalToActOn === 0
                ? "Nothing pending — you're caught up."
                : `${totalToActOn} ${totalToActOn === 1 ? "insight" : "insights"} in this view`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <PeriodSelector label={period.label} />
          <Select
            value={show}
            onValueChange={(v) => setShow(v as ShowFilter)}
          >
            <SelectTrigger className="h-9 w-[150px] text-xs font-medium gap-1.5">
              <span className="text-muted-foreground">Show:</span>
              <SelectValue />
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
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

      {/* Empty state */}
      {visible.length === 0 && (
        <EmptyState filter={show} />
      )}

      {/* PENDING view → 3 zones */}
      {!showFlatList && visible.length > 0 && (
        <>
          {/* ZONE 1 — ACT NOW (only renders if there's a critical) */}
          {critical && (
            <section aria-label="Act now">
              <SectionHeader title="Act now" emphasis />
              <ActNowCard
                insight={critical}
                onPrimary={() => handlePrimary(critical)}
                onSnooze={() => handleSnooze(critical.id)}
                onOpenDetail={() => setDetail(critical)}
              />
            </section>
          )}

          {/* ZONE 2 — THIS WEEK */}
          {thisWeek.length > 0 && (
            <section aria-label="This week" className="space-y-3">
              <SectionHeader title="This week" count={thisWeek.length} />
              <div className="space-y-3">
                {thisWeek.map((i) => (
                  <ThisWeekItem
                    key={i.id}
                    insight={i}
                    onPrimary={() => handlePrimary(i)}
                    onSnooze={() => handleSnooze(i.id)}
                    onOpenDetail={() => setDetail(i)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ZONE 3 — WORTH KNOWING */}
          {worthKnowing.length > 0 && (
            <section aria-label="Worth knowing" className="space-y-3">
              <SectionHeader
                title="Worth knowing"
                count={worthKnowing.length}
                muted
              />
              <div className="space-y-2">
                {worthKnowing.map((i) => (
                  <WorthKnowingItem
                    key={i.id}
                    insight={i}
                    onPrimary={() => handlePrimary(i)}
                    onSnooze={() => handleSnooze(i.id)}
                    onOpenDetail={() => setDetail(i)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Non-pending views → flat list (snoozed/implemented/ignored/all) */}
      {showFlatList && visible.length > 0 && (
        <section className="space-y-2">
          {flat.map((i) => (
            <WorthKnowingItem
              key={i.id}
              insight={i}
              onPrimary={() => handlePrimary(i)}
              onSnooze={() => handleSnooze(i.id)}
              onOpenDetail={() => setDetail(i)}
            />
          ))}
        </section>
      )}

      {/* Detail sheet */}
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
  );
}

function SectionHeader({
  title,
  count,
  emphasis,
  muted,
}: {
  title: string;
  count?: number;
  emphasis?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2.5 mb-3">
      <h2
        className={
          emphasis
            ? "text-[11px] font-bold uppercase tracking-[0.12em] text-rose-700"
            : muted
              ? "text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
              : "text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground"
        }
      >
        {title}
      </h2>
      {count !== undefined && (
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {count}
        </span>
      )}
    </div>
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
    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl bg-card">
      <Inbox
        className="h-9 w-9 text-muted-foreground/40 mb-3"
        strokeWidth={1.5}
      />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </div>
  );
}
