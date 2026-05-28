import { NextResponse, type NextRequest } from "next/server";

// Auth is enforced client-side via <AuthGate> in app/(dashboard)/layout.tsx
// (the token lives in localStorage, which middleware can't read). Middleware
// stays as a passthrough so we can add platform-level concerns later (rate
// limiting, geolocation, etc.) without re-wiring everything.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
