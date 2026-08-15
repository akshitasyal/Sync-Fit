import { NextRequest, NextResponse } from "next/server";
import defaultAuthMiddleware from "next-auth/middleware";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirect legacy / incorrect routes
  if (pathname === "/dashboard/today" || pathname === "/today") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Run NextAuth session authentication check
  return (defaultAuthMiddleware as any)(req);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/nutrition/:path*",
    "/training/:path*",
    "/onboarding/:path*",
    "/profile",
    "/profile/:path*",
    "/grocery-list/:path*",
    "/workout/:path*",
    "/export/:path*",
  ],
};
