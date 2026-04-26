"use client";

import { ChipMultiSelect, OptionGrid } from "@/components/onboarding/option-card";
import { FieldGroup, StepHeader } from "@/components/onboarding/wizard-shell";
import { Input } from "@/components/ui/input";
import {
  BIGGEST_PAIN_OPTIONS,
  SUCCESS_METRICS,
} from "@/lib/onboarding/options";
import type { BiggestPain, OnboardingData } from "@/lib/onboarding/types";

export function GoalsStep({
  data,
  setData,
}: {
  data: OnboardingData;
  setData: (updater: (d: OnboardingData) => OnboardingData) => void;
}) {
  const goals = data.goals ?? {
    biggestPain: "low-conversion" as BiggestPain,
    biggestPainOther: undefined,
    successMetrics: [] as string[],
    revenueTarget: undefined,
  };

  function update<K extends keyof typeof goals>(
    key: K,
    value: (typeof goals)[K]
  ) {
    setData((d) => ({ ...d, goals: { ...goals, [key]: value } }));
  }

  function toggleMetric(metric: string) {
    const next = goals.successMetrics.includes(metric)
      ? goals.successMetrics.filter((m) => m !== metric)
      : [...goals.successMetrics, metric];
    update("successMetrics", next);
  }

  // Build pain options with category badges in label
  const painOptions = BIGGEST_PAIN_OPTIONS.map((p) => ({
    value: p.value,
    label: p.label,
    hint: p.category,
  }));

  return (
    <div className="space-y-7">
      <StepHeader
        badge="Goals & pain"
        title="What's the biggest pain point right now?"
        subtitle="Pick the one that&apos;s costing you the most. We&apos;ll focus the dashboard around it."
      />

      <FieldGroup label="Biggest pain point">
        <OptionGrid
          options={painOptions}
          value={goals.biggestPain}
          onChange={(v) => update("biggestPain", v as BiggestPain)}
          columns={2}
        />
      </FieldGroup>

      {goals.biggestPain === "other" && (
        <FieldGroup label="Tell us what's the pain">
          <Input
            value={goals.biggestPainOther ?? ""}
            onChange={(e) => update("biggestPainOther", e.target.value)}
            placeholder="Describe in one sentence…"
            className="h-10"
          />
        </FieldGroup>
      )}

      <FieldGroup
        label="What would success look like in 3 months?"
        hint="Select everything that matters."
      >
        <ChipMultiSelect
          options={SUCCESS_METRICS}
          values={goals.successMetrics}
          onToggle={toggleMetric}
          columns={2}
        />
      </FieldGroup>

      {goals.successMetrics.includes("Specific revenue target") && (
        <FieldGroup label="Revenue target">
          <Input
            value={goals.revenueTarget ?? ""}
            onChange={(e) => update("revenueTarget", e.target.value)}
            placeholder="e.g. $25M closed by Q4"
            className="h-10 max-w-md"
          />
        </FieldGroup>
      )}
    </div>
  );
}

export function getGoalsMissing(data: OnboardingData): string[] {
  const g = data.goals;
  const missing: string[] = [];
  if (!g?.biggestPain) missing.push("Biggest pain point");
  if (!g || g.successMetrics.length === 0)
    missing.push("At least 1 success metric");
  if (g?.biggestPain === "other" && !g.biggestPainOther?.trim())
    missing.push("Describe the pain");
  if (
    g?.successMetrics.includes("Specific revenue target") &&
    !g.revenueTarget?.trim()
  )
    missing.push("Revenue target");
  return missing;
}
