"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  HomeIcon, 
  FireIcon, 
  UserCircleIcon, 
  ArrowLeftOnRectangleIcon,
  BoltIcon,
  ChartBarIcon,
  ListBulletIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  const links = [
    { name: "Today", href: "/today", icon: BoltIcon },
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Meal Plan", href: "/meal-plan", icon: FireIcon },
    { name: "Shopping List", href: "/grocery-list", icon: ListBulletIcon },
    { name: "Export Plan", href: "/export", icon: ArrowDownTrayIcon },
    { name: "Workout", href: "/workout", icon: ChartBarIcon },
    { name: "Profile", href: "/profile", icon: UserCircleIcon },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 glass-panel-dark border-r border-white/10 shadow-2xl z-40 hidden md:flex flex-col">
      <div className="flex items-center gap-2 p-6 border-b border-white/5">
        <BoltIcon className="h-8 w-8 text-emerald-400" />
        <Link href="/" className="font-bold text-xl items-center tracking-tight text-white hover:opacity-80 transition-opacity">
          Sync<span className="text-emerald-400">Fit</span>
        </Link>
      </div>

      <div className="flex-1 py-6 px-4 space-y-3">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                isActive 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 font-bold" 
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent font-medium"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-sm font-medium"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
