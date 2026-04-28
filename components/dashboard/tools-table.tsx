"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Home, Inbox, Search, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BrandIcon } from "@/components/onboarding/brand-icon";
import type { FlatTool } from "@/lib/tools/data";
import { cn } from "@/lib/utils";

export function ToolsTable({
  tools,
  categories,
}: {
  tools: FlatTool[];
  categories: { key: string; title: string; count: number }[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [reNativeOnly, setReNativeOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (reNativeOnly && !t.reNative) return false;
      if (
        activeCategories.length > 0 &&
        !activeCategories.includes(t.categoryKey)
      )
        return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.categoryTitle.toLowerCase().includes(q) ||
        t.website.toLowerCase().includes(q)
      );
    });
  }, [tools, query, activeCategories, reNativeOnly]);

  function toggleCategory(key: string) {
    setActiveCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  }

  function clearFilters() {
    setQuery("");
    setActiveCategories([]);
    setReNativeOnly(false);
  }

  const hasFilters =
    query.length > 0 || activeCategories.length > 0 || reNativeOnly;

  return (
    <div className="space-y-4">
      {/* Search + count */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60"
            strokeWidth={1.75}
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, description, category…"
            className="h-10 pl-9 pr-9"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md inline-flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tabular-nums text-muted-foreground">
            {filtered.length === tools.length
              ? `${tools.length} tools`
              : `${filtered.length} of ${tools.length}`}
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* RE-native toggle (its own row, more prominent) */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => setReNativeOnly((v) => !v)}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors border",
            reNativeOnly
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:border-foreground/30"
          )}
        >
          <Home className="h-3.5 w-3.5" strokeWidth={2} />
          Real estate native only
        </button>
        <span className="text-[11px] text-muted-foreground">
          Hides Slack, Canva, Mailchimp, ChatGPT, etc. — only tools built for real estate.
        </span>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => {
          const active = activeCategories.includes(cat.key);
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => toggleCategory(cat.key)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium transition-colors border",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-foreground/30"
              )}
            >
              {cat.title}
              <span
                className={cn(
                  "font-mono tabular-nums text-[10px]",
                  active
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                )}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-lg bg-card">
          <Inbox
            className="h-9 w-9 text-muted-foreground/40 mb-3"
            strokeWidth={1.5}
          />
          <p className="text-sm font-medium text-foreground">
            No tools match this filter
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-primary hover:underline mt-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/60">
                  <TableHead className="w-[260px] py-3">Tool</TableHead>
                  <TableHead className="w-[180px]">Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[200px]">Website</TableHead>
                  <TableHead className="w-[60px] text-right pr-5"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((tool) => (
                  <TableRow
                    key={`${tool.categoryKey}-${tool.name}`}
                    className="cursor-pointer group border-border/40"
                    onClick={() =>
                      window.open(tool.website, "_blank", "noopener,noreferrer")
                    }
                  >
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <BrandIcon name={tool.name} size={32} />
                        <div className="min-w-0 flex flex-col">
                          <span className="text-[14px] font-semibold text-foreground truncate">
                            {tool.name}
                          </span>
                          {tool.reNative ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary mt-0.5">
                              <Home className="h-2.5 w-2.5" strokeWidth={2.5} />
                              RE-native
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground mt-0.5">
                              General tool
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-muted/50 text-muted-foreground border-border/50 font-medium text-[10px] py-0 px-2 h-5"
                      >
                        {tool.categoryTitle}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-[13px] text-muted-foreground leading-snug line-clamp-2">
                        {tool.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[11px] text-muted-foreground/80 truncate block">
                        {tool.website.replace(/^https?:\/\//, "")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-5">
                      <ArrowUpRight
                        className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors inline-block"
                        strokeWidth={2}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
