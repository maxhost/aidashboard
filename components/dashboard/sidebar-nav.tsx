"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Megaphone,
  Compass,
  Gauge,
  LifeBuoy,
  LogOut,
  X,
  CheckSquare,
  Kanban,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PulsorLockup } from "@/components/brand/pulsor";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { dashboardData } from "@/lib/mock-data";
import { signOut } from "@/lib/auth";
import { ROLE_KEY, isRole, type Role } from "@/components/dashboard/role-switch";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

const NAV_WORKSPACE_DEFAULT: NavItem[] = [
  { href: "/overview", label: "Home", icon: LayoutDashboard },
  { href: "/sales", label: "Sales", icon: TrendingUp },
  { href: "/marketing", label: "Marketing", icon: Megaphone },
  { href: "/strategy", label: "Strategy", icon: Compass },
];

const NAV_WORKSPACE_ASSISTANT: NavItem[] = [
  { href: "/morning-brief", label: "Morning Brief", icon: CheckSquare },
  { href: "/operations", label: "Operations", icon: Kanban },
  { href: "/transactions", label: "Transactions", icon: FileText },
];

const NAV_SECONDARY = [
  { href: "/usage", label: "Usage", icon: Gauge, disabled: false },
  { href: "/help", label: "Help", icon: LifeBuoy, disabled: true },
] as const;

function useRole(): Role {
  const [role, setRole] = useState<Role>("team-leader");
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

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const role = useRole();
  const workspace =
    role === "assistant" ? NAV_WORKSPACE_ASSISTANT : NAV_WORKSPACE_DEFAULT;
  const renderItem = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
  }) => {
    const active = pathname === href || pathname?.startsWith(href + "/");
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
  };

  return (
    <>
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Workspace
        </p>
        {workspace.map(renderItem)}
      </nav>
      <div className="px-4 pb-6 space-y-1 border-t border-border/60 pt-4">
        <UserPill onNavigate={onNavigate} />
        {NAV_SECONDARY.map(({ href, label, icon: Icon, disabled }) => {
          const active =
            !disabled && (pathname === href || pathname?.startsWith(href + "/"));
          if (disabled) {
            return (
              <button
                key={href}
                type="button"
                disabled
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/60 cursor-not-allowed"
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                {label}
              </button>
            );
          }
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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
      </div>
    </>
  );
}

function UserPill({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const { user } = dashboardData;
  function handleSignOut() {
    signOut();
    router.push("/login");
  }
  return (
    <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
          {user.initials}
        </AvatarFallback>
      </Avatar>
      <Link
        href="/usage"
        onClick={onNavigate}
        className="flex-1 min-w-0 leading-tight"
      >
        <div className="text-sm font-medium text-foreground truncate">
          {user.name.split(" ")[0]} {user.name.split(" ")[1]?.[0]}.
        </div>
        <div className="text-xs text-muted-foreground truncate">
          Account settings
        </div>
      </Link>
      <button
        type="button"
        aria-label="Sign out"
        title="Sign out"
        onClick={handleSignOut}
        className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors shrink-0"
      >
        <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex h-16 items-center gap-2.5 px-5 border-b border-border">
      <PulsorLockup size={44} textClassName="text-[20px]" />
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
          <PulsorLockup size={44} textClassName="text-[20px]" />
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
