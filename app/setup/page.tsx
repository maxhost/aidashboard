"use client";

import { useEffect, useState } from "react";
import { WizardShell } from "@/components/onboarding/wizard-shell";
import { WelcomeStep } from "@/components/onboarding/steps/welcome-step";
import {
  BusinessStep,
  getBusinessMissing,
} from "@/components/onboarding/steps/business-step";
import {
  TeamStep,
  getTeamMissing,
} from "@/components/onboarding/steps/team-step";
import {
  MarketStep,
  getMarketMissing,
} from "@/components/onboarding/steps/market-step";
import {
  LeadSourcesStep,
  getLeadSourcesMissing,
} from "@/components/onboarding/steps/lead-sources-step";
import {
  TechStackStep,
  getTechStackMissing,
} from "@/components/onboarding/steps/tech-stack-step";
import {
  WorkflowsStep,
  getWorkflowsMissing,
} from "@/components/onboarding/steps/workflows-step";
import {
  GoalsStep,
  getGoalsMissing,
} from "@/components/onboarding/steps/goals-step";
import { CompleteStep } from "@/components/onboarding/steps/complete-step";
import { STEPS } from "@/lib/onboarding/types";
import {
  loadOnboarding,
  saveOnboarding,
} from "@/lib/onboarding/storage";
import type { OnboardingData } from "@/lib/onboarding/types";

const TOTAL = STEPS.length;

export default function SetupPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({});
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadOnboarding();
    if (saved) setData(saved);
    setHydrated(true);
  }, []);

  // Persist on every change
  useEffect(() => {
    if (hydrated) saveOnboarding(data);
  }, [data, hydrated]);

  const currentStep = STEPS[step];
  const isLastStepBeforeComplete = step === TOTAL - 2;
  const isComplete = step === TOTAL - 1;

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function getMissing(): string[] {
    switch (currentStep.key) {
      case "business":
        return getBusinessMissing(data);
      case "team":
        return getTeamMissing(data);
      case "market":
        return getMarketMissing(data);
      case "leadSources":
        return getLeadSourcesMissing(data);
      case "techStack":
        return getTechStackMissing(data);
      case "workflows":
        return getWorkflowsMissing(data);
      case "goals":
        return getGoalsMissing(data);
      default:
        return [];
    }
  }
  const missing = getMissing();
  const canAdvance = missing.length === 0;

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <WizardShell
      step={step}
      totalSteps={TOTAL}
      stepLabel={currentStep.label}
      onBack={back}
      onNext={next}
      canBack={step > 0 && !isComplete}
      canNext={canAdvance && !isComplete}
      missing={missing}
      nextLabel={
        currentStep.key === "welcome"
          ? "Get started"
          : isLastStepBeforeComplete
            ? "Finish setup"
            : "Continue"
      }
      hideFooter={currentStep.key === "welcome" || isComplete}
    >
      {currentStep.key === "welcome" && <WelcomeStep onNext={next} />}
      {currentStep.key === "business" && (
        <BusinessStep data={data} setData={setData} />
      )}
      {currentStep.key === "team" && (
        <TeamStep data={data} setData={setData} />
      )}
      {currentStep.key === "market" && (
        <MarketStep data={data} setData={setData} />
      )}
      {currentStep.key === "leadSources" && (
        <LeadSourcesStep data={data} setData={setData} />
      )}
      {currentStep.key === "techStack" && (
        <TechStackStep data={data} setData={setData} />
      )}
      {currentStep.key === "workflows" && (
        <WorkflowsStep data={data} setData={setData} />
      )}
      {currentStep.key === "goals" && (
        <GoalsStep data={data} setData={setData} />
      )}
      {currentStep.key === "complete" && <CompleteStep data={data} />}
    </WizardShell>
  );
}
