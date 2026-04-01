import { NextRequest, NextResponse } from "next/server";
import defaultAuthMiddleware from "next-auth/middleware";

export function proxy(req: NextRequest, ctx: any) {
  return (defaultAuthMiddleware as any)(req, ctx);
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
