"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  HomeIcon, 
  FireIcon, 
  ArrowLeftOnRectangleIcon,
  BoltIcon,
  ChartBarIcon,
  ListBulletIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

type NavGroup = {
  label: string;
  links: { name: string; href: string; icon: React.ElementType }[];
};

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    links: [
      { name: "Today", href: "/dashboard/today", icon: CalendarDaysIcon },
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    ],
  },
  {
    label: "Nutrition",
    links: [
      { name: "Meal Plan", href: "/nutrition/meal-plan", icon: FireIcon },
      { name: "Shopping List", href: "/nutrition/shopping-list", icon: ListBulletIcon },
      { name: "Export Plan", href: "/nutrition/export", icon: ArrowDownTrayIcon },
    ],
  },
  {
    label: "Training",
    links: [
      { name: "Workout", href: "/training/workout", icon: ChartBarIcon },
    ],
  },
  {
    label: "Account",
    links: [
      { name: "Profile Setup", href: "/onboarding/setup", icon: Cog6ToothIcon },
    ],
  },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-sm z-40 hidden md:flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-[#c1ff00] rounded-lg flex items-center justify-center flex-shrink-0">
          <BoltIcon className="h-5 w-5 text-black" />
        </div>
        <Link href="/" className="font-bold text-xl tracking-tight text-[#111111] hover:opacity-70 transition-opacity">
          Sync<span className="text-[#111111]">Fit</span>
        </Link>
      </div>

      {/* Nav Groups */}
      <div className="flex-1 py-6 px-3 overflow-y-auto space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.18em] px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.links.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-[#c1ff00] text-[#111111] font-bold shadow-sm"
                        : "text-gray-600 hover:text-[#111111] hover:bg-gray-100 font-medium"
                    }`}
                  >
                    <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? "text-[#111111]" : "text-gray-400"}`} />
                    <span className="text-sm">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User info + Logout */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        <div className="px-3 py-2">
          <p className="text-[11px] text-gray-400 font-medium truncate">{session.user?.name || session.user?.email}</p>
          <p className="text-[10px] text-gray-300 truncate">{session.user?.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-medium"
        >
          <ArrowLeftOnRectangleIcon className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
