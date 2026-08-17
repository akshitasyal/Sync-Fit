"use client";

import {
  BoltIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import { IWorkoutDay, IExercise } from "@/types/workout";
import ExerciseVideo from "@/components/workout/ExerciseVideo";
import MuscleSilhouetteVisual from "@/components/workout/MuscleSilhouetteVisual";
import { getExerciseMedia } from "@/constants/exerciseMedia";

interface WorkoutHeroProps {
  day?: IWorkoutDay;
  selectedProgram?: string;
  experienceLevel?: string;
  energyLevel?: string;
  sleepQuality?: string;
  onStartWorkout?: () => void;
}

/**
 * Derives muscle activation percentages based on day focus and category
 */
function getMuscleActivations(focus = ""): { name: string; percentage: number }[] {
  const f = focus.toLowerCase();
  if (f.includes("leg") || f.includes("quad") || f.includes("lower")) {
    return [
      { name: "Quadriceps", percentage: 85 },
      { name: "Glutes", percentage: 65 },
      { name: "Hamstrings", percentage: 40 },
    ];
  }
  if (f.includes("chest") || f.includes("push")) {
    return [
      { name: "Pectorals (Chest)", percentage: 90 },
      { name: "Anterior Deltoids", percentage: 70 },
      { name: "Triceps Brachii", percentage: 65 },
    ];
  }
  if (f.includes("back") || f.includes("pull")) {
    return [
      { name: "Latissimus Dorsi", percentage: 85 },
      { name: "Rhomboids & Traps", percentage: 75 },
      { name: "Biceps", percentage: 60 },
    ];
  }
  if (f.includes("shoulder") || f.includes("arm")) {
    return [
      { name: "Lateral & Rear Delts", percentage: 85 },
      { name: "Triceps & Biceps", percentage: 75 },
      { name: "Core", percentage: 30 },
    ];
  }
  if (f.includes("cardio") || f.includes("hiit") || f.includes("circuit")) {
    return [
      { name: "Cardiovascular System", percentage: 95 },
      { name: "Abdominals & Core", percentage: 80 },
      { name: "Quadriceps & Calves", percentage: 65 },
    ];
  }
  // Full body default
  return [
    { name: "Major Compound Movers", percentage: 80 },
    { name: "Core & Pelvic Floor", percentage: 65 },
    { name: "Posterior Chain", percentage: 60 },
  ];
}

export default function WorkoutHero({
  day,
  selectedProgram = "muscle-gain",
  experienceLevel = "intermediate",
  energyLevel = "high",
  sleepQuality = "good",
  onStartWorkout,
}: WorkoutHeroProps) {
  if (!day) return null;

  const isRest = day.focus === "Rest";
  const validExercises = day.exercises?.filter((e) => typeof e.exerciseId !== "string") || [];
  const exerciseCount = validExercises.length;
  const firstExercise = validExercises[0]?.exerciseId as IExercise | undefined;
  const estimatedMin = isRest ? 0 : Math.max(30, exerciseCount * 12);
  const muscleActivations = getMuscleActivations(day.focus);

  const firstMedia = getExerciseMedia(firstExercise?.name || day.focus);

  // Dynamic Readiness Calculation
  let readinessScore = 88;
  if (energyLevel === "low" || sleepQuality === "poor") readinessScore = 64;
  else if (energyLevel === "high" && sleepQuality === "good") readinessScore = 94;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-[32px] p-4 sm:p-6 md:p-8 shadow-xs relative overflow-hidden space-y-6 sm:space-y-8">
      {/* Background Icon Watermark */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        <BoltIcon className="w-56 h-56 text-[#111111]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">

        {/* ── Left Column: Session Meta, Readiness, Muscle Bars & Start CTA (7 Cols) ── */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <span className="px-3 py-1 bg-[#c1ff00]/15 text-[#111111] text-[10px] font-black uppercase tracking-[0.16em] rounded-full border border-[#c1ff00]/40">
                Today's Workout
              </span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                {day.dayOfWeek}
              </span>
              {day.isCompleted && (
                <span className="text-xs font-black text-[#111111] bg-[#c1ff00] px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                  <CheckCircleIcon className="w-3.5 h-3.5" /> Complete
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-[#111111] tracking-tight uppercase">
              {day.focus}
            </h2>

            {!isRest && (
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 font-semibold pt-1 flex-wrap">
                <span className="flex items-center gap-1.5 text-[#111111] font-bold">
                  <BoltIcon className="w-4 h-4 text-[#c1ff00]" />
                  {exerciseCount} Exercises
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  ~{estimatedMin} min
                </span>
                <span>•</span>
                <span className="capitalize text-gray-700 font-bold">
                  {experienceLevel} Level
                </span>
              </div>
            )}
          </div>

          {/* Readiness Gauge Row */}
          {!isRest && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Today's Readiness
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c1ff00] animate-pulse" />
                  <span className="text-sm font-black text-[#111111]">
                    {readinessScore}% Ready to Train
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-bold text-gray-500 flex-wrap">
                <span>⚡ Energy: <strong className="capitalize text-[#111111]">{energyLevel}</strong></span>
                <span>🌙 Sleep: <strong className="capitalize text-[#111111]">{sleepQuality}</strong></span>
              </div>
            </div>
          )}

          {/* Target Muscle Activation Progress Bars */}
          {!isRest && (
            <div className="space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 block">
                Target Muscle Activation
              </span>
              <div className="space-y-2">
                {muscleActivations.map((m) => (
                  <div key={m.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#111111]">
                      <span>{m.name}</span>
                      <span className="text-gray-500">{m.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#c1ff00] h-full rounded-full transition-all duration-700"
                        style={{ width: `${m.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── START WORKOUT CTA Button ── */}
          {!isRest && onStartWorkout && (
            <button
              onClick={onStartWorkout}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#c1ff00] hover:bg-[#aadf00] text-black font-black rounded-xl sm:rounded-2xl transition-all hover:scale-105 shadow-[0_4px_20px_rgba(193,255,0,0.4)] flex items-center justify-center gap-3 group text-sm sm:text-base cursor-pointer"
            >
              <span>START WORKOUT</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* ── Right Column: First Exercise Looping Video & Target Muscle Silhouette (5 Cols) ── */}
        {!isRest && (
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* 1st Exercise Demonstration Video */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Lead Exercise Movement
                </span>
                <span className="text-[10px] font-bold text-[#8bb900] truncate max-w-[150px]">
                  {firstExercise?.name || "Warm-up"}
                </span>
              </div>
              <ExerciseVideo
                videoSrc={firstMedia.videoSrc}
                posterSrc={firstMedia.posterSrc}
                exerciseName={firstExercise?.name || day.focus}
                variant="hero"
                category={firstExercise?.category || "legs"}
              />
            </div>

            {/* Target Muscle Silhouette */}
            <MuscleSilhouetteVisual focus={day.focus} />
          </div>
        )}

      </div>
    </div>
  );
}
