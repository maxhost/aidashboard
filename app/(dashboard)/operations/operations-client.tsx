"use client";

import { Sparkles } from "lucide-react";
import {
  BackOfficeAddRow,
  BackOfficeRowActions,
} from "@/components/dashboard/back-office-controls";
import { useIsBackOffice } from "@/components/dashboard/use-role";
import { useRemoveWithReason } from "@/components/dashboard/use-remove-with-reason";
import { cn } from "@/lib/utils";
import {
  OPS_TAG_LABEL,
  type OpsAtRiskItem,
  type OpsBrief,
  type OpsItem,
} from "@/lib/data/assistant-demo";

const SUBTITLE =
  "7 follow-ups pending · 5 deals at risk · 5 opportunities detected";

export function OperationsClient({ brief }: { brief: OpsBrief }) {
  const isBackOffice = useIsBackOffice();
  const needsRemoval = useRemoveWithReason<OpsItem>({
    itemType: "ops-needs-attention",
    getDisplayName: (i) => i.headline,
  });
  const riskRemoval = useRemoveWithReason<OpsAtRiskItem>({
    itemType: "ops-at-risk",
    getDisplayName: (i) => i.headline,
  });
  const momentumRemoval = useRemoveWithReason<OpsItem>({
    itemType: "ops-momentum",
    getDisplayName: (i) => i.headline,
  });

  const liveNeedsAttention = brief.needsAttention.filter(
    (i) => !needsRemoval.isRemoved(i.id)
  );
  const liveAtRisk = brief.atRisk.filter((i) => !riskRemoval.isRemoved(i.id));
  const liveMomentum = brief.momentum.filter(
    (i) => !momentumRemoval.isRemoved(i.id)
  );
  const sortedAtRisk = [...liveAtRisk].sort(
    (a, b) =>
      (a.severity === "critical" ? 0 : 1) -
      (b.severity === "critical" ? 0 : 1)
  );

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 mx-auto space-y-8 max-w-[1400px]">
      <header>
        <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
          Operations
        </h1>
        <p className="text-base lg:text-lg text-foreground/75 mt-2 leading-snug max-w-[640px]">
          {SUBTITLE}
        </p>
      </header>

      <div className="-mx-4 sm:-mx-6 lg:-mx-8 overflow-x-auto pb-2">
        <div className="flex gap-4 px-4 sm:px-6 lg:px-8 min-w-max">
          <OpsColumn
            title="Needs attention"
            count={liveNeedsAttention.length}
            accent="warning"
            footer={
              isBackOffice ? (
                <BackOfficeAddRow label="Add follow-up" />
              ) : undefined
            }
          >
            {liveNeedsAttention.map((item) => (
              <NeedsAttentionCard
                key={item.id}
                item={item}
                onRequestRemove={() => needsRemoval.requestRemove(item)}
              />
            ))}
          </OpsColumn>
          <OpsColumn
            title="At risk"
            count={sortedAtRisk.length}
            accent="destructive"
            footer={
              isBackOffice ? (
                <BackOfficeAddRow label="Add risk item" />
              ) : undefined
            }
          >
            {sortedAtRisk.map((item) => (
              <AtRiskCard
                key={item.id}
                item={item}
                onRequestRemove={() => riskRemoval.requestRemove(item)}
              />
            ))}
          </OpsColumn>
          <OpsColumn
            title="Momentum"
            count={liveMomentum.length}
            accent="success"
            footer={
              isBackOffice ? (
                <BackOfficeAddRow label="Add momentum signal" />
              ) : undefined
            }
          >
            {liveMomentum.map((item) => (
              <MomentumCard
                key={item.id}
                item={item}
                onRequestRemove={() => momentumRemoval.requestRemove(item)}
              />
            ))}
          </OpsColumn>
        </div>
      </div>

      {needsRemoval.dialog}
      {riskRemoval.dialog}
      {momentumRemoval.dialog}
    </div>
  );
}

const COLUMN_ACCENT: Record<"warning" | "destructive" | "success", string> = {
  warning: "bg-warning",
  destructive: "bg-destructive",
  success: "bg-success",
};

function OpsColumn({
  title,
  count,
  accent,
  children,
  footer,
}: {
  title: string;
  count: number;
  accent: "warning" | "destructive" | "success";
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="w-[300px] shrink-0 rounded-xl bg-muted/30 border border-border/60 flex flex-col">
      <div className="px-3 py-2.5 flex items-center justify-between gap-2 border-b border-border/60">
        <div className="flex items-center gap-2 min-w-0">
          <span
            aria-hidden
            className={cn("h-2 w-2 rounded-full shrink-0", COLUMN_ACCENT[accent])}
          />
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground truncate">
            {title}
          </span>
        </div>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground shrink-0">
          {count}
        </span>
      </div>
      <ul className="p-2 space-y-2 min-h-[60px] flex-1">{children}</ul>
      {footer && <div className="border-t border-border/60">{footer}</div>}
    </section>
  );
}

function CardShell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <li
      className={cn(
        "rounded-lg border border-border bg-card p-3",
        "hover:border-foreground/30 hover:shadow-sm transition-all",
        className
      )}
    >
      {children}
    </li>
  );
}

function CardMeta({ item }: { item: OpsItem }) {
  if (!item.client && !item.timeSignal) return null;
  return (
    <div className="mt-2 flex items-baseline justify-between gap-2">
      {item.client && (
        <span className="text-[11px] text-muted-foreground truncate">
          {item.client}
        </span>
      )}
      {item.timeSignal && (
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground/80 shrink-0">
          {item.timeSignal}
        </span>
      )}
    </div>
  );
}

function CardActions({
  label,
  onRequestRemove,
}: {
  label: string;
  onRequestRemove: () => void;
}) {
  const isBackOffice = useIsBackOffice();
  if (!isBackOffice) return null;
  return (
    <BackOfficeRowActions
      label={label}
      onDelete={onRequestRemove}
      className="-mr-2"
    />
  );
}

function NeedsAttentionCard({
  item,
  onRequestRemove,
}: {
  item: OpsItem;
  onRequestRemove: () => void;
}) {
  return (
    <CardShell>
      <div className="flex items-center gap-1.5">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-warning" />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85 flex-1">
          {OPS_TAG_LABEL[item.tag]}
        </span>
        <CardActions
          label={item.headline}
          onRequestRemove={onRequestRemove}
        />
      </div>
      <p className="mt-1.5 text-sm leading-snug text-foreground">
        {item.headline}
      </p>
      <CardMeta item={item} />
    </CardShell>
  );
}

function AtRiskCard({
  item,
  onRequestRemove,
}: {
  item: OpsAtRiskItem;
  onRequestRemove: () => void;
}) {
  const critical = item.severity === "critical";
  return (
    <CardShell
      className={cn(
        "border-l-2",
        critical ? "border-l-destructive" : "border-l-warning"
      )}
    >
      <div className="flex items-center gap-1.5">
        <span
          aria-hidden
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            critical ? "bg-destructive" : "bg-warning"
          )}
        />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85 flex-1">
          {OPS_TAG_LABEL[item.tag]}
        </span>
        <CardActions
          label={item.headline}
          onRequestRemove={onRequestRemove}
        />
      </div>
      <p className="mt-1.5 text-sm leading-snug text-foreground">
        {item.headline}
      </p>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        {item.client && (
          <span className="text-[11px] text-muted-foreground truncate">
            {item.client}
          </span>
        )}
        {item.timeSignal && (
          <span
            className={cn(
              "font-mono text-[11px] tabular-nums shrink-0",
              critical ? "text-destructive" : "text-muted-foreground/80"
            )}
          >
            {item.timeSignal}
          </span>
        )}
      </div>
    </CardShell>
  );
}

function MomentumCard({
  item,
  onRequestRemove,
}: {
  item: OpsItem;
  onRequestRemove: () => void;
}) {
  return (
    <CardShell>
      <div className="flex items-center gap-1.5">
        <Sparkles
          className="h-3 w-3 text-success shrink-0"
          strokeWidth={2}
          fill="currentColor"
        />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85 flex-1">
          {OPS_TAG_LABEL[item.tag]}
        </span>
        <CardActions
          label={item.headline}
          onRequestRemove={onRequestRemove}
        />
      </div>
      <p className="mt-1.5 text-sm leading-snug text-foreground">
        {item.headline}
      </p>
      <CardMeta item={item} />
    </CardShell>
  );
}

