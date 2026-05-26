"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  AlertTriangle,
  XCircle,
  CircleCheck,
  ArrowUp,
  Calendar,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/dashboard/section-title";
import {
  BackOfficeAddRow,
  BackOfficeRowActions,
} from "@/components/dashboard/back-office-controls";
import { useIsBackOffice } from "@/components/dashboard/use-role";
import { useRemoveWithReason } from "@/components/dashboard/use-remove-with-reason";
import {
  OPS_TASK_OWNER_ASSIGNEE,
  OPS_TASK_STATUS_LABEL,
  TRANSACTION_DOCUMENT_LABEL,
  TRANSACTION_PARTY_LABEL,
  type OpsTask,
  type OpsTaskStatus,
  type TimelineMilestone,
  type Transaction,
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

const STATUS_ICON: Record<TransactionStatus, typeof CircleCheck> = {
  "on-track": CircleCheck,
  "at-risk": AlertTriangle,
  delayed: XCircle,
};

const DOC_STATUS_DOT: Record<TransactionDocumentStatus, string> = {
  received: "bg-success",
  pending: "bg-muted-foreground/40",
};

const DOC_STATUS_LABEL: Record<TransactionDocumentStatus, string> = {
  received: "Received",
  pending: "Pending",
};

const DOC_STATUS_TEXT: Record<TransactionDocumentStatus, string> = {
  received: "text-muted-foreground",
  pending: "text-muted-foreground/80",
};

const TASK_STATUS_ORDER: Record<OpsTaskStatus, number> = {
  overdue: 0,
  "in-progress": 1,
  awaiting: 2,
  "not-started": 3,
  completed: 4,
};

const TASK_STATUS_PILL: Record<OpsTaskStatus, string> = {
  overdue: "bg-destructive/15 text-destructive",
  "in-progress": "bg-success-subtle text-success",
  awaiting: "bg-warning-subtle text-warning",
  "not-started": "bg-muted text-muted-foreground",
  completed: "bg-muted/60 text-muted-foreground",
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

      {transaction.parties && transaction.parties.length > 0 && (
        <PartiesSection parties={transaction.parties} />
      )}

      {transaction.opsTasks && transaction.opsTasks.length > 0 && (
        <TasksSection tasks={transaction.opsTasks} />
      )}

      {transaction.documents && transaction.documents.length > 0 && (
        <DocumentsSection documents={transaction.documents} />
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
            <span className="mx-1.5 text-foreground/30">·</span>
            Closing <span className="text-foreground">{t.closingDate}</span>
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

      <div className="rounded-xl border border-border bg-card px-5 py-6 sm:px-7 sm:py-7">
        <TimelineStepper milestones={t.timeline} />
      </div>
    </header>
  );
}

function TimelineStepper({
  milestones,
}: {
  milestones: TimelineMilestone[];
}) {
  return (
    <ol className="flex items-start">
      {milestones.map((m, i) => {
        const prev = milestones[i - 1];
        const leftSegmentDone = i > 0 && prev.state === "done";
        const rightSegmentDone = m.state === "done";
        const isFirst = i === 0;
        const isLast = i === milestones.length - 1;
        return (
          <li
            key={m.id}
            className="flex-1 flex flex-col items-center min-w-0"
          >
            <div className="flex items-center w-full">
              <div
                className={cn(
                  "h-1.5 flex-1 rounded-l-full",
                  isFirst
                    ? "invisible"
                    : leftSegmentDone
                      ? "bg-success"
                      : "bg-muted"
                )}
              />
              <NumberedDot state={m.state} number={i + 1} />
              <div
                className={cn(
                  "h-1.5 flex-1 rounded-r-full",
                  isLast
                    ? "invisible"
                    : rightSegmentDone
                      ? "bg-success"
                      : "bg-muted"
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2.5 text-[11px] leading-tight text-center truncate w-full px-1",
                m.state === "current"
                  ? "text-foreground font-medium"
                  : m.state === "done"
                    ? "text-foreground"
                    : "text-muted-foreground"
              )}
            >
              {m.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function NumberedDot({
  state,
  number,
}: {
  state: TimelineMilestone["state"];
  number: number;
}) {
  if (state === "done") {
    return (
      <span
        aria-label={`Step ${number} done`}
        className="h-7 w-7 rounded-full bg-success text-background inline-flex items-center justify-center shrink-0 text-xs font-medium"
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  }
  if (state === "current") {
    return (
      <span
        aria-label={`Step ${number} in progress`}
        className="h-7 w-7 rounded-full bg-foreground text-background inline-flex items-center justify-center shrink-0 text-xs font-semibold ring-4 ring-foreground/10"
      >
        {number}
      </span>
    );
  }
  return (
    <span
      aria-label={`Step ${number} pending`}
      className="h-7 w-7 rounded-full bg-muted text-muted-foreground inline-flex items-center justify-center shrink-0 text-xs font-medium"
    >
      {number}
    </span>
  );
}

type TaskTab = "todo" | "done";

function TasksSection({ tasks }: { tasks: OpsTask[] }) {
  const isBackOffice = useIsBackOffice();
  const [tab, setTab] = useState<TaskTab>("todo");
  const sorted = [...tasks].sort(
    (a, b) =>
      TASK_STATUS_ORDER[a.status] - TASK_STATUS_ORDER[b.status]
  );
  const todo = sorted.filter((t) => t.status !== "completed");
  const done = sorted.filter((t) => t.status === "completed");
  const visible = tab === "todo" ? todo : done;
  const totalCount = tasks.length;
  const completedPct =
    totalCount === 0
      ? 0
      : Math.round((done.length / totalCount) * 100);

  return (
    <section aria-label="Tasks" className="space-y-3">
      <SectionTitle
        title="Tasks"
        tooltip="The execution layer. Mia handles coordination — Maria takes the calls."
        right={
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground shrink-0">
            {done.length} of {totalCount} · {completedPct}%
          </span>
        }
      />
      <TasksTabs
        tab={tab}
        onChange={setTab}
        todoCount={todo.length}
        doneCount={done.length}
      />
      {visible.length > 0 ? (
        <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
          {visible.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
          {isBackOffice && tab === "todo" && (
            <li>
              <BackOfficeAddRow label="Add task" />
            </li>
          )}
        </ul>
      ) : (
        <>
          <p className="text-sm text-muted-foreground px-1 py-4">
            {tab === "todo"
              ? "Nothing open — clean run on this deal."
              : "Nothing completed yet."}
          </p>
          {isBackOffice && tab === "todo" && (
            <ul className="rounded-xl border border-border bg-card overflow-hidden">
              <li>
                <BackOfficeAddRow label="Add task" />
              </li>
            </ul>
          )}
        </>
      )}
    </section>
  );
}

function TasksTabs({
  tab,
  onChange,
  todoCount,
  doneCount,
}: {
  tab: TaskTab;
  onChange: (next: TaskTab) => void;
  todoCount: number;
  doneCount: number;
}) {
  const tabs: { key: TaskTab; label: string; count: number }[] = [
    { key: "todo", label: "Todo", count: todoCount },
    { key: "done", label: "Done", count: doneCount },
  ];
  return (
    <div
      role="tablist"
      aria-label="Filter tasks"
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
                  active
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60"
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

function TaskRow({ task }: { task: OpsTask }) {
  const completed = task.status === "completed";
  const assignee = OPS_TASK_OWNER_ASSIGNEE[task.owner];
  return (
    <li className="flex items-center gap-3 px-4 py-3 sm:px-5">
      <span
        aria-hidden
        className={cn(
          "h-4 w-4 rounded border inline-flex items-center justify-center shrink-0",
          completed
            ? "bg-success border-success text-background"
            : "border-border bg-background"
        )}
      >
        {completed && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span
        className={cn(
          "shrink-0 inline-flex items-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.06em]",
          TASK_STATUS_PILL[task.status]
        )}
      >
        {OPS_TASK_STATUS_LABEL[task.status]}
      </span>
      <p
        className={cn(
          "text-sm leading-snug flex-1 min-w-0 truncate",
          completed
            ? "text-muted-foreground line-through decoration-muted-foreground/40"
            : "text-foreground"
        )}
      >
        {task.title}
      </p>
      {task.priority === "high" && !completed && (
        <span className="hidden md:inline-flex items-center gap-1 shrink-0 text-[11px] text-warning font-medium">
          <ArrowUp className="h-3 w-3" strokeWidth={2.25} />
          High Priority
        </span>
      )}
      {(task.dueLabel || task.whenLabel) && (
        <span className="hidden sm:inline-flex items-center gap-1 shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground/85">
          <Calendar className="h-3 w-3" strokeWidth={2} />
          {task.whenLabel ?? task.dueLabel}
        </span>
      )}
      <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/90">
        <span
          aria-hidden
          className="h-5 w-5 rounded-full bg-foreground text-background inline-flex items-center justify-center text-[9px] font-semibold"
        >
          {assignee.initials}
        </span>
        <span className="hidden sm:inline">{assignee.name}</span>
      </span>
    </li>
  );
}

function PartiesSection({ parties }: { parties: TransactionParty[] }) {
  const isBackOffice = useIsBackOffice();
  const removal = useRemoveWithReason<TransactionParty>({
    itemType: "transaction-party",
    getDisplayName: (p) =>
      `${TRANSACTION_PARTY_LABEL[p.role]} · ${p.name}`,
  });
  const visible = parties.filter((p) => !removal.isRemoved(p.id));
  return (
    <section aria-label="Parties involved" className="space-y-2.5">
      <SectionTitle title="Parties" tooltip="Everyone touching this deal." />
      <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
        {visible.map((p) => (
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
            {isBackOffice && (
              <BackOfficeRowActions
                label={p.name}
                onDelete={() => removal.requestRemove(p)}
              />
            )}
          </li>
        ))}
        {isBackOffice && (
          <li>
            <BackOfficeAddRow label="Add party" />
          </li>
        )}
      </ul>
      {removal.dialog}
    </section>
  );
}

function DocumentsSection({
  documents,
}: {
  documents: TransactionDocument[];
}) {
  const isBackOffice = useIsBackOffice();
  const removal = useRemoveWithReason<TransactionDocument>({
    itemType: "transaction-document",
    getDisplayName: (d) => TRANSACTION_DOCUMENT_LABEL[d.kind],
  });
  const visible = documents.filter((d) => !removal.isRemoved(d.id));
  return (
    <section aria-label="Documents" className="space-y-2.5">
      <SectionTitle
        title="Documents"
        tooltip="View or download the artifacts tied to this transaction."
      />
      <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
        {visible.map((d) => (
          <DocumentRow
            key={d.id}
            document={d}
            isBackOffice={isBackOffice}
            onRequestRemove={() => removal.requestRemove(d)}
          />
        ))}
        {isBackOffice && (
          <li>
            <BackOfficeAddRow label="Upload document" />
          </li>
        )}
      </ul>
      {removal.dialog}
    </section>
  );
}

function DocumentRow({
  document,
  isBackOffice,
  onRequestRemove,
}: {
  document: TransactionDocument;
  isBackOffice: boolean;
  onRequestRemove: () => void;
}) {
  const received = document.status === "received";
  const rowClass = "flex items-center gap-3 px-4 py-3 sm:px-5 w-full text-left";
  const docLabel = TRANSACTION_DOCUMENT_LABEL[document.kind];
  const inner = (
    <>
      <span
        aria-hidden
        className={cn(
          "h-2 w-2 rounded-full shrink-0",
          DOC_STATUS_DOT[document.status]
        )}
      />
      <span className="text-sm text-foreground flex-1 min-w-0 truncate">
        {docLabel}
      </span>
      <span
        className={cn("text-xs shrink-0", DOC_STATUS_TEXT[document.status])}
      >
        {DOC_STATUS_LABEL[document.status]}
      </span>
      {document.whenLabel && (
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground/70 shrink-0 w-[88px] text-right">
          {document.whenLabel}
        </span>
      )}
      <Download
        aria-hidden={!received}
        className={cn(
          "h-3.5 w-3.5 shrink-0 transition-colors",
          received
            ? "text-muted-foreground/60 group-hover:text-foreground"
            : "text-transparent"
        )}
        strokeWidth={2}
      />
    </>
  );
  return (
    <li className="flex items-stretch">
      {received ? (
        <button
          type="button"
          aria-label={`Download ${docLabel}`}
          className={cn(
            rowClass,
            "group hover:bg-muted/40 transition-colors flex-1"
          )}
        >
          {inner}
        </button>
      ) : (
        <div className={cn(rowClass, "flex-1")}>{inner}</div>
      )}
      {isBackOffice && (
        <span className="flex items-center pr-3 sm:pr-4 shrink-0">
          <BackOfficeRowActions label={docLabel} onDelete={onRequestRemove} />
        </span>
      )}
    </li>
  );
}

