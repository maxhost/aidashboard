"use client";

import { ChipMultiSelect, OptionGrid } from "@/components/onboarding/option-card";
import { FieldGroup, StepHeader } from "@/components/onboarding/wizard-shell";
import {
  MONTHLY_SPEND_OPTIONS,
  TECH_STACK_GROUPS,
} from "@/lib/onboarding/options";
import type { MonthlySpend, OnboardingData } from "@/lib/onboarding/types";

type StackKey = (typeof TECH_STACK_GROUPS)[number]["key"];

export function TechStackStep({
  data,
  setData,
}: {
  data: OnboardingData;
  setData: (updater: (d: OnboardingData) => OnboardingData) => void;
}) {
  const stack = data.techStack ?? {
    crm: [] as string[],
    leadCapture: [] as string[],
    communication: [] as string[],
    marketing: [] as string[],
    transactions: [] as string[],
    aiTools: [] as string[],
    analytics: [] as string[],
    phone: [] as string[],
    monthlySpend: undefined as MonthlySpend | undefined,
  };

  function toggle(key: StackKey, item: string) {
    const arr = stack[key] as string[];
    const next = arr.includes(item)
      ? arr.filter((i) => i !== item)
      : [...arr, item];
    setData((d) => ({
      ...d,
      techStack: { ...stack, [key]: next },
    }));
  }

  function setSpend(value: MonthlySpend) {
    setData((d) => ({
      ...d,
      techStack: { ...stack, monthlySpend: value },
    }));
  }

  const totalSelected = TECH_STACK_GROUPS.reduce(
    (acc, g) => acc + (stack[g.key] as string[]).length,
    0
  );

  return (
    <div className="space-y-7">
      <StepHeader
        badge="Tech stack"
        title="What tools do you use today?"
        subtitle="Pick everything in your current stack — even tools you barely use. We&apos;ll surface the ones that drive ROI."
      />

      <div className="rounded-xl border border-border/70 bg-muted/30 px-4 py-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Selected
        </div>
        <div className="font-mono text-xl font-bold tabular-nums text-foreground mt-0.5">
          {totalSelected} <span className="text-sm font-normal text-muted-foreground">tools</span>
        </div>
      </div>

      {TECH_STACK_GROUPS.map((group) => {
        const values = stack[group.key] as string[];
        return (
          <div key={group.key} className="space-y-2.5">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {group.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {group.description}
              </p>
            </div>
            <ChipMultiSelect
              options={group.items}
              values={values}
              onToggle={(v) => toggle(group.key, v)}
              columns={3}
              withBrandIcon
            />
          </div>
        );
      })}

      <FieldGroup
        label="Total monthly software spend"
        hint="Rough estimate across all the tools above."
      >
        <OptionGrid
          options={MONTHLY_SPEND_OPTIONS}
          value={stack.monthlySpend}
          onChange={(v) => setSpend(v as MonthlySpend)}
          columns={3}
          size="compact"
        />
      </FieldGroup>
    </div>
  );
}

export function getTechStackMissing(data: OnboardingData): string[] {
  const s = data.techStack;
  const missing: string[] = [];
  if (!s || s.crm.length === 0)
    missing.push("At least 1 CRM (most important data point)");
  if (!s || !s.monthlySpend) missing.push("Monthly software spend");
  return missing;
}
