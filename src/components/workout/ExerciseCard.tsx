"use client";

import {
  CheckCircleIcon,
  PlayCircleIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import { IExercise } from "@/types/workout";
import ExerciseVideo from "@/components/workout/ExerciseVideo";
import { getExerciseMedia } from "@/constants/exerciseMedia";

interface ExerciseCardProps {
  exercise: IExercise;
  sets: number;
  reps: string;
  duration?: number;
  isCompleted: boolean;
  completedSetIndexes: number[];
  onToggleSet: (setIdx: number) => void;
  onToggleExercise: () => void;
  onViewForm: (exercise: IExercise) => void;
}

/**
 * Derives simulated previous performance and progressive target based on exercise
 */
function getProgressiveOverload(name = "", sets = 3, reps = "8-12", duration?: number) {
  const n = name.toLowerCase();

  // Cardio / duration exercises
  if (duration || n.includes("run") || n.includes("hiit") || n.includes("plank")) {
    const prevTime = duration ? duration - 2 : 45;
    const targetTime = duration || 50;
    return {
      type: "time",
      last: `${prevTime}s hold / pace`,
      target: `${targetTime}s target pace`,
      progression: "+5% duration",
    };
  }

  // Heavy barbell compounds
  if (n.includes("squat")) {
    return {
      type: "weight",
      last: "50.0 kg × 5",
      target: "52.5 kg × 5",
      progression: "+5.0% overload",
    };
  }
  if (n.includes("bench") || n.includes("press")) {
    return {
      type: "weight",
      last: "42.5 kg × 8",
      target: "45.0 kg × 8",
      progression: "+5.8% overload",
    };
  }
  if (n.includes("deadlift")) {
    return {
      type: "weight",
      last: "70.0 kg × 5",
      target: "72.5 kg × 5",
      progression: "+3.5% overload",
    };
  }
  if (n.includes("row") || n.includes("pull")) {
    return {
      type: "weight",
      last: "35.0 kg × 10",
      target: "37.5 kg × 10",
      progression: "+7.1% overload",
    };
  }

  // Dumbbell / Isolation exercises
  return {
    type: "reps",
    last: "10 reps @ 12kg",
    target: "12 reps @ 12kg",
    progression: "+2 reps volume",
  };
}

export default function ExerciseCard({
  exercise,
  sets = 3,
  reps = "8-12",
  duration,
  isCompleted,
  completedSetIndexes = [],
  onToggleSet,
  onToggleExercise,
  onViewForm,
}: ExerciseCardProps) {
  const media = getExerciseMedia(exercise.name);
  const overload = getProgressiveOverload(exercise.name, sets, reps, duration);
  const completedCount = completedSetIndexes.length;
  const allSetsComplete = completedCount === sets && sets > 0;

  return (
    <div
      className={`bg-white rounded-2xl sm:rounded-[28px] p-3.5 sm:p-5 border transition-all duration-300 flex flex-col justify-between gap-3.5 sm:gap-4 relative overflow-hidden group hover:-translate-y-1 ${
        isCompleted || allSetsComplete
          ? "border-[#c1ff00]/60 bg-[#c1ff00]/5 shadow-md"
          : "border-gray-100 hover:border-gray-300 hover:shadow-xl shadow-xs"
      }`}
    >
      {/* ── 1. Compact Looping Exercise Demonstration Video (30-40% height) ── */}
      <div className="relative">
        <ExerciseVideo
          videoSrc={media.videoSrc}
          posterSrc={media.posterSrc}
          exerciseName={exercise.name}
          variant="preview"
          category={exercise.category}
        />

        {/* Floating Quick Action over video - Accessible on mobile & hover on desktop */}
        <button
          type="button"
          onClick={() => onViewForm(exercise)}
          className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 bg-black/60 hover:bg-black/90 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-black uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-white/20 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 flex items-center gap-1 shadow-md cursor-pointer"
        >
          <PlayCircleIcon className="w-3.5 h-3.5 text-[#c1ff00]" />
          <span>Technique</span>
        </button>
      </div>

      {/* ── 2. Header & Difficulty Info ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg ${
                exercise.difficulty === "high"
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : exercise.difficulty === "medium"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-[#c1ff00]/15 text-[#111111] border border-[#c1ff00]/40"
              }`}
            >
              {exercise.difficulty || "medium"}
            </span>

            <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 uppercase">
              {exercise.category}
            </span>
          </div>

          <h3 className="text-base font-black text-[#111111] leading-tight">
            {exercise.name}
          </h3>
          
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8bb900]" />
            <span className="text-[#111111] font-bold">{media.primaryMuscles[0]}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400 text-[10px]">{media.equipment}</span>
          </div>
        </div>

        {/* Master Exercise Complete Checkbox */}
        <button
          type="button"
          onClick={onToggleExercise}
          className="transition-transform active:scale-90 flex-shrink-0"
          title="Toggle complete exercise"
        >
          {isCompleted || allSetsComplete ? (
            <div className="w-7 h-7 bg-[#c1ff00] rounded-full flex items-center justify-center shadow-md">
              <CheckCircleSolid className="w-4 h-4 text-[#111111]" />
            </div>
          ) : (
            <CheckCircleIcon className="w-7 h-7 text-gray-300 hover:text-[#c1ff00] transition-colors" />
          )}
        </button>
      </div>

      {/* ── 3. Volume Targets ── */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-50/80 p-2 rounded-xl border border-gray-100">
          <span className="text-gray-400 text-[9px] uppercase font-bold tracking-wider block">
            {duration ? "Duration" : "Target Sets"}
          </span>
          <span className="text-sm font-black text-[#111111]">
            {duration ? `${duration}m` : `${sets} Sets`}
          </span>
        </div>

        <div className="bg-gray-50/80 p-2 rounded-xl border border-gray-100">
          <span className="text-gray-400 text-[9px] uppercase font-bold tracking-wider block">
            {duration ? "Cadence" : "Target Reps"}
          </span>
          <span className="text-sm font-black text-[#111111]">
            {duration ? "Sustained" : reps}
          </span>
        </div>
      </div>

      {/* ── 4. Progressive Overload Box ── */}
      <div className="bg-gradient-to-r from-gray-50 to-[#c1ff00]/5 border border-gray-100 rounded-2xl p-2.5 space-y-1">
        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-gray-400">
          <span>Progressive Target</span>
          <span className="text-[#8bb900] font-black flex items-center gap-1">
            <ArrowTrendingUpIcon className="w-3 h-3" />
            {overload.progression}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[9px] text-gray-400 font-semibold block">Last Session</span>
            <span className="font-bold text-gray-600 text-[11px]">{overload.last}</span>
          </div>
          <div>
            <span className="text-[9px] text-[#8bb900] font-bold block">Today's Target</span>
            <span className="font-black text-[#111111] text-[11px]">{overload.target}</span>
          </div>
        </div>
      </div>

      {/* ── 5. Set Checklist ── */}
      {!duration && (
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-gray-400">
            <span>Set Checklist</span>
            <span className="text-[#111111] font-bold">
              {completedCount} / {sets} Complete
            </span>
          </div>

          <div className="space-y-1">
            {Array.from({ length: sets }).map((_, sIdx) => {
              const isSetDone = completedSetIndexes.includes(sIdx);
              return (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => onToggleSet(sIdx)}
                  className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                    isSetDone
                      ? "bg-[#c1ff00]/20 border-[#c1ff00]/60 text-[#111111]"
                      : "bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gray-400">SET {sIdx + 1}</span>
                    <span className="text-[11px]">{reps} reps</span>
                  </span>
                  {isSetDone ? (
                    <CheckCircleSolid className="w-3.5 h-3.5 text-[#111111]" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 6. Bottom Action ── */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onViewForm(exercise)}
          className="text-xs font-black text-[#111111] hover:text-black flex items-center gap-1.5 transition-colors group-hover:text-[#8bb900]"
        >
          <PlayCircleIcon className="w-4 h-4 text-[#8bb900]" />
          <span>VIEW TECHNIQUE →</span>
        </button>

        {exercise.rest && (
          <span className="text-[10px] font-bold text-gray-400">
            {exercise.rest}s Rest
          </span>
        )}
      </div>
    </div>
  );
}
