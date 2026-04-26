import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpRight } from "lucide-react";
import type { Lead, LeadStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; dot: string; text: string }
> = {
  hot: {
    label: "Hot",
    dot: "bg-rose-500",
    text: "text-rose-700",
  },
  warm: {
    label: "Warm",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
  cold: {
    label: "Cold",
    dot: "bg-slate-400",
    text: "text-slate-600",
  },
};

export function RecentLeads({ leads }: { leads: Lead[] }) {
  return (
    <Card className="shadow-sm border-border/70">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            Recent leads
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Latest activity across the team
          </p>
        </div>
        <button
          type="button"
          className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          View all
          <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
        </button>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <div className="divide-y divide-border/60">
          {leads.slice(0, 6).map((lead) => {
            const status = STATUS_CONFIG[lead.status];
            return (
              <div
                key={lead.id}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-violet-100 text-violet-700 text-xs font-semibold">
                    {lead.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {lead.name}
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
                    <span className="text-[11px] text-muted-foreground truncate">
                      · {lead.property}
                    </span>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end shrink-0">
                  <span className="text-[11px] font-medium text-foreground">
                    {lead.stage}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono tabular-nums">
                    {formatDistanceToNowStrict(new Date(lead.lastContactAt))} ago
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
