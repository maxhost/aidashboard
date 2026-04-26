"use client";

import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center text-center pt-4 pb-8">
      <div className="relative">
        <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-md">
          <Sparkles
            className="h-7 w-7 text-primary-foreground"
            strokeWidth={1.75}
          />
        </div>
        <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-xl bg-emerald-500 border-4 border-background flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">👋</span>
        </div>
      </div>

      <h1 className="mt-6 text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
        Hi, let&apos;s get to know your business
      </h1>
      <p className="mt-3 text-base text-muted-foreground max-w-xl leading-relaxed">
        Answer a few questions so we can personalize your dashboard with the
        right metrics, workflows, and benchmarks for your team.
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
        <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
        Takes about 8 minutes · 8 questions
      </div>

      <Button onClick={onNext} className="mt-8 h-11 px-6 gap-1.5 text-sm">
        Get started
        <ArrowRight className="h-4 w-4" strokeWidth={2} />
      </Button>

      <p className="mt-6 text-[11px] text-muted-foreground/70 max-w-md">
        Your answers stay on this device until you finish. No account needed
        for the demo.
      </p>
    </div>
  );
}
