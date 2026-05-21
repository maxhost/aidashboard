"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Phone,
  MessageCircle,
  Send,
  CalendarPlus,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/dashboard/section-title";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ATTENTION_CATEGORY_LABEL,
  GREETING_LABEL,
  buildBriefSubtitle,
  getGreetingPeriod,
  prioritizeAttention,
  type BriefAttentionItem,
  type BriefAttentionTone,
  type BriefHandled,
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

const TONE_DOT: Record<BriefAttentionTone, string> = {
  critical: "bg-destructive",
  warning: "bg-warning",
  neutral: "bg-success",
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

  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [priorityTab, setPriorityTab] = useState<PriorityTab>("todo");
  const selectedPriority =
    brief.priorities.find((p) => p.id === selectedId) ?? null;
  const todoPriorities = useMemo(
    () => brief.priorities.filter((p) => !doneIds.has(p.id)),
    [brief.priorities, doneIds]
  );
  const donePriorities = useMemo(
    () => brief.priorities.filter((p) => doneIds.has(p.id)),
    [brief.priorities, doneIds]
  );
  const visiblePriorities =
    priorityTab === "todo" ? todoPriorities : donePriorities;

  function toggleDone(id: string) {
    setDoneIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
      <PriorityOverview active={active} />

      {/* Earlier — collapsed by default */}
      {brief.earlier.length > 0 && <EarlierBlock items={brief.earlier} />}

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
                onOpen={() => setSelectedId(p.id)}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground px-1 py-6">
            {priorityTab === "todo"
              ? "Nothing left for today. Clean run."
              : "Nothing marked done yet."}
          </p>
        )}
      </section>

      {/* Already handled — compact, secondary */}
      <HandledBlock items={brief.handled} />

      <Sheet
        open={!!selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      >
        <SheetContent className="w-full sm:max-w-md">
          {selectedPriority && (
            <PriorityDetail
              priority={selectedPriority}
              done={doneIds.has(selectedPriority.id)}
              onToggle={() => toggleDone(selectedPriority.id)}
            />
          )}
        </SheetContent>
      </Sheet>
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

function PriorityOverview({ active }: { active: BriefAttentionItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const top = active.slice(0, PRIORITY_OVERVIEW_LIMIT);
  const rest = active.slice(PRIORITY_OVERVIEW_LIMIT);
  const visible = expanded ? active : top;
  return (
    <section aria-label="Priority overview" className="space-y-2.5">
      <SectionTitle
        title="Priority overview"
        tooltip="What's blocking, at risk, or actionable today — ordered by urgency."
      />
      <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
        {visible.map((item) => (
          <AttentionRow key={item.id} item={item} />
        ))}
      </ul>
      {rest.length > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="inline-flex items-center gap-1.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          aria-expanded={expanded}
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              expanded ? "rotate-180" : "rotate-0"
            )}
            strokeWidth={2}
          />
          <span>
            {expanded ? "Show top priorities only" : `Show ${rest.length} more`}
          </span>
        </button>
      )}
    </section>
  );
}

function AttentionRow({ item }: { item: BriefAttentionItem }) {
  return (
    <li className="flex items-center gap-3.5 px-4 py-4 sm:px-5">
      <span
        aria-hidden
        className={cn(
          "h-2.5 w-2.5 rounded-full shrink-0",
          TONE_DOT[item.tone]
        )}
      />
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85 shrink-0 w-[96px]">
        {ATTENTION_CATEGORY_LABEL[item.category]}
      </span>
      <p className="text-[15px] leading-snug text-foreground flex-1 min-w-0 truncate">
        {item.headline}
      </p>
    </li>
  );
}

function PriorityRow({
  priority,
  done,
  onToggle,
  onOpen,
}: {
  priority: BriefPriority;
  done: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const ActionIcon = ACTION_ICON[priority.action.kind];
  const isCritical = priority.riskLevel === "critical";
  return (
    <li
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 transition-opacity",
        done && "opacity-55"
      )}
    >
      <button
        type="button"
        aria-label={done ? "Mark as pending" : "Mark as done"}
        onClick={onToggle}
        className={cn(
          "h-5 w-5 rounded-md border inline-flex items-center justify-center shrink-0 transition-colors",
          done
            ? "bg-success border-success text-background"
            : "border-border text-muted-foreground/50 hover:border-foreground hover:text-foreground"
        )}
      >
        {done && <Check className="h-3 w-3" strokeWidth={2.5} />}
      </button>
      <button
        type="button"
        onClick={onOpen}
        className="group flex-1 min-w-0 text-left"
        aria-label={`Open details for ${priority.headline}`}
      >
        <span
          className={cn(
            "block text-[15px] leading-snug text-foreground truncate decoration-muted-foreground/30 underline-offset-2 group-hover:underline",
            done && "line-through"
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
      <button
        type="button"
        onClick={onToggle}
        className="shrink-0 inline-flex items-center justify-center gap-1.5 min-w-[96px] px-3 py-1.5 rounded-md text-xs font-medium bg-success-subtle text-success hover:bg-success-subtle/70 transition-colors"
      >
        <ActionIcon className="h-3.5 w-3.5" strokeWidth={2} />
        {priority.action.label}
      </button>
    </li>
  );
}

function PriorityDetail({
  priority,
  done,
  onToggle,
}: {
  priority: BriefPriority;
  done: boolean;
  onToggle: () => void;
}) {
  const ActionIcon = ACTION_ICON[priority.action.kind];
  const isCritical = priority.riskLevel === "critical";
  return (
    <>
      <SheetHeader className="text-left">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {priority.action.label}
          </span>
          {isCritical && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-destructive">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
              At risk
            </span>
          )}
        </div>
        <SheetTitle className="text-lg leading-snug">
          {priority.headline}
        </SheetTitle>
        <SheetDescription className="sr-only">
          Suggested priority details
        </SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-5">
        {priority.context && (
          <DetailField label="Why now">
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
                isCritical
                  ? "text-destructive"
                  : "text-foreground/70"
              )}
            >
              {priority.risk}
            </p>
          </DetailField>
        )}
      </div>

      <div className="mt-8 flex gap-2">
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium bg-success-subtle text-success hover:bg-success-subtle/70 transition-colors"
        >
          <ActionIcon className="h-4 w-4" strokeWidth={2} />
          {priority.action.label}
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-medium border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
        >
          {done ? "Mark as pending" : "Mark done"}
        </button>
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

function EarlierBlock({ items }: { items: BriefAttentionItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <section aria-label="Earlier this week">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center gap-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={open}
      >
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open ? "rotate-0" : "-rotate-90"
          )}
          strokeWidth={2}
        />
        <span>Earlier this week</span>
        <span className="font-mono tabular-nums text-muted-foreground/60">
          ({items.length})
        </span>
      </button>
      {open && (
        <ul className="mt-2 rounded-xl border border-border/70 bg-card/60 divide-y divide-border/50 overflow-hidden">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 px-4 py-2.5 text-muted-foreground"
            >
              <span
                aria-hidden
                className={cn(
                  "h-1.5 w-1.5 rounded-full shrink-0 opacity-60",
                  TONE_DOT[item.tone]
                )}
              />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60 shrink-0 w-[88px]">
                {ATTENTION_CATEGORY_LABEL[item.category]}
              </span>
              <p className="text-xs flex-1 min-w-0 truncate">
                {item.headline}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function HandledBlock({ items }: { items: BriefHandled[] }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;
  return (
    <section aria-label="Already handled" className="pt-2 border-t border-border/50">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center gap-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={open}
      >
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open ? "rotate-0" : "-rotate-90"
          )}
          strokeWidth={2}
        />
        <span>Already handled</span>
        <span className="font-mono tabular-nums text-muted-foreground/60">
          ({items.length})
        </span>
      </button>
      {open && (
        <ul className="mt-1.5 space-y-1">
          {items.map((h) => (
            <li
              key={h.id}
              className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-muted-foreground"
            >
              <Check
                className="h-3 w-3 text-success/80 shrink-0"
                strokeWidth={2.5}
              />
              <span className="flex-1 min-w-0 truncate">{h.headline}</span>
              {h.whenLabel && (
                <span className="font-mono text-[10px] text-muted-foreground/60 shrink-0">
                  {h.whenLabel}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
