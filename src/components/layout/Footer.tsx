"use client";

import { BoltIcon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/meal-plan') || pathname?.startsWith('/profile') || pathname?.startsWith('/workout') || pathname?.startsWith('/grocery-list') || pathname?.startsWith('/export') || pathname?.startsWith('/nutrition');
  if (isAuthRoute) return null;

  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 py-10 sm:py-12 px-4 text-center text-slate-400 mt-auto">
      <div className="flex justify-center items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#c1ff00] flex items-center justify-center shadow-[0_0_15px_rgba(193,255,0,0.5)]">
          <BoltIcon className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
        </div>
        <span className="font-bold text-lg sm:text-xl tracking-tight text-white">Sync<span className="text-[#c1ff00]">Fit</span></span>
      </div>
      <p className="text-xs sm:text-sm mb-2 max-w-md mx-auto leading-relaxed">Empowering your health with AI-powered precision.</p>
      <p className="text-[11px] sm:text-xs text-slate-500">© {new Date().getFullYear()} Sync-Fit. All rights reserved.</p>
    </footer>
  );
}
