"use client";

import Link from "next/link";
import {
  AlertTriangle,
  XCircle,
  CircleCheck,
  ChevronRight,
  Plus,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/dashboard/section-title";
import {
  TRANSACTION_PHASE_LABEL,
  TRANSACTION_PHASE_ORDER,
  type Transaction,
  type TransactionPhase,
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

const PHASE_TOOLTIP: Record<TransactionPhase, string> = {
  closing:
    "Closing within the next week — final walkthroughs, signed disclosures, last documents.",
  pending: "Under contract — due diligence, appraisal, financing.",
  listing: "Seller-side, pre-contract — prep, MLS, showings.",
};

export function TransactionsClient({
  grouped,
}: {
  grouped: Record<TransactionPhase, Transaction[]>;
}) {
  const all = TRANSACTION_PHASE_ORDER.flatMap((p) => grouped[p]);

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1000px] mx-auto space-y-7">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
            Transactions
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {all.length} active deal{all.length === 1 ? "" : "s"} across your
            book.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/access"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border text-foreground hover:bg-muted/60 transition-colors"
          >
            <KeyRound className="h-3.5 w-3.5" strokeWidth={2} />
            Access & logins
          </Link>
          <Link
            href="/transactions/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.25} />
            New transaction
          </Link>
        </div>
      </header>

      {TRANSACTION_PHASE_ORDER.map((phase) => {
        const items = grouped[phase];
        if (items.length === 0) return null;
        return (
          <section
            key={phase}
            aria-label={TRANSACTION_PHASE_LABEL[phase]}
            className="space-y-2.5"
          >
            <SectionTitle
              title={TRANSACTION_PHASE_LABEL[phase]}
              tooltip={PHASE_TOOLTIP[phase]}
              right={
                <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                  {items.length}
                </span>
              }
            />
            <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
              {items.map((t) => (
                <TransactionRow key={t.id} transaction={t} phase={phase} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function TransactionRow({
  transaction: t,
}: {
  transaction: Transaction;
  phase: TransactionPhase;
}) {
  const StatusIcon = STATUS_ICON[t.status];
  const isHealthy = t.status === "on-track";
  return (
    <li>
      <Link
        href={`/transactions/${t.id}`}
        className="block px-4 sm:px-5 py-4 hover:bg-muted/40 transition-colors group"
      >
        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span
                className={cn(
                  "text-base font-medium truncate",
                  isHealthy ? "text-foreground/85" : "text-foreground"
                )}
              >
                {t.address}
              </span>
              <span className="text-sm text-muted-foreground">
                · {t.client}
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-3">
              <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full transition-all", STATUS_BAR[t.status])}
                  style={{ width: `${t.progressPct}%` }}
                />
              </div>
              <span className="font-mono text-xs tabular-nums text-muted-foreground shrink-0 w-10 text-right">
                {t.progressPct}%
              </span>
            </div>
          </div>

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
            <ChevronRight
              className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground transition-colors shrink-0"
              strokeWidth={1.75}
            />
          </div>
        </div>
      </Link>
    </li>
  );
}
