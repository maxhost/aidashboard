import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRight } from "lucide-react";
import type { Agent } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  Agent["status"],
  { label: string; dot: string; text: string }
> = {
  top: {
    label: "Top",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
  },
  rising: {
    label: "Rising",
    dot: "bg-violet-500",
    text: "text-violet-700",
  },
  steady: {
    label: "Steady",
    dot: "bg-slate-400",
    text: "text-slate-600",
  },
  "needs-coaching": {
    label: "Coaching",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
};

function formatCompactCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-0.5 h-7 w-16">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-violet-200"
          style={{ height: `${(v / max) * 100}%`, minHeight: "2px" }}
        />
      ))}
    </div>
  );
}

export function AgentLeaderboard({ agents }: { agents: Agent[] }) {
  const sorted = [...agents]
    .sort((a, b) => b.metrics.volumeClosedYTD - a.metrics.volumeClosedYTD)
    .slice(0, 5);

  return (
    <Card className="shadow-sm border-border/70">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            Agent leaderboard
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Top performers by volume closed YTD
          </p>
        </div>
        <button
          type="button"
          className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          View team
          <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
        </button>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <div className="divide-y divide-border/60">
          {sorted.map((agent, idx) => {
            const status = STATUS_CONFIG[agent.status];
            return (
              <div
                key={agent.id}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <span className="font-mono text-xs text-muted-foreground w-4 tabular-nums">
                  {idx + 1}
                </span>
                <Avatar className="h-9 w-9">
                  {agent.avatarUrl && (
                    <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                  )}
                  <AvatarFallback
                    className={cn(
                      "text-white text-xs font-semibold",
                      agent.avatarColor
                    )}
                  >
                    {agent.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {agent.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        status.dot
                      )}
                    />
                    <span className={cn("text-[11px] font-medium", status.text)}>
                      {status.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      · {agent.role}
                    </span>
                  </div>
                </div>
                <Sparkline data={agent.trend} />
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold text-foreground tabular-nums">
                    {formatCompactCurrency(agent.metrics.volumeClosedYTD)}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono tabular-nums">
                    {agent.metrics.dealsClosedYTD} closed
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
