"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
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
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";

type NavGroup = {
  label: string;
  links: { name: string; href: string; icon: React.ElementType }[];
};

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    links: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    ],
  },
  {
    label: "Nutrition",
    links: [
      { name: "Meal Plan", href: "/meal-plan", icon: FireIcon },
      { name: "Shopping List", href: "/grocery-list", icon: ListBulletIcon },
      { name: "Export Plan", href: "/export", icon: ArrowDownTrayIcon },
    ],
  },
  {
    label: "Training",
    links: [
      { name: "Workout", href: "/workout", icon: ChartBarIcon },
    ],
  },
  {
    label: "Account",
    links: [
      { name: "My Profile", href: "/profile", icon: UserCircleIcon },
    ],
  },
];

const bottomNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Meal Plan", href: "/meal-plan", icon: FireIcon },
  { name: "Shopping", href: "/grocery-list", icon: ListBulletIcon },
  { name: "Workout", href: "/workout", icon: ChartBarIcon },
  { name: "Profile", href: "/profile", icon: UserCircleIcon },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  if (!session) return null;

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── 1. MOBILE TOP HEADER BAR (md:hidden) ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-b border-gray-200/80 z-40 px-4 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#c1ff00] flex items-center justify-center shadow-[0_0_12px_rgba(193,255,0,0.5)]">
            <BoltIcon className="h-5 w-5 text-black" />
          </div>
          <span className="font-black text-lg tracking-tight text-[#111111]">
            Sync<span className="text-[#111111]">Fit</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors border border-gray-200 text-xs font-bold"
            title="My Profile"
          >
            {session.user?.name ? session.user.name.charAt(0).toUpperCase() : <UserCircleIcon className="w-5 h-5 text-gray-600" />}
          </Link>
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* ── 2. MOBILE SLIDE-OUT DRAWER WITH BACKDROP ── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content Panel */}
          <div className="relative w-[280px] max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#c1ff00] flex items-center justify-center shadow-[0_0_12px_rgba(193,255,0,0.5)]">
                  <BoltIcon className="h-5 w-5 text-black" />
                </div>
                <span className="font-black text-lg tracking-tight text-[#111111]">
                  Sync<span className="text-[#111111]">Fit</span>
                </span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 py-4 px-3 overflow-y-auto space-y-5">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.18em] px-3 mb-1.5">
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
                          onClick={() => setMobileDrawerOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                            active
                              ? "bg-[#c1ff00] text-[#111111] font-bold shadow-xs"
                              : "text-gray-700 hover:text-[#111111] hover:bg-gray-100 font-medium text-sm"
                          }`}
                        >
                          <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-[#111111]" : "text-gray-400"}`} />
                          <span className="text-sm">{link.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Footer & User Info */}
            <div className="p-3 border-t border-gray-100 space-y-2 bg-gray-50/50">
              <div className="px-3 py-1">
                <p className="text-xs font-bold text-[#111111] truncate">{session.user?.name || "Member"}</p>
                <p className="text-[11px] text-gray-400 truncate">{session.user?.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all text-xs font-bold"
              >
                <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. MOBILE BOTTOM QUICK NAVIGATION BAR (md:hidden) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-30 px-1 py-1 flex items-center justify-around shadow-lg pb-[max(0.35rem,env(safe-area-inset-bottom))]">
        {bottomNavItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
                active ? "text-[#111111] font-bold" : "text-gray-400 hover:text-gray-600 font-medium"
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  active ? "bg-[#c1ff00] text-[#111111]" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight leading-none ${active ? "font-black text-[#111111]" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── 4. DESKTOP SIDEBAR (hidden md:flex) ── */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-sm z-40 hidden md:flex flex-col">
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-[#c1ff00] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(193,255,0,0.5)]">
            <BoltIcon className="h-6 w-6 text-black" />
          </div>
          <Link href="/" className="font-bold text-xl tracking-tight text-[#111111] hover:opacity-70 transition-opacity">
            Sync<span className="text-[#111111]">Fit</span>
          </Link>
        </div>

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

        <div className="p-3 border-t border-gray-100 space-y-1">
          <div className="px-3 py-2">
            <p className="text-[11px] text-gray-400 font-medium truncate">{session.user?.name || session.user?.email}</p>
            <p className="text-[10px] text-gray-300 truncate">{session.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-medium cursor-pointer"
          >
            <ArrowLeftOnRectangleIcon className="w-[18px] h-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
