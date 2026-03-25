"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { BoltIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isAuthRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/meal-plan') || pathname?.startsWith('/profile');
  if (session && isAuthRoute) return null;

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel-dark border-b border-white/10 text-white shadow-md bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <BoltIcon className="h-8 w-8 text-emerald-400" />
            <Link href="/" className="font-bold text-xl tracking-tight text-white hover:opacity-80 transition-opacity">
              Sync<span className="text-emerald-400">Fit</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            {session ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium hover:text-emerald-400 transition-colors">
                  Dashboard
                </Link>
                <Link href="/meal-plan" className="text-sm font-medium hover:text-emerald-400 transition-colors">
                  Meal Plan
                </Link>
                <Link href="/profile" className="text-sm font-medium hover:text-emerald-400 transition-colors">
                  Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors border border-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-lg transition-colors text-white shadow-lg shadow-emerald-500/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
