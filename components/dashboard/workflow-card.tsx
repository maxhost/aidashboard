"use client";

import { Fragment, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Clock,
  DollarSign,
  Pause,
  Play,
} from "lucide-react";
import { BrandIcon } from "@/components/onboarding/brand-icon";
import type { Workflow, WorkflowStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  buildNarrativeLine,
  formatHours,
  timeSavedHours,
} from "@/lib/workflows/manual-time";
import { WorkflowDetailSheet } from "./workflow-detail-sheet";

const STATUS_CONFIG: Record<
  WorkflowStatus,
  { label: string; dot: string; text: string }
> = {
  performing: {
    label: "Performing",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
  },
  healthy: {
    label: "Healthy",
    dot: "bg-sky-500",
    text: "text-sky-700",
  },
  underperforming: {
    label: "Underperforming",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
  broken: {
    label: "Broken",
    dot: "bg-rose-500",
    text: "text-rose-700",
  },
};

function formatCompactCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return n > 0 ? `$${n}` : "—";
}

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const [open, setOpen] = useState(false);
  const status = STATUS_CONFIG[workflow.status];
  const isUp = workflow.weeklyChange >= 0;
  const hours = timeSavedHours(workflow);
  const narrative = buildNarrativeLine(workflow);

  return (
    <>
      <Card className="p-5 shadow-sm border-border/70 hover:shadow-md hover:border-border transition-all flex flex-col gap-4">
        {/* Header: status + delta pill */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn("h-2 w-2 rounded-full shrink-0", status.dot)} />
            <span className={cn("text-[11px] font-semibold", status.text)}>
              {status.label}
            </span>
          </div>
          {workflow.status !== "broken" && workflow.weeklyChange !== 0 && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-mono text-[11px] font-semibold tabular-nums shrink-0",
                isUp
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              )}
            >
              {isUp ? (
                <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
              ) : (
                <ArrowDownRight className="h-3 w-3" strokeWidth={2.5} />
              )}
              {Math.abs(workflow.weeklyChange).toFixed(1)}%
            </span>
          )}
        </div>

        {/* Title + 1-line description */}
        <div>
          <h3 className="text-[15px] font-semibold leading-tight text-foreground">
            {workflow.name}
          </h3>
          <p className="text-xs italic text-muted-foreground mt-1 line-clamp-1">
            {workflow.description}
          </p>
        </div>

        {/* Flow chip — the integration story */}
        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 overflow-x-auto">
          {workflow.tools.map((tool, idx) => (
            <Fragment key={tool}>
              <div className="flex items-center gap-1.5 shrink-0">
                <BrandIcon name={tool} size={22} />
                <span className="text-[12px] font-medium text-foreground whitespace-nowrap">
                  {tool}
                </span>
              </div>
              {idx < workflow.tools.length - 1 && (
                <ArrowRight
                  className="h-3 w-3 text-muted-foreground/60 shrink-0"
                  strokeWidth={2}
                />
              )}
            </Fragment>
          ))}
        </div>

        {/* Hero metrics: time saved + money */}
        <div className="grid grid-cols-2 gap-3">
          <HeroMetric
            icon={<Clock className="h-4.5 w-4.5" strokeWidth={1.75} />}
            iconClass="bg-emerald-100 text-emerald-600"
            value={formatHours(hours)}
            label="saved this month"
          />
          <HeroMetric
            icon={<DollarSign className="h-4.5 w-4.5" strokeWidth={1.75} />}
            iconClass="bg-violet-100 text-violet-600"
            value={formatCompactCurrency(workflow.metrics.revenueAttributed)}
            label="pipeline driven"
          />
        </div>

        {/* Narrative line */}
        <p className="text-xs text-muted-foreground leading-snug">
          {narrative}
        </p>

        {/* Footer */}
        <div className="flex items-center pt-1 border-t border-border/60 -mx-5 -mb-5 px-5 py-3 mt-auto">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            {workflow.status === "broken" ? (
              <>
                <Play className="h-3.5 w-3.5 mr-1" strokeWidth={2} />
                Resume
              </>
            ) : (
              <>
                <Pause className="h-3.5 w-3.5 mr-1" strokeWidth={2} />
                Pause
              </>
            )}
          </Button>
          <Button
            size="sm"
            className="h-8 px-3 text-xs gap-1 ml-auto"
            onClick={() => setOpen(true)}
          >
            Open details
            <ArrowRight className="h-3 w-3" strokeWidth={2} />
          </Button>
        </div>
      </Card>

      <WorkflowDetailSheet
        workflow={workflow}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

function HeroMetric({
  icon,
  iconClass,
  value,
  label,
}: {
  icon: React.ReactNode;
  iconClass: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-card p-3 flex items-center gap-3">
      <span
        className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
          iconClass
        )}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="font-mono text-lg font-bold tabular-nums text-foreground leading-none">
          {value}
        </div>
        <div className="text-[11px] text-muted-foreground mt-1 leading-tight">
          {label}
        </div>
      </div>
    </div>
  );
}
