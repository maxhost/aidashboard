import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

// Routes anyone can hit without a session.
const PUBLIC_PATHS = [
  "/login",
  "/setup",
  "/landing",        // static HTML landing — served at "/" via rewrite
  "/closing",        // public closing-progress view shared with clients
  "/icon.svg",
  "/favicon.ico",
];

function isPublic(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

/** Detect "admin.something" subdomain (prod). Dev uses path-based routing. */
function isAdminSubdomain(host: string | null): boolean {
  if (!host) return false;
  return host.startsWith("admin.");
}

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);

  // Refreshes the session cookie if expired.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const host = request.headers.get("host");
  const adminSub = isAdminSubdomain(host);

  // ── 1. Subdomain routing (production only) ─────────────────────
  // If hitting admin.pulsor.co, internally rewrite "/foo" → "/admin/foo"
  // so we can keep all admin code under /app/admin/* in the same Next app.
  if (adminSub && !isAdminPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/admin${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // ── 2. Public routes ──────────────────────────────────────────
  if (isPublic(pathname)) {
    // If logged-in user lands on /login, send them home.
    if (pathname === "/login" && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/overview";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // ── 3. Auth required for everything else ──────────────────────
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // ── 4. Role enforcement ───────────────────────────────────────
  // Look up role for this request (single query; cookies already in client).
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role as "admin" | "team_leader" | "agent" | undefined;

  if (isAdminPath(pathname) && role !== "admin") {
    // Non-admins can't see /admin/*
    const url = request.nextUrl.clone();
    url.pathname = "/overview";
    return NextResponse.redirect(url);
  }

  if (!isAdminPath(pathname) && role === "admin" && adminSub) {
    // Already in admin subdomain handled above; nothing to do.
  }

  return response;
}

export const config = {
  matcher: [
    // Run on everything except _next, static assets, and image-optimization paths.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
