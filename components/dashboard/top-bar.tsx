"use client";

import { ChevronDown, ChevronRight, Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { dashboardData } from "@/lib/mock-data";

const PAGE_LABEL: Record<string, string> = {
  overview: "Overview",
  workflows: "Workflows",
  team: "Team",
  insights: "Insights",
};

export function TopBar() {
  const pathname = usePathname() ?? "";
  const segments = pathname.split("/").filter(Boolean);
  const currentLabel = PAGE_LABEL[segments[0] ?? ""] ?? "Dashboard";
  const { user } = dashboardData;

  return (
    <header className="h-16 sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur-md flex items-center justify-between px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm min-w-0"
      >
        <span className="text-muted-foreground">Dashboard</span>
        <ChevronRight
          className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0"
          strokeWidth={1.75}
        />
        <span className="font-semibold text-foreground truncate">
          {currentLabel}
        </span>
      </nav>

      {/* Right cluster */}
      <div className="flex items-center gap-2">
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
        <button
          type="button"
          className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-lg hover:bg-muted/60 transition-colors"
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
            <div className="text-xs text-muted-foreground">Account settings</div>
          </div>
          <ChevronDown
            className="h-4 w-4 text-muted-foreground"
            strokeWidth={1.75}
          />
        </button>
      </div>
    </header>
  );
}
