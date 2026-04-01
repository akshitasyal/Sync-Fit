"use client";
import { BoltIcon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/meal-plan') || pathname?.startsWith('/profile') || pathname?.startsWith('/workout') || pathname?.startsWith('/grocery-list');
  if (isAuthRoute) return null;

  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 py-12 text-center text-slate-400 mt-auto">
      <div className="flex justify-center items-center gap-2 mb-4">
        <BoltIcon className="h-6 w-6 text-[#c1ff00]" />
        <span className="font-bold text-xl tracking-tight text-white">Sync<span className="text-[#c1ff00]">Fit</span></span>
      </div>
      <p className="text-sm mb-2">Empowering your health with Al-powered precision.</p>
      <p className="text-xs text-slate-500">© {new Date().getFullYear()} Sync-Fit. All rights reserved.</p>
    </footer>
  );
}
