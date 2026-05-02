import { CheckCircle2, OctagonAlert, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Insight } from "@/lib/types";

type Status = "on-track" | "attention" | "critical";

const STATUS_META: Record<
  Status,
  {
    title: string;
    icon: typeof CheckCircle2;
    iconBg: string;
    iconColor: string;
    accent: string;
  }
> = {
  "on-track": {
    title: "Operations on track",
    icon: CheckCircle2,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    accent: "border-l-emerald-500",
  },
  attention: {
    title: "Some focus required",
    icon: TriangleAlert,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    accent: "border-l-amber-500",
  },
  critical: {
    title: "Critical issue needs your attention",
    icon: OctagonAlert,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    accent: "border-l-rose-500",
  },
};

function computeStatus(pending: Insight[]): Status {
  const criticals = pending.filter((i) => i.type === "critical").length;
  const warnings = pending.filter((i) => i.type === "warning").length;
  if (criticals > 0) return "critical";
  if (warnings > 3) return "attention";
  return "on-track";
}

export function OverviewHero({
  firstName,
  insights,
  positiveSummary,
}: {
  firstName: string;
  insights: Insight[];
  positiveSummary?: string[];
}) {
  const pending = insights.filter((i) => i.state === "pending");
  const status = computeStatus(pending);
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  const criticals = pending.filter((i) => i.type === "critical").length;
  const warnings = pending.filter((i) => i.type === "warning").length;
  const wins = pending.filter((i) => i.type === "opportunity").length;

  // Build the contextual summary line that sits under the hero title.
  const parts: string[] = [];
  if (criticals > 0) {
    parts.push(`${criticals} ${criticals === 1 ? "critical alert" : "critical alerts"}`);
  }
  if (warnings > 0) {
    parts.push(`${warnings} ${warnings === 1 ? "warning" : "warnings"} this week`);
  }
  if (wins > 0) {
    parts.push(`${wins} ${wins === 1 ? "win" : "wins"} to act on`);
  }
  const summary =
    status === "on-track" && parts.length === 0
      ? "All clear. Nothing pending right now."
      : parts.join(" · ");

  return (
    <div
      className={cn(
        "rounded-xl bg-card border border-border/70 border-l-[4px] p-5 shadow-sm",
        meta.accent
      )}
    >
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "h-12 w-12 rounded-2xl shrink-0 flex items-center justify-center",
            meta.iconBg
          )}
        >
          <Icon className={cn("h-6 w-6", meta.iconColor)} strokeWidth={2} />
        </span>

        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground">
            Welcome back, {firstName}.
          </div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground leading-snug mt-0.5">
            {meta.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">{summary}</p>

          {status === "on-track" &&
            positiveSummary &&
            positiveSummary.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                {positiveSummary.map((line) => (
                  <li
                    key={line}
                    className="inline-flex items-center gap-1.5 text-xs text-foreground/80"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {line}
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>
    </div>
  );
}
