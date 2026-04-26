"use client";

import { Input } from "@/components/ui/input";
import { OptionGrid } from "@/components/onboarding/option-card";
import { FieldGroup, StepHeader } from "@/components/onboarding/wizard-shell";
import { ROLE_OPTIONS, YEARS_OPTIONS } from "@/lib/onboarding/options";
import type { OnboardingData, Role, YearsInRE } from "@/lib/onboarding/types";

export function BusinessStep({
  data,
  setData,
}: {
  data: OnboardingData;
  setData: (updater: (d: OnboardingData) => OnboardingData) => void;
}) {
  const info = data.basicInfo ?? {
    name: "",
    email: "",
    company: "",
    role: "team-leader" as Role,
    yearsInRE: "5-10" as YearsInRE,
  };

  function update<K extends keyof typeof info>(
    key: K,
    value: (typeof info)[K]
  ) {
    setData((d) => ({
      ...d,
      basicInfo: { ...info, [key]: value },
    }));
  }

  return (
    <div className="space-y-7">
      <StepHeader
        badge="About you"
        title="Tell us about your business"
        subtitle="The basics — who you are and how you operate."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup label="Your name">
          <Input
            value={info.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Maria Gonzalez"
            className="h-10"
            autoFocus
          />
        </FieldGroup>
        <FieldGroup label="Email">
          <Input
            type="email"
            value={info.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@team.com"
            className="h-10"
          />
        </FieldGroup>
      </div>

      <FieldGroup label="Company / Brokerage name">
        <Input
          value={info.company}
          onChange={(e) => update("company", e.target.value)}
          placeholder="Gonzalez Team — eXp Realty"
          className="h-10"
        />
      </FieldGroup>

      <FieldGroup label="Your role">
        <OptionGrid
          options={ROLE_OPTIONS}
          value={info.role}
          onChange={(v) => update("role", v as Role)}
          columns={2}
        />
      </FieldGroup>

      <FieldGroup label="Years in real estate">
        <OptionGrid
          options={YEARS_OPTIONS}
          value={info.yearsInRE}
          onChange={(v) => update("yearsInRE", v as YearsInRE)}
          columns={3}
          size="compact"
        />
      </FieldGroup>
    </div>
  );
}

export function getBusinessMissing(data: OnboardingData): string[] {
  const i = data.basicInfo;
  const missing: string[] = [];
  if (!i || i.name.trim().length < 2) missing.push("Your name");
  if (!i || !i.email.includes("@")) missing.push("Email");
  if (!i || i.company.trim().length < 2) missing.push("Company name");
  if (!i?.role) missing.push("Your role");
  if (!i?.yearsInRE) missing.push("Years in RE");
  return missing;
}
