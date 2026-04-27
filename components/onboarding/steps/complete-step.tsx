"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import type { OnboardingData } from "@/lib/onboarding/types";
import { saveOnboarding } from "@/lib/onboarding/storage";
import { signIn } from "@/lib/auth";

const TASKS = [
  "Saving your workspace profile",
  "Notifying the Pulsor team",
  "Mapping your tech stack",
  "Calibrating benchmarks",
  "Personalizing your dashboard",
];

async function submitToServer(data: OnboardingData): Promise<void> {
  try {
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
      keepalive: true,
    });
  } catch (err) {
    // Don't block the user if the network request fails — they still see the dashboard.
    console.warn("[onboarding] Submit failed, will retry from localStorage:", err);
  }
}

export function CompleteStep({ data }: { data: OnboardingData }) {
  const router = useRouter();
  const [taskIndex, setTaskIndex] = useState(0);
  const [done, setDone] = useState(false);
  const firstName = data.basicInfo?.name?.split(" ")[0] ?? "there";

  useEffect(() => {
    const completed: OnboardingData = {
      ...data,
      completedAt: new Date().toISOString(),
    };
    // Persist locally
    saveOnboarding(completed);
    // Sign the user in (mock auth)
    signIn();
    // Send to server (Resend email) — fire and forget, doesn't block UX
    void submitToServer(completed);

    // Stagger the loader text to feel like setup is happening
    const interval = setInterval(() => {
      setTaskIndex((i) => {
        if (i >= TASKS.length - 1) {
          clearInterval(interval);
          setDone(true);
          return i;
        }
        return i + 1;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [data]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => router.push("/overview"), 900);
    return () => clearTimeout(t);
  }, [done, router]);

  return (
    <div className="flex flex-col items-center text-center pt-8 pb-12">
      <div className="relative">
        <div
          className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-md transition-all ${
            done ? "bg-emerald-500" : "bg-primary"
          }`}
        >
          {done ? (
            <CheckCircle2
              className="h-7 w-7 text-white"
              strokeWidth={2.25}
            />
          ) : (
            <Sparkles
              className="h-7 w-7 text-primary-foreground"
              strokeWidth={1.75}
            />
          )}
        </div>
      </div>

      <h1 className="mt-6 text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
        {done ? `All set, ${firstName}!` : `Almost done, ${firstName}…`}
      </h1>
      <p className="mt-3 text-base text-muted-foreground max-w-xl leading-relaxed">
        {done
          ? "Your dashboard is ready. Sending you in now…"
          : "Personalizing your dashboard based on your answers."}
      </p>

      <div className="mt-8 w-full max-w-md space-y-2.5">
        {TASKS.map((t, i) => {
          const isDone = i < taskIndex || done;
          const isActive = i === taskIndex && !done;
          return (
            <div
              key={t}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all ${
                isDone
                  ? "border-emerald-100 bg-emerald-50/60 text-emerald-900"
                  : isActive
                    ? "border-primary/30 bg-accent-subtle text-foreground"
                    : "border-border bg-card text-muted-foreground/60"
              }`}
            >
              <span className="shrink-0">
                {isDone ? (
                  <CheckCircle2
                    className="h-4 w-4 text-emerald-600"
                    strokeWidth={2.25}
                  />
                ) : isActive ? (
                  <Loader2
                    className="h-4 w-4 animate-spin text-primary"
                    strokeWidth={2}
                  />
                ) : (
                  <span className="block h-4 w-4 rounded-full border-2 border-muted-foreground/20" />
                )}
              </span>
              <span className="text-sm font-medium text-left">{t}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
