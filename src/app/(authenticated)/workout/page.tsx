"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BoltIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ClockIcon,
  ListBulletIcon,
  AcademicCapIcon,
  FireIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  UserIcon,
  Square3Stack3DIcon,
  HandRaisedIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

import { useWorkoutPlan } from "@/hooks/useWorkoutPlan";
import { useProfile } from "@/hooks/useProfile";
import { PROGRAMS } from "@/constants/programs";
import { IExercise } from "@/types/workout";

const MuscleIcon = ({ category }: { category: string }) => {
  switch (category) {
    case "chest": return <Square3Stack3DIcon className="w-4 h-4" />;
    case "back": return <HandRaisedIcon className="w-4 h-4" />;
    case "legs": return <UserIcon className="w-4 h-4" />;
    case "arms": return <HandRaisedIcon className="w-4 h-4" />;
    case "shoulders": return <ShieldCheckIcon className="w-4 h-4" />;
    case "core": return <FireIcon className="w-4 h-4" />;
    case "cardio": return <RocketLaunchIcon className="w-4 h-4" />;
    case "full-body": return <BoltIcon className="w-4 h-4" />;
    case "mobility": return <ArrowPathIcon className="w-4 h-4" />;
    default: return <BoltIcon className="w-4 h-4" />;
  }
};

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

  const [changingProgram, setChangingProgram] = useState<string | null>(null);
  const [showProgramSelector, setShowProgramSelector] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const switchProgram = async (programId: string) => {
    if (profile?.selectedProgram === programId) {
      setShowProgramSelector(false);
      return;
    }
    try {
      setChangingProgram(programId);
      await updateProfile({ selectedProgram: programId as any });
      await generatePlan();
      setActiveDayIdx(0);
      setShowProgramSelector(false);
    } catch (err: any) {
      setPlanError(err.message);
    } finally {
      setChangingProgram(null);
    }
  };

  const seedAndGenerate = async () => {
    try {
      setPlanError("");
      await fetch("/api/workouts/seed");
      await generatePlan();
    } catch {
      setPlanError("Failed to seed exercises");
    }
  };

  const loading = planLoading || profileLoading || status === "loading";
  const error = planError || profileError;
  const selectedProgram = profile?.selectedProgram;

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#f8f7f5] h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#c1ff00] animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Loading your training plan…</p>
        </div>
      </div>
    );
  }

  const activeDay = plan?.days?.[activeDayIdx];
  const activeProgramConfig = PROGRAMS.find(p => p.id === selectedProgram);

  return (
    <div className="flex-grow bg-[#f8f7f5] p-6 md:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Page Header ───────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Training</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight">Workout Engine</h1>
              {activeProgramConfig && (
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-tight flex items-center gap-1.5 ${activeProgramConfig.badge} border-current/20`}>
                  {activeProgramConfig.emoji} {activeProgramConfig.label}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {activeProgramConfig ? activeProgramConfig.desc : "Select a program below to generate your training plan."}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowProgramSelector(s => !s)}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-[#111111] hover:border-gray-300 font-semibold transition-all text-sm shadow-sm"
            >
              🎯 Change Program
              <ChevronRightIcon className={`w-4 h-4 transition-transform ${showProgramSelector ? "rotate-90" : ""}`} />
            </button>
            <button
              onClick={generatePlan}
              disabled={generating}
              className="flex items-center gap-2 px-6 py-3 bg-[#c1ff00] hover:bg-[#a9e000] disabled:opacity-50 text-[#111111] font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(193,255,0,0.35)] hover:-translate-y-0.5"
            >
              <ArrowPathIcon className={`w-5 h-5 ${generating ? "animate-spin" : ""}`} />
              {plan ? "Regenerate Week" : "Generate Plan"}
            </button>
          </div>
        </div>

        {/* ── Program Selector Modal Overlay ─────────────────────── */}
        {showProgramSelector && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={() => setShowProgramSelector(false)}
            />
            <div className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[680px] lg:w-[800px] z-50 bg-white rounded-[30px] shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-[#111111]">Choose Your Fitness Program</h2>
                  <p className="text-gray-400 text-sm">Switching program regenerates your weekly plan instantly.</p>
                </div>
                <button
                  onClick={() => setShowProgramSelector(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#111111]"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROGRAMS.map(prog => {
                  const isActive = selectedProgram === prog.id;
                  const isLoading = changingProgram === prog.id;
                  return (
                    <button
                      key={prog.id}
                      id={`program-${prog.id}`}
                      onClick={() => switchProgram(prog.id)}
                      disabled={!!changingProgram}
                      className={`relative text-left p-5 rounded-2xl border-2 transition-all hover:-translate-y-0.5 disabled:opacity-60 ${
                        isActive
                          ? "border-[#111111] bg-[#f8f8f5] shadow-lg"
                          : "border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-white hover:shadow-md"
                      }`}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b ${prog.color}`} />
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-2xl">{prog.emoji}</span>
                            <span className="font-bold text-[#111111] text-sm">{prog.label}</span>
                          </div>
                          <p className="text-gray-400 text-xs leading-relaxed">{prog.desc}</p>
                        </div>
                        {isLoading ? (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-[#111111] animate-spin flex-shrink-0 mt-0.5" />
                        ) : isActive ? (
                          <CheckCircleSolid className="w-5 h-5 text-[#111111] flex-shrink-0 mt-0.5" />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ── Error ─────────────────────────────────────────────── */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
            {error}
            {error.includes("No exercises") && (
              <button onClick={seedAndGenerate} className="ml-auto font-bold underline whitespace-nowrap">
                Seed Exercises Now
              </button>
            )}
          </div>
        )}

        {/* ── Workout Plan View ──────────────────────────────────── */}
        {plan && (
          <div className="space-y-8">
            <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
              {plan.days.map((day, idx) => (
                <button
                  key={day.date}
                  onClick={() => setActiveDayIdx(idx)}
                  className={`flex-shrink-0 px-5 py-3 rounded-xl border transition-all flex flex-col items-center min-w-[100px] ${
                    activeDayIdx === idx
                      ? "bg-[#c1ff00] border-[#c1ff00] text-[#111111] shadow-[0_4px_14px_rgba(193,255,0,0.3)]"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${activeDayIdx === idx ? "text-[#111111]" : "text-gray-400"}`}>
                    {day.dayOfWeek.slice(0, 3)}
                  </span>
                  <span className="text-lg font-black">{new Date(day.date).getDate()}</span>
                  {day.isCompleted && (
                    <CheckCircleSolid className={`w-4 h-4 mt-1.5 ${activeDayIdx === idx ? "text-black" : "text-[#c1ff00]"}`} />
                  )}
                </button>
              ))}
            </div>

            <div className="bg-white border border-gray-100 p-7 rounded-[30px] shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-[0.04] pointer-events-none">
                <BoltIcon className="w-32 h-32 text-[#111111]" />
              </div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-3 py-1 bg-[#c1ff00]/10 text-[#111111] text-[10px] font-bold uppercase tracking-tighter rounded-full border border-[#c1ff00]/30">
                  Today's Target
                </span>
                {activeProgramConfig && (
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-tighter rounded-full border ${activeProgramConfig.accent}`}>
                    {activeProgramConfig.emoji} {activeProgramConfig.label}
                  </span>
                )}
                {activeDay?.isCompleted && (
                  <span className="text-sm font-bold text-[#111111] flex items-center gap-1">
                    <CheckCircleSolid className="w-4 h-4 text-[#111111]" /> Complete!
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-black text-[#111111]">{activeDay?.focus}</h2>
              {activeDay && activeDay.focus !== "Rest" && (
                <p className="text-gray-400 text-sm mt-1">{activeDay.exercises.length} exercises today</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeDay?.focus === "Rest" ? (
                <div className="col-span-full py-16 text-center bg-white border border-gray-100 rounded-[30px] shadow-sm">
                  <p className="text-5xl mb-4">😴</p>
                  <p className="text-[#111111] text-xl font-bold">Rest Day</p>
                  <p className="text-gray-400 text-sm mt-2">Your muscles grow during recovery. Eat well and sleep.</p>
                </div>
              ) : (
                activeDay?.exercises.filter(ex => typeof ex.exerciseId !== 'string').map((ex, idx) => {
                  const exercise = ex.exerciseId as IExercise;
                  return (
                    <div
                      key={idx}
                      className={`bg-white rounded-[30px] p-6 border shadow-sm transition-all group flex flex-col gap-5 ${
                        ex.completed ? "border-[#c1ff00]/40 bg-[#c1ff00]/5" : "border-gray-100 hover:shadow-xl"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1.5 flex-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                            exercise.difficulty === "high" ? "bg-red-50 text-red-500 border border-red-100" :
                            exercise.difficulty === "medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                            "bg-[#c1ff00]/10 text-[#111111] border border-[#c1ff00]/30"
                          }`}>
                            {exercise.difficulty}
                          </span>
                          <h3 className="text-lg font-bold text-[#111111] group-hover:text-black transition-colors leading-tight pr-2">
                            {exercise.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => toggleCompletion(exercise._id)}
                          className="transition-transform active:scale-90 flex-shrink-0"
                        >
                          {ex.completed ? (
                            <div className="w-8 h-8 bg-[#c1ff00] rounded-full flex items-center justify-center">
                              <CheckCircleSolid className="w-5 h-5 text-black" />
                            </div>
                          ) : (
                            <CheckCircleIcon className="w-8 h-8 text-gray-300 hover:text-[#c1ff00] transition-colors" />
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {ex.duration ? (
                          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-1">
                              <ClockIcon className="w-3 h-3" /> Duration
                            </span>
                            <span className="text-[#111111] font-black text-lg">{ex.duration}m</span>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-1">
                              <ListBulletIcon className="w-3 h-3" /> Sets
                            </span>
                            <span className="text-[#111111] font-black text-lg">{ex.sets}</span>
                          </div>
                        )}

                        {!ex.duration && (
                          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-1">
                              <AcademicCapIcon className="w-3 h-3" /> Reps
                            </span>
                            <span className="text-[#111111] font-black text-lg">{ex.reps}</span>
                          </div>
                        )}

                        {exercise.rest && exercise.rest > 0 && !ex.duration && (
                          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-1">
                              <ClockIcon className="w-3 h-3" /> Rest
                            </span>
                            <span className="text-[#111111] font-black text-lg">
                              {exercise.rest >= 60 ? `${exercise.rest / 60}m` : `${exercise.rest}s`}
                            </span>
                          </div>
                        )}

                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 col-span-2">
                          <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-1">
                            <MuscleIcon category={exercise.category} /> Target
                          </span>
                          <span className="text-[#111111] font-bold capitalize">{exercise.category.replace("-", " ")}</span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm italic line-clamp-2">
                        {exercise.instructions}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {!plan && !loading && (
          <div className="space-y-6">
            {!selectedProgram && (
              <div className="bg-white border border-dashed border-gray-200 rounded-[30px] p-8 text-center">
                <p className="text-2xl mb-3">🎯</p>
                <h3 className="text-[#111111] font-bold text-lg mb-1">Pick a Program First</h3>
                <p className="text-gray-400 text-sm mb-5">Choose your fitness program above to get a tailored weekly plan.</p>
                <button
                  onClick={() => setShowProgramSelector(true)}
                  className="px-6 py-3 bg-[#c1ff00] hover:bg-[#a9e000] text-[#111111] font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(193,255,0,0.35)] hover:-translate-y-0.5"
                >
                  Browse Programs →
                </button>
              </div>
            )}

            {!selectedProgram && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROGRAMS.map(prog => (
                  <button
                    key={prog.id}
                    onClick={() => switchProgram(prog.id)}
                    disabled={!!changingProgram}
                    className="relative text-left p-5 rounded-2xl border-2 border-gray-100 bg-white hover:border-gray-300 hover:shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b ${prog.color}`} />
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-2xl">{prog.emoji}</span>
                      <span className="font-bold text-[#111111] text-sm">{prog.label}</span>
                      {changingProgram === prog.id && (
                        <div className="w-4 h-4 ml-auto rounded-full border-2 border-gray-200 border-t-[#111111] animate-spin" />
                      )}
                    </div>
                    <p className="text-gray-400 text-xs">{prog.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {selectedProgram && (
              <div className="bg-white rounded-[30px] border border-dashed border-gray-200 p-20 text-center space-y-6 max-w-xl mx-auto mt-10">
                <div className="w-20 h-20 bg-[#c1ff00] rounded-full flex items-center justify-center mx-auto">
                  <BoltIcon className="w-10 h-10 text-black" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#111111]">No Workout Plan Active</h2>
                  <p className="text-gray-400">Ready to train with <strong>{PROGRAMS.find(p => p.id === selectedProgram)?.label}</strong>? Generate your week.</p>
                </div>
                <button
                  onClick={generatePlan}
                  disabled={generating}
                  className="px-8 py-4 bg-[#c1ff00] hover:bg-[#a9e000] text-[#111111] font-black rounded-xl transition-all hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(193,255,0,0.35)] disabled:opacity-50"
                >
                  {generating ? "Calibrating…" : "Initialize Training Plan"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
