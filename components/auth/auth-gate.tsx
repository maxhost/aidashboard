"use client";

import { useEffect, useState } from "react";
import { isLoggedIn } from "@/lib/auth";
import { PulsorMark } from "@/components/brand/pulsor";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      setReady(true);
    } else if (typeof window !== "undefined") {
      // Hard redirect avoids useRouter (which fails during static prerender of
      // dashboard pages). The browser navigates fresh to /login.
      window.location.href = "/login";
    }
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <PulsorMark size={48} className="animate-pulse" />
          <span className="text-sm text-muted-foreground">
            Loading workspace…
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
