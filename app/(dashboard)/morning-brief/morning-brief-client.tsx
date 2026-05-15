"use client";

import { useState } from "react";
import {
  Check,
  Phone,
  MessageCircle,
  Send,
  CalendarPlus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/dashboard/section-title";
import type {
  BriefAttentionItem,
  BriefAttentionTone,
  BriefHandled,
  BriefPriority,
  BriefPriorityAction,
  MorningBrief,
} from "@/lib/data/assistant-demo";

const ACTION_ICON: Record<BriefPriorityAction, typeof Phone> = {
  call: Phone,
  send: Send,
  message: MessageCircle,
  schedule: CalendarPlus,
};

const ATTENTION_DOT: Record<BriefAttentionTone, string> = {
  critical: "bg-destructive",
  warning: "bg-warning",
  neutral: "bg-success",
};

const ATTENTION_TAG_LABEL: Record<BriefAttentionTone, string> = {
  critical: "Delayed",
  warning: "Watch",
  neutral: "On track",
};

const ATTENTION_TAG_TEXT: Record<BriefAttentionTone, string> = {
  critical: "text-destructive",
  warning: "text-warning",
  neutral: "text-success",
};

export function MorningBriefClient({
  firstName,
  brief,
}: {
  firstName: string;
  brief: MorningBrief;
}) {
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());

  function toggleDone(id: string) {
    setDoneIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[900px] mx-auto space-y-6">
      {/* Hero */}
      <header>
        <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
          Good morning, {firstName} &#9728;&#65039;
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Here&apos;s your brief for today.
        </p>
      </header>

      {/* Section 1: Today needs your attention */}
      <section aria-label="Today needs your attention" className="space-y-2">
        <SectionTitle
          title="Today needs your attention"
          tooltip="What's moving, stuck, or warming up across your active clients."
        />
        <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
          {brief.attention.map((item) => (
            <AttentionRow key={item.id} item={item} />
          ))}
        </ul>
      </section>

      {/* Section 2: Suggested priorities */}
      <section aria-label="Suggested priorities" className="space-y-2">
        <SectionTitle
          title="Suggested priorities"
          tooltip="What I'd pick up first today."
          right={
            <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
              {brief.priorities.length - doneIds.size}{" "}
              of {brief.priorities.length}
            </span>
          }
        />
        <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
          {brief.priorities.map((p) => (
            <PriorityRow
              key={p.id}
              priority={p}
              done={doneIds.has(p.id)}
              onToggle={() => toggleDone(p.id)}
            />
          ))}
        </ul>
      </section>

      {/* Section 3: Already handled */}
      <section aria-label="Things already handled" className="space-y-2">
        <SectionTitle
          title="Things already handled"
          tooltip="Pulsor took care of these for you overnight."
          right={
            <Sparkles
              className="h-3.5 w-3.5 text-success"
              strokeWidth={2}
              fill="currentColor"
            />
          }
        />
        <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
          {brief.handled.map((h) => (
            <HandledRow key={h.id} item={h} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function AttentionRow({ item }: { item: BriefAttentionItem }) {
  const tone = item.tone ?? "warning";
  return (
    <li className="flex items-center gap-3 px-4 py-3.5">
      <span
        aria-hidden
        className={cn(
          "h-2 w-2 rounded-full shrink-0",
          ATTENTION_DOT[tone]
        )}
      />
      <p className="text-sm text-foreground flex-1 min-w-0 truncate">
        {item.headline}
      </p>
      <span
        className={cn(
          "font-mono text-[10px] font-semibold uppercase tracking-[0.08em] shrink-0",
          ATTENTION_TAG_TEXT[tone]
        )}
      >
        {ATTENTION_TAG_LABEL[tone]}
      </span>
    </li>
  );
}

function PriorityRow({
  priority,
  done,
  onToggle,
}: {
  priority: BriefPriority;
  done: boolean;
  onToggle: () => void;
}) {
  const ActionIcon = ACTION_ICON[priority.action.kind];
  return (
    <li
      className={cn(
        "flex items-start gap-3 px-4 py-3.5 transition-opacity",
        done && "opacity-55"
      )}
    >
      <button
        type="button"
        aria-label={done ? "Mark as pending" : "Mark as done"}
        onClick={onToggle}
        className={cn(
          "mt-0.5 h-5 w-5 rounded-md border inline-flex items-center justify-center shrink-0 transition-colors",
          done
            ? "bg-success border-success text-background"
            : "border-border text-muted-foreground/50 hover:border-foreground hover:text-foreground"
        )}
      >
        {done && <Check className="h-3 w-3" strokeWidth={2.5} />}
      </button>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm text-foreground",
            done && "line-through"
          )}
        >
          {priority.headline}
        </p>
        {priority.context && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {priority.context}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
          "bg-foreground text-background hover:bg-foreground/90"
        )}
      >
        <ActionIcon className="h-3.5 w-3.5" strokeWidth={2} />
        {priority.action.label}
      </button>
    </li>
  );
}

function HandledRow({ item }: { item: BriefHandled }) {
  return (
    <li className="flex items-center gap-3 px-4 py-3.5">
      <span
        aria-hidden
        className="h-5 w-5 rounded-full bg-success text-background inline-flex items-center justify-center shrink-0"
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
      <p className="text-sm text-muted-foreground flex-1 min-w-0 truncate">
        {item.headline}
      </p>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-success shrink-0">
        Done
      </span>
    </li>
  );
}
