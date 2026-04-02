"use client";
import { BoltIcon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/meal-plan') || pathname?.startsWith('/profile');
  if (isAuthRoute) return null;

  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 py-12 text-center text-slate-400 mt-auto">
      <div className="flex justify-center items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#c1ff00] flex items-center justify-center shadow-[0_0_15px_rgba(193,255,0,0.5)]">
          <BoltIcon className="h-6 w-6 text-black" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">Sync<span className="text-[#c1ff00]">Fit</span></span>
      </div>
      <p className="text-sm mb-2">Empowering your health with Fuzzy Logic precision.</p>
      <p className="text-xs text-slate-500">© {new Date().getFullYear()} Sync-Fit. All rights reserved.</p>
    </footer>
  );
}
