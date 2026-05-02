"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  UserCircle,
  Settings,
  Menu,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { dashboardData } from "@/lib/mock-data";
import { signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";

const PAGE_LABEL: Record<string, string> = {
  overview: "Overview",
  sales: "Sales",
  marketing: "Marketing",
  team: "Team",
  workflows: "Workflows",
  insights: "Insights",
  tools: "Tools",
};

export function TopBar({
  onOpenSidebar,
}: {
  onOpenSidebar?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const segments = pathname.split("/").filter(Boolean);
  const currentLabel = PAGE_LABEL[segments[0] ?? ""] ?? "Dashboard";
  const { user } = dashboardData;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click-outside to close
  useEffect(() => {
    if (!menuOpen) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  function handleSignOut() {
    signOut();
    router.push("/login");
  }

  return (
    <header className="h-16 sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left cluster: hamburger (mobile) + breadcrumbs */}
      <div className="flex items-center gap-2 min-w-0">
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
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm min-w-0"
        >
          <span className="text-muted-foreground hidden sm:inline">
            Dashboard
          </span>
          <ChevronRight
            className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0 hidden sm:block"
            strokeWidth={1.75}
          />
          <span className="font-semibold text-foreground truncate">
            {currentLabel}
          </span>
        </nav>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          aria-label="Search"
          className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
        >
          <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="relative h-9 w-9 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive" />
        </button>

        {/* User pill + dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className={cn(
              "flex items-center gap-3 pl-2 pr-2 sm:pr-3 py-1.5 rounded-lg transition-colors",
              menuOpen ? "bg-muted/60" : "hover:bg-muted/60"
            )}
          >
            <Avatar className="h-9 w-9 ring-2 ring-emerald-100">
              <AvatarFallback className="bg-emerald-500 text-white text-xs font-semibold">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left leading-tight hidden sm:block">
              <div className="text-sm font-semibold text-foreground">
                {user.name.split(" ")[0]} {user.name.split(" ")[1]?.[0]}.
              </div>
              <div className="text-xs text-muted-foreground">
                Account settings
              </div>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                menuOpen && "rotate-180"
              )}
              strokeWidth={1.75}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-card border border-border shadow-lg p-1.5 z-20 animate-in fade-in-0 slide-in-from-top-1">
              <div className="px-3 py-2.5 border-b border-border/60">
                <div className="text-sm font-semibold text-foreground truncate">
                  {user.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <span className="h-1 w-1 rounded-full bg-emerald-500" />
                  {user.role}
                </div>
              </div>
              <div className="py-1">
                <MenuItem icon={UserCircle} label="View profile" />
                <MenuItem icon={Settings} label="Workspace settings" />
              </div>
              <div className="border-t border-border/60 pt-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.75} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({
  icon: Icon,
  label,
}: {
  icon: typeof UserCircle;
  label: string;
}) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted/60 transition-colors"
    >
      <Icon
        className="h-4 w-4 text-muted-foreground"
        strokeWidth={1.75}
      />
      {label}
    </button>
  );
}
