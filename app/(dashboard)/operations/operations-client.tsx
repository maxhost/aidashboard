"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Building2, TrendingUp, ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  CLIENT_TYPE_LABEL,
  PIPELINE_STAGE_LABEL,
  PIPELINE_STAGE_ORDER,
  type ClientTemperature,
  type ClientType,
  type PipelineClient,
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

export function OperationsClient({
  byStage,
}: {
  byStage: Record<PipelineStage, PipelineClient[]>;
}) {
  const [selected, setSelected] = useState<PipelineClient | null>(null);

  return (
    <div className="px-4 sm:px-6 py-6 lg:px-8 lg:py-8 max-w-[1400px] mx-auto space-y-6">
      <header>
        <h1 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight">
          Operations
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Where every active client sits in your pipeline.
        </p>
      </header>

      {/* Kanban: horizontal scroll on narrow screens */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 overflow-x-auto pb-4">
        <ol className="flex gap-3 px-4 sm:px-6 lg:px-8 min-w-max">
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
