import { NextRequest, NextResponse } from "next/server";
import defaultAuthMiddleware from "next-auth/middleware";

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
