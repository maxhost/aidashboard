"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckSquare,
  AlertTriangle,
  ChevronRight,
  Pencil,
  RefreshCw,
  Send,
} from "lucide-react";
import {
  RealtorAvatar as Avatar,
  RealtorSelector,
} from "@/components/dashboard/realtor-selector";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  STATUS_LABEL,
  type OperationalEvent,
  type OperationalEventStatus,
  type Realtor,
} from "@/lib/data/operational-timeline";
import { listRealtors, toUiRealtor, type UiRealtor } from "@/lib/api/realtors";
import {
  approveConversation,
  listTimeline,
  rejectConversation,
  toUiEvent,
} from "@/lib/api/operator";
import { getToken } from "@/lib/session";

// ─── Status dot color tokens ────────────────────────────────────────────

const STATUS_DOT: Record<OperationalEventStatus, string> = {
  pending: "bg-warning",
  approved: "bg-success",
  edited: "bg-[hsl(205_55%_50%)]",
  rejected: "bg-destructive/70",
  synced: "bg-success/70",
};

const STATUS_TEXT: Record<OperationalEventStatus, string> = {
  pending: "text-warning",
  approved: "text-success",
  edited: "text-[hsl(205_55%_38%)]",
  rejected: "text-destructive/80",
  synced: "text-success",
};

// ─── Tab system ─────────────────────────────────────────────────────────

type TimelineTab = "pending" | "processed" | "rejected";

const TAB_LABEL: Record<TimelineTab, string> = {
  pending: "Pending",
  processed: "Processed",
  rejected: "Rejected",
};

function statusTab(status: OperationalEventStatus): TimelineTab {
  if (status === "pending") return "pending";
  if (status === "rejected") return "rejected";
  return "processed"; // approved | edited | synced
}

// ─── Main module ────────────────────────────────────────────────────────

/**
 * BackOffice-only review module: focus on ONE realtor at a time, filter
 * their voice notes by review state (Pending / Processed / Rejected).
 *
 * Optimized for the human review workflow, NOT for monitoring AI metrics.
 */
export function OperationalTimelineSection() {
  const { realtors, status: realtorsStatus } = useRealtors();
  const [realtorId, setRealtorId] = useState<string>("");
  const [tab, setTab] = useState<TimelineTab>("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewBusy, setReviewBusy] = useState<"approve" | "reject" | null>(
    null,
  );

  useEffect(() => {
    if (!realtorId && realtors.length > 0) setRealtorId(realtors[0].id);
  }, [realtors, realtorId]);

  const realtor: UiRealtor | null =
    realtors.find((r) => r.id === realtorId) ?? realtors[0] ?? null;

  const {
    events,
    status: eventsStatus,
    refreshing,
    refresh,
  } = useTimeline(realtor);
  const forRealtor = events;

  const counts: Record<TimelineTab, number> = {
    pending: forRealtor.filter((e) => statusTab(e.status) === "pending").length,
    processed: forRealtor.filter((e) => statusTab(e.status) === "processed")
      .length,
    rejected: forRealtor.filter((e) => statusTab(e.status) === "rejected")
      .length,
  };
  const pendingCount = counts.pending;

  const visible = forRealtor.filter((e) => statusTab(e.status) === tab);
  const selected = events.find((e) => e.id === selectedId) ?? null;

  async function handleApprove(conversationId: string) {
    const token = getToken();
    if (!token) return;
    setReviewBusy("approve");
    try {
      await approveConversation(token, conversationId);
      setSelectedId(null);
      setTab("processed");
      refresh();
    } catch {
      // optimistic; refresh will reconcile on next tick
      refresh();
    } finally {
      setReviewBusy(null);
    }
  }

  async function handleReject(conversationId: string, reason?: string) {
    const token = getToken();
    if (!token) return;
    setReviewBusy("reject");
    try {
      await rejectConversation(token, conversationId, reason);
      setSelectedId(null);
      setTab("rejected");
      refresh();
    } catch {
      refresh();
    } finally {
      setReviewBusy(null);
    }
  }

  const header = (
    <div>
      <h2 className="text-lg font-medium text-foreground">
        Operational timeline
      </h2>
      <p className="text-sm text-muted-foreground mt-1 leading-snug">
        Review voice notes from one realtor at a time. Approve, edit, or
        reject what the AI extracted.
      </p>
    </div>
  );

  if (realtorsStatus === "loading") {
    return (
      <section aria-label="Operational timeline" className="space-y-4">
        {header}
        <p className="text-sm text-muted-foreground">Loading realtors…</p>
      </section>
    );
  }
  if (realtorsStatus === "error") {
    return (
      <section aria-label="Operational timeline" className="space-y-4">
        {header}
        <p className="text-sm text-destructive">
          Couldn&apos;t load realtors. Check your connection and refresh.
        </p>
      </section>
    );
  }
  if (!realtor) {
    return (
      <section aria-label="Operational timeline" className="space-y-4">
        {header}
        <p className="text-sm text-muted-foreground">
          No realtors yet. They&apos;ll appear here once they send their first
          message.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Operational timeline" className="space-y-4">
      {header}

      {/* Realtor selector + pending count + refresh */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <RealtorSelector
            realtors={realtors}
            value={realtor}
            onChange={(r) => {
              setRealtorId(r.id);
              setTab("pending");
            }}
          />
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing || eventsStatus === "loading"}
            aria-label="Refresh voice notes"
            title="Refresh"
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5",
                (refreshing || eventsStatus === "loading") && "animate-spin"
              )}
              strokeWidth={2}
            />
          </button>
        </div>
        <span className="text-sm text-muted-foreground tabular-nums">
          {pendingCount === 0
            ? "Nothing pending review"
            : `${pendingCount} pending review`}
        </span>
      </div>

      {/* Tabs */}
      <TimelineTabs tab={tab} onChange={setTab} counts={counts} />

      {/* Card with rows */}
      {eventsStatus === "loading" ? (
        <p className="text-sm text-muted-foreground px-1 py-8 text-center">
          Loading voice notes…
        </p>
      ) : eventsStatus === "error" ? (
        <p className="text-sm text-destructive px-1 py-8 text-center">
          Couldn&apos;t load voice notes for {realtor.shortName}.
        </p>
      ) : visible.length > 0 ? (
        <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
          {visible.map((event) => (
            <TimelineRow
              key={event.id}
              event={event}
              onReview={() => setSelectedId(event.id)}
            />
          ))}
        </ul>
      ) : (
        <EmptyState tab={tab} realtor={realtor} />
      )}

      <Dialog
        open={!!selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      >
        <DialogContent className="sm:max-w-2xl p-0 gap-0 max-h-[88dvh] flex flex-col overflow-hidden">
          {selected && (
            <ReviewDialog
              key={selected.id}
              event={selected}
              busy={reviewBusy}
              onApprove={() => handleApprove(selected.id)}
              onReject={() => handleReject(selected.id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

// ─── Realtor selector ───────────────────────────────────────────────────

// ─── Tabs ───────────────────────────────────────────────────────────────

function TimelineTabs({
  tab,
  onChange,
  counts,
}: {
  tab: TimelineTab;
  onChange: (next: TimelineTab) => void;
  counts: Record<TimelineTab, number>;
}) {
  const tabs: TimelineTab[] = ["pending", "processed", "rejected"];
  return (
    <div
      role="tablist"
      aria-label="Filter operational events"
      className="flex items-center gap-6 border-b border-border/60"
    >
      {tabs.map((key) => {
        const active = tab === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              "relative -mb-px py-2 text-sm font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              {TAB_LABEL[key]}
              <span
                className={cn(
                  "font-mono text-[11px] tabular-nums",
                  active ? "text-muted-foreground" : "text-muted-foreground/60"
                )}
              >
                {counts[key]}
              </span>
            </span>
            {active && (
              <span
                aria-hidden
                className="absolute left-0 right-0 bottom-0 h-[2px] bg-foreground rounded-full"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Timeline row (simplified for human review) ─────────────────────────

function TimelineRow({
  event,
  onReview,
}: {
  event: OperationalEvent;
  onReview: () => void;
}) {
  const taskCount = event.suggestedTasks.length;
  const riskCount = event.detectedRisks.length;

  return (
    <li className="group px-4 sm:px-5 py-4 sm:py-[18px] transition-colors hover:bg-muted/30">
      {/* Top: realtor + timestamp + status */}
      <div className="flex items-center gap-3">
        <Avatar realtor={event.realtor} size={26} />
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-[14.5px] font-medium text-foreground truncate">
            {event.realtor.shortName}
          </span>
          <span aria-hidden className="text-muted-foreground/40">·</span>
          <span className="text-sm text-muted-foreground tabular-nums">
            {event.earlierLabel ?? event.receivedAtLabel}
          </span>
        </div>
        <StatusBadge status={event.status} />
      </div>

      {/* Transcript preview */}
      <p className="mt-2.5 pl-[38px] text-[14.5px] leading-relaxed text-foreground/80 line-clamp-2">
        &ldquo;{event.transcriptPreview}&rdquo;
      </p>

      {/* AI chips + Review CTA */}
      <div className="mt-3 pl-[38px] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex flex-wrap gap-1.5">
          {taskCount > 0 && (
            <Pill icon={CheckSquare}>
              {taskCount} {taskCount === 1 ? "task" : "tasks"}
            </Pill>
          )}
          {riskCount > 0 && (
            <Pill icon={AlertTriangle} tone="warning">
              {riskCount} {riskCount === 1 ? "risk" : "risks"}
            </Pill>
          )}
        </div>
        <button
          type="button"
          onClick={onReview}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-foreground/85 hover:text-foreground hover:bg-muted/70 transition-colors shrink-0"
        >
          Review
          <ChevronRight
            className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform"
            strokeWidth={2}
          />
        </button>
      </div>
    </li>
  );
}

// ─── Small parts ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OperationalEventStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 shrink-0 text-[11px] font-medium",
        STATUS_TEXT[status]
      )}
    >
      <span
        aria-hidden
        className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[status])}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

function Pill({
  icon: Icon,
  children,
  tone = "default",
}: {
  icon: typeof CheckSquare;
  children: React.ReactNode;
  tone?: "default" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11.5px] font-medium border",
        tone === "warning"
          ? "border-warning/30 bg-warning-subtle text-warning"
          : "border-border bg-muted/40 text-foreground/80"
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={2} />
      {children}
    </span>
  );
}

function EmptyState({
  tab,
  realtor,
}: {
  tab: TimelineTab;
  realtor: Realtor;
}) {
  const messages: Record<TimelineTab, string> = {
    pending: `No voice notes pending review from ${realtor.shortName}.`,
    processed: `No processed notes from ${realtor.shortName} yet.`,
    rejected: `No rejected notes from ${realtor.shortName}.`,
  };
  return (
    <p className="text-sm text-muted-foreground px-1 py-8 text-center">
      {messages[tab]}
    </p>
  );
}

// ─── Review dialog (centered modal, MVP-stripped) ───────────────────────

function ReviewDialog({
  event,
  busy,
  onApprove,
  onReject,
}: {
  event: OperationalEvent;
  busy: "approve" | "reject" | null;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isApproved = event.status === "approved" || event.status === "synced";
  const isRejected = event.status === "rejected";
  const isTerminal = isApproved || isRejected;
  const disableAll = busy !== null || isTerminal;
  return (
    <>
      <DialogTitle className="sr-only">Review voice note</DialogTitle>
      <DialogDescription className="sr-only">
        Transcript and AI-extracted items for review
      </DialogDescription>

      {/* Body — transcript + tasks + risks. pr-12 clears Dialog's close × */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-7 pr-12 space-y-7 min-h-0">
        {/* Transcript */}
        <section>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/80 mb-2.5">
            Transcript
          </h3>
          <p className="text-[15px] leading-relaxed text-foreground/85">
            {event.transcript}
          </p>
        </section>

        {/* Detected tasks */}
        {event.suggestedTasks.length > 0 && (
          <section>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/80 mb-2.5">
              Detected tasks
            </h3>
            <ul className="space-y-2">
              {event.suggestedTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-start gap-3 text-[14.5px] leading-relaxed text-foreground/85"
                >
                  <span
                    aria-hidden
                    className="mt-[9px] h-1 w-1 rounded-full bg-foreground/35 shrink-0"
                  />
                  <span>{task.text}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Detected risks */}
        {event.detectedRisks.length > 0 && (
          <section>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/80 mb-2.5">
              Detected risks
            </h3>
            <ul className="space-y-2">
              {event.detectedRisks.map((risk) => (
                <li
                  key={risk.id}
                  className="flex items-start gap-2.5 rounded-lg border border-warning/25 bg-warning-subtle/40 px-3 py-2.5"
                >
                  <AlertTriangle
                    aria-hidden
                    className="h-3.5 w-3.5 mt-0.5 text-warning shrink-0"
                    strokeWidth={2.25}
                  />
                  <span className="text-sm text-foreground/85 leading-snug">
                    {risk.text}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Footer — Edit · Reject · Push to dashboard */}
      <div className="flex items-center justify-between gap-3 px-6 py-3 sm:py-3.5 border-t border-border/60 shrink-0">
        <button
          type="button"
          disabled
          title="Coming soon"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground/40 cursor-not-allowed"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          Edit
        </button>
        <div className="flex items-center gap-2">
          {isTerminal && (
            <span className="text-xs text-muted-foreground italic mr-2">
              {isApproved ? "Already pushed" : "Rejected"}
            </span>
          )}
          <button
            type="button"
            onClick={onReject}
            disabled={disableAll}
            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            {busy === "reject" ? "Rejecting…" : "Reject"}
          </button>
          <button
            type="button"
            onClick={onApprove}
            disabled={disableAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-foreground"
          >
            <Send className="h-3.5 w-3.5" strokeWidth={2.25} />
            {busy === "approve" ? "Pushing…" : "Push to dashboard"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Realtors fetch hook ────────────────────────────────────────────────

type RealtorsStatus = "loading" | "ready" | "error";

function useRealtors(): { realtors: UiRealtor[]; status: RealtorsStatus } {
  const [realtors, setRealtors] = useState<UiRealtor[]>([]);
  const [status, setStatus] = useState<RealtorsStatus>("loading");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setStatus("error");
      return;
    }
    let cancelled = false;
    listRealtors(token)
      .then((res) => {
        if (cancelled) return;
        setRealtors(res.realtors.map(toUiRealtor));
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { realtors, status };
}

// ─── Timeline fetch hook ────────────────────────────────────────────────

type TimelineStatus = "loading" | "ready" | "error";

const POLL_MS = 15_000;

function useTimeline(realtor: UiRealtor | null): {
  events: OperationalEvent[];
  status: TimelineStatus;
  refreshing: boolean;
  refresh: () => void;
} {
  const [events, setEvents] = useState<OperationalEvent[]>([]);
  const [status, setStatus] = useState<TimelineStatus>("loading");
  const [refreshing, setRefreshing] = useState(false);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    if (!realtor) {
      setEvents([]);
      setStatus("ready");
      return;
    }
    const token = getToken();
    if (!token) {
      setStatus("error");
      return;
    }

    let cancelled = false;
    let isFirst = true;

    async function load() {
      if (isFirst) setStatus("loading");
      else setRefreshing(true);
      try {
        const res = await listTimeline(token!, realtor!.id);
        if (cancelled) return;
        setEvents(res.events.map((e) => toUiEvent(e, realtor!)));
        setStatus("ready");
      } catch {
        if (cancelled) return;
        if (isFirst) setStatus("error");
      } finally {
        if (!cancelled) setRefreshing(false);
        isFirst = false;
      }
    }

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [realtor, tick]);

  return { events, status, refreshing, refresh };
}

