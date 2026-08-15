"use client";

import { useState } from "react";
import {
  XMarkIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BoltIcon,
  ClockIcon,
  LightBulbIcon,
  PlayCircleIcon,
  PlusIcon,
  ForwardIcon,
} from "@heroicons/react/24/solid";
import { IWorkoutDay, IExercise } from "@/types/workout";
import ExerciseVideo from "@/components/workout/ExerciseVideo";
import { getExerciseMedia } from "@/constants/exerciseMedia";

interface ActiveWorkoutModeProps {
  isOpen: boolean;
  onClose: () => void;
  day: IWorkoutDay;
  setChecklist: Record<string, number[]>;
  onToggleSet: (exerciseId: string, setIdx: number, totalSets: number) => void;
  onCompleteWorkout: () => void;
  onViewForm: (exercise: IExercise) => void;
}

export default function ActiveWorkoutMode({
  isOpen,
  onClose,
  day,
  setChecklist,
  onToggleSet,
  onCompleteWorkout,
  onViewForm,
}: ActiveWorkoutModeProps) {
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);

  if (!isOpen || !day) return null;

  const validExercises = day.exercises?.filter((e) => typeof e.exerciseId !== "string") || [];
  const currentItem = validExercises[currentExIdx];
  const currentExercise = currentItem?.exerciseId as IExercise | undefined;

  if (!currentExercise) return null;

  const exId = (currentExercise._id || "").toString();
  const media = getExerciseMedia(currentExercise.name);
  const totalSets = currentItem.sets || 3;
  const targetReps = currentItem.reps || "8-12";
  const completedSets = setChecklist[`${day.date}_${exId}`] || [];
  const allCurrentSetsDone = completedSets.length >= totalSets;

  // Handle Set Completion inside Workout Mode
  const handleCompleteCurrentSet = () => {
    // Find next uncompleted set index
    let nextSetIdx = 0;
    for (let i = 0; i < totalSets; i++) {
      if (!completedSets.includes(i)) {
        nextSetIdx = i;
        break;
      }
    }

    onToggleSet(exId, nextSetIdx, totalSets);

    // Trigger Rest Period (e.g. 90 seconds)
    const restTime = currentExercise.rest || 90;
    setRestSeconds(restTime);
    setIsResting(true);
  };

  const nextExercise = () => {
    if (currentExIdx < validExercises.length - 1) {
      setCurrentExIdx((i) => i + 1);
      setIsResting(false);
    }
  };

  const prevExercise = () => {
    if (currentExIdx > 0) {
      setCurrentExIdx((i) => i - 1);
      setIsResting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0c10] text-white flex flex-col justify-between overflow-y-auto animate-in fade-in duration-300">
      {/* ── 1. Top Header & Navigation Bar ── */}
      <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#c1ff00] text-black flex items-center justify-center font-black">
            <BoltIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#c1ff00]">
                Guided Training Mode
              </span>
              <span className="text-xs text-gray-400 font-bold">• {day.focus}</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Exercise {currentExIdx + 1} of {validExercises.length}
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
          title="Exit Workout Mode"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* ── 2. Main Center Body: Video & Active Set Execution ── */}
      <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">

        {/* Left: Large Video Demonstration (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <ExerciseVideo
              videoSrc={media.videoSrc}
              posterSrc={media.posterSrc}
              exerciseName={currentExercise.name}
              variant="workoutMode"
              category={currentExercise.category}
            />

            <button
              onClick={() => onViewForm(currentExercise)}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-xs font-black uppercase px-3 py-1.5 rounded-full border border-white/20 transition-all flex items-center gap-1.5 shadow-lg"
            >
              <PlayCircleIcon className="w-4 h-4 text-[#c1ff00]" />
              <span>Technique Guide</span>
            </button>
          </div>

          {/* Contextual Coach Tip Banner */}
          <div className="bg-[#14161d] border border-white/10 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#c1ff00]/15 text-[#c1ff00] flex-shrink-0 mt-0.5">
              <LightBulbIcon className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#c1ff00]">
                SyncFit Coach Cue
              </span>
              <p className="text-xs text-gray-300 font-medium leading-relaxed">
                {media.coachTips[0] || "Maintain strict abdominal tension and control the eccentric descent."}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Active Set Tracker & Rest Actions (5 Cols) */}
        <div className="lg:col-span-5 bg-[#14161d] border border-white/10 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Active Exercise
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentExercise.name}
            </h3>
            <p className="text-xs text-[#c1ff00] font-bold uppercase tracking-wider">
              {totalSets} Sets • {targetReps} Reps
            </p>
          </div>

          {/* Set Checklist Stack */}
          <div className="space-y-2">
            {Array.from({ length: totalSets }).map((_, sIdx) => {
              const isDone = completedSets.includes(sIdx);
              const isCurrent = !isDone && (sIdx === 0 || completedSets.includes(sIdx - 1));

              return (
                <div
                  key={sIdx}
                  onClick={() => onToggleSet(exId, sIdx, totalSets)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isDone
                      ? "bg-[#c1ff00]/15 border-[#c1ff00] text-white"
                      : isCurrent
                      ? "bg-white/10 border-white/30 text-white shadow-lg ring-1 ring-[#c1ff00]/40"
                      : "bg-[#0b0c10] border-white/5 text-gray-500 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase text-gray-400">
                      SET {sIdx + 1}
                    </span>
                    <span className="text-sm font-bold">{targetReps} Reps</span>
                  </div>

                  {isDone ? (
                    <CheckCircleIcon className="w-5 h-5 text-[#c1ff00]" />
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-gray-500" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Primary Action Button: Complete Set or Next */}
          <div className="space-y-3 pt-2">
            {!allCurrentSetsDone ? (
              <button
                onClick={handleCompleteCurrentSet}
                className="w-full py-4 px-6 bg-[#c1ff00] hover:bg-[#aadf00] text-black font-black rounded-2xl text-sm transition-all hover:scale-[1.02] shadow-[0_4px_20px_rgba(193,255,0,0.4)] flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="w-5 h-5" />
                <span>COMPLETE SET</span>
              </button>
            ) : (
              <button
                onClick={currentExIdx < validExercises.length - 1 ? nextExercise : onCompleteWorkout}
                className="w-full py-4 px-6 bg-[#c1ff00] hover:bg-[#aadf00] text-black font-black rounded-2xl text-sm transition-all hover:scale-[1.02] shadow-[0_4px_20px_rgba(193,255,0,0.4)] flex items-center justify-center gap-2"
              >
                <span>{currentExIdx < validExercises.length - 1 ? "NEXT EXERCISE →" : "FINISH WORKOUT 🎉"}</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ── 3. Bottom Session Navigation Bar ── */}
      <div className="p-4 sm:p-6 border-t border-white/10 flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <button
          onClick={prevExercise}
          disabled={currentExIdx === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs font-black uppercase text-white transition-all"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Global Workout Completion Shortcut */}
        <button
          onClick={onCompleteWorkout}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-colors"
        >
          End &amp; Log Workout
        </button>

        <button
          onClick={nextExercise}
          disabled={currentExIdx === validExercises.length - 1}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs font-black uppercase text-white transition-all"
        >
          <span>Next</span>
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
