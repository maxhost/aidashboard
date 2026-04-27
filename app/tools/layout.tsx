"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { PulsorLockup } from "@/components/brand/pulsor";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { isLoggedIn } from "@/lib/auth";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    setAuthed(isLoggedIn());
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Public top bar */}
      <header className="h-16 border-b border-border bg-card sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/tools" className="shrink-0">
          <PulsorLockup size={28} textClassName="text-sm" />
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3">
          {authed ? (
            <Link
              href="/overview"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
            >
              Open dashboard
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          ) : (
            <>
              <Link
                href="/setup"
                className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                Set up your workspace
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Sign in
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1">{children}</main>
      <DashboardFooter />
    </div>
  );
}
