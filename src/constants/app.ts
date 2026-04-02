export const APP_CONFIG = {
  name: "SyncFit",
  version: "1.0.0",
  description: "Your Al-powered fitness and nutrition companion.",
  themeColor: "#c1ff00",
};

export const PUBLIC_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
] as const;

export const AUTH_NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: "ChartBarIcon" },
  { label: "Meal Plan", href: "/meal-plan", icon: "UserIcon" },
  { label: "Shopping List", href: "/grocery-list", icon: "ListBulletIcon" },
  { label: "Workout", href: "/workout", icon: "BoltIcon" },
] as const;
