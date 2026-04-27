"use client";

import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PulsorLockup } from "@/components/brand/pulsor";
import { cn } from "@/lib/utils";

export function WizardShell({
  step,
  totalSteps,
  stepLabel,
  onBack,
  onNext,
  canBack,
  canNext,
  nextLabel = "Continue",
  hideFooter = false,
  missing = [],
  children,
}: {
  step: number;
  totalSteps: number;
  stepLabel: string;
  onBack?: () => void;
  onNext?: () => void;
  canBack?: boolean;
  canNext?: boolean;
  nextLabel?: string;
  hideFooter?: boolean;
  missing?: string[];
  children: React.ReactNode;
}) {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar with brand + progress */}
      <header className="px-4 sm:px-6 lg:px-10 py-5 border-b border-border/60 bg-card sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <div className="shrink-0 hidden sm:block">
            <PulsorLockup size={28} textClassName="text-sm" />
          </div>
          <div className="shrink-0 sm:hidden">
            <PulsorLockup size={28} textClassName="text-sm hidden" />
          </div>

          <div className="flex-1 flex items-center gap-3 min-w-0">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground shrink-0">
              {step + 1} / {totalSteps}
            </span>
          </div>

          <span className="text-xs font-medium text-muted-foreground hidden md:block">
            {stepLabel}
          </span>
        </div>
      </header>

      {/* Step body */}
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        <div className="max-w-3xl mx-auto">{children}</div>
      </main>

      {/* Footer with Back / Next */}
      {!hideFooter && (
        <footer className="px-4 sm:px-6 lg:px-10 py-4 border-t border-border/60 bg-card sticky bottom-0">
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {!canNext && missing.length > 0 && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-[12px] text-amber-900">
                <AlertCircle
                  className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5"
                  strokeWidth={2}
                />
                <div>
                  <span className="font-semibold">Missing to continue:</span>{" "}
                  <span className="text-amber-800">
                    {missing.join(" · ")}
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                disabled={!canBack}
                className={cn(
                  "gap-1.5 text-muted-foreground",
                  !canBack && "invisible"
                )}
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                Back
              </Button>
              <Button
                type="button"
                onClick={onNext}
                disabled={!canNext}
                className="gap-1.5 min-w-[140px]"
              >
                {nextLabel}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export function StepHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <div className="mb-7">
      {badge && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-subtle px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {badge}
        </span>
      )}
      <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function FieldGroup({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <div>
        <label className="text-sm font-semibold text-foreground">{label}</label>
        {hint && (
          <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
        )}
      </div>
      {children}
    </div>
  );
}
