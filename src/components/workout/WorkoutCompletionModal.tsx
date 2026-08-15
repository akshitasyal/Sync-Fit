"use client";

import {
  CheckCircleIcon,
  TrophyIcon,
  FireIcon,
  SparklesIcon,
  ClockIcon,
  Square3Stack3DIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

interface WorkoutCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutFocus: string;
  totalSets: number;
  durationMin: number;
  caloriesBurned: number;
  streak: number;
  onViewProgress?: () => void;
}

export default function WorkoutCompletionModal({
  isOpen,
  onClose,
  workoutFocus = "Full Body Training",
  totalSets = 18,
  durationMin = 45,
  caloriesBurned = 320,
  streak = 4,
  onViewProgress,
}: WorkoutCompletionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-[32px] w-full max-w-lg p-6 sm:p-8 shadow-2xl z-10 space-y-6 text-center animate-in zoom-in-95 duration-200">
        {/* Top Trophy Badge */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-[#c1ff00] flex items-center justify-center shadow-[0_0_25px_rgba(193,255,0,0.5)]">
          <TrophyIcon className="w-10 h-10 text-black animate-bounce" />
        </div>

        {/* Celebration Title */}
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-[#c1ff00]/20 text-[#111111] px-3 py-1 rounded-full border border-[#c1ff00]/40">
            Session Crushed
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            Workout Complete! 🎉
          </h3>
          <p className="text-sm font-bold text-gray-500 uppercase">{workoutFocus}</p>
        </div>

        {/* Highlighted Metric Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-left">
          <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl">
            <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 block">Duration</span>
            <span className="text-base sm:text-lg font-black text-[#111111]">{durationMin} min</span>
          </div>

          <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl">
            <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 block">Sets Completed</span>
            <span className="text-base sm:text-lg font-black text-[#111111]">{totalSets} sets</span>
          </div>

          <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl">
            <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 block">Est. Burn</span>
            <span className="text-base sm:text-lg font-black text-[#111111]">{caloriesBurned} kcal</span>
          </div>
        </div>

        {/* Gamification / PR Badge Box */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 text-left flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-400 text-black flex-shrink-0">
            <TrophyIcon className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
              <span>Personal Record Unlocked</span>
              <span className="bg-amber-200 text-amber-900 text-[9px] px-1.5 py-0.2 rounded font-black">+120 XP</span>
            </p>
            <p className="text-xs text-amber-800 font-medium">
              Progressive overload achieved! Strength output increased by +5%.
            </p>
          </div>
        </div>

        {/* Streak & Consistency */}
        <div className="bg-gray-50 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FireIcon className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-bold text-gray-700">Consistency Streak</span>
          </div>
          <span className="text-xs font-black text-[#111111] bg-white px-3 py-1 rounded-full border border-gray-200">
            🔥 {streak} Day Streak
          </span>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {onViewProgress && (
            <button
              onClick={() => {
                onClose();
                onViewProgress();
              }}
              className="py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-[#111111] font-bold rounded-2xl text-xs sm:text-sm transition-colors"
            >
              View Progress
            </button>
          )}

          <button
            onClick={onClose}
            className={`py-3.5 px-4 bg-[#c1ff00] hover:bg-[#aadf00] text-black font-black rounded-2xl text-xs sm:text-sm transition-all shadow-[0_4px_14px_rgba(193,255,0,0.35)] ${
              !onViewProgress ? "col-span-2" : ""
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
