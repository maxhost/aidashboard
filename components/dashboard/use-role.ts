"use client";

import { useEffect, useState } from "react";
import { ROLE_KEY, isRole, type Role } from "@/components/dashboard/role-switch";

/**
 * Read the currently-selected design-time role from localStorage and stay
 * subscribed to changes — both same-tab (via "pulsor:role-change") and
 * cross-tab (via "storage").
 */
export function useRole(initial: Role = "team-leader"): Role {
  const [role, setRole] = useState<Role>(initial);
  useEffect(() => {
    const read = () => {
      const stored = localStorage.getItem(ROLE_KEY);
      if (isRole(stored)) setRole(stored);
    };
    read();
    const onChange = () => read();
    window.addEventListener("pulsor:role-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("pulsor:role-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return role;
}

export function useIsBackOffice(): boolean {
  return useRole() === "back-office";
}
