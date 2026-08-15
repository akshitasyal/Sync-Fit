"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import {
  BoltIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { useWorkoutPlan } from "@/hooks/useWorkoutPlan";
import { useProfile } from "@/hooks/useProfile";
import { IExercise } from "@/types/workout";

import WorkoutHeader from "@/components/workout/WorkoutHeader";
import WeeklyProgress from "@/components/workout/WeeklyProgress";
import WorkoutHero from "@/components/workout/WorkoutHero";
import WorkoutStats from "@/components/workout/WorkoutStats";
import ExerciseCard from "@/components/workout/ExerciseCard";
import ExerciseFormModal from "@/components/workout/ExerciseFormModal";
import RestTimer from "@/components/workout/RestTimer";
import WorkoutCompletionModal from "@/components/workout/WorkoutCompletionModal";
import ProgramChangeModal from "@/components/workout/ProgramChangeModal";
import RegenerateConfirmModal from "@/components/workout/RegenerateConfirmModal";
import ActiveWorkoutMode from "@/components/workout/ActiveWorkoutMode";

export default function WorkoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    plan,
    loading: planLoading,
    generating,
    error: planError,
    activeDayIdx,
    setActiveDayIdx,
    generatePlan,
    toggleCompletion,
    setError: setPlanError,
  } = useWorkoutPlan();

  const {
    profile,
    loading: profileLoading,
    updating: updatingProfile,
    error: profileError,
    updateProfile,
  } = useProfile();

  // Modals & Interactive States
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [activeFormExercise, setActiveFormExercise] = useState<IExercise | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showActiveWorkout, setShowActiveWorkout] = useState(false);
  const [changingProgram, setChangingProgram] = useState<string | null>(null);

  // Set-by-set tracking state: key = `${dayDate}_${exerciseId}`, value = array of completed set indexes
  const [setChecklist, setSetChecklist] = useState<Record<string, number[]>>({});

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const activeDay = plan?.days?.[activeDayIdx];
  const selectedProgram = profile?.selectedProgram || "muscle-gain";

  // Switch Program Action
  const switchProgram = async (programId: string) => {
    if (profile?.selectedProgram === programId) {
      setShowProgramModal(false);
      return;
    }
    try {
      setChangingProgram(programId);
      await updateProfile({ selectedProgram: programId as any });
      await generatePlan();
      setActiveDayIdx(0);
      setShowProgramModal(false);
    } catch (err: any) {
      setPlanError(err.message);
    } finally {
      setChangingProgram(null);
    }
  };

  // Safe regeneration action
  const handleRegenerate = async () => {
    try {
      await generatePlan();
    } catch (err: any) {
      setPlanError(err.message);
    }
  };

  // Seed fallback
  const seedAndGenerate = async () => {
    try {
      setPlanError("");
      await fetch("/api/workouts/seed");
      await generatePlan();
    } catch {
      setPlanError("Failed to seed exercises");
    }
  };

  // Handle Set Toggle
  const handleToggleSet = (exerciseId: string, setIdx: number, totalSets: number) => {
    if (!activeDay) return;
    const key = `${activeDay.date}_${exerciseId}`;
    const current = setChecklist[key] || [];

    let updated: number[];
    if (current.includes(setIdx)) {
      updated = current.filter((i) => i !== setIdx);
    } else {
      updated = [...current, setIdx];
      // Automatically trigger rest timer when completing a set
      setShowRestTimer(true);
    }

    setSetChecklist((prev) => ({ ...prev, [key]: updated }));

    // If all sets for this exercise are now done, toggle exercise completion if not already marked
    const exInDay = activeDay.exercises.find(
      (e: any) => (e.exerciseId?._id?.toString() ?? e.exerciseId?.toString()) === exerciseId
    );
    if (updated.length === totalSets && exInDay && !exInDay.completed) {
      toggleCompletion(exerciseId);
    }
  };

  // Handle Complete Exercise Toggle
  const handleToggleExercise = (exerciseId: string, totalSets: number) => {
    if (!activeDay) return;
    const key = `${activeDay.date}_${exerciseId}`;
    const exInDay = activeDay.exercises.find(
      (e: any) => (e.exerciseId?._id?.toString() ?? e.exerciseId?.toString()) === exerciseId
    );

    const willBeCompleted = !exInDay?.completed;
    toggleCompletion(exerciseId);

    // Update set checklist to match
    if (willBeCompleted) {
      setSetChecklist((prev) => ({
        ...prev,
        [key]: Array.from({ length: totalSets }, (_, i) => i),
      }));
    } else {
      setSetChecklist((prev) => ({
        ...prev,
        [key]: [],
      }));
    }
  };

  // Calculate day completion stats
  const exercises = useMemo(() => {
    if (!activeDay || activeDay.focus === "Rest") return [];
    return activeDay.exercises.filter((ex) => typeof ex.exerciseId !== "string");
  }, [activeDay]);

  const completedExercisesCount = exercises.filter((ex) => ex.completed).length;
  const totalExercisesCount = exercises.length;
  const exerciseProgressPercent =
    totalExercisesCount > 0
      ? Math.round((completedExercisesCount / totalExercisesCount) * 100)
      : 0;

  // Complete full workout
  const handleCompleteWorkout = () => {
    if (!activeDay) return;
    // Mark all exercises complete
    exercises.forEach((ex) => {
      const exId = (ex.exerciseId as IExercise)._id;
      if (!ex.completed) toggleCompletion(exId);
    });
    setShowActiveWorkout(false);
    setShowCompletionModal(true);
  };

  // Auto-celebration check when all exercises are complete
  useEffect(() => {
    if (
      totalExercisesCount > 0 &&
      completedExercisesCount === totalExercisesCount &&
      !showCompletionModal &&
      !showActiveWorkout
    ) {
      const timer = setTimeout(() => {
        setShowCompletionModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [completedExercisesCount, totalExercisesCount, showCompletionModal, showActiveWorkout]);

  const loading = planLoading || profileLoading || status === "loading";
  const error = planError || profileError;

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#f8f7f5] h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#c1ff00] animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Calibrating your training engine…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#f8f7f5] p-5 sm:p-8 md:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* 1. Header */}
        <WorkoutHeader
          selectedProgram={selectedProgram}
          generating={generating}
          onOpenProgramSelector={() => setShowProgramModal(true)}
          onOpenRegenerateModal={() => setShowRegenerateModal(true)}
          hasPlan={!!plan}
        />

        {/* 2. Error Notice */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3 text-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
            <span>{error}</span>
            {error.includes("No exercises") && (
              <button
                onClick={seedAndGenerate}
                className="ml-auto font-bold underline whitespace-nowrap"
              >
                Seed Exercises Now
              </button>
            )}
          </div>
        )}

        {/* 3. Active Workout Plan Flow */}
        {plan && (
          <div className="space-y-8">
            {/* Weekly Progress Calendar */}
            <WeeklyProgress
              days={plan.days}
              activeDayIdx={activeDayIdx}
              onSelectDay={setActiveDayIdx}
              streakCount={4}
            />

            {/* Today's Workout Hero */}
            <WorkoutHero
              day={activeDay}
              selectedProgram={selectedProgram}
              experienceLevel={profile?.experienceLevel || "intermediate"}
              energyLevel={profile?.energyLevel || "high"}
              sleepQuality={profile?.sleepQuality || "good"}
              onStartWorkout={() => setShowActiveWorkout(true)}
            />

            {/* Workout Summary Stats */}
            <WorkoutStats day={activeDay} />

            {/* Exercises Section */}
            {activeDay?.focus === "Rest" ? (
              <div className="py-20 text-center bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm space-y-4">
                <p className="text-6xl">😴</p>
                <h3 className="text-2xl font-black text-[#111111]">Active Recovery Day</h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                  Your muscles rebuild and synthesize protein during recovery. Prioritize hydration, 8+ hours of restful sleep, and gentle mobility.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Exercise Section Progress Bar Header */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                      Today's Execution Progress
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-[#111111]">
                        {completedExercisesCount} / {totalExercisesCount}
                      </span>
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        Exercises Completed
                      </span>
                    </div>
                  </div>

                  <div className="w-full sm:w-64 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-gray-500">
                      <span>Progress</span>
                      <span className="text-[#111111] font-black">{exerciseProgressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[#c1ff00] h-full rounded-full transition-all duration-500"
                        style={{ width: `${exerciseProgressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Exercise Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exercises.map((ex, idx) => {
                    const exercise = ex.exerciseId as IExercise;
                    const exId = (exercise._id || "").toString();
                    const key = `${activeDay?.date}_${exId}`;
                    const completedSets = setChecklist[key] || [];

                    return (
                      <ExerciseCard
                        key={exId || idx}
                        exercise={exercise}
                        sets={ex.sets || 3}
                        reps={ex.reps || "8-12"}
                        duration={ex.duration}
                        isCompleted={ex.completed}
                        completedSetIndexes={completedSets}
                        onToggleSet={(sIdx) => handleToggleSet(exId, sIdx, ex.sets || 3)}
                        onToggleExercise={() => handleToggleExercise(exId, ex.sets || 3)}
                        onViewForm={(exerciseObj) => setActiveFormExercise(exerciseObj)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. Empty State if No Plan */}
        {!plan && !loading && (
          <div className="bg-white rounded-[32px] border border-dashed border-gray-200 p-12 sm:p-16 text-center space-y-6 max-w-xl mx-auto mt-8 shadow-sm">
            <div className="w-20 h-20 bg-[#c1ff00] rounded-3xl flex items-center justify-center mx-auto shadow-md">
              <BoltIcon className="w-10 h-10 text-black" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#111111]">
                No Workout Plan Initialized
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Ready to calibrate your weekly training protocol? Click below to generate an intelligent personalized plan.
              </p>
            </div>
            <button
              onClick={generatePlan}
              disabled={generating}
              className="px-8 py-4 bg-[#c1ff00] hover:bg-[#aadf00] text-[#111111] font-black rounded-2xl transition-all hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(193,255,0,0.35)] disabled:opacity-50 text-sm"
            >
              {generating ? "Calibrating Training Protocol…" : "Initialize Workout Engine →"}
            </button>
          </div>
        )}

      </div>

      {/* ── Guided Full-Screen / Interactive Workout Mode ───────── */}
      {activeDay && (
        <ActiveWorkoutMode
          isOpen={showActiveWorkout}
          onClose={() => setShowActiveWorkout(false)}
          day={activeDay}
          setChecklist={setChecklist}
          onToggleSet={handleToggleSet}
          onCompleteWorkout={handleCompleteWorkout}
          onViewForm={(exerciseObj) => setActiveFormExercise(exerciseObj)}
        />
      )}

      {/* ── Floating Rest Timer Widget ─────────────────────────── */}
      <RestTimer
        isOpen={showRestTimer}
        onClose={() => setShowRestTimer(false)}
        initialSeconds={90}
      />

      {/* ── Form Guide Modal with Video ────────────────────────── */}
      <ExerciseFormModal
        exercise={activeFormExercise}
        onClose={() => setActiveFormExercise(null)}
      />

      {/* ── Program Selector Modal ─────────────────────────────── */}
      <ProgramChangeModal
        isOpen={showProgramModal}
        onClose={() => setShowProgramModal(false)}
        selectedProgram={selectedProgram}
        onSelectProgram={switchProgram}
        changingProgram={changingProgram}
      />

      {/* ── Safe Regenerate Confirmation Modal ─────────────────── */}
      <RegenerateConfirmModal
        isOpen={showRegenerateModal}
        onClose={() => setShowRegenerateModal(false)}
        onConfirm={handleRegenerate}
        generating={generating}
      />

      {/* ── Celebration / Workout Complete Modal ───────────────── */}
      <WorkoutCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        workoutFocus={activeDay?.focus || "Today's Session"}
        totalSets={exercises.reduce((acc, ex) => acc + (ex.sets || 3), 0)}
        durationMin={Math.max(30, exercises.length * 12)}
        caloriesBurned={Math.round(exercises.length * 80)}
        streak={5}
      />
    </div>
  );
}
