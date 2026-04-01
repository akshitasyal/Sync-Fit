import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      // ── Old authenticated routes → new canonical routes ──
      { source: "/today", destination: "/dashboard/today", permanent: true },
      { source: "/meal-plan", destination: "/nutrition/meal-plan", permanent: true },
      { source: "/grocery-list", destination: "/nutrition/shopping-list", permanent: true },
      { source: "/export", destination: "/nutrition/export", permanent: true },
      { source: "/workout", destination: "/training/workout", permanent: true },
      { source: "/profile", destination: "/onboarding/setup", permanent: true },

      // ── Old program pages → new /programs/* hierarchy ──
      { source: "/strength-training", destination: "/programs/strength-training", permanent: true },
      { source: "/muscle-gain", destination: "/programs/muscle-gain", permanent: true },
      { source: "/weight-loss", destination: "/programs/weight-loss", permanent: true },
      { source: "/adaptive-fitness", destination: "/programs/adaptive-fitness", permanent: true },
      { source: "/beginner-start", destination: "/programs/beginner-start", permanent: true },
    ];
  },
};

export default nextConfig;
