"use client";

import { useState } from "react";
import { Check, ChevronDown, AlertTriangle, XCircle, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RESPONSIBLE_LABEL,
  type TimelineMilestone,
  type Transaction,
  type TransactionStatus,
} from "@/lib/data/assistant-demo";

const STATUS_LABEL: Record<TransactionStatus, string> = {
  "on-track": "On track",
  "at-risk": "At risk",
  delayed: "Delayed",
};

const STATUS_TEXT: Record<TransactionStatus, string> = {
  "on-track": "text-success",
  "at-risk": "text-warning",
  delayed: "text-destructive",
};

const STATUS_BG: Record<TransactionStatus, string> = {
  "on-track": "bg-success-subtle",
  "at-risk": "bg-warning-subtle",
  delayed: "bg-destructive/15",
};

const STATUS_BAR: Record<TransactionStatus, string> = {
  "on-track": "bg-success",
  "at-risk": "bg-warning",
  delayed: "bg-destructive",
};

const STATUS_ICON: Record<TransactionStatus, typeof CircleCheck> = {
  "on-track": CircleCheck,
  "at-risk": AlertTriangle,
  delayed: XCircle,
};

export function TransactionsClient({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const atRiskCount = transactions.filter(
    (t) => t.status === "at-risk" || t.status === "delayed"
  ).length;

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1000px] mx-auto space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
          Transactions
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          {transactions.length} active closings
          {atRiskCount > 0 && (
            <>
              ,{" "}
              <span className="text-warning font-medium">
                {atRiskCount} need attention
              </span>
            </>
          )}
          .
        </p>
      </header>

      <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
        {transactions.map((t) => {
          const isOpen = expanded.has(t.id);
          const StatusIcon = STATUS_ICON[t.status];
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => toggle(t.id)}
                className="w-full text-left px-4 sm:px-5 py-4 hover:bg-muted/40 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                  {/* Address + client */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground truncate">
                        {t.address}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        · {t.client}
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-center gap-3">
                      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all",
                            STATUS_BAR[t.status]
                          )}
                          style={{ width: `${t.progressPct}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0 w-10 text-right">
                        {t.progressPct}%
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Next:{" "}
                      <span className="text-foreground">{t.nextStep}</span>
                      <span className="mx-1.5 text-foreground/30">·</span>
                      <span>{t.dueLabel}</span>
                      <span className="mx-1.5 text-foreground/30">·</span>
                      <span className="text-foreground/70">
                        {RESPONSIBLE_LABEL[t.responsible]}
                      </span>
                    </div>
                  </div>

                  {/* Status badge + chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium",
                        STATUS_BG[t.status],
                        STATUS_TEXT[t.status]
                      )}
                    >
                      <StatusIcon className="h-3 w-3" strokeWidth={2.25} />
                      {STATUS_LABEL[t.status]}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform shrink-0",
                        isOpen && "rotate-180"
                      )}
                      strokeWidth={1.75}
                    />
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 -mt-1">
                  <div className="rounded-lg bg-muted/30 border border-border/60 p-4">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Timeline
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                        Closing · {t.closingDate}
                      </span>
                    </div>
                    <ol className="space-y-2">
                      {t.timeline.map((m) => (
                        <TimelineRow key={m.id} milestone={m} />
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TimelineRow({ milestone }: { milestone: TimelineMilestone }) {
  return (
    <li className="flex items-center gap-3">
      <TimelineDot state={milestone.state} />
      <span
        className={cn(
          "text-sm flex-1",
          milestone.state === "future"
            ? "text-muted-foreground"
            : "text-foreground"
        )}
      >
        {milestone.label}
      </span>
      {milestone.date && (
        <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
          {milestone.date}
        </span>
      )}
    </li>
  );
}

function TimelineDot({
  state,
}: {
  state: TimelineMilestone["state"];
}) {
  if (state === "done") {
    return (
      <span
        aria-label="Done"
        className="h-4 w-4 rounded-full bg-success text-background inline-flex items-center justify-center shrink-0"
      >
        <Check className="h-2.5 w-2.5" strokeWidth={3} />
      </span>
    );
  }
  if (state === "current") {
    return (
      <span
        aria-label="In progress"
        className="h-4 w-4 rounded-full bg-foreground inline-flex items-center justify-center shrink-0 ring-4 ring-foreground/10"
      >
        <span className="h-1 w-1 rounded-full bg-background" />
      </span>
    );
  }
  return (
    <span
      aria-label="Pending"
      className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 bg-background shrink-0 inline-block"
    />
  );
}
