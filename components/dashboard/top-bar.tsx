"use client";

import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { RoleSwitch } from "@/components/dashboard/role-switch";

export function TopBar({
  onOpenSidebar,
  desktopCollapsed = false,
  onToggleDesktopSidebar,
}: {
  onOpenSidebar?: () => void;
  desktopCollapsed?: boolean;
  onToggleDesktopSidebar?: () => void;
}) {
  const DesktopIcon = desktopCollapsed ? PanelLeftOpen : PanelLeftClose;
  return (
    <header className="h-14 sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-1 min-w-0">
        {onOpenSidebar && (
          <button
            type="button"
            aria-label="Open menu"
            onClick={onOpenSidebar}
            className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors -ml-1"
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          </button>
        )}
        {onToggleDesktopSidebar && (
          <button
            type="button"
            aria-label={desktopCollapsed ? "Show sidebar" : "Hide sidebar"}
            title={desktopCollapsed ? "Show sidebar" : "Hide sidebar"}
            onClick={onToggleDesktopSidebar}
            className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors -ml-1.5"
          >
            <DesktopIcon className="h-5 w-5" strokeWidth={1.75} />
          </button>
        )}
      </div>

      <RoleSwitch />
    </header>
  );
}
