"use client";

import { ArrowPathIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { PROGRAMS } from "@/constants/programs";

interface WorkoutHeaderProps {
  selectedProgram?: string;
  generating: boolean;
  onOpenProgramSelector: () => void;
  onOpenRegenerateModal: () => void;
  hasPlan: boolean;
}

const PROGRAM_SUBTITLES: Record<string, string> = {
  "muscle-gain": "Hypertrophy training • Personalized for maximum muscle growth and progressive overload",
  "weight-loss": "High-intensity metabolic conditioning • Calorie expenditure with lean mass protection",
  "strength": "Heavy compound barbell periodization • Progressive strength & neural adaptation",
  "cardio": "Aerobic endurance & interval conditioning • Cardiovascular capacity and VO2 max",
  "beginner": "Foundational movement mastery • Joint durability and full-body strength building",
  "adaptive": "Low-impact mobility & functional recovery • Joint-friendly resistance and balance",
};

export default function WorkoutHeader({
  selectedProgram,
  generating,
  onOpenProgramSelector,
  onOpenRegenerateModal,
  hasPlan,
}: WorkoutHeaderProps) {
  const activeProgramConfig = PROGRAMS.find((p) => p.id === selectedProgram) || {
    id: "muscle-gain",
    label: "Muscle Gain",
    emoji: "💪",
    desc: "Hypertrophy splits for maximum muscle growth",
    color: "from-purple-500 to-violet-600",
    accent: "bg-purple-50 border-purple-200 text-purple-700",
    badge: "bg-purple-100 text-purple-700",
  };

  const subtitle =
    PROGRAM_SUBTITLES[selectedProgram || ""] ||
    "Hypertrophy training • Personalized for your current fitness level";

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-2 border-b border-gray-100">
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#c1ff00] shadow-[0_0_10px_rgba(193,255,0,0.8)]" />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-gray-400">
            Training Engine
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#111111] tracking-tight">
            Workout Engine
          </h1>
          <span
            className={`text-[10px] sm:text-xs font-black px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border uppercase tracking-wider flex items-center gap-1.5 shadow-xs ${activeProgramConfig.accent}`}
          >
            <span>{activeProgramConfig.emoji}</span>
            <span>{activeProgramConfig.label}</span>
          </span>
        </div>

        <p className="text-gray-500 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
          {subtitle}
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex gap-2 sm:gap-3 flex-wrap items-center self-stretch sm:self-auto">
        <button
          onClick={onOpenProgramSelector}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:text-[#111111] hover:border-gray-400 font-bold transition-all text-xs sm:text-sm shadow-xs hover:shadow active:scale-95 cursor-pointer"
        >
          <span>🎯 Change Program</span>
          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
        </button>

        <button
          onClick={onOpenRegenerateModal}
          disabled={generating}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#c1ff00] hover:bg-[#aadf00] disabled:opacity-50 text-[#111111] font-black rounded-xl transition-all shadow-[0_4px_14px_rgba(193,255,0,0.35)] hover:-translate-y-0.5 active:scale-95 text-xs sm:text-sm cursor-pointer"
        >
          <ArrowPathIcon className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
          <span>{hasPlan ? "Regenerate Week" : "Generate Plan"}</span>
        </button>
      </div>
    </div>
  );
}
