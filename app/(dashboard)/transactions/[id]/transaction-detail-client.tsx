"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Check,
  AlertTriangle,
  XCircle,
  CircleCheck,
  Sparkles,
  Mic,
  MessageCircle,
  RefreshCcw,
  Cog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/dashboard/section-title";
import {
  RESPONSIBLE_LABEL,
  TRANSACTION_DOCUMENT_LABEL,
  TRANSACTION_PARTY_LABEL,
  type TimelineMilestone,
  type Transaction,
  type TransactionActivity,
  type TransactionActivityKind,
  type TransactionDocument,
  type TransactionDocumentStatus,
  type TransactionParty,
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

const DOC_STATUS_DOT: Record<TransactionDocumentStatus, string> = {
  received: "bg-success",
  pending: "bg-muted-foreground/40",
  overdue: "bg-destructive",
};

const DOC_STATUS_LABEL: Record<TransactionDocumentStatus, string> = {
  received: "Received",
  pending: "Pending",
  overdue: "Overdue",
};

const DOC_STATUS_TEXT: Record<TransactionDocumentStatus, string> = {
  received: "text-muted-foreground",
  pending: "text-muted-foreground/80",
  overdue: "text-destructive",
};

const ACTIVITY_ICON: Record<TransactionActivityKind, typeof Sparkles> = {
  ai: Sparkles,
  voice: Mic,
  crm: RefreshCcw,
  message: MessageCircle,
  system: Cog,
};

const ACTIVITY_TONE: Record<TransactionActivityKind, string> = {
  ai: "text-success",
  voice: "text-foreground/70",
  crm: "text-foreground/70",
  message: "text-foreground/70",
  system: "text-muted-foreground",
};

export function TransactionDetailClient({
  transaction,
}: {
  transaction: Transaction;
}) {
  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[900px] mx-auto space-y-8">
      <Link
        href="/transactions"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        All transactions
      </Link>

      <Header transaction={transaction} />

      {transaction.aiSummary && (
        <AISummarySection
          summary={transaction.aiSummary}
          status={transaction.status}
        />
      )}

      {transaction.criticalActions && transaction.criticalActions.length > 0 && (
        <CriticalActionsSection actions={transaction.criticalActions} />
      )}

      <TimelineSection
        milestones={transaction.timeline}
        closingDate={transaction.closingDate}
      />

      {transaction.parties && transaction.parties.length > 0 && (
        <PartiesSection parties={transaction.parties} />
      )}

      {transaction.documents && transaction.documents.length > 0 && (
        <DocumentsSection documents={transaction.documents} />
      )}

      {transaction.activity && transaction.activity.length > 0 && (
        <ActivitySection activity={transaction.activity} />
      )}
    </div>
  );
}

function Header({ transaction: t }: { transaction: Transaction }) {
  const StatusIcon = STATUS_ICON[t.status];
  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
            {t.address}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t.type === "buyer" ? "Buyer" : "Seller"} ·{" "}
            <span className="text-foreground">{t.client}</span>
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0",
            STATUS_BG[t.status],
            STATUS_TEXT[t.status]
          )}
        >
          <StatusIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
          {STATUS_LABEL[t.status]}
          {t.statusReason && (
            <span className="font-normal text-muted-foreground ml-1">
              · {t.statusReason}
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full transition-all", STATUS_BAR[t.status])}
            style={{ width: `${t.progressPct}%` }}
          />
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
          {t.progressPct}%
        </span>
      </div>

      <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          Closing expected{" "}
          <span className="text-foreground">{t.closingDate}</span>
        </span>
        <span className="text-foreground/30">·</span>
        <span>
          Next:{" "}
          <span className="text-foreground">{t.nextStep}</span> ·{" "}
          {t.dueLabel}
        </span>
        <span className="text-foreground/30">·</span>
        <span className="text-foreground/70">
          {RESPONSIBLE_LABEL[t.responsible]}
        </span>
      </div>
    </header>
  );
}

function AISummarySection({
  summary,
  status,
}: {
  summary: NonNullable<Transaction["aiSummary"]>;
  status: TransactionStatus;
}) {
  const isHealthy = status === "on-track";
  return (
    <section aria-label="AI summary" className="space-y-2.5">
      <SectionTitle
        title="AI summary"
        tooltip="A short read on the deal's health right now — pulled from CRM activity, messages, and calendar signals."
      />
      <div className="rounded-xl border border-border bg-card px-4 py-4 sm:px-5">
        <div className="flex items-start gap-2.5">
          <Sparkles
            className="h-4 w-4 mt-0.5 shrink-0 text-success"
            strokeWidth={2}
            fill="currentColor"
          />
          <p className="text-[15px] leading-relaxed text-foreground/90">
            {summary.headline}
          </p>
        </div>
        {(summary.blocker || summary.nextAction) && (
          <div className="mt-4 grid sm:grid-cols-2 gap-4 pt-4 border-t border-border/60">
            {summary.blocker && (
              <DetailField label="Current blocker">
                <p
                  className={cn(
                    "text-sm leading-snug",
                    isHealthy ? "text-foreground/85" : "text-destructive"
                  )}
                >
                  {summary.blocker}
                </p>
              </DetailField>
            )}
            {summary.nextAction && (
              <DetailField label="Suggested next">
                <p className="text-sm leading-snug text-foreground/85">
                  {summary.nextAction}
                </p>
              </DetailField>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function CriticalActionsSection({
  actions,
}: {
  actions: NonNullable<Transaction["criticalActions"]>;
}) {
  return (
    <section aria-label="Next critical actions" className="space-y-2.5">
      <SectionTitle
        title="Next critical actions"
        tooltip="The few moves that actually unblock this deal — not a generic checklist."
      />
      <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
        {actions.map((a, idx) => (
          <li
            key={a.id}
            className="flex items-start gap-3 px-4 py-3.5 sm:px-5"
          >
            <span
              aria-hidden
              className="mt-0.5 h-5 w-5 rounded-md border border-border inline-flex items-center justify-center shrink-0 font-mono text-[11px] text-muted-foreground"
            >
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] leading-snug text-foreground">
                {a.label}
              </p>
              {a.rationale && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {a.rationale}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TimelineSection({
  milestones,
  closingDate,
}: {
  milestones: TimelineMilestone[];
  closingDate: string;
}) {
  const [open, setOpen] = useState(false);
  const currentIdx = milestones.findIndex((m) => m.state === "current");
  const summary =
    currentIdx >= 0
      ? `${milestones[currentIdx].label} · ${currentIdx + 1} of ${milestones.length}`
      : `${milestones.length} milestones`;
  return (
    <section aria-label="Timeline">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 py-1.5 group text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-1.5">
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform",
              open ? "rotate-0" : "-rotate-90"
            )}
            strokeWidth={2}
          />
          <h2 className="text-lg font-medium text-foreground tracking-tight">
            Timeline
          </h2>
          <span className="text-xs text-muted-foreground">· {summary}</span>
        </div>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground shrink-0">
          Closing · {closingDate}
        </span>
      </button>
      {open && (
        <ol className="mt-3 rounded-xl bg-muted/30 border border-border/60 p-4 space-y-2">
          {milestones.map((m) => (
            <TimelineRow key={m.id} milestone={m} />
          ))}
        </ol>
      )}
    </section>
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

function TimelineDot({ state }: { state: TimelineMilestone["state"] }) {
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

function PartiesSection({ parties }: { parties: TransactionParty[] }) {
  return (
    <section aria-label="Parties involved" className="space-y-2.5">
      <SectionTitle
        title="Parties"
        tooltip="Everyone touching this deal — last interaction shown when known."
      />
      <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
        {parties.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-3.5 px-4 py-3 sm:px-5"
          >
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85 shrink-0 w-[96px]">
              {TRANSACTION_PARTY_LABEL[p.role]}
            </span>
            <span className="text-sm text-foreground flex-1 min-w-0 truncate">
              {p.name}
            </span>
            {p.lastInteraction && (
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground/80 shrink-0">
                {p.lastInteraction}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function DocumentsSection({
  documents,
}: {
  documents: TransactionDocument[];
}) {
  return (
    <section aria-label="Documents" className="space-y-2.5">
      <SectionTitle
        title="Documents"
        tooltip="Key artifacts tied to this transaction. Pulsor flags overdue ones."
      />
      <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
        {documents.map((d) => (
          <li
            key={d.id}
            className="flex items-center gap-3 px-4 py-3 sm:px-5"
          >
            <span
              aria-hidden
              className={cn(
                "h-2 w-2 rounded-full shrink-0",
                DOC_STATUS_DOT[d.status]
              )}
            />
            <span className="text-sm text-foreground flex-1 min-w-0 truncate">
              {TRANSACTION_DOCUMENT_LABEL[d.kind]}
            </span>
            <span
              className={cn(
                "text-xs shrink-0",
                DOC_STATUS_TEXT[d.status]
              )}
            >
              {DOC_STATUS_LABEL[d.status]}
            </span>
            {d.whenLabel && (
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground/70 shrink-0 w-[88px] text-right">
                {d.whenLabel}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ActivitySection({
  activity,
}: {
  activity: TransactionActivity[];
}) {
  return (
    <section aria-label="Activity" className="space-y-2.5">
      <SectionTitle
        title="Activity"
        tooltip="Chronological feed of voice notes, CRM events, AI flags, and messages."
      />
      <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
        {activity.map((a) => {
          const Icon = ACTIVITY_ICON[a.kind];
          return (
            <li
              key={a.id}
              className="flex items-start gap-3 px-4 py-3.5 sm:px-5"
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5 mt-0.5 shrink-0",
                  ACTIVITY_TONE[a.kind]
                )}
                strokeWidth={2}
                fill={a.kind === "ai" ? "currentColor" : "none"}
              />
              <p className="text-sm leading-snug text-foreground/85 flex-1 min-w-0">
                {a.text}
              </p>
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground/70 shrink-0">
                {a.whenLabel}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
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
