"use client";

import Link from "next/link";

export default function ProgramsHero() {

  return (
    /* ── Outer Wrapper: screen-edge margin + rounded card ── */
    <div className="px-2 pt-2 md:px-4 md:pt-4">
      <div className="relative w-full min-h-[520px] rounded-3xl overflow-hidden">

        {/* ── Background Image ── */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('/images/page-header-bg.jpg')" }}
        />

        {/* ── Gradient Overlay ── */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/20" />



        {/* ══════════════════════════════════════════════
            HERO TEXT — centered vertically & horizontally
        ══════════════════════════════════════════════ */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-[520px] text-center px-4 animate-fade-in">
          <h1 className="text-5xl md:text-[64px] font-bold text-white mb-4 tracking-tight drop-shadow-lg">
            Our Programs
          </h1>
          <nav aria-label="Breadcrumb" className="flex flex-col items-center">
            <p className="text-white/70 text-base md:text-lg font-medium tracking-wide">
              Home <span className="mx-2 text-white/50">/</span> Our Programs
            </p>
            <div className="w-2 h-2 rounded-full bg-[#c1ff00] mt-6" />
          </nav>
        </div>

      </div>
    </div>
  );
}
