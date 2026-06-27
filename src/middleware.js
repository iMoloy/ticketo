import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect all dashboard subroutes
  if (pathname.startsWith("/dashboard")) {
    try {
      // Forward request cookies to session helper endpoint
      const response = await fetch(new URL("/api/auth/get-session", request.url), {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      const session = response.ok ? await response.json() : null;

      // 1. If not logged in, redirect to login
      if (!session || !session.user) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const { role, isBlocked } = session.user;

      // 2. If blocked, redirect to login with error
      if (isBlocked) {
        return NextResponse.redirect(new URL("/login?error=blocked", request.url));
      }

      // 3. Enforce Role Dashboard Paths
      if (pathname.startsWith("/dashboard/attendee") && role !== "attendee") {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
      }
      if (pathname.startsWith("/dashboard/organizer") && role !== "organizer") {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
      }
      if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
      }

      // If user is at root /dashboard, redirect to their role-specific home
      if (pathname === "/dashboard" || pathname === "/dashboard/") {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
      }

    } catch (err) {
      console.error("Middleware fetch error:", err);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
