import { ArrowUpRight } from "lucide-react";
import { BrandIcon } from "@/components/onboarding/brand-icon";
import type { Tool } from "@/lib/tools/data";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href={tool.website}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-sm hover:shadow-md hover:border-foreground/20 transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <BrandIcon name={tool.name} size={40} />
        <ArrowUpRight
          className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 mt-1"
          strokeWidth={2}
        />
      </div>
      <div className="min-w-0">
        <div className="text-[14px] font-semibold text-foreground leading-tight truncate">
          {tool.name}
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>
      <div className="mt-auto pt-2 border-t border-border/40">
        <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-wider truncate block">
          {tool.website.replace(/^https?:\/\//, "")}
        </span>
      </div>
    </a>
  );
}
