"use client";

import { ChipMultiSelect, OptionGrid } from "@/components/onboarding/option-card";
import { FieldGroup, StepHeader } from "@/components/onboarding/wizard-shell";
import { Input } from "@/components/ui/input";
import {
  AVG_PRICE_OPTIONS,
  CLIENT_TYPES,
  PROPERTY_TYPES,
} from "@/lib/onboarding/options";
import type { AvgPrice, OnboardingData } from "@/lib/onboarding/types";

export function MarketStep({
  data,
  setData,
}: {
  data: OnboardingData;
  setData: (updater: (d: OnboardingData) => OnboardingData) => void;
}) {
  const market = data.market ?? {
    mainMarket: "",
    propertyTypes: [] as string[],
    avgPrice: "500K-1M" as AvgPrice,
    clientTypes: [] as string[],
  };

  function update<K extends keyof typeof market>(
    key: K,
    value: (typeof market)[K]
  ) {
    setData((d) => ({ ...d, market: { ...market, [key]: value } }));
  }

  function toggle(field: "propertyTypes" | "clientTypes", value: string) {
    const arr = market[field];
    const next = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];
    update(field, next);
  }

  return (
    <div className="space-y-7">
      <StepHeader
        badge="Market & specialty"
        title="Where and what do you sell?"
        subtitle="So we can benchmark you against teams in similar markets."
      />

      <FieldGroup
        label="Main market"
        hint="City, region, or metro area you operate in."
      >
        <Input
          value={market.mainMarket}
          onChange={(e) => update("mainMarket", e.target.value)}
          placeholder="Boston metro, MA"
          className="h-10 max-w-md"
        />
      </FieldGroup>

      <FieldGroup
        label="Property types you sell"
        hint="Select all that apply."
      >
        <ChipMultiSelect
          options={PROPERTY_TYPES}
          values={market.propertyTypes}
          onToggle={(v) => toggle("propertyTypes", v)}
          columns={3}
        />
      </FieldGroup>

      <FieldGroup label="Average property price">
        <OptionGrid
          options={AVG_PRICE_OPTIONS}
          value={market.avgPrice}
          onChange={(v) => update("avgPrice", v as AvgPrice)}
          columns={3}
          size="compact"
        />
      </FieldGroup>

      <FieldGroup label="Main client types" hint="Select all that apply.">
        <ChipMultiSelect
          options={CLIENT_TYPES}
          values={market.clientTypes}
          onToggle={(v) => toggle("clientTypes", v)}
          columns={3}
        />
      </FieldGroup>
    </div>
  );
}

export function getMarketMissing(data: OnboardingData): string[] {
  const m = data.market;
  const missing: string[] = [];
  if (!m || m.mainMarket.trim().length < 2) missing.push("Main market");
  if (!m || m.propertyTypes.length === 0)
    missing.push("At least 1 property type");
  if (!m || m.clientTypes.length === 0) missing.push("At least 1 client type");
  return missing;
}
