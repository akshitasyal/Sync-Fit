"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  BoltIcon, 
  FireIcon, 
  CheckCircleIcon,
  CalendarIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function TodayPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loggedData, setLoggedData] = useState<any>({ mealsConsumed: [], totalCalories: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: "", calories: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated") {
      fetchTodayData();
      fetchCalories();
    }
  }, [status]);

  const fetchCalories = async () => {
    try {
      const res = await fetch("/api/calories");
      const d = await res.json();
      setLoggedData(d);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTodayData = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      
      const [mealRes, workoutRes, userRes] = await Promise.all([
        fetch("/api/meal-plan"),
        fetch("/api/workout-plan"),
        fetch("/api/profile")
      ]);

      const meals = await mealRes.json();
      const workouts = await workoutRes.json();
      const user = await userRes.json();

      const todayMeal = meals?.days?.find((d: any) => d.date === today);
      const todayWorkout = workouts?.days?.find((d: any) => d.date === today);

      setData({
        todayMeal,
        todayWorkout,
        recommendations: user.recommendations,
        user
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex-grow flex items-center justify-center bg-slate-950">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  const { todayMeal, todayWorkout, recommendations } = data || {};
  const actualCalories = loggedData.totalCalories || 0;
  const targetCalories = recommendations?.recommendedCalories || 2000;
  const calorieProgress = (actualCalories / targetCalories) * 100;

  const handleLogMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newMeal.name, calories: parseInt(newMeal.calories) })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewMeal({ name: "", calories: "" });
        fetchCalories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-grow bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">Today's Focus</h1>
            <p className="text-slate-400 text-lg uppercase tracking-widest font-bold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-emerald-400" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-black px-6 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            LOG MEAL
          </button>
        </div>

        {/* Calorie Stats Card */}
        <div className="glass-panel-dark p-8 rounded-[40px] border border-white/5 relative overflow-hidden group">
           <div className="flex flex-col md:flex-row justify-between gap-8 items-center">
              <div className="space-y-4 text-center md:text-left">
                 <h3 className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Actual Energy Intake</h3>
                 <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-white">{actualCalories}</span>
                    <span className="text-slate-500 text-xl">/ {targetCalories} kcal</span>
                 </div>
                 <div className="w-full md:w-80 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000" 
                      style={{ width: `${Math.min(100, calorieProgress)}%` }}
                    ></div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                    <span className="text-emerald-400 text-2xl font-black">{todayMeal?.totalProtein || 0}g</span>
                    <p className="text-slate-500 text-[10px] uppercase font-bold mt-1">Protein</p>
                 </div>
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                    <span className="text-teal-400 text-2xl font-black">{todayMeal?.totalCarbs || 0}g</span>
                    <p className="text-slate-500 text-[10px] uppercase font-bold mt-1">Carbs</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Meals Section */}
           <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FireIcon className="w-6 h-6 text-orange-500" /> Nutrition
                 </h2>
                 <Link href="/meal-plan" className="text-emerald-400 text-sm font-bold flex items-center gap-1 hover:underline">
                    View Full Plan <ChevronRightIcon className="w-4 h-4" />
                 </Link>
              </div>
              <div className="space-y-4">
                 {todayMeal?.meals.map((m: any, i: number) => (
                    <div key={i} className="glass-panel-dark p-6 rounded-3xl border border-white/5 flex items-center gap-6 hover:border-white/10 transition-all">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 font-bold capitalize">
                          {m.slot[0]}
                       </div>
                       <div className="flex-grow">
                          <p className="text-[10px] font-black uppercase text-emerald-500/60 mb-0.5 tracking-widest">{m.slot}</p>
                          <h4 className="text-white font-bold">{m.mealId.name}</h4>
                          <p className="text-slate-500 text-xs">{m.mealId.calories} kcal • {m.mealId.protein}g P</p>
                       </div>
                    </div>
                 ))}
                 {!todayMeal && (
                   <p className="text-slate-500 text-center py-10 bg-white/5 rounded-3xl border border-dashed border-white/10 underline">
                     <Link href="/meal-plan">No meals scheduled. Generate your plan.</Link>
                   </p>
                 )}
              </div>

               {/* Actual Logged Meals */}
               <div className="pt-6 space-y-4">
                  <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-2">Recently Logged</h3>
                  {loggedData.mealsConsumed?.length > 0 ? (
                    loggedData.mealsConsumed.map((m: any, i: number) => (
                      <div key={i} className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 flex justify-between items-center">
                        <div>
                          <h5 className="text-white font-bold text-sm">{m.name}</h5>
                          <p className="text-slate-500 text-[10px]">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <span className="text-emerald-400 font-black text-sm">{m.calories} kcal</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-600 text-[10px] italic px-2">No meals logged manually today.</p>
                  )}
               </div>
           </div>

           {/* Workouts Section */}
           <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <BoltIcon className="w-6 h-6 text-emerald-400" /> Training
                 </h2>
                 <Link href="/workout" className="text-emerald-400 text-sm font-bold flex items-center gap-1 hover:underline">
                    View Full Split <ChevronRightIcon className="w-4 h-4" />
                 </Link>
              </div>
              <div className="glass-panel-dark p-8 rounded-[40px] border border-white/5 space-y-6">
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Today's Focus</p>
                        <h3 className="text-3xl font-black text-white">{todayWorkout?.focus || "Rest Day"}</h3>
                    </div>
                    {todayWorkout?.isCompleted && <CheckCircleSolid className="w-10 h-10 text-emerald-500" />}
                 </div>

                 {todayWorkout?.exercises.length > 0 && (
                    <div className="space-y-3">
                       {todayWorkout.exercises.map((ex: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                             {ex.completed ? <CheckCircleSolid className="w-5 h-5 text-emerald-500 flex-shrink-0" /> : <CheckCircleIcon className="w-5 h-5 text-slate-700 flex-shrink-0" />}
                             <span className={`text-sm font-medium ${ex.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                {ex.exerciseId.name}
                             </span>
                             <span className="ml-auto text-[10px] font-bold text-slate-600 bg-white/5 px-2 py-1 rounded-md uppercase">
                                {ex.sets}x{ex.reps}
                             </span>
                          </div>
                       ))}
                    </div>
                 )}

                 {!todayWorkout && (
                    <p className="text-slate-500 italic text-sm">No training session logged for today.</p>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Log Meal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md glass-panel-dark p-8 rounded-[32px] border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-white mb-6">Log Daily Intake</h3>
            <form onSubmit={handleLogMeal} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Meal Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Protein Shake"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Calories (kcal)</label>
                <input 
                  type="number" 
                  required
                  placeholder="0"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                SAVE ENTRY
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
