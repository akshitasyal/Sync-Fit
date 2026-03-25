"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PowerIcon } from "@heroicons/react/24/outline";

export default function FastingToggle({ initialStatus }: { initialStatus: boolean }) {
  const [isFasting, setIsFasting] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleFasting = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFastingMode: !isFasting })
      });

      if (res.ok) {
        setIsFasting(!isFasting);
        router.refresh(); // Refresh server component data
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-3xl shadow-xl backdrop-blur-md">
      <div className={`p-3 rounded-2xl ${isFasting ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-500'}`}>
        <PowerIcon className="w-6 h-6" />
      </div>
      <div className="flex-grow">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Special Mode</p>
        <h3 className="text-sm font-bold text-white">Fasting Today</h3>
      </div>
      <button
        onClick={toggleFasting}
        disabled={loading}
        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${isFasting ? 'bg-amber-500' : 'bg-slate-700'}`}
      >
        <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${isFasting ? 'translate-x-6' : 'translate-x-0'}`}></div>
      </button>
    </div>
  );
}
