"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  Building2,
  Home,
  LogOut,
  ScrollText,
  Sparkles,
  UserCircle,
  Users,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PulsorLockup } from "@/components/brand/pulsor";
import { signOut } from "@/lib/auth";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
};

const NAV_MANAGE: NavItem[] = [
  { href: "/admin", label: "Overview", icon: Home, exact: true },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/solo-agents", label: "Solo agents", icon: UserCircle },
  { href: "/admin/users", label: "All users", icon: Users },
];

const NAV_LIBRARY: NavItem[] = [
  { href: "/admin/workflows", label: "Workflows", icon: Workflow },
  { href: "/admin/insights", label: "Insights", icon: Sparkles },
  { href: "/admin/tools", label: "Tools", icon: Boxes },
];

const NAV_SECURITY: NavItem[] = [
  { href: "/admin/audit", label: "Audit log", icon: ScrollText },
];

export function AdminSidebar({
  adminName,
  adminEmail,
}: {
  adminName: string;
  adminEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function renderItem({ href, label, icon: Icon, exact }: NavItem) {
    const active = exact
      ? pathname === href
      : pathname === href || pathname?.startsWith(href + "/");
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
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          )}
          strokeWidth={1.75}
        />
        {label}
      </Link>
    );
  }

  return (
    <aside className="hidden lg:flex h-screen w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-border sticky top-0">
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-border">
        <PulsorLockup size={36} textClassName="text-[18px]" />
        <span className="ml-1 inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-foreground text-background">
          Admin
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Manage
        </p>
        {NAV_MANAGE.map(renderItem)}

        <p className="px-3 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Library
        </p>
        {NAV_LIBRARY.map(renderItem)}

        <p className="px-3 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Security
        </p>
        {NAV_SECURITY.map(renderItem)}
      </nav>

      <div className="px-4 pb-6 border-t border-border/60 pt-4">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <span className="h-8 w-8 rounded-full bg-foreground text-background text-[11px] font-semibold inline-flex items-center justify-center shrink-0">
            {(adminName || adminEmail).slice(0, 2).toUpperCase()}
          </span>
          <div className="flex-1 min-w-0 leading-tight">
            <div className="text-sm font-medium text-foreground truncate">
              {adminName || "Admin"}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">
              {adminEmail}
            </div>
          </div>
          <button
            type="button"
            aria-label="Sign out"
            title="Sign out"
            onClick={async () => {
              await signOut();
              router.push("/login");
            }}
            className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors shrink-0"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );
}
