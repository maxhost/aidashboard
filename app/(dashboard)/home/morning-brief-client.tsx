"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Phone,
  MessageCircle,
  Send,
  CalendarPlus,
  CheckCircle2,
  RefreshCw,
  Key,
  FileText,
  Home as HomeIcon,
  Banknote,
  ClipboardCheck,
  Handshake,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/dashboard/section-title";
import {
  BackOfficeAddRow,
  BackOfficeRowActions,
} from "@/components/dashboard/back-office-controls";
import { useIsBackOffice, useRole } from "@/components/dashboard/use-role";
import { getCachedUser, getToken } from "@/lib/session";
import { listRealtors, toUiRealtor, type UiRealtor } from "@/lib/api/realtors";
import { RealtorSelector } from "@/components/dashboard/realtor-selector";
import {
  listMyTasks,
  splitTasks,
  toUiAttention,
  toUiPriority,
  updateTaskStatus,
  type TaskRow,
} from "@/lib/api/tasks";
import type { User } from "@/lib/api/auth";
import {
  useRemoveWithReason,
  type RemoveMetadata,
  type RemoveReason,
} from "@/components/dashboard/use-remove-with-reason";
import { useSnoozeWithReason } from "@/components/dashboard/use-snooze-with-reason";
import { OperationalTimelineSection } from "./operational-timeline-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GREETING_LABEL,
  buildBriefSubtitle,
  getGreetingPeriod,
  prioritizeAttention,
  type BriefAttentionCategory,
  type BriefAttentionItem,
  type BriefAttentionTone,
  type BriefPriority,
  type BriefPriorityAction,
  type GreetingPeriod,
  type MorningBrief,
} from "@/lib/data/assistant-demo";

const ACTION_ICON: Record<BriefPriorityAction, typeof Phone> = {
  call: Phone,
  send: Send,
  message: MessageCircle,
  schedule: CalendarPlus,
  confirm: CheckCircle2,
};

const ATTENTION_CATEGORY_ICON: Record<BriefAttentionCategory, typeof Phone> = {
  closing: Key,
  negotiation: Handshake,
  "follow-up": MessageCircle,
  contract: FileText,
  showing: HomeIcon,
  lender: Banknote,
  inspection: ClipboardCheck,
};

const TONE_ROW_BORDER: Record<BriefAttentionTone, string> = {
  critical: "border-l-2 border-l-destructive",
  warning: "border-l-2 border-l-warning",
  neutral: "",
};

const GREETING_EMOJI: Record<GreetingPeriod, string> = {
  morning: "☀️",
  afternoon: "🌤️",
  evening: "🌙",
};

const PRIORITY_OVERVIEW_LIMIT = 4;

type PriorityTab = "todo" | "done";

export function MorningBriefClient({
  firstName,
  brief: briefFromProps,
}: {
  firstName: string;
  brief: MorningBrief;
}) {
  const [period, setPeriod] = useState<GreetingPeriod>(() =>
    typeof window === "undefined" ? "morning" : getGreetingPeriod()
  );
  useEffect(() => {
    setPeriod(getGreetingPeriod());
    // Keep the greeting fresh if the tab stays open across the boundary.
    const id = window.setInterval(() => setPeriod(getGreetingPeriod()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const role = useRole();
  const isAssistant = role === "assistant";
  const isBackOfficeRole = role === "back-office";
  // Modes that drive the brief from real tasks (vs mock data). Operator can
  // 'view as' a realtor; realtor sessions are auto-scoped by the backend.
  const useRealData = isAssistant || isBackOfficeRole;

  const [authUser, setAuthUser] = useState<User | null>(null);
  useEffect(() => {
    setAuthUser(getCachedUser());
  }, []);
  const isAuthOperator = authUser?.role === "operator";

  // Operators on Assistant or Back Office can pick which realtor to "look as".
  // Realtors are auto-scoped by their session, no picker.
  const { realtors: pickableRealtors } = usePickableRealtors(
    useRealData && isAuthOperator,
  );
  const [pickedRealtorId, setPickedRealtorId] = useState<string>("");
  useEffect(() => {
    if (!pickedRealtorId && pickableRealtors.length > 0) {
      setPickedRealtorId(pickableRealtors[0].id);
    }
  }, [pickableRealtors, pickedRealtorId]);
  const pickedRealtor =
    pickableRealtors.find((r) => r.id === pickedRealtorId) ?? null;

  const scopedRealtorId = isAuthOperator ? pickedRealtorId || null : null;
  const canFetchTasks = useRealData && (!isAuthOperator || !!pickedRealtorId);
  const {
    tasks: realTasks,
    refresh: refreshTasks,
    refreshing: tasksRefreshing,
  } = useMyTasks(canFetchTasks, scopedRealtorId);

  // Greeting target:
  //  - Operator viewing-as a realtor (Assistant or BO) -> that realtor's first name
  //  - Realtor logged in (Assistant)                   -> their own first name
  //  - Back Office without picker (no operator)        -> operator's first name
  //  - Anything else (mock-data roles)                 -> fall back to the prop
  const displayFirstName =
    useRealData && isAuthOperator && isAssistant
      ? pickedRealtor?.name
        ? pickFirstName(pickedRealtor.name)
        : firstName
      : useRealData && authUser?.name
        ? pickFirstName(authUser.name)
        : firstName;

  const brief = useMemo<MorningBrief>(() => {
    if (!useRealData) return briefFromProps;
    const { overview, priorities } = splitTasks(realTasks);
    return {
      attention: overview.map(toUiAttention),
      earlier: [],
      priorities: priorities.map(toUiPriority),
      handled: [],
    };
  }, [useRealData, realTasks, briefFromProps]);

  // In real-data mode, the detail dialog can be opened from BOTH lists.
  // It always needs the full BriefPriority shape, so we build a global lookup.
  const realPriorityById = useMemo(() => {
    if (!useRealData) return null;
    const m = new Map<string, BriefPriority>();
    for (const t of realTasks) m.set(t.id, toUiPriority(t));
    return m;
  }, [useRealData, realTasks]);

  // Mirror the DB's done state into the local Sets so the Done tab in BOTH
  // lists stays accurate across the 15s poll. The DB is the source of truth
  // in real-data modes; mock-data modes keep their pure in-memory behavior.
  useEffect(() => {
    if (!useRealData) return;
    const done = new Set<string>();
    for (const t of realTasks) if (t.status === "done") done.add(t.id);
    setDoneIds(done);
    setAttentionDoneIds(new Set(done));
  }, [useRealData, realTasks]);

  const subtitle = useMemo(() => buildBriefSubtitle(brief), [brief]);
  const active = useMemo(() => prioritizeAttention(brief.attention), [brief]);

  const isBackOffice = useIsBackOffice();
  const priorityRemoval = useRemoveWithReason<BriefPriority>({
    itemType: "priority",
    getDisplayName: (p) => p.headline,
    onRemove: (p, meta) => {
      if (useRealData) void persistStatus(p.id, "ignored", formatRemoveReason(meta));
    },
  });
  const attentionRemoval = useRemoveWithReason<BriefAttentionItem>({
    itemType: "attention",
    getDisplayName: (a) => a.headline,
    onRemove: (a, meta) => {
      if (useRealData) void persistStatus(a.id, "ignored", formatRemoveReason(meta));
    },
  });
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [snoozedIds, setSnoozedIds] = useState<Set<string>>(new Set());
  const [attentionDoneIds, setAttentionDoneIds] = useState<Set<string>>(
    new Set()
  );
  const [attentionSnoozedIds, setAttentionSnoozedIds] = useState<Set<string>>(
    new Set()
  );
  const prioritySnoozeReason = useSnoozeWithReason<BriefPriority>({
    itemType: "priority",
    getDisplayName: (p) => p.headline,
    onSnooze: (p, reason) => {
      snoozePriority(p.id, reason);
      setSelectedId((current) => (current === p.id ? null : current));
    },
  });
  const attentionSnoozeReason = useSnoozeWithReason<BriefAttentionItem>({
    itemType: "attention",
    getDisplayName: (a) => a.headline,
    onSnooze: (a, reason) => snoozeAttention(a.id, reason),
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [priorityTab, setPriorityTab] = useState<PriorityTab>("todo");
  const [attentionTab, setAttentionTab] = useState<PriorityTab>("todo");
  const selectedPriority =
    brief.priorities.find((p) => p.id === selectedId) ??
    (selectedId ? (realPriorityById?.get(selectedId) ?? null) : null);
  const livePriorities = useMemo(
    () => brief.priorities.filter((p) => !priorityRemoval.isRemoved(p.id)),
    [brief.priorities, priorityRemoval]
  );
  const todoPriorities = useMemo(
    () =>
      livePriorities.filter(
        (p) => !doneIds.has(p.id) && !snoozedIds.has(p.id)
      ),
    [livePriorities, doneIds, snoozedIds]
  );
  const donePriorities = useMemo(
    () => livePriorities.filter((p) => doneIds.has(p.id)),
    [livePriorities, doneIds]
  );
  const visiblePriorities =
    priorityTab === "todo" ? todoPriorities : donePriorities;

  // Navigation through todo priorities inside the detail dialog
  const priorityIdx = selectedId
    ? todoPriorities.findIndex((p) => p.id === selectedId)
    : -1;
  const canGoPrev = priorityIdx > 0;
  const canGoNext = priorityIdx < todoPriorities.length - 1;
  function goToPrev() {
    if (canGoPrev) setSelectedId(todoPriorities[priorityIdx - 1].id);
  }
  function goToNext() {
    if (canGoNext) setSelectedId(todoPriorities[priorityIdx + 1].id);
  }
  const liveAttention = useMemo(
    () => active.filter((a) => !attentionRemoval.isRemoved(a.id)),
    [active, attentionRemoval]
  );
  const todoAttention = useMemo(
    () =>
      liveAttention.filter(
        (a) => !attentionDoneIds.has(a.id) && !attentionSnoozedIds.has(a.id)
      ),
    [liveAttention, attentionDoneIds, attentionSnoozedIds]
  );
  const doneAttention = useMemo(
    () => liveAttention.filter((a) => attentionDoneIds.has(a.id)),
    [liveAttention, attentionDoneIds]
  );

  function toggleAttentionDone(id: string) {
    const wasDone = attentionDoneIds.has(id);
    setAttentionDoneIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setAttentionSnoozedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (useRealData) {
      void persistStatus(id, wasDone ? "assigned" : "done");
    }
  }

  function snoozeAttention(id: string, reason?: string) {
    setAttentionSnoozedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    if (useRealData) {
      void persistStatus(id, "ignored", reason);
    }
  }

  function toggleDone(id: string) {
    const wasDone = doneIds.has(id);
    setDoneIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // If marking done, also drop any snooze on the same item.
    setSnoozedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (useRealData) {
      void persistStatus(id, wasDone ? "assigned" : "done");
    }
  }

  function snoozePriority(id: string, reason?: string) {
    setSnoozedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    if (useRealData) {
      void persistStatus(id, "ignored", reason);
    }
  }

  async function persistStatus(
    id: string,
    status: "done" | "ignored" | "assigned",
    dismissReason?: string,
  ) {
    const token = getToken();
    if (!token) return;
    try {
      await updateTaskStatus(
        token,
        id,
        status,
        dismissReason !== undefined ? { dismissReason } : undefined,
      );
      refreshTasks();
    } catch {
      // Optimistic UI already applied; a refresh will reconcile.
      refreshTasks();
    }
  }

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[900px] mx-auto space-y-8">
      {/* Hero — greeting + contextual operational subtitle */}
      <header>
        <h1
          suppressHydrationWarning
          className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight"
        >
          {GREETING_LABEL[period]}, {displayFirstName}{" "}
          <span aria-hidden className="ml-0.5 align-[-2px] text-[0.9em]">
            {GREETING_EMOJI[period]}
          </span>
        </h1>
        <p className="text-base lg:text-lg text-foreground/75 mt-2 leading-snug max-w-[640px]">
          {subtitle}
        </p>
      </header>

      {/* Toolbar — operator's realtor picker (operator only) + refresh.
          One picker scopes BOTH the brief lists AND the operational timeline. */}
      {useRealData && (
        <div className="flex items-center gap-3 flex-wrap">
          {isAuthOperator && (
            <>
              <span className="text-sm text-muted-foreground">Viewing as</span>
              {pickableRealtors.length > 0 ? (
                <RealtorSelector
                  realtors={pickableRealtors}
                  value={pickedRealtor}
                  onChange={(r) => setPickedRealtorId(r.id)}
                  placeholder="Select realtor"
                />
              ) : (
                <span className="text-sm text-muted-foreground">
                  Loading realtors…
                </span>
              )}
            </>
          )}
          <button
            type="button"
            onClick={refreshTasks}
            disabled={tasksRefreshing || !canFetchTasks}
            aria-label="Refresh tasks"
            title="Refresh"
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5",
                tasksRefreshing && "animate-spin"
              )}
              strokeWidth={2}
            />
          </button>
        </div>
      )}

      {/* Priority overview — live, sorted by urgency, top items only */}
      <PriorityOverview
        tab={attentionTab}
        onChange={setAttentionTab}
        todoItems={todoAttention}
        doneItems={doneAttention}
        onToggleDone={toggleAttentionDone}
        onSnoozeRequest={attentionSnoozeReason.request}
        onRequestRemove={attentionRemoval.requestRemove}
        onOpen={useRealData ? (id) => setSelectedId(id) : undefined}
      />

      {/* Suggested priorities — action + context + optional risk */}
      <section aria-label="Suggested priorities" className="space-y-3">
        <SectionTitle
          title="Suggested priorities"
          tooltip="What I'd pick up first today, with the reason behind each call."
        />
        <PriorityTabs
          tab={priorityTab}
          onChange={setPriorityTab}
          todoCount={todoPriorities.length}
          doneCount={donePriorities.length}
        />
        {visiblePriorities.length > 0 ? (
          <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            {visiblePriorities.map((p) => (
              <PriorityRow
                key={p.id}
                priority={p}
                done={doneIds.has(p.id)}
                onToggle={() => toggleDone(p.id)}
                onSnooze={() => prioritySnoozeReason.request(p)}
                onOpen={() => setSelectedId(p.id)}
                onRequestRemove={() => priorityRemoval.requestRemove(p)}
              />
            ))}
            {isBackOffice && priorityTab === "todo" && (
              <li>
                <BackOfficeAddRow label="Add priority" />
              </li>
            )}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground px-1 py-6">
            {priorityTab === "todo"
              ? "Nothing left for today. Clean run."
              : "Nothing marked done yet."}
          </p>
        )}
      </section>

      {/* BackOffice-only operational timeline — separate module below the brief */}
      {isBackOffice && (
        <OperationalTimelineSection
          realtor={isAuthOperator ? pickedRealtor : null}
        />
      )}

      <Dialog
        open={!!selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      >
        <DialogContent className="sm:max-w-lg p-0 gap-0 max-h-[88dvh] flex flex-col overflow-hidden">
          {selectedPriority && (
            <PriorityDetail
              key={selectedPriority.id}
              priority={selectedPriority}
              done={doneIds.has(selectedPriority.id)}
              onToggle={() => toggleDone(selectedPriority.id)}
              onSnooze={() => prioritySnoozeReason.request(selectedPriority)}
              onClose={() => setSelectedId(null)}
              canGoPrev={canGoPrev}
              canGoNext={canGoNext}
              onPrev={goToPrev}
              onNext={goToNext}
              current={priorityIdx + 1}
              total={todoPriorities.length}
            />
          )}
        </DialogContent>
      </Dialog>

      {priorityRemoval.dialog}
      {attentionRemoval.dialog}
      {prioritySnoozeReason.dialog}
      {attentionSnoozeReason.dialog}
    </div>
  );
}

function PriorityTabs({
  tab,
  onChange,
  todoCount,
  doneCount,
}: {
  tab: PriorityTab;
  onChange: (next: PriorityTab) => void;
  todoCount: number;
  doneCount: number;
}) {
  const tabs: { key: PriorityTab; label: string; count: number }[] = [
    { key: "todo", label: "Todo", count: todoCount },
    { key: "done", label: "Done", count: doneCount },
  ];
  return (
    <div
      role="tablist"
      aria-label="Filter suggested priorities"
      className="flex items-center gap-6 border-b border-border/60"
    >
      {tabs.map(({ key, label, count }) => {
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
              {label}
              <span
                className={cn(
                  "font-mono text-[11px] tabular-nums",
                  active ? "text-muted-foreground" : "text-muted-foreground/60"
                )}
              >
                {count}
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

function PriorityOverview({
  tab,
  onChange,
  todoItems,
  doneItems,
  onToggleDone,
  onSnoozeRequest,
  onRequestRemove,
  onOpen,
}: {
  tab: PriorityTab;
  onChange: (next: PriorityTab) => void;
  todoItems: BriefAttentionItem[];
  doneItems: BriefAttentionItem[];
  onToggleDone: (id: string) => void;
  onSnoozeRequest: (item: BriefAttentionItem) => void;
  onRequestRemove: (item: BriefAttentionItem) => void;
  onOpen?: (id: string) => void;
}) {
  const isBackOffice = useIsBackOffice();
  const visibleTodo = todoItems.slice(0, PRIORITY_OVERVIEW_LIMIT);
  const visible = tab === "todo" ? visibleTodo : doneItems;
  return (
    <section aria-label="Priority overview" className="space-y-3">
      <SectionTitle
        title="Priority overview"
        tooltip="The signals most likely to create operational problems today — sorted by urgency."
      />
      <PriorityTabs
        tab={tab}
        onChange={onChange}
        todoCount={visibleTodo.length}
        doneCount={doneItems.length}
      />
      {visible.length > 0 ? (
        <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
          {visible.map((item) => (
            <AttentionRow
              key={item.id}
              item={item}
              done={tab === "done"}
              onToggle={() => onToggleDone(item.id)}
              onSnooze={() => onSnoozeRequest(item)}
              isBackOffice={isBackOffice}
              onRequestRemove={() => onRequestRemove(item)}
              onOpen={onOpen ? () => onOpen(item.id) : undefined}
            />
          ))}
          {isBackOffice && tab === "todo" && (
            <li>
              <BackOfficeAddRow label="Add attention item" />
            </li>
          )}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground px-1 py-4">
          {tab === "todo"
            ? "Nothing pressing right now."
            : "Nothing marked handled yet."}
        </p>
      )}
    </section>
  );
}

function AttentionRow({
  item,
  done,
  onToggle,
  onSnooze,
  isBackOffice,
  onRequestRemove,
  onOpen,
}: {
  item: BriefAttentionItem;
  done: boolean;
  onToggle: () => void;
  onSnooze: () => void;
  isBackOffice: boolean;
  onRequestRemove: () => void;
  onOpen?: () => void;
}) {
  const CategoryIcon = ATTENTION_CATEGORY_ICON[item.category];
  const TitleBlock = (
    <>
      <p
        className={cn(
          "text-[15px] leading-snug font-medium text-foreground truncate",
          done && "line-through font-normal decoration-muted-foreground/40"
        )}
      >
        {item.headline}
      </p>
      {item.tone === "critical" && item.risk && !done && (
        <p className="mt-0.5 text-xs text-destructive truncate">{item.risk}</p>
      )}
    </>
  );
  return (
    <li
      className={cn(
        "group flex items-start gap-3.5 px-4 py-4 sm:px-5",
        TONE_ROW_BORDER[item.tone],
        done && "opacity-60"
      )}
    >
      <CategoryIcon
        aria-hidden
        className="h-5 w-5 mt-0.5 shrink-0 text-foreground/70"
        strokeWidth={2}
      />
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open details for ${item.headline}`}
          className="flex-1 min-w-0 text-left"
        >
          {TitleBlock}
        </button>
      ) : (
        <div className="flex-1 min-w-0">{TitleBlock}</div>
      )}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "group/done inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
            done
              ? "text-success hover:bg-success-subtle/70"
              : "text-foreground/80 hover:text-foreground hover:bg-muted/70"
          )}
        >
          <Check
            className={cn(
              "h-3 w-3 transition-opacity",
              done
                ? "opacity-100"
                : "opacity-0 -ml-3.5 group-hover/done:opacity-100 group-hover/done:ml-0"
            )}
            strokeWidth={2.5}
          />
          {done ? "Mark pending" : "Done"}
        </button>
        {!done && (
          <button
            type="button"
            onClick={onSnooze}
            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Not now
          </button>
        )}
      </div>
      {isBackOffice && (
        <BackOfficeRowActions
          label={item.headline}
          onDelete={onRequestRemove}
        />
      )}
    </li>
  );
}

function PriorityRow({
  priority,
  done,
  onToggle,
  onSnooze,
  onOpen,
  onRequestRemove,
}: {
  priority: BriefPriority;
  done: boolean;
  onToggle: () => void;
  onSnooze: () => void;
  onOpen: () => void;
  onRequestRemove: () => void;
}) {
  const ActionIcon = ACTION_ICON[priority.action.kind];
  const isCritical = priority.riskLevel === "critical";
  const isBackOffice = useIsBackOffice();
  return (
    <li
      className={cn(
        "group flex items-start gap-3.5 px-4 py-4 sm:px-5 sm:py-[18px] transition-opacity",
        done && "opacity-55"
      )}
    >
      <ActionIcon
        aria-hidden
        className="h-5 w-5 mt-0.5 shrink-0 text-foreground/70"
        strokeWidth={2}
      />
      <button
        type="button"
        onClick={onOpen}
        className="flex-1 min-w-0 text-left"
        aria-label={`Open details for ${priority.headline}`}
      >
        <span
          className={cn(
            "block text-[15px] leading-snug text-foreground truncate",
            done && "line-through decoration-muted-foreground/40"
          )}
        >
          {priority.headline}
        </span>
        {isCritical && priority.risk && (
          <span className="block mt-0.5 text-xs text-destructive truncate">
            {priority.risk}
          </span>
        )}
      </button>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "group/done inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
            done
              ? "text-success hover:bg-success-subtle/70"
              : "text-foreground/80 hover:text-foreground hover:bg-muted/70"
          )}
        >
          <Check
            className={cn(
              "h-3 w-3 transition-opacity",
              done
                ? "opacity-100"
                : "opacity-0 -ml-3.5 group-hover/done:opacity-100 group-hover/done:ml-0"
            )}
            strokeWidth={2.5}
          />
          {done ? "Mark pending" : "Done"}
        </button>
        {!done && (
          <button
            type="button"
            onClick={onSnooze}
            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Not now
          </button>
        )}
      </div>
      {isBackOffice && (
        <BackOfficeRowActions
          label={priority.headline}
          onDelete={onRequestRemove}
          className="shrink-0"
        />
      )}
    </li>
  );
}

function PriorityDetail({
  priority,
  done,
  onToggle,
  onSnooze,
  onClose,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  current,
  total,
}: {
  priority: BriefPriority;
  done: boolean;
  onToggle: () => void;
  onSnooze: () => void;
  onClose: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  current: number;
  total: number;
}) {
  const ActionIcon = ACTION_ICON[priority.action.kind];

  function handleDone() {
    onToggle();
    onClose();
  }

  const suggestions = (priority.pulsorSuggestions ?? []).slice(0, 2);

  return (
    <>
      {/* Accessible title/description (sr-only, Dialog needs them) */}
      <DialogTitle className="sr-only">{priority.headline}</DialogTitle>
      <DialogDescription className="sr-only">Priority detail</DialogDescription>

      {/* Nav strip — text buttons, readable for non-tech users */}
      <div className="flex items-center justify-between gap-2 px-4 sm:px-5 pt-3 pb-1 pr-12 shrink-0">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 -ml-1 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          Previous
        </button>
        <span className="text-sm text-muted-foreground/80 tabular-nums select-none">
          {current} of {total}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          Next
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      {/* Scrollable body — header lives inside for unified breathing */}
      <div className="flex-1 overflow-y-auto px-7 sm:px-9 pt-6 pb-10 min-h-0">
        {/* Header — icon + title only */}
        <div className="flex items-start gap-3.5">
          <ActionIcon
            aria-hidden
            className="h-5 w-5 mt-1 shrink-0 text-foreground/55"
            strokeWidth={1.75}
          />
          <h2 className="text-[20px] leading-snug font-medium text-foreground">
            {priority.headline}
          </h2>
        </div>

        {/* Short context — no label, aligned with title */}
        {priority.context && (
          <p className="mt-7 pl-[34px] text-[15px] leading-relaxed text-foreground/70">
            {priority.context}
          </p>
        )}

        {/* Risk line — red when critical, neutral otherwise */}
        {priority.risk && (
          <p
            className={cn(
              "mt-4 pl-[34px] text-[14px] leading-snug",
              priority.riskLevel === "critical"
                ? "text-destructive"
                : "text-foreground/70"
            )}
          >
            {priority.risk}
          </p>
        )}

        {/* Snapshot — Client / Amount / Zone / Due chips */}
        {priority.snapshot && priority.snapshot.length > 0 && (
          <dl className="mt-7 pl-[34px] flex flex-wrap gap-x-6 gap-y-3">
            {priority.snapshot.map((s, i) => (
              <div key={i} className="flex flex-col">
                <dt className="text-[11px] uppercase tracking-wide text-foreground/55">
                  {s.label}
                </dt>
                <dd className="text-[14px] text-foreground/85 mt-0.5">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* Suggested by Pulsor — max 2 bullets, calm */}
        {suggestions.length > 0 && (
          <div className="mt-9 pl-[34px]">
            <p className="text-[13px] font-medium text-foreground/65 mb-3">
              Suggested by Pulsor
            </p>
            <ul className="space-y-2.5">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[15px] text-foreground/85 leading-snug"
                >
                  <span
                    aria-hidden
                    className="mt-[9px] h-1 w-1 rounded-full bg-foreground/35 shrink-0"
                  />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action footer — Done as ghost with hover-pill effect */}
      <div className="border-t border-border/40 px-6 py-3.5 sm:px-7 shrink-0">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleDone}
            className={cn(
              "group/done inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              done
                ? "text-success hover:bg-success-subtle/70"
                : "text-foreground/80 hover:text-foreground hover:bg-muted/70"
            )}
          >
            <Check
              className={cn(
                "h-3.5 w-3.5 transition-opacity",
                done
                  ? "opacity-100"
                  : "opacity-0 -ml-4 group-hover/done:opacity-100 group-hover/done:ml-0"
              )}
              strokeWidth={2.5}
            />
            {done ? "Mark as pending" : "Done"}
          </button>
          {!done && (
            <button
              type="button"
              onClick={onSnooze}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Not now
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Real-tasks fetch hook (Assistant role only) ─────────────────────────

const REALTOR_TASKS_POLL_MS = 15_000;

function useMyTasks(
  enabled: boolean,
  realtorId?: string | null,
): {
  tasks: TaskRow[];
  refresh: () => void;
  refreshing: boolean;
} {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [tick, setTick] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => setTick((n) => n + 1);

  useEffect(() => {
    if (!enabled) {
      setTasks([]);
      return;
    }
    const token = getToken();
    if (!token) return;
    let cancelled = false;

    async function load() {
      setRefreshing(true);
      try {
        const res = await listMyTasks(token!, realtorId ?? undefined);
        if (!cancelled) setTasks(res.tasks);
      } catch {
        // silent — UI shows whatever was loaded before
      } finally {
        if (!cancelled) setRefreshing(false);
      }
    }

    load();
    const id = window.setInterval(load, REALTOR_TASKS_POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [enabled, realtorId, tick]);

  return { tasks, refresh, refreshing };
}

function usePickableRealtors(enabled: boolean): { realtors: UiRealtor[] } {
  const [realtors, setRealtors] = useState<UiRealtor[]>([]);

  useEffect(() => {
    if (!enabled) {
      setRealtors([]);
      return;
    }
    const token = getToken();
    if (!token) return;
    let cancelled = false;
    listRealtors(token)
      .then((res) => {
        if (cancelled) return;
        setRealtors(res.realtors.map(toUiRealtor));
      })
      .catch(() => {
        if (cancelled) return;
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { realtors };
}

// "Maxi (test)" -> "Maxi"; "Operador Uno" -> "Operador"; "  Jane " -> "Jane".
function pickFirstName(fullName: string): string {
  const cleaned = fullName.trim().split(/\s+/)[0] ?? "";
  return cleaned.replace(/[^A-Za-zÀ-ÿ-]/g, "") || fullName.trim();
}

// Combines the trash dialog's structured reasons + free text into a single
// string that gets persisted on tasks.dismissed_reason and captured in the
// decisions audit log by the PATCH /tasks/:id endpoint.
const REMOVE_REASON_LABEL: Record<RemoveReason, string> = {
  "not-relevant": "No longer relevant",
  duplicate: "Duplicate / already handled elsewhere",
  "wrong-ai-suggestion": "Incorrect AI suggestion",
  "low-priority": "Low priority / not worth tracking",
  other: "Other",
};

function formatRemoveReason(meta: RemoveMetadata): string {
  const labels = meta.selected_reasons.map((r) => REMOVE_REASON_LABEL[r]);
  const head = labels.join(", ");
  const custom = meta.custom_reason_text.trim();
  if (!head && !custom) return "removed";
  if (custom) return head ? `${head} — ${custom}` : custom;
  return head;
}

