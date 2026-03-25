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
      <div className="flex-grow flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const activeDay = plan?.days[activeDayIdx];

  return (
    <div className="flex-grow bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3">Workout Engine</h1>
            <p className="text-slate-400 text-lg">AI-distributed training splits based on your intensity profile.</p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={generatePlan}
              disabled={generating}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
            >
              <ArrowPathIcon className={`w-5 h-5 ${generating ? 'animate-spin' : ''}`} />
              {plan ? "Regenerate Week" : "Generate Plan"}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
             {error}
             {error === "No exercises in database" && (
               <button onClick={seedExercises} className="ml-auto underline font-bold">Seed Exercises Now</button>
             )}
          </div>
        )}

        {plan && (
          <div className="space-y-8">
            {/* Days Navigation */}
            <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar">
              {plan.days.map((day, idx) => (
                <button
                  key={day.date}
                  onClick={() => setActiveDayIdx(idx)}
                  className={`flex-shrink-0 px-6 py-4 rounded-2xl border transition-all flex flex-col items-center min-w-[120px] ${
                    activeDayIdx === idx 
                      ? "bg-emerald-500/20 border-emerald-500 text-white shadow-xl shadow-emerald-500/10" 
                      : "bg-slate-900/50 border-white/5 text-slate-500 hover:border-white/10 hover:bg-slate-900"
                  }`}
                >
                  <span className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${activeDayIdx === idx ? "text-emerald-400" : "text-slate-600"}`}>
                    {day.dayOfWeek.slice(0, 3)}
                  </span>
                  <span className="text-lg font-black">{new Date(day.date).getDate()}</span>
                  {day.isCompleted && (
                    <CheckCircleSolid className="w-4 h-4 text-emerald-400 mt-2" />
                  )}
                </button>
              ))}
            </div>

            {/* Day Focus Header */}
            <div className="glass-panel-dark p-8 rounded-3xl border border-white/5 overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <BoltIcon className="w-32 h-32 text-white" />
               </div>
               <div className="flex items-center gap-4 mb-2">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-tighter rounded-full border border-emerald-500/20">
                     Today's Target
                  </span>
                  {activeDay?.isCompleted && (
                    <span className="text-emerald-400 text-sm font-bold flex items-center gap-1">
                       <CheckCircleSolid className="w-4 h-4" /> Goal Reached
                    </span>
                  )}
               </div>
               <h2 className="text-4xl font-black text-white">{activeDay?.focus}</h2>
            </div>

            {/* Exercises Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeDay?.focus === "Rest" ? (
                <div className="col-span-full py-20 text-center glass-panel-dark rounded-3xl border border-white/5">
                   <p className="text-slate-400 text-xl font-medium">Rest Day - Time for recovery!</p>
                   <p className="text-slate-600 text-sm mt-2 font-light">Your muscles grow while you sleep and rest, not just when you train.</p>
                </div>
              ) : (
                activeDay?.exercises.map((ex) => (
                  <div 
                    key={ex.exerciseId._id} 
                    className={`glass-panel-dark rounded-3xl p-6 border transition-all group flex flex-col gap-6 ${
                      ex.completed ? "border-emerald-500/50 bg-emerald-500/5 opacity-80" : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                          ex.exerciseId.difficulty === "high" ? "bg-rose-500/20 text-rose-400" :
                          ex.exerciseId.difficulty === "medium" ? "bg-amber-500/20 text-amber-400" :
                          "bg-emerald-500/20 text-emerald-400"
                        }`}>
                          {ex.exerciseId.difficulty}
                        </span>
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">
                          {ex.exerciseId.name}
                        </h3>
                      </div>
                      <button 
                        onClick={() => toggleCompletion(ex.exerciseId._id)}
                        className="transition-transform active:scale-90"
                      >
                        {ex.completed ? (
                          <CheckCircleSolid className="w-8 h-8 text-emerald-500" />
                        ) : (
                          <CheckCircleIcon className="w-8 h-8 text-slate-700 hover:text-emerald-500 transition-colors" />
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       {ex.duration ? (
                         <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-1">
                               <ClockIcon className="w-3 h-3" /> Duration
                            </span>
                            <span className="text-white font-black text-lg">{ex.duration}m</span>
                         </div>
                       ) : (
                         <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-1">
                               <ListBulletIcon className="w-3 h-3" /> Sets
                            </span>
                            <span className="text-white font-black text-lg">{ex.sets}</span>
                         </div>
                       )}
                       {!ex.duration && (
                         <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-1">
                               <AcademicCapIcon className="w-3 h-3" /> Reps
                            </span>
                            <span className="text-white font-black text-lg">{ex.reps}</span>
                         </div>
                       )}
                       <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 col-span-2">
                          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 mb-1">
                             <MuscleIcon category={ex.exerciseId.category} /> Targeted Muscle
                          </span>
                          <span className="text-white font-bold capitalize">{ex.exerciseId.category}</span>
                       </div>
                    </div>

                    <p className="text-slate-500 text-sm italic line-clamp-2">
                      {ex.exerciseId.instructions}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {!plan && !loading && (
          <div className="glass-panel-dark rounded-[40px] p-20 text-center space-y-8 border border-white/5 max-w-2xl mx-auto mt-20">
             <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                <BoltIcon className="w-12 h-12" />
             </div>
             <div className="space-y-3">
                <h2 className="text-3xl font-black text-white">No Workout Plan Active</h2>
                <p className="text-slate-400 text-lg">Your AI training blueprint hasn't been calibrated yet. Click the button below to generate your first weekly split.</p>
             </div>
             <button 
                onClick={generatePlan}
                disabled={generating}
                className="px-10 py-5 bg-white text-slate-950 font-black rounded-3xl hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
             >
                {generating ? "Calibrating..." : "Initialize Training Plan"}
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
