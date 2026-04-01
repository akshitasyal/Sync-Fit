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
        body: JSON.stringify({ isFastingMode: !isFasting }),
      });
      if (res.ok) {
        setIsFasting(!isFasting);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
      isFasting
        ? "bg-amber-50 border-amber-200"
        : "bg-white border-gray-100"
    }`}>
      <div className={`p-2.5 rounded-xl flex-shrink-0 ${isFasting ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-400"}`}>
        <PowerIcon className="w-5 h-5" />
      </div>
      <div className="flex-grow">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Special Mode</p>
        <h3 className={`text-sm font-bold ${isFasting ? "text-amber-700" : "text-[#111111]"}`}>
          {isFasting ? "Fasting Mode ON" : "Fasting Mode"}
        </h3>
      </div>
      <button
        onClick={toggleFasting}
        disabled={loading}
        aria-label="Toggle fasting mode"
        className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
          isFasting ? "bg-amber-400" : "bg-gray-200"
        } ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-300 ${
          isFasting ? "translate-x-6" : "translate-x-0"
        }`} />
      </button>
    </div>
  );
}
