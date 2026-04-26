"use client";

import { ChipMultiSelect, OptionGrid } from "@/components/onboarding/option-card";
import { FieldGroup, StepHeader } from "@/components/onboarding/wizard-shell";
import { Input } from "@/components/ui/input";
import {
  ANNUAL_VOLUME_OPTIONS,
  BROKERAGES,
  TEAM_ROLES,
  TEAM_SIZE_OPTIONS,
} from "@/lib/onboarding/options";
import type {
  AnnualVolume,
  OnboardingData,
  TeamSize,
} from "@/lib/onboarding/types";

export function TeamStep({
  data,
  setData,
}: {
  data: OnboardingData;
  setData: (updater: (d: OnboardingData) => OnboardingData) => void;
}) {
  const team = data.team ?? {
    size: "6-15" as TeamSize,
    roles: [] as string[],
    annualVolume: "5-15M" as AnnualVolume,
    brokerage: "",
  };

  function update<K extends keyof typeof team>(
    key: K,
    value: (typeof team)[K]
  ) {
    setData((d) => ({ ...d, team: { ...team, [key]: value } }));
  }

  function toggleRole(role: string) {
    const next = team.roles.includes(role)
      ? team.roles.filter((r) => r !== role)
      : [...team.roles, role];
    update("roles", next);
  }

  return (
    <div className="space-y-7">
      <StepHeader
        badge="Team & structure"
        title="How big is your team?"
        subtitle="A snapshot of size, structure, and brokerage."
      />

      <FieldGroup label="How many agents on your team?">
        <OptionGrid
          options={TEAM_SIZE_OPTIONS}
          value={team.size}
          onChange={(v) => update("size", v as TeamSize)}
          columns={3}
        />
      </FieldGroup>

      <FieldGroup
        label="Dedicated support roles"
        hint="Select everyone you have on the team beyond producing agents."
      >
        <ChipMultiSelect
          options={TEAM_ROLES}
          values={team.roles}
          onToggle={toggleRole}
          columns={3}
        />
      </FieldGroup>

      <FieldGroup label="Team annual volume">
        <OptionGrid
          options={ANNUAL_VOLUME_OPTIONS}
          value={team.annualVolume}
          onChange={(v) => update("annualVolume", v as AnnualVolume)}
          columns={3}
          size="compact"
        />
      </FieldGroup>

      <FieldGroup label="Brokerage">
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={BROKERAGES.includes(team.brokerage) ? team.brokerage : ""}
            onChange={(e) => update("brokerage", e.target.value)}
            className="h-10 px-3 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="" disabled>
              Select brokerage
            </option>
            {BROKERAGES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {team.brokerage === "Other" && (
            <Input
              placeholder="Brokerage name"
              onChange={(e) => update("brokerage", e.target.value || "Other")}
              className="h-10"
            />
          )}
        </div>
      </FieldGroup>
    </div>
  );
}

export function isTeamValid(data: OnboardingData): boolean {
  const t = data.team;
  return Boolean(t && t.size && t.annualVolume && t.brokerage);
}
