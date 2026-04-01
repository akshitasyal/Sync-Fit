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
  HandRaisedIcon
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

const MuscleIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'chest': return <Square3Stack3DIcon className="w-4 h-4" />;
    case 'back': return <HandRaisedIcon className="w-4 h-4" />;
    case 'legs': return <UserIcon className="w-4 h-4" />;
    case 'arms': return <BoltIcon className="w-4 h-4" />;
    case 'shoulders': return <ShieldCheckIcon className="w-4 h-4" />;
    case 'core': return <FireIcon className="w-4 h-4" />;
    case 'cardio': return <RocketLaunchIcon className="w-4 h-4" />;
    default: return <BoltIcon className="w-4 h-4" />;
  }
};

interface Exercise {
  _id: string;
  name: string;
  category: string;
  difficulty: "low" | "medium" | "high";
  instructions: string;
}

interface WorkoutDay {
  date: string;
  dayOfWeek: string;
  isCompleted: boolean;
  focus: string;
  exercises: {
    exerciseId: Exercise;
    sets: number;
    reps: string;
    duration?: number;
    completed: boolean;
  }[];
}

interface WorkoutPlan {
  _id: string;
  days: WorkoutDay[];
}

export default function WorkoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchPlan();
    }
  }, [status]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/workout-plan");
      if (res.status === 404) {
        setPlan(null);
      } else if (!res.ok) {
        throw new Error("Failed to fetch workout plan");
      } else {
        const data = await res.json();
        setPlan(data);
        
        // Find today's index
        const todayStr = new Date().toISOString().split("T")[0];
        const todayIdx = data.days.findIndex((d: any) => d.date === todayStr);
        if (todayIdx !== -1) setActiveDayIdx(todayIdx);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    try {
      setGenerating(true);
      setError("");
      const res = await fetch("/api/workout-plan", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Generation failed");
      }
      const result = await res.json();
      setPlan(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const toggleCompletion = async (exerciseId: string) => {
    if (!plan) return;
    const dayDate = plan.days[activeDayIdx].date;
    
    try {
      const res = await fetch("/api/workout-plan/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayDate, exerciseId })
      });
      
      if (res.ok) {
        // Optimistic update
        const updatedPlan = { ...plan };
        const day = updatedPlan.days[activeDayIdx];
        const ex = day.exercises.find(e => e.exerciseId._id === exerciseId);
        if (ex) {
          ex.completed = !ex.completed;
          day.isCompleted = day.exercises.every(e => e.completed);
        }
        setPlan(updatedPlan);
      }
    } catch (err) {
      console.error("Failed to update completion", err);
    }
  };

  const seedExercises = async () => {
    try {
      setLoading(true);
      await fetch("/api/workouts/seed");
      generatePlan();
    } catch (err) {
      setError("Failed to seed exercises");
      setLoading(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#f8f7f5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#c1ff00] animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Loading your training plan…</p>
        </div>
      </div>
    );
  }

  const activeDay = plan?.days?.[activeDayIdx];

  return (
    <div className="flex-grow bg-[#f8f7f5] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#c1ff00]" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Training</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight">Workout Engine</h1>
            <p className="text-gray-500 text-sm mt-1">AI-distributed training splits based on your intensity profile.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={generatePlan}
              disabled={generating}
              className="flex items-center gap-2 px-6 py-3 bg-[#c1ff00] hover:bg-[#a9e000] disabled:opacity-50 text-[#111111] font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(193,255,0,0.35)] hover:-translate-y-0.5"
            >
              <ArrowPathIcon className={`w-5 h-5 ${generating ? 'animate-spin' : ''}`} />
              {plan ? "Regenerate Week" : "Generate Plan"}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-3 text-sm">
             <div className="w-2 h-2 rounded-full bg-red-500" />
             {error}
             {error === "No exercises in database" && (
               <button onClick={seedExercises} className="ml-auto font-bold underline">Seed Exercises Now</button>
             )}
          </div>
        )}

        {plan && (
          <div className="space-y-8">
            {/* Days Navigation */}
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

            {/* Day Focus Header */}
            <div className="bg-white border border-gray-100 p-7 rounded-[30px] shadow-sm overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-[0.04] pointer-events-none">
                  <BoltIcon className="w-32 h-32 text-[#111111]" />
               </div>
               <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-[#c1ff00]/10 text-[#111111] text-[10px] font-bold uppercase tracking-tighter rounded-full border border-[#c1ff00]/30">
                     Today's Target
                  </span>
                  {activeDay?.isCompleted && (
                    <span className="text-sm font-bold text-[#111111] flex items-center gap-1">
                       <CheckCircleSolid className="w-4 h-4 text-[#111111]" /> Complete!
                    </span>
                  )}
               </div>
               <h2 className="text-3xl font-black text-[#111111]">{activeDay?.focus}</h2>
            </div>

            {/* Exercises Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeDay?.focus === "Rest" ? (
                <div className="col-span-full py-16 text-center bg-white border border-gray-100 rounded-[30px] shadow-sm">
                   <p className="text-[#111111] text-xl font-bold">Rest Day</p>
                   <p className="text-gray-400 text-sm mt-2">Your muscles grow while you sleep and rest, not just when you train.</p>
                </div>
              ) : (
                activeDay?.exercises.map((ex) => (
                  <div 
                    key={ex.exerciseId._id} 
                    className={`bg-white rounded-[30px] p-6 border shadow-sm transition-all group flex flex-col gap-5 ${
                      ex.completed ? "border-[#c1ff00]/40 bg-[#c1ff00]/5" : "border-gray-100 hover:shadow-xl"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1.5">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                          ex.exerciseId.difficulty === "high" ? "bg-red-50 text-red-500 border border-red-100" :
                          ex.exerciseId.difficulty === "medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                          "bg-[#c1ff00]/10 text-[#111111] border border-[#c1ff00]/30"
                        }`}>
                          {ex.exerciseId.difficulty}
                        </span>
                        <h3 className="text-lg font-bold text-[#111111] group-hover:text-black transition-colors leading-tight">
                          {ex.exerciseId.name}
                        </h3>
                      </div>
                      <button 
                        onClick={() => toggleCompletion(ex.exerciseId._id)}
                        className="transition-transform active:scale-90"
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
                       <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 col-span-2">
                          <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-1">
                             <MuscleIcon category={ex.exerciseId.category} /> Targeted Muscle
                          </span>
                          <span className="text-[#111111] font-bold capitalize">{ex.exerciseId.category}</span>
                       </div>
                    </div>

                    <p className="text-gray-400 text-sm italic line-clamp-2">
                      {ex.exerciseId.instructions}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {!plan && !loading && (
          <div className="bg-white rounded-[30px] border border-dashed border-gray-200 p-20 text-center space-y-6 max-w-xl mx-auto mt-10">
             <div className="w-20 h-20 bg-[#c1ff00] rounded-full flex items-center justify-center mx-auto">
                <BoltIcon className="w-10 h-10 text-black" />
             </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-black text-[#111111]">No Workout Plan Active</h2>
                <p className="text-gray-400">Your AI training blueprint hasn&apos;t been calibrated yet. Click below to generate your first weekly split.</p>
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
    </div>
  );
}
