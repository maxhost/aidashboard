"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ROLE_KEY = "pulsor:role";
type Role = "team-leader" | "realtor";
const ROLES: { key: Role; label: string }[] = [
  { key: "team-leader", label: "Team Leader" },
  { key: "realtor", label: "Realtor" },
];

/**
 * Design-time toggle that simulates which user role is active.
 * Persisted in localStorage so navigation doesn't reset it.
 * Other parts of the app can read `localStorage.getItem("pulsor:role")`
 * to render conditional sections later.
 */
export function RoleSwitch() {
  const [role, setRole] = useState<Role>("team-leader");

  useEffect(() => {
    const stored = localStorage.getItem(ROLE_KEY) as Role | null;
    if (stored === "team-leader" || stored === "realtor") {
      setRole(stored);
    }
  }, []);

  function pick(next: Role) {
    setRole(next);
    localStorage.setItem(ROLE_KEY, next);
    // Notify any listeners on the same tab
    window.dispatchEvent(new Event("pulsor:role-change"));
  }

  return (
    <div
      role="tablist"
      aria-label="Switch role view"
      className="inline-flex items-center rounded-full bg-card ring-1 ring-foreground/10 p-0.5"
    >
      {ROLES.map((r) => {
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
