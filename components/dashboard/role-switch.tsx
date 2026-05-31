"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getCachedUser } from "@/lib/session";

export const ROLE_KEY = "pulsor:role";
export type Role = "team-leader" | "agent" | "assistant" | "back-office";

const ROLES: { key: Role; label: string }[] = [
  { key: "team-leader", label: "Team Leader" },
  { key: "agent", label: "Agent" },
  { key: "assistant", label: "Assistant" },
  { key: "back-office", label: "Back Office" },
];

// Realtors only see Assistant; operators see Assistant + Back Office.
// Other roles (Team Leader / Agent) are demo-only and hidden in production.
function visibleRolesForAuth(authRole: "operator" | "realtor" | null): Role[] {
  if (authRole === "operator") return ["assistant", "back-office"];
  if (authRole === "realtor") return ["assistant"];
  return [];
}

export function isRole(value: unknown): value is Role {
  return (
    value === "team-leader" ||
    value === "agent" ||
    value === "assistant" ||
    value === "back-office"
  );
}

/**
 * Design-time toggle that simulates which user role is active.
 * Persisted in localStorage so navigation doesn't reset it.
 * Other parts of the app can read `localStorage.getItem("pulsor:role")`
 * to render conditional sections later.
 */
export function RoleSwitch() {
  const [role, setRole] = useState<Role>("assistant");
  const [authRole, setAuthRole] = useState<"operator" | "realtor" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ROLE_KEY);
    const auth = getCachedUser();
    setAuthRole(auth?.role ?? null);
    const allowed = visibleRolesForAuth(auth?.role ?? null);
    if (isRole(stored) && allowed.includes(stored)) {
      setRole(stored);
    } else if (allowed.length > 0) {
      // Stored role is hidden for this auth -> snap to the first allowed.
      setRole(allowed[0]);
      localStorage.setItem(ROLE_KEY, allowed[0]);
      window.dispatchEvent(new Event("pulsor:role-change"));
    }
  }, []);

  function pick(next: Role) {
    setRole(next);
    localStorage.setItem(ROLE_KEY, next);
    // Notify any listeners on the same tab
    window.dispatchEvent(new Event("pulsor:role-change"));
  }

  const visibleKeys = visibleRolesForAuth(authRole);
  const visible = ROLES.filter((r) => visibleKeys.includes(r.key));

  // Realtors only have a single tab (Assistant). Hide the switcher entirely.
  if (visible.length <= 1) return null;

  return (
    <div
      role="tablist"
      aria-label="Switch role view"
      className="inline-flex items-center rounded-full bg-card ring-1 ring-foreground/10 p-0.5"
    >
      {visible.map((r) => {
        const active = role === r.key;
        return (
          <button
            key={r.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => pick(r.key)}
            className={cn(
              "px-3 py-1 text-[12px] font-medium rounded-full transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
