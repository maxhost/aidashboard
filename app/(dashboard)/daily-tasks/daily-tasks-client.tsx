"use client";

import { useState } from "react";
import { Check, Phone, MessageCircle, Send, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DailyTask, TaskUrgency } from "@/lib/data/assistant-demo";

const URGENCY_BAR: Record<TaskUrgency, string> = {
  urgent: "bg-destructive",
  today: "bg-warning",
  "this-week": "bg-muted-foreground/40",
};

const URGENCY_LABEL: Record<TaskUrgency, string> = {
  urgent: "Urgent",
  today: "Today",
  "this-week": "This week",
};

const URGENCY_TEXT: Record<TaskUrgency, string> = {
  urgent: "text-destructive",
  today: "text-warning",
  "this-week": "text-muted-foreground",
};

const ACTION_ICON = {
  call: Phone,
  message: MessageCircle,
  send: Send,
  done: Check,
} as const;

export function DailyTasksClient({
  firstName,
  tasks,
  urgentCount,
}: {
  firstName: string;
  tasks: DailyTask[];
  urgentCount: number;
}) {
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());

  const pendingCount = tasks.length - doneIds.size;
  const pendingUrgent = tasks.filter(
    (t) => t.urgency === "urgent" && !doneIds.has(t.id)
  ).length;

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
      <header>
        <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
          Good morning, {firstName} &#9728;&#65039;
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          You have{" "}
          <span className="text-foreground font-medium">{pendingCount}</span>{" "}
          {pendingCount === 1 ? "thing" : "things"} to do today
          {pendingUrgent > 0 && (
            <>
              ,{" "}
              <span className="text-destructive font-medium">
                {pendingUrgent} urgent
              </span>
            </>
          )}
          .
        </p>
      </header>

      <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
        {tasks.map((t) => {
          const done = doneIds.has(t.id);
          const ActionIcon = ACTION_ICON[t.primaryAction.kind];
          return (
            <li key={t.id} className="relative">
              <span
                aria-label={URGENCY_LABEL[t.urgency]}
                title={URGENCY_LABEL[t.urgency]}
                className={cn(
                  "absolute left-0 top-2 bottom-2 w-[3px] rounded-r-sm",
                  URGENCY_BAR[t.urgency]
                )}
              />
              <div
                className={cn(
                  "flex items-start gap-3 pl-5 pr-4 py-3.5 transition-colors",
                  done && "opacity-55"
                )}
              >
                {/* Done checkbox */}
                <button
                  type="button"
                  aria-label={done ? "Mark as pending" : "Mark as done"}
                  onClick={() => toggleDone(t.id)}
                  className={cn(
                    "mt-0.5 h-5 w-5 inline-flex items-center justify-center rounded-md border shrink-0 transition-colors",
                    done
                      ? "bg-success border-success text-background"
                      : "border-border text-muted-foreground/50 hover:border-foreground hover:text-foreground"
                  )}
                >
                  {done && <Check className="h-3 w-3" strokeWidth={2.5} />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span
                      className={cn(
                        "font-mono text-[10px] font-semibold uppercase tracking-[0.08em]",
                        URGENCY_TEXT[t.urgency]
                      )}
                    >
                      {URGENCY_LABEL[t.urgency]}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {t.client}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-sm text-foreground mt-0.5",
                      done && "line-through"
                    )}
                  >
                    {t.action}
                  </p>
                  {t.context && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.context}
                    </p>
                  )}
                </div>

                {/* Primary quick action */}
                <button
                  type="button"
                  onClick={() => {
                    if (t.primaryAction.kind === "done") toggleDone(t.id);
                  }}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors",
                    "bg-foreground text-background border-foreground hover:bg-foreground/90",
                    done && "opacity-60"
                  )}
                >
                  <ActionIcon className="h-3.5 w-3.5" strokeWidth={2} />
                  {t.primaryAction.label}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Secondary actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          View all tasks
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Add a task
        </button>
      </div>
    </div>
  );
}
