"use client";

import { Star } from "lucide-react";
import { BrandIcon } from "@/components/onboarding/brand-icon";
import { StepHeader } from "@/components/onboarding/wizard-shell";
import { LEAD_SOURCE_GROUPS } from "@/lib/onboarding/options";
import type { OnboardingData } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

export function LeadSourcesStep({
  data,
  setData,
}: {
  data: OnboardingData;
  setData: (updater: (d: OnboardingData) => OnboardingData) => void;
}) {
  const leadSources = data.leadSources ?? {
    sources: [] as string[],
    topSources: [] as string[],
  };

  function toggleSource(source: string) {
    const next = leadSources.sources.includes(source)
      ? leadSources.sources.filter((s) => s !== source)
      : [...leadSources.sources, source];
    setData((d) => ({
      ...d,
      leadSources: {
        ...leadSources,
        sources: next,
        topSources: leadSources.topSources.filter((t) => next.includes(t)),
      },
    }));
  }

  function toggleTop(source: string) {
    let next = leadSources.topSources;
    if (next.includes(source)) {
      next = next.filter((s) => s !== source);
    } else if (next.length < 3) {
      next = [...next, source];
    } else {
      return; // max 3
    }
    setData((d) => ({
      ...d,
      leadSources: { ...leadSources, topSources: next },
    }));
  }

  return (
    <div className="space-y-7">
      <StepHeader
        badge="Lead sources"
        title="Where do your leads come from?"
        subtitle="Select everything you use, then mark your top 3 — that&apos;s where we&apos;ll focus the analysis."
      />

      {/* Top 3 selector visible when there are selections */}
      {leadSources.sources.length > 0 && (
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Star
              className="h-4 w-4 text-amber-600 fill-amber-600"
              strokeWidth={1.5}
            />
            <span className="text-xs font-semibold text-amber-900">
              Top 3 sources ({leadSources.topSources.length}/3)
            </span>
          </div>
          <p className="text-[11px] text-amber-800/80 mt-1">
            Click a source below twice (or use the ★ button) to mark it as a top
            source.
          </p>
        </div>
      )}

      {LEAD_SOURCE_GROUPS.map((group) => (
        <div key={group.title} className="space-y-2.5">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {group.title}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {group.items.map((item) => {
              const selected = leadSources.sources.includes(item);
              const isTop = leadSources.topSources.includes(item);
              return (
                <div key={item} className="relative">
                  <button
                    type="button"
                    onClick={() => toggleSource(item)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 pr-8 rounded-lg border-2 text-left text-[13px] font-medium transition-all hover:border-foreground/30",
                      selected
                        ? "border-primary bg-accent-subtle text-foreground"
                        : "border-border bg-card text-foreground"
                    )}
                  >
                    {group.branded && <BrandIcon name={item} size={26} />}
                    <span className="leading-tight truncate">{item}</span>
                  </button>
                  {selected && (
                    <button
                      type="button"
                      onClick={() => toggleTop(item)}
                      aria-label={isTop ? "Unmark top source" : "Mark top source"}
                      className={cn(
                        "absolute top-1/2 right-2 -translate-y-1/2 h-6 w-6 rounded-md inline-flex items-center justify-center transition-colors",
                        isTop
                          ? "bg-amber-100 text-amber-600"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <Star
                        className={cn(
                          "h-3.5 w-3.5",
                          isTop && "fill-amber-500 text-amber-500"
                        )}
                        strokeWidth={1.75}
                      />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

    </div>
  );
}

export function getLeadSourcesMissing(data: OnboardingData): string[] {
  const ls = data.leadSources;
  const missing: string[] = [];
  if (!ls || ls.sources.length === 0)
    missing.push("Pick at least 1 lead source");
  return missing;
}
