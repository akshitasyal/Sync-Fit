"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FastingToggleProps {
  initialStatus: boolean;
  onToggle?: (newStatus: boolean) => void;
  compact?: boolean;
}

export default function FastingToggle({ initialStatus, onToggle, compact = false }: FastingToggleProps) {
  const [isFasting, setIsFasting] = useState(initialStatus);
  const [phase, setPhase] = useState<"idle" | "saving" | "generating" | "done">("idle");
  const router = useRouter();

  const toggleFasting = async () => {
    if (phase !== "idle") return;
    const next = !isFasting;

    try {
      // Phase 1 — persist preference
      setPhase("saving");
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFastingMode: next }),
      });
      if (!res.ok) throw new Error("Failed to save");

      setIsFasting(next);
      onToggle?.(next);

      // Phase 2 — regenerate meal plan (which also rebuilds shopping list)
      setPhase("generating");
      await fetch("/api/meal-plan/generate", { method: "POST" });

      // Phase 3 — done
      setPhase("done");
      setTimeout(() => {
        setPhase("idle");
        router.refresh();
      }, 1200);
    } catch (err) {
      console.error(err);
      setPhase("idle");
    }
  };

  const isLoading = phase === "saving" || phase === "generating";

  const statusLabel = {
    idle: isFasting ? "Fasting Mode ON" : "Fasting Mode",
    saving: "Saving…",
    generating: "Rebuilding plan…",
    done: "✓ Plan updated",
  }[phase];

  // ── Compact mode: pill button for inline use in the header ────────────────
  if (compact) {
    return (
      <button
        onClick={toggleFasting}
        disabled={isLoading}
        id="fasting-mode-toggle"
        aria-label="Toggle fasting mode"
        aria-pressed={isFasting}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-bold text-sm transition-all duration-300 flex-shrink-0 ${
          isFasting
            ? "bg-amber-50 border-amber-200 text-amber-700"
            : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-[#111111]"
        } ${isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="text-base leading-none">{isFasting ? "🌙" : "🍽️"}</span>
        <span className="hidden sm:inline">
          {phase === "saving" ? "Saving…" : phase === "generating" ? "Updating…" : phase === "done" ? "✓ Done" : isFasting ? "Fasting ON" : "Fasting"}
        </span>
        {/* Mini toggle switch */}
        <div className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${isFasting ? "bg-amber-400" : "bg-gray-200"}`}>
          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${isFasting ? "translate-x-4" : "translate-x-0"}`} />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            </div>
          )}
        </div>
      </button>
    );
  }

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
        isFasting
          ? "bg-amber-50 border-amber-200 shadow-[0_4px_20px_rgba(245,158,11,0.15)]"
          : "bg-white border-gray-100"
      }`}
    >
      {/* Icon */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all ${
          isFasting ? "bg-amber-100" : "bg-gray-100"
        }`}
      >
        {isFasting ? "🌙" : "🍽️"}
      </div>

      {/* Labels */}
      <div className="flex-grow min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
          Special Mode
        </p>
        <h3
          className={`text-sm font-bold truncate transition-colors ${
            isFasting ? "text-amber-700" : "text-[#111111]"
          }`}
        >
          {statusLabel}
        </h3>
        {isFasting && phase === "idle" && (
          <p className="text-[10px] text-amber-600 font-medium mt-0.5">
            Vrat-friendly meals only
          </p>
        )}
      </div>

      {/* Toggle switch */}
      <button
        onClick={toggleFasting}
        disabled={isLoading}
        id="fasting-mode-toggle"
        aria-label="Toggle fasting mode"
        aria-pressed={isFasting}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
          isFasting ? "bg-amber-400" : "bg-gray-200"
        } ${isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}`}
      >
        <div
          className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-300 ${
            isFasting ? "translate-x-6" : "translate-x-0"
          }`}
        />
        {/* Spinner overlay when loading */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          </div>
        )}
      </button>
    </div>
  );
}
