"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Workflow,
  Users,
  Sparkles,
  PieChart,
  Settings,
  LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_PRIMARY = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/workflows", label: "Workflows", icon: Workflow },
  { href: "/team", label: "Team", icon: Users },
  { href: "/insights", label: "Insights", icon: Sparkles },
] as const;

const NAV_SECONDARY = [
  { href: "/settings", label: "Settings", icon: Settings, disabled: true },
  { href: "/help", label: "Help & support", icon: LifeBuoy, disabled: true },
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex h-screen w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-border sticky top-0">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-6 border-b border-border">
        <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
          <PieChart
            className="h-4 w-4 text-primary-foreground"
            strokeWidth={2.25}
          />
        </div>
        <span className="font-semibold text-[15px] tracking-tight">
          RE Data Copilot
        </span>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Workspace
        </p>
        {NAV_PRIMARY.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
                strokeWidth={1.75}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Secondary */}
      <div className="px-4 pb-6 space-y-1">
        {NAV_SECONDARY.map(({ href, label, icon: Icon }) => (
          <button
            key={href}
            type="button"
            disabled
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/60 cursor-not-allowed"
          >
            <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}
