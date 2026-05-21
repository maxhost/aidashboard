"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Building2,
  TrendingUp,
  ExternalLink,
  Sparkles,
  ArrowRight,
  List,
  Columns3,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { SectionTitle } from "@/components/dashboard/section-title";
import { cn } from "@/lib/utils";
import {
  CLIENT_TYPE_LABEL,
  OPS_TAG_LABEL,
  PIPELINE_STAGE_LABEL,
  PIPELINE_STAGE_ORDER,
  type ClientTemperature,
  type ClientType,
  type OpsAtRiskItem,
  type OpsBrief,
  type OpsItem,
  type PipelineClient,
  type PipelineSnapshot,
  type PipelineStage,
} from "@/lib/data/assistant-demo";

const TEMP_DOT: Record<ClientTemperature, string> = {
  hot: "bg-destructive",
  warm: "bg-warning",
  cold: "bg-muted-foreground/50",
};

const TEMP_LABEL: Record<ClientTemperature, string> = {
  hot: "Hot",
  warm: "Warm",
  cold: "Cold",
};

const TYPE_ICON: Record<ClientType, typeof Home> = {
  buyer: Home,
  seller: Building2,
  investor: TrendingUp,
};

type ViewMode = "list" | "kanban";

export function OperationsClient({
  brief,
  snapshot,
  byStage,
}: {
  brief: OpsBrief;
  snapshot: PipelineSnapshot;
  byStage: Record<PipelineStage, PipelineClient[]>;
}) {
  const [pipelineOpen, setPipelineOpen] = useState(false);
  const [selected, setSelected] = useState<PipelineClient | null>(null);
  const [view, setView] = useState<ViewMode>("kanban");

  const subtitle = `${brief.needsAttention.length} follow-up${brief.needsAttention.length === 1 ? "" : "s"} pending · ${brief.atRisk.length} deal${brief.atRisk.length === 1 ? "" : "s"} at risk · ${brief.momentum.length} opportunit${brief.momentum.length === 1 ? "y" : "ies"} detected`;

  const sortedAtRisk = [...brief.atRisk].sort(
    (a, b) =>
      (a.severity === "critical" ? 0 : 1) -
      (b.severity === "critical" ? 0 : 1)
  );

  return (
    <div
      className={cn(
        "px-4 sm:px-6 py-6 lg:px-8 lg:py-8 mx-auto space-y-8",
        view === "list" ? "max-w-[900px]" : "max-w-[1400px]"
      )}
    >
      <header>
        <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
          Operations
        </h1>
        <p className="text-base lg:text-lg text-foreground/75 mt-2 leading-snug max-w-[640px]">
          {subtitle}
        </p>
      </header>

      <PipelineSnapshotStrip
        snapshot={snapshot}
        onOpenPipeline={() => setPipelineOpen(true)}
      />

      <div className="flex items-center justify-end">
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === "list" ? (
        <>
          <section aria-label="Needs attention" className="space-y-2.5">
            <SectionTitle
              title="Needs attention"
              tooltip="Operational gaps inferred from your CRM, calendar, and inbox activity."
            />
            <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
              {brief.needsAttention.map((item) => (
                <NeedsAttentionRow key={item.id} item={item} />
              ))}
            </ul>
          </section>

          <section aria-label="At risk" className="space-y-2.5">
            <SectionTitle
              title="At risk"
              tooltip="Transactions or commitments showing risk signals — slipping dates, silent stakeholders, missing artifacts."
            />
            <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
              {sortedAtRisk.map((item) => (
                <AtRiskRow key={item.id} item={item} />
              ))}
            </ul>
          </section>

          <section aria-label="Momentum" className="space-y-2.5">
            <SectionTitle
              title="Momentum"
              tooltip="Engagement signals worth acting on — re-opened searches, replies after silence, buying-intent uplifts."
            />
            <ul className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
              {brief.momentum.map((item) => (
                <MomentumRow key={item.id} item={item} />
              ))}
            </ul>
          </section>
        </>
      ) : (
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 overflow-x-auto pb-2">
          <div className="flex gap-4 px-4 sm:px-6 lg:px-8 min-w-max">
            <OpsColumn
              title="Needs attention"
              count={brief.needsAttention.length}
              accent="warning"
            >
              {brief.needsAttention.map((item) => (
                <NeedsAttentionCard key={item.id} item={item} />
              ))}
            </OpsColumn>
            <OpsColumn
              title="At risk"
              count={sortedAtRisk.length}
              accent="destructive"
            >
              {sortedAtRisk.map((item) => (
                <AtRiskCard key={item.id} item={item} />
              ))}
            </OpsColumn>
            <OpsColumn
              title="Momentum"
              count={brief.momentum.length}
              accent="success"
            >
              {brief.momentum.map((item) => (
                <MomentumCard key={item.id} item={item} />
              ))}
            </OpsColumn>
          </div>
        </div>
      )}

      <Sheet
        open={pipelineOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPipelineOpen(false);
            setSelected(null);
          }
        }}
      >
        <SheetContent className="w-full sm:max-w-4xl lg:max-w-5xl">
          <SheetHeader className="text-left">
            <SheetTitle>Full pipeline</SheetTitle>
            <SheetDescription>
              The underlying CRM view. Most days you won&apos;t need this — Pulsor
              surfaces what matters on the main screen.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 -mx-6 overflow-x-auto pb-2">
            <ol className="flex gap-3 px-6 min-w-max">
              {PIPELINE_STAGE_ORDER.map((stage) => {
                const cards = byStage[stage] ?? [];
                return (
                  <li
                    key={stage}
                    className="w-64 shrink-0 rounded-xl bg-muted/30 border border-border/60 flex flex-col"
                  >
                    <div className="px-3 py-2.5 flex items-center justify-between gap-2 border-b border-border/60">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground truncate">
                        {PIPELINE_STAGE_LABEL[stage]}
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-muted-foreground shrink-0">
                        {cards.length}
                      </span>
                    </div>
                    <ul className="p-2 space-y-2 min-h-[60px]">
                      {cards.map((c) => (
                        <KanbanCard
                          key={c.id}
                          client={c}
                          onOpen={() => setSelected(c)}
                        />
                      ))}
                      {cards.length === 0 && (
                        <li className="text-[11px] text-muted-foreground/60 px-1 py-2 italic">
                          No clients here right now
                        </li>
                      )}
                    </ul>
                  </li>
                );
              })}
            </ol>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <SheetContent className="w-full sm:max-w-md">
          {selected && <ClientDetail client={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (next: ViewMode) => void;
}) {
  const options: { key: ViewMode; label: string; icon: typeof List }[] = [
    { key: "list", label: "List", icon: List },
    { key: "kanban", label: "Kanban", icon: Columns3 },
  ];
  return (
    <div
      role="tablist"
      aria-label="View mode"
      className="inline-flex items-center rounded-md border border-border bg-card p-0.5"
    >
      {options.map(({ key, label, icon: Icon }) => {
        const active = view === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(key)}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
            {label}
          </button>
        );
      })}
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
}: {
  title: string;
  count: number;
  accent: "warning" | "destructive" | "success";
  children: React.ReactNode;
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
      <ul className="p-2 space-y-2 min-h-[60px]">{children}</ul>
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

function NeedsAttentionCard({ item }: { item: OpsItem }) {
  return (
    <CardShell>
      <div className="flex items-center gap-1.5">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-warning" />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85">
          {OPS_TAG_LABEL[item.tag]}
        </span>
      </div>
      <p className="mt-1.5 text-sm leading-snug text-foreground">
        {item.headline}
      </p>
      <CardMeta item={item} />
    </CardShell>
  );
}

function AtRiskCard({ item }: { item: OpsAtRiskItem }) {
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
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85">
          {OPS_TAG_LABEL[item.tag]}
        </span>
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

function MomentumCard({ item }: { item: OpsItem }) {
  return (
    <CardShell>
      <div className="flex items-center gap-1.5">
        <Sparkles
          className="h-3 w-3 text-success shrink-0"
          strokeWidth={2}
          fill="currentColor"
        />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85">
          {OPS_TAG_LABEL[item.tag]}
        </span>
      </div>
      <p className="mt-1.5 text-sm leading-snug text-foreground">
        {item.headline}
      </p>
      <CardMeta item={item} />
    </CardShell>
  );
}

function PipelineSnapshotStrip({
  snapshot,
  onOpenPipeline,
}: {
  snapshot: PipelineSnapshot;
  onOpenPipeline: () => void;
}) {
  const stats = [
    { value: snapshot.activeClients, label: "active clients" },
    { value: snapshot.inShowing, label: "in showing" },
    { value: snapshot.underContract, label: "under contract" },
    { value: snapshot.closingThisWeek, label: "closing this week" },
  ];
  return (
    <section
      aria-label="Pipeline snapshot"
      className="rounded-xl border border-border/70 bg-card/60 px-4 py-3.5 sm:px-5 flex flex-wrap items-center gap-x-6 gap-y-2"
    >
      <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-2 flex-1 min-w-0">
        {stats.map(({ value, label }) => (
          <li key={label} className="flex items-baseline gap-1.5">
            <span className="font-mono text-base tabular-nums font-medium text-foreground">
              {value}
            </span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onOpenPipeline}
        className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        View full pipeline
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </section>
  );
}

function NeedsAttentionRow({ item }: { item: OpsItem }) {
  return (
    <li className="flex items-center gap-3.5 px-4 py-4 sm:px-5">
      <span
        aria-hidden
        className="h-2.5 w-2.5 rounded-full shrink-0 bg-warning"
      />
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85 shrink-0 w-[96px]">
        {OPS_TAG_LABEL[item.tag]}
      </span>
      <p className="text-[15px] leading-snug text-foreground flex-1 min-w-0 truncate">
        {item.headline}
      </p>
      {item.timeSignal && (
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground/80 shrink-0">
          {item.timeSignal}
        </span>
      )}
    </li>
  );
}

function AtRiskRow({ item }: { item: OpsAtRiskItem }) {
  const critical = item.severity === "critical";
  return (
    <li
      className={cn(
        "flex items-center gap-3.5 px-4 py-4 sm:px-5 border-l-2",
        critical ? "border-l-destructive" : "border-l-warning"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-2.5 w-2.5 rounded-full shrink-0",
          critical ? "bg-destructive" : "bg-warning"
        )}
      />
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85 shrink-0 w-[96px]">
        {OPS_TAG_LABEL[item.tag]}
      </span>
      <p
        className={cn(
          "text-[15px] leading-snug flex-1 min-w-0 truncate",
          critical ? "text-foreground" : "text-foreground"
        )}
      >
        {item.headline}
      </p>
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
    </li>
  );
}

function MomentumRow({ item }: { item: OpsItem }) {
  return (
    <li className="flex items-center gap-3.5 px-4 py-4 sm:px-5">
      <Sparkles
        className="h-3.5 w-3.5 shrink-0 text-success"
        strokeWidth={2}
        fill="currentColor"
      />
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/85 shrink-0 w-[96px]">
        {OPS_TAG_LABEL[item.tag]}
      </span>
      <p className="text-[15px] leading-snug text-foreground flex-1 min-w-0 truncate">
        {item.headline}
      </p>
      {item.timeSignal && (
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground/80 shrink-0">
          {item.timeSignal}
        </span>
      )}
    </li>
  );
}

function KanbanCard({
  client,
  onOpen,
}: {
  client: PipelineClient;
  onOpen: () => void;
}) {
  const TypeIcon = TYPE_ICON[client.type];
  const linkedToTransactions = client.stage === "under-contract";

  const cardClasses = cn(
    "group block w-full text-left rounded-lg border border-border bg-card p-3",
    "hover:border-foreground/30 hover:shadow-sm transition-all"
  );

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-foreground truncate">
          {client.name}
        </span>
        <span
          aria-label={TEMP_LABEL[client.temperature]}
          title={TEMP_LABEL[client.temperature]}
          className={cn(
            "h-2 w-2 rounded-full shrink-0 mt-1.5",
            TEMP_DOT[client.temperature]
          )}
        />
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <TypeIcon className="h-3 w-3" strokeWidth={1.75} />
        <span>{CLIENT_TYPE_LABEL[client.type]}</span>
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {client.daysInStage}d in stage
        </span>
        <span className="text-[11px] text-muted-foreground/80 truncate">
          {client.lastInteraction}
        </span>
      </div>
      {linkedToTransactions && (
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          <span>View in Transactions</span>
          <ExternalLink className="h-3 w-3" strokeWidth={2} />
        </div>
      )}
    </>
  );

  return (
    <li>
      {linkedToTransactions ? (
        <Link href="/transactions" className={cardClasses}>
          {inner}
        </Link>
      ) : (
        <button type="button" onClick={onOpen} className={cardClasses}>
          {inner}
        </button>
      )}
    </li>
  );
}

function ClientDetail({ client }: { client: PipelineClient }) {
  const TypeIcon = TYPE_ICON[client.type];
  return (
    <>
      <SheetHeader className="text-left">
        <SheetTitle>{client.name}</SheetTitle>
        <SheetDescription>
          {PIPELINE_STAGE_LABEL[client.stage]} · {client.daysInStage}{" "}
          {client.daysInStage === 1 ? "day" : "days"} in stage
        </SheetDescription>
      </SheetHeader>
      <div className="mt-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Type">
            <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
              <TypeIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
              {CLIENT_TYPE_LABEL[client.type]}
            </span>
          </Field>
          <Field label="Temperature">
            <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  TEMP_DOT[client.temperature]
                )}
              />
              {TEMP_LABEL[client.temperature]}
            </span>
          </Field>
          {client.budget && (
            <Field label="Budget">
              <span className="font-mono text-sm tabular-nums text-foreground">
                {client.budget}
              </span>
            </Field>
          )}
          {client.area && (
            <Field label="Area">
              <span className="text-sm text-foreground">{client.area}</span>
            </Field>
          )}
          <Field label="Last touch">
            <span className="text-sm text-foreground">
              {client.lastInteraction}
            </span>
          </Field>
        </div>
        {client.note && (
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-1">
              Note
            </div>
            <p className="text-sm text-foreground">{client.note}</p>
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            className="flex-1 px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors"
          >
            Message client
          </button>
          <button
            type="button"
            className="flex-1 px-3 py-1.5 rounded-md border border-border text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
          >
            Move stage
          </button>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-1">
        {label}
      </div>
      {children}
    </div>
  );
}

