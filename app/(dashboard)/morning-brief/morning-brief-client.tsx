"use client";

import { useState } from "react";
import {
  Check,
  Phone,
  MessageCircle,
  Send,
  CalendarPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
    <div className="px-4 sm:px-6 py-8 sm:py-12 lg:px-8 max-w-[720px] mx-auto space-y-10">
      <header>
        <h1 className="text-3xl sm:text-4xl font-medium text-foreground tracking-tight leading-tight">
          Good morning, {firstName} &#9728;&#65039;
        </h1>
      </header>

      <BriefSection title="Today needs your attention">
        <ul className="space-y-3">
          {brief.attention.map((item) => (
            <AttentionRow key={item.id} item={item} />
          ))}
        </ul>
      </BriefSection>

      <BriefSection title="Suggested priorities">
        <ul className="space-y-3">
          {brief.priorities.map((p) => (
            <PriorityRow
              key={p.id}
              priority={p}
              done={doneIds.has(p.id)}
              onToggle={() => toggleDone(p.id)}
            />
          ))}
        </ul>
      </BriefSection>

      <BriefSection title="Things already handled">
        <ul className="space-y-3">
          {brief.handled.map((h) => (
            <HandledRow key={h.id} item={h} />
          ))}
        </ul>
      </BriefSection>
    </div>
  );
}

function BriefSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

function AttentionRow({ item }: { item: BriefAttentionItem }) {
  const tone = item.tone ?? "warning";
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className={cn(
          "mt-2 h-1.5 w-1.5 rounded-full shrink-0",
          ATTENTION_DOT[tone]
        )}
      />
      <p className="text-base text-foreground leading-snug">{item.headline}</p>
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
        "flex items-start gap-3 transition-opacity",
        done && "opacity-55"
      )}
    >
      <button
        type="button"
        aria-label={done ? "Mark as pending" : "Mark as done"}
        onClick={onToggle}
        className={cn(
          "mt-1 h-4 w-4 rounded-md border inline-flex items-center justify-center shrink-0 transition-colors",
          done
            ? "bg-success border-success text-background"
            : "border-border text-muted-foreground/50 hover:border-foreground hover:text-foreground"
        )}
      >
        {done && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
      </button>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-base text-foreground leading-snug",
            done && "line-through"
          )}
        >
          {priority.headline}
        </p>
        {priority.context && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {priority.context}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
          "border border-border text-foreground hover:bg-muted/60"
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
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className="mt-0.5 h-4 w-4 rounded-full bg-success/15 text-success inline-flex items-center justify-center shrink-0"
      >
        <Check className="h-2.5 w-2.5" strokeWidth={3} />
      </span>
      <p className="text-base text-muted-foreground leading-snug">
        {item.headline}
      </p>
    </li>
  );
}
