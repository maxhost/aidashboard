"use client";

import { useEffect, useState } from "react";
import { SidebarNav, MobileSidebar } from "@/components/dashboard/sidebar-nav";
import { TopBar } from "@/components/dashboard/top-bar";
import { AuthGate } from "@/components/auth/auth-gate";

const SIDEBAR_COLLAPSED_KEY = "pulsor:sidebar-collapsed";

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored === "1") setDesktopCollapsed(true);
  }, []);

  function toggleDesktopSidebar() {
    setDesktopCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <AuthGate>
      <div className="flex min-h-screen bg-background">
        <SidebarNav collapsed={desktopCollapsed} />
        <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
        <div className="flex-1 min-w-0 flex flex-col">
          <TopBar
            onOpenSidebar={() => setMobileOpen(true)}
            desktopCollapsed={desktopCollapsed}
            onToggleDesktopSidebar={toggleDesktopSidebar}
          />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </AuthGate>
  );
}
