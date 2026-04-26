import type { OnboardingData } from "./types";

const KEY = "aidashboard:onboarding";

export function saveOnboarding(data: OnboardingData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // ignore quota / private mode errors
  }
}

export function loadOnboarding(): OnboardingData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OnboardingData) : null;
  } catch {
    return null;
  }
}

export function clearOnboarding(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
