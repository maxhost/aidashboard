"use client";

import { OptionGrid } from "@/components/onboarding/option-card";
import { FieldGroup, StepHeader } from "@/components/onboarding/wizard-shell";
import {
  CLOSING_OPTIONS,
  FOLLOWUP_CADENCE_OPTIONS,
  LEAD_CAPTURE_OPTIONS,
  LEAD_SCORING_OPTIONS,
  RESPONSE_TIME_OPTIONS,
  SHOWINGS_OPTIONS,
} from "@/lib/onboarding/options";
import type {
  Closing,
  FollowUpCadence,
  LeadCapture,
  LeadScoring,
  OnboardingData,
  ResponseTime,
  Showings,
} from "@/lib/onboarding/types";

export function WorkflowsStep({
  data,
  setData,
}: {
  data: OnboardingData;
  setData: (updater: (d: OnboardingData) => OnboardingData) => void;
}) {
  const wf = data.workflows ?? {
    leadCapture: "auto-website" as LeadCapture,
    responseTime: "5-15min" as ResponseTime,
    followUpCadence: "mix" as FollowUpCadence,
    leadScoring: "manual" as LeadScoring,
    showings: "calendly" as Showings,
    closing: "templates" as Closing,
  };

  function update<K extends keyof typeof wf>(key: K, value: (typeof wf)[K]) {
    setData((d) => ({ ...d, workflows: { ...wf, [key]: value } }));
  }

  return (
    <div className="space-y-7">
      <StepHeader
        badge="Workflows"
        title="How do you handle leads today?"
        subtitle="The current state of your operations — what's manual vs automated."
      />

      <FieldGroup label="Lead capture">
        <OptionGrid
          options={LEAD_CAPTURE_OPTIONS}
          value={wf.leadCapture}
          onChange={(v) => update("leadCapture", v as LeadCapture)}
          columns={3}
          size="compact"
        />
      </FieldGroup>

      <FieldGroup label="Lead response time goal">
        <OptionGrid
          options={RESPONSE_TIME_OPTIONS}
          value={wf.responseTime}
          onChange={(v) => update("responseTime", v as ResponseTime)}
          columns={3}
        />
      </FieldGroup>

      <FieldGroup label="Follow-up cadence">
        <OptionGrid
          options={FOLLOWUP_CADENCE_OPTIONS}
          value={wf.followUpCadence}
          onChange={(v) => update("followUpCadence", v as FollowUpCadence)}
          columns={2}
        />
      </FieldGroup>

      <FieldGroup label="Lead scoring / qualification">
        <OptionGrid
          options={LEAD_SCORING_OPTIONS}
          value={wf.leadScoring}
          onChange={(v) => update("leadScoring", v as LeadScoring)}
          columns={2}
        />
      </FieldGroup>

      <FieldGroup label="Showings / appointments">
        <OptionGrid
          options={SHOWINGS_OPTIONS}
          value={wf.showings}
          onChange={(v) => update("showings", v as Showings)}
          columns={2}
          size="compact"
        />
      </FieldGroup>

      <FieldGroup label="Closing process">
        <OptionGrid
          options={CLOSING_OPTIONS}
          value={wf.closing}
          onChange={(v) => update("closing", v as Closing)}
          columns={2}
        />
      </FieldGroup>
    </div>
  );
}

export function isWorkflowsValid(data: OnboardingData): boolean {
  const w = data.workflows;
  return Boolean(
    w &&
      w.leadCapture &&
      w.responseTime &&
      w.followUpCadence &&
      w.leadScoring &&
      w.showings &&
      w.closing
  );
}
