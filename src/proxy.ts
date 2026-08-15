import { NextRequest, NextResponse } from "next/server";
import defaultAuthMiddleware from "next-auth/middleware";

<<<<<<< HEAD
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

    // Fix wrong routes
      if (pathname === "/dashboard/today" || pathname === "/today") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
            }

              // Run auth middleware
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
=======
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirect legacy routes
  if (pathname === "/dashboard/today" || pathname === "/today") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Run NextAuth auth check
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
>>>>>>> b6e10d4 (upgraded workout engine)
