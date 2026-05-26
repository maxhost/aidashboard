"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { celebrate } from "@/lib/celebrate";
import {
  Check,
  Phone,
  MessageCircle,
  Send,
  CalendarPlus,
  Key,
  FileText,
  Home as HomeIcon,
  Banknote,
  ClipboardCheck,
  Handshake,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/dashboard/section-title";
import {
  BackOfficeAddRow,
  BackOfficeRowActions,
} from "@/components/dashboard/back-office-controls";
import { useIsBackOffice } from "@/components/dashboard/use-role";
import { useRemoveWithReason } from "@/components/dashboard/use-remove-with-reason";
import { useSnoozeWithReason } from "@/components/dashboard/use-snooze-with-reason";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  brief,
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

  const subtitle = useMemo(() => buildBriefSubtitle(brief), [brief]);
  const active = useMemo(() => prioritizeAttention(brief.attention), [brief]);

  const isBackOffice = useIsBackOffice();
  const priorityRemoval = useRemoveWithReason<BriefPriority>({
    itemType: "priority",
    getDisplayName: (p) => p.headline,
  });
  const attentionRemoval = useRemoveWithReason<BriefAttentionItem>({
    itemType: "attention",
    getDisplayName: (a) => a.headline,
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
    onSnooze: (p) => {
      snoozePriority(p.id);
      setSelectedId((current) => (current === p.id ? null : current));
    },
  });
  const attentionSnoozeReason = useSnoozeWithReason<BriefAttentionItem>({
    itemType: "attention",
    getDisplayName: (a) => a.headline,
    onSnooze: (a) => snoozeAttention(a.id),
  });
  const lastCelebratedRef = useRef(0);
  const totalDone = doneIds.size + attentionDoneIds.size;

  useEffect(() => {
    // Trigger a small celebration every 3rd completion (3, 6, 9, ...).
    // Reset the milestone if the user un-checks something so a re-cross
    // still feels rewarding.
    if (totalDone === 0) {
      lastCelebratedRef.current = 0;
      return;
    }
    if (totalDone > lastCelebratedRef.current && totalDone % 3 === 0) {
      const intensity = totalDone >= 9 ? 3 : totalDone >= 6 ? 2 : 1;
      celebrate(intensity);
      lastCelebratedRef.current = totalDone;
    } else if (totalDone < lastCelebratedRef.current) {
      lastCelebratedRef.current = totalDone;
    }
  }, [totalDone]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [priorityTab, setPriorityTab] = useState<PriorityTab>("todo");
  const [attentionTab, setAttentionTab] = useState<PriorityTab>("todo");
  const selectedPriority =
    brief.priorities.find((p) => p.id === selectedId) ?? null;
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
  }

  function snoozeAttention(id: string) {
    setAttentionSnoozedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  function toggleDone(id: string) {
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
  }

  function snoozePriority(id: string) {
    setSnoozedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[900px] mx-auto space-y-8">
      {/* Hero — greeting + contextual operational subtitle */}
      <header>
        <h1
          suppressHydrationWarning
          className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight"
        >
          {GREETING_LABEL[period]}, {firstName}{" "}
          <span aria-hidden className="ml-0.5 align-[-2px] text-[0.9em]">
            {GREETING_EMOJI[period]}
          </span>
        </h1>
        <p className="text-base lg:text-lg text-foreground/75 mt-2 leading-snug max-w-[640px]">
          {subtitle}
        </p>
      </header>

      {/* Priority overview — live, sorted by urgency, top items only */}
      <PriorityOverview
        tab={attentionTab}
        onChange={setAttentionTab}
        todoItems={todoAttention}
        doneItems={doneAttention}
        onToggleDone={toggleAttentionDone}
        onSnoozeRequest={attentionSnoozeReason.request}
        onRequestRemove={attentionRemoval.requestRemove}
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

      <Sheet
        open={!!selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      >
        <SheetContent className="w-full sm:max-w-md p-0 gap-0">
          {selectedPriority && (
            <PriorityDetail
              key={selectedPriority.id}
              priority={selectedPriority}
              done={doneIds.has(selectedPriority.id)}
              onToggle={() => toggleDone(selectedPriority.id)}
              onSnooze={() => prioritySnoozeReason.request(selectedPriority)}
              onClose={() => setSelectedId(null)}
            />
          )}
        </SheetContent>
      </Sheet>

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
}: {
  tab: PriorityTab;
  onChange: (next: PriorityTab) => void;
  todoItems: BriefAttentionItem[];
  doneItems: BriefAttentionItem[];
  onToggleDone: (id: string) => void;
  onSnoozeRequest: (item: BriefAttentionItem) => void;
  onRequestRemove: (item: BriefAttentionItem) => void;
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
}: {
  item: BriefAttentionItem;
  done: boolean;
  onToggle: () => void;
  onSnooze: () => void;
  isBackOffice: boolean;
  onRequestRemove: () => void;
}) {
  const CategoryIcon = ATTENTION_CATEGORY_ICON[item.category];
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
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-[15px] leading-snug font-medium text-foreground truncate",
            done && "line-through font-normal decoration-muted-foreground/40"
          )}
        >
          {item.headline}
        </p>
        {item.tone === "critical" && item.risk && !done && (
          <p className="mt-0.5 text-xs text-destructive truncate">
            {item.risk}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "group/done inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
            done
              ? "text-success hover:bg-success-subtle/70"
              : "text-foreground/80 hover:text-foreground hover:bg-muted/80"
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
          Done
        </button>
        {!done && (
          <button
            type="button"
            onClick={onSnooze}
            className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground/65 hover:text-foreground/80 hover:bg-muted/50 transition-colors"
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
      <div className="flex items-center gap-0.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
            done
              ? "text-success hover:bg-success-subtle/60"
              : "text-muted-foreground/85 hover:text-foreground hover:bg-muted/50"
          )}
        >
          {done && <Check className="h-3 w-3" strokeWidth={2.5} />}
          {done ? "Done" : "Done"}
        </button>
        {!done && (
          <button
            type="button"
            onClick={onSnooze}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-muted-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors"
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
}: {
  priority: BriefPriority;
  done: boolean;
  onToggle: () => void;
  onSnooze: () => void;
  onClose: () => void;
}) {
  const ActionIcon = ACTION_ICON[priority.action.kind];
  const isCritical = priority.riskLevel === "critical";

  function handleDone() {
    onToggle();
    onClose();
  }

  return (
    <>
      <SheetHeader className="text-left px-5 pt-5 sm:px-6 sm:pt-6 gap-2">
        <div className="flex items-center gap-1.5">
          <ActionIcon
            className="h-3.5 w-3.5 text-muted-foreground/85 shrink-0"
            strokeWidth={2}
          />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85">
            {priority.action.label}
          </span>
          {isCritical && (
            <>
              <span aria-hidden className="text-muted-foreground/30">
                ·
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-destructive">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-destructive" />
                At risk
              </span>
            </>
          )}
        </div>
        <SheetTitle className="text-[19px] leading-snug font-medium text-foreground">
          {priority.headline}
        </SheetTitle>
        <SheetDescription className="sr-only">
          Priority detail
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-5 sm:px-6 pb-6 space-y-6">
        {priority.context && (
          <DetailField label="Why this matters">
            <p className="text-sm text-foreground/85 leading-relaxed">
              {priority.context}
            </p>
          </DetailField>
        )}

        {priority.risk && (
          <DetailField label="Risk if untouched today">
            <p
              className={cn(
                "text-sm leading-relaxed",
                isCritical ? "text-destructive" : "text-foreground/70"
              )}
            >
              {priority.risk}
            </p>
          </DetailField>
        )}

        {priority.pulsorSuggestions && priority.pulsorSuggestions.length > 0 && (
          <DetailField label="Pulsor suggestions">
            <ul className="space-y-2">
              {priority.pulsorSuggestions.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-foreground/85 leading-snug"
                >
                  <Sparkles
                    aria-hidden
                    className="h-3.5 w-3.5 mt-0.5 shrink-0 text-success"
                    strokeWidth={2}
                    fill="currentColor"
                  />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </DetailField>
        )}

        {priority.snapshot && priority.snapshot.length > 0 && (
          <DetailField label="Context snapshot">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 rounded-lg border border-border/70 bg-muted/20 px-3.5 py-3">
              {priority.snapshot.map((s) => (
                <li key={s.label} className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground/70">
                    {s.label}
                  </div>
                  <div className="text-sm text-foreground truncate">
                    {s.value}
                  </div>
                </li>
              ))}
            </ul>
          </DetailField>
        )}
      </div>

      <div className="border-t border-border bg-muted/20 px-5 py-3 sm:px-6">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={onSnooze}
            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground/80 hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={handleDone}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-foreground hover:bg-muted/70 transition-colors"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.25} />
            {done ? "Mark as pending" : "Done"}
          </button>
        </div>
      </div>
    </>
  );
}

function DetailField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/75 mb-1.5">
        {label}
      </div>
      {children}
    </div>
  );
}

