"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Megaphone,
  Workflow,
  Users,
  Sparkles,
  Boxes,
  Settings,
  LifeBuoy,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PulsorLockup } from "@/components/brand/pulsor";

const NAV_PRIMARY = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/sales", label: "Sales", icon: TrendingUp },
  { href: "/marketing", label: "Marketing", icon: Megaphone },
  { href: "/team", label: "Team", icon: Users },
  { href: "/workflows", label: "Workflows", icon: Workflow },
  { href: "/insights", label: "Insights", icon: Sparkles },
  { href: "/tools", label: "Tools", icon: Boxes },
] as const;

const NAV_SECONDARY = [
  { href: "/settings", label: "Settings", icon: Settings, disabled: true },
  { href: "/help", label: "Help & support", icon: LifeBuoy, disabled: true },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
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
              onClick={onNavigate}
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
    </>
  );
}

function Brand() {
  return (
    <div className="flex h-16 items-center gap-2.5 px-5 border-b border-border">
      <PulsorLockup size={32} />
    </div>
  );
}

export function SidebarNav() {
  return (
    <aside className="hidden lg:flex h-screen w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-border sticky top-0">
      <Brand />
      <NavList />
    </aside>
  );
}

export function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <>
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm animate-in fade-in-0"
          onClick={() => onOpenChange(false)}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-40 h-screen w-64 flex flex-col bg-sidebar text-sidebar-foreground border-r border-border transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2.5 px-5 border-b border-border">
          <PulsorLockup size={32} />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
        <NavList onNavigate={() => onOpenChange(false)} />
      </aside>
    </>
  );
}
