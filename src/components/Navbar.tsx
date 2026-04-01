"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BoltIcon, ArrowRightIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Navbar is ONLY rendered inside (public) layout — no need to check auth routes here.

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">

      {/* Gradient strip so text stays readable over any hero image */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* ── LEFT: Logo ── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#c1ff00] flex items-center justify-center shadow-[0_0_12px_rgba(193,255,0,0.4)]">
              <BoltIcon className="w-5 h-5 text-black" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight drop-shadow-sm">
              Sync<span className="text-[#c1ff00]">Fit</span><span className="text-[#c1ff00]">.</span>
            </span>
          </Link>

          {/* ── CENTER: Nav links (desktop) ── */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 drop-shadow-sm relative group ${
                  pathname === link.href ? "text-[#c1ff00]" : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-[#c1ff00] rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* ── RIGHT: CTA ── */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2"
                >
                  Logout
                </button>
                <Link
                  href="/dashboard/today"
                  className="inline-flex items-center gap-2 bg-[#c1ff00] hover:bg-[#aadf00] text-black font-bold text-sm px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-105 shadow-[0_4px_20px_rgba(193,255,0,0.3)]"
                >
                  Dashboard <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-[#c1ff00] hover:bg-[#aadf00] text-black font-bold text-sm px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-105 shadow-[0_4px_20px_rgba(193,255,0,0.3)]"
                >
                  Get Started <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Slide-out Menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-black/90 backdrop-blur-md border-t border-white/10 px-4 pb-6 pt-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-white/80 hover:text-white font-medium text-base py-3 px-3 rounded-lg hover:bg-white/5 transition-colors border-b border-white/5 last:border-none"
            >
              {link.label}
            </Link>
          ))}

          {session ? (
            <>
              <Link
                href="/dashboard/today"
                onClick={() => setMobileOpen(false)}
                className="text-white/80 hover:text-white font-medium text-base py-3 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-left text-white/80 hover:text-white font-medium text-base py-3 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-center text-white font-semibold py-3 px-6 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="text-center bg-[#c1ff00] hover:bg-[#aadf00] text-black font-bold py-3 px-6 rounded-full transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
